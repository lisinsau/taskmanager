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
        priority: data.priority ?? "medium",
        createdAt: data.createdAt ?? null,
      };
    });
  } catch (error) {
    throw new Error("Impossible de récupérer les tâches utilisateur.");
  }
}

export async function addTask(userId, task) {
  try {
    const payload = {
      title: task?.title?.trim() || "",
      completed: false,
      priority: task?.priority || "medium",
      createdAt: serverTimestamp(),
    };

    const taskRef = await addDoc(getTasksCollection(userId), payload);
    return taskRef.id;
  } catch (error) {
    throw new Error("Impossible d'ajouter la tâche.");
  }
}

export async function updateTask(userId, taskId, updates) {
  try {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await updateDoc(taskRef, updates);
  } catch (error) {
    throw new Error("Impossible de mettre à jour la tâche.");
  }
}

export async function deleteTask(userId, taskId) {
  try {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    throw new Error("Impossible de supprimer la tâche.");
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
            priority: data.priority ?? "medium",
            createdAt: data.createdAt ?? null,
          };
        });

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
    throw new Error("Impossible de démarrer l'écoute des tâches.");
  }
}
