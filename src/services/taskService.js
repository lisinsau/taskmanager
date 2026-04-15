import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

const FIRESTORE_ERROR_MESSAGES = {
  "permission-denied":
    "Accès refusé. Vous n'avez pas la permission d'effectuer cette action.",
  "not-found": "Cette ressource n'existe plus.",
  unavailable: "Service temporairement indisponible. Vérifiez votre connexion.",
  unauthenticated: "Vous devez être connecté pour effectuer cette action.",
};

function toUserError(error) {
  const message = FIRESTORE_ERROR_MESSAGES[error?.code] || "Une erreur est survenue. Veuillez réessayer.";
  return new Error(message);
}

function getTasksCollection(userId) {
  return collection(db, "users", userId, "tasks");
}

export async function getUserTasks(userId) {
  try {
    const tasksQuery = query(getTasksCollection(userId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(tasksQuery);

    return snapshot.docs.map((taskDoc) => {
      const data = taskDoc.data();
      return {
        id: taskDoc.id,
        title: data.title ?? "",
        completed: data.completed ?? false,
        priority: data.priority ?? "moyenne",
        createdAt: data.createdAt ?? null,
      };
    });
  } catch (error) {
    throw toUserError(error);
  }
}

export async function addTask(userId, task) {
  try {
    const payload = {
      title: task?.title?.trim() || "Titre par défaut",
      completed: false,
      priority: task?.priority || "moyenne",
      createdAt: serverTimestamp(),
    };

    const taskRef = await addDoc(getTasksCollection(userId), payload);
    return taskRef.id;
  } catch (error) {
    throw toUserError(error);
  }
}

export async function updateTask(userId, taskId, updates) {
  try {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await updateDoc(taskRef, updates);
  } catch (error) {
    throw toUserError(error);
  }
}

export async function deleteTask(userId, taskId) {
  try {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    throw toUserError(error);
  }
}

export function subscribeToTasks(userId, callback, onError) {
  try {
    const tasksQuery = query(getTasksCollection(userId), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const tasks = snapshot.docs.map((taskDoc) => {
          const data = taskDoc.data();
          return {
            id: taskDoc.id,
            title: data.title ?? "",
            completed: data.completed ?? false,
            priority: data.priority ?? "moyenne",
            createdAt: data.createdAt ?? null,
          };
        });

        callback(tasks);
      },
      (error) => {
        if (onError) {
          onError(toUserError(error));
        }
      }
    );

    return unsubscribe;
  } catch (error) {
    throw toUserError(error);
  }
}
