"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import AuthGuard from "../../components/AuthGuard";
import CreateListForm from "../../components/CreateListForm";
import SharedListCard from "../../components/SharedListCard";
import SharedListView from "../../components/SharedListView";
import { useAuth } from "../../contexts/AuthContext";
import {
  addMemberToList,
  addSharedTask,
  createSharedList,
  deleteSharedList,
  deleteSharedTask,
  getUsersByIds,
  removeMemberFromList,
  subscribeToSharedLists,
  subscribeToSharedTasks,
  updateSharedTask,
} from "../../services/sharedListService";

function getErrorMessage(error, fallbackMessage) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

export default function SharedListsPage() {
  const { user } = useAuth();
  const userId = user?.uid || null;

  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [listTaskStats, setListTaskStats] = useState({});
  const [taskAuthorsMap, setTaskAuthorsMap] = useState({});
  const [loadingLists, setLoadingLists] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState(null);

  const selectedList = useMemo(
    () => lists.find((list) => list.id === selectedListId) || null,
    [lists, selectedListId]
  );

  useEffect(() => {
    if (!userId) {
      setLists([]);
      setLoadingLists(false);
      return;
    }

    setLoadingLists(true);
    setError(null);

    const unsubscribe = subscribeToSharedLists(
      userId,
      (nextLists) => {
        setLists(nextLists);
        setLoadingLists(false);
      },
      (subscriptionError) => {
        setError(
          getErrorMessage(subscriptionError, "Impossible de charger les listes partagées.")
        );
        setLoadingLists(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (!selectedListId) {
      setSelectedTasks([]);
      setLoadingTasks(false);
      return;
    }

    setLoadingTasks(true);
    setError(null);

    const unsubscribe = subscribeToSharedTasks(
      selectedListId,
      (tasks) => {
        setSelectedTasks(tasks);
        setLoadingTasks(false);
      },
      (subscriptionError) => {
        setError(
          getErrorMessage(subscriptionError, "Impossible de charger les tâches partagées.")
        );
        setLoadingTasks(false);
      }
    );

    return () => unsubscribe();
  }, [selectedListId]);

  useEffect(() => {
    if (lists.length === 0) {
      setListTaskStats({});
      return;
    }

    const unsubscribers = lists.map((list) =>
      subscribeToSharedTasks(
        list.id,
        (tasks) => {
          const totalTasks = tasks.length;
          const completedTasks = tasks.filter((task) => task.completed).length;

          setListTaskStats((previousStats) => ({
            ...previousStats,
            [list.id]: { totalTasks, completedTasks },
          }));
        },
        (subscriptionError) => {
          setError(
            getErrorMessage(
              subscriptionError,
              "Impossible de charger les statistiques des tâches partagées."
            )
          );
        }
      )
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [lists]);

  useEffect(() => {
    let isCancelled = false;

    const loadMembers = async () => {
      if (!selectedList?.members?.length) {
        setSelectedMembers([]);
        return;
      }

      try {
        const users = await getUsersByIds(selectedList.members);
        const usersMap = new Map(users.map((member) => [member.id, member]));

        const members = selectedList.members.map((memberId) => {
          const userData = usersMap.get(memberId);
          return {
            id: memberId,
            email: userData?.email || memberId,
          };
        });

        if (!isCancelled) {
          setSelectedMembers(members);
        }
      } catch {
        if (!isCancelled) {
          setSelectedMembers(
            selectedList.members.map((memberId) => ({ id: memberId, email: memberId }))
          );
        }
      }
    };

    loadMembers();

    return () => {
      isCancelled = true;
    };
  }, [selectedList]);

  useEffect(() => {
    let isCancelled = false;

    const loadTaskAuthors = async () => {
      const authorIds = [
        ...new Set(
          selectedTasks
            .map((task) => task?.addedBy)
            .filter((value) => typeof value === "string" && value.length > 0)
        ),
      ];

      if (authorIds.length === 0) {
        setTaskAuthorsMap({});
        return;
      }

      try {
        const users = await getUsersByIds(authorIds);
        const map = users.reduce((accumulator, member) => {
          accumulator[member.id] = member.email || member.id;
          return accumulator;
        }, {});

        if (!isCancelled) {
          setTaskAuthorsMap(map);
        }
      } catch {
        if (!isCancelled) {
          setTaskAuthorsMap({});
        }
      }
    };

    loadTaskAuthors();

    return () => {
      isCancelled = true;
    };
  }, [selectedTasks]);

  const tasksWithAuthorEmail = useMemo(
    () =>
      selectedTasks.map((task) => ({
        ...task,
        addedByEmail: taskAuthorsMap[task.addedBy] || null,
      })),
    [selectedTasks, taskAuthorsMap]
  );

  const handleCreateList = async (name) => {
    if (!userId) {
      return;
    }

    setError(null);
    try {
      await createSharedList(userId, name);
    } catch (createError) {
      setError(getErrorMessage(createError, "Impossible de créer la liste partagée."));
      throw createError;
    }
  };

  const handleOpenList = (list) => {
    setSelectedListId(list?.id || null);
  };

  const handleDeleteList = async (list) => {
    if (!userId || !list?.id) {
      return;
    }

    setError(null);
    try {
      await deleteSharedList(list.id, userId);
      if (selectedListId === list.id) {
        setSelectedListId(null);
      }
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Impossible de supprimer la liste."));
    }
  };

  const handleAddMember = async (email) => {
    if (!selectedListId) {
      return;
    }

    setError(null);
    try {
      await addMemberToList(selectedListId, email);
    } catch (memberError) {
      setError(getErrorMessage(memberError, "Impossible d'ajouter ce membre."));
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!selectedListId || !userId) {
      return;
    }

    setError(null);
    try {
      await removeMemberFromList(selectedListId, userId, memberId);
    } catch (memberError) {
      setError(getErrorMessage(memberError, "Impossible de retirer ce membre."));
    }
  };

  const handleAddSharedTask = async (task) => {
    if (!selectedListId || !userId) {
      return;
    }

    setError(null);
    try {
      await addSharedTask(selectedListId, userId, task);
    } catch (taskError) {
      setError(getErrorMessage(taskError, "Impossible d'ajouter la tâche partagée."));
    }
  };

  const handleUpdateSharedTask = async (taskId, updates) => {
    if (!selectedListId) {
      return;
    }

    setError(null);
    try {
      await updateSharedTask(selectedListId, taskId, updates);
    } catch (taskError) {
      setError(getErrorMessage(taskError, "Impossible de mettre à jour la tâche."));
    }
  };

  const handleDeleteSharedTask = async (taskId) => {
    if (!selectedListId) {
      return;
    }

    setError(null);
    try {
      await deleteSharedTask(selectedListId, taskId);
    } catch (taskError) {
      setError(getErrorMessage(taskError, "Impossible de supprimer la tâche."));
    }
  };

  return (
    <AuthGuard>
      <Header />
      <main className="flex min-h-screen justify-center bg-zinc-50 px-4 py-10">
        <section className="w-full max-w-5xl space-y-6">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold text-zinc-900">Listes partagées</h1>
            <p className="text-sm text-zinc-600">
              Créez des listes, invitez des membres et collaborez en temps réel.
            </p>
          </header>

          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          ) : null}

          {selectedList ? (
            <SharedListView
              list={selectedList}
              tasks={tasksWithAuthorEmail}
              currentUserId={userId}
              members={selectedMembers}
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
              onAddTask={handleAddSharedTask}
              onUpdateTask={handleUpdateSharedTask}
              onDeleteTask={handleDeleteSharedTask}
              onBack={() => setSelectedListId(null)}
            />
          ) : (
            <>
              <CreateListForm onCreateList={handleCreateList} />

              {loadingLists ? (
                <p className="text-sm font-medium text-zinc-600">Chargement...</p>
              ) : (
                <div className="grid gap-4">
                  {lists.length === 0 ? (
                    <article className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center">
                      <p className="text-zinc-600">
                        Aucune liste partagée pour le moment. Créez-en une pour commencer.
                      </p>
                    </article>
                  ) : (
                    lists.map((list) => (
                      <SharedListCard
                        key={list.id}
                        list={{
                          ...list,
                          totalTasks: listTaskStats[list.id]?.totalTasks ?? 0,
                          completedTasks: listTaskStats[list.id]?.completedTasks ?? 0,
                        }}
                        currentUserId={userId}
                        onOpen={handleOpenList}
                        onDelete={handleDeleteList}
                      />
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {selectedList && loadingTasks ? (
            <p className="text-sm font-medium text-zinc-600">Chargement...</p>
          ) : null}
        </section>
      </main>
    </AuthGuard>
  );
}
