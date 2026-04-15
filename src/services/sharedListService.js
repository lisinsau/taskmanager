import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  documentId,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../lib/firebase";

function getSharedListsCollection() {
  return collection(db, "sharedLists");
}

function getSharedListDoc(listId) {
  return doc(db, "sharedLists", listId);
}

function getSharedTasksCollection(listId) {
  return collection(db, "sharedLists", listId, "tasks");
}

function normalizeTask(taskDoc) {
  const data = taskDoc.data();
  return {
    id: taskDoc.id,
    title: data.title ?? "",
    completed: data.completed ?? false,
    priority: data.priority ?? "moyenne",
    createdAt: data.createdAt ?? null,
    addedBy: data.addedBy ?? null,
  };
}

export async function createSharedList(userId, name) {
  try {
    const listPayload = {
      name: name?.trim() || "Liste partagée",
      ownerId: userId,
      members: [userId],
      createdAt: serverTimestamp(),
    };

    const listRef = await addDoc(getSharedListsCollection(), listPayload);
    return listRef.id;
  } catch (error) {
    throw new Error("Impossible de créer la liste partagée.");
  }
}

export async function getUserSharedLists(userId) {
  try {
    const listsQuery = query(
      getSharedListsCollection(),
      where("members", "array-contains", userId)
    );
    const snapshot = await getDocs(listsQuery);

    return snapshot.docs.map((listDoc) => {
      const data = listDoc.data();
      return {
        id: listDoc.id,
        name: data.name ?? "",
        ownerId: data.ownerId ?? null,
        members: data.members ?? [],
        createdAt: data.createdAt ?? null,
      };
    });
  } catch (error) {
    throw new Error("Impossible de récupérer les listes partagées.");
  }
}

export function subscribeToSharedLists(userId, callback, onError) {
  try {
    const listsQuery = query(
      getSharedListsCollection(),
      where("members", "array-contains", userId)
    );

    const unsubscribe = onSnapshot(
      listsQuery,
      (snapshot) => {
        const lists = snapshot.docs.map((listDoc) => {
          const data = listDoc.data();
          return {
            id: listDoc.id,
            name: data.name ?? "",
            ownerId: data.ownerId ?? null,
            members: data.members ?? [],
            createdAt: data.createdAt ?? null,
          };
        });

        callback(lists);
      },
      (error) => {
        if (onError) {
          onError(error);
        }
      }
    );

    return unsubscribe;
  } catch (error) {
    throw new Error("Impossible d'écouter les listes partagées.");
  }
}

export async function addMemberToList(listId, email) {
  try {
    const trimmedEmail = email?.trim();
    const normalizedEmail = trimmedEmail?.toLowerCase();
    if (!trimmedEmail || !normalizedEmail) {
      throw new Error("Adresse e-mail invalide.");
    }

    const usersByLowercaseQuery = query(
      collection(db, "users"),
      where("emailLowercase", "==", normalizedEmail)
    );
    let usersSnapshot = await getDocs(usersByLowercaseQuery);

    if (usersSnapshot.empty) {
      const usersByEmailQuery = query(
        collection(db, "users"),
        where("email", "==", trimmedEmail)
      );
      usersSnapshot = await getDocs(usersByEmailQuery);
    }

    if (usersSnapshot.empty) {
      throw new Error("Aucun utilisateur trouvé avec cet e-mail.");
    }

    const memberId = usersSnapshot.docs[0].id;
    const listRef = getSharedListDoc(listId);
    await updateDoc(listRef, {
      members: arrayUnion(memberId),
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Impossible d'ajouter ce membre à la liste.");
  }
}

export async function getUsersByIds(userIds) {
  try {
    const ids = Array.isArray(userIds) ? userIds.filter(Boolean) : [];
    if (ids.length === 0) {
      return [];
    }

    const chunks = [];
    for (let index = 0; index < ids.length; index += 10) {
      chunks.push(ids.slice(index, index + 10));
    }

    const snapshots = await Promise.all(
      chunks.map((chunk) =>
        getDocs(
          query(collection(db, "users"), where(documentId(), "in", chunk))
        )
      )
    );

    const users = snapshots.flatMap((snapshot) =>
      snapshot.docs.map((userDoc) => {
        const data = userDoc.data();
        return {
          id: userDoc.id,
          email: data.email || data.emailLowercase || userDoc.id,
        };
      })
    );

    return users;
  } catch (error) {
    throw new Error("Impossible de récupérer les informations des membres.");
  }
}

export async function removeMemberFromList(listId, currentUserId, memberIdToRemove) {
  try {
    const listRef = getSharedListDoc(listId);
    const listSnapshot = await getDoc(listRef);

    if (!listSnapshot.exists()) {
      throw new Error("Cette liste partagée n'existe pas.");
    }

    const data = listSnapshot.data();
    if (data.ownerId !== currentUserId) {
      throw new Error("Seul le propriétaire peut retirer un membre.");
    }

    if (!memberIdToRemove) {
      throw new Error("Membre à retirer invalide.");
    }

    if (memberIdToRemove === data.ownerId) {
      throw new Error("Le propriétaire ne peut pas être retiré de la liste.");
    }

    await updateDoc(listRef, {
      members: arrayRemove(memberIdToRemove),
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Impossible de retirer ce membre.");
  }
}

export async function deleteSharedList(listId, userId) {
  try {
    const listRef = getSharedListDoc(listId);
    const listSnapshot = await getDoc(listRef);

    if (!listSnapshot.exists()) {
      throw new Error("Cette liste partagée n'existe pas.");
    }

    const listData = listSnapshot.data();
    if (listData.ownerId !== userId) {
      throw new Error("Seul le propriétaire peut supprimer cette liste.");
    }

    const tasksSnapshot = await getDocs(getSharedTasksCollection(listId));
    await Promise.all(tasksSnapshot.docs.map((taskDoc) => deleteDoc(taskDoc.ref)));
    await deleteDoc(listRef);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Impossible de supprimer la liste partagée.");
  }
}

export async function getSharedListTasks(listId) {
  try {
    const tasksQuery = query(getSharedTasksCollection(listId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(tasksQuery);

    return snapshot.docs.map(normalizeTask);
  } catch (error) {
    throw new Error("Impossible de récupérer les tâches partagées.");
  }
}

export async function addSharedTask(listId, userId, task) {
  try {
    const payload = {
      title: task?.title?.trim() || "",
      completed: false,
      priority: task?.priority || "moyenne",
      createdAt: serverTimestamp(),
      addedBy: userId,
    };

    const taskRef = await addDoc(getSharedTasksCollection(listId), payload);
    return taskRef.id;
  } catch (error) {
    throw new Error("Impossible d'ajouter la tâche partagée.");
  }
}

export async function updateSharedTask(listId, taskId, updates) {
  try {
    const taskRef = doc(db, "sharedLists", listId, "tasks", taskId);
    await updateDoc(taskRef, updates);
  } catch (error) {
    throw new Error("Impossible de mettre à jour la tâche partagée.");
  }
}

export async function deleteSharedTask(listId, taskId) {
  try {
    const taskRef = doc(db, "sharedLists", listId, "tasks", taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    throw new Error("Impossible de supprimer la tâche partagée.");
  }
}

export function subscribeToSharedTasks(listId, callback, onError) {
  try {
    const tasksQuery = query(getSharedTasksCollection(listId), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const tasks = snapshot.docs.map(normalizeTask);
        callback(tasks);
      },
      (error) => {
        if (onError) {
          onError(error);
        }
      }
    );

    return unsubscribe;
  } catch (error) {
    throw new Error("Impossible d'écouter les tâches partagées.");
  }
}
