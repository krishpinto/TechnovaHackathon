"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useProjects } from "@/components/context/ProjectContext";

type TaskType = {
  $id: string;
  project_id: string;
  task_name: string;
  priority: "low" | "medium" | "high";
  deadline: string;
  assigned_users: string[];
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
};

type TaskContextType = {
  tasks: TaskType[] | null;
  loading: boolean;
  error: string | null;
  fetchTasks: () => void;
  createTask: (
    task: Omit<
      TaskType,
      | "$id"
      | "$createdAt"
      | "$updatedAt"
      | "$permissions"
      | "$databaseId"
      | "$collectionId"
    >
  ) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<TaskType>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<TaskType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { currentProject } = useProjects();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();

      // Filter tasks for the current project
      const filteredTasks = data.filter(
        (task: TaskType) => task.project_id === currentProject?.$id
      );

      setTasks(filteredTasks);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Failed to fetch tasks");
      setTasks(null);
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  // Automatically fetch tasks when the current project changes
  useEffect(() => {
    if (currentProject) {
      fetchTasks();
    }
  }, [currentProject, fetchTasks]);

  const createTask = useCallback(
    async (
      task: Omit<
        TaskType,
        | "$id"
        | "$createdAt"
        | "$updatedAt"
        | "$permissions"
        | "$databaseId"
        | "$collectionId"
      >
    ) => {
      try {
        setLoading(true);
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        });
        if (!response.ok) throw new Error("Failed to create task");
        const newTask = await response.json();
        setTasks((prevTasks) => [...(prevTasks || []), newTask]);
      } catch (err) {
        console.error("Failed to create task:", err);
        setError("Failed to create task");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateTask = useCallback(
    async (taskId: string, updates: Partial<TaskType>) => {
      try {
        setLoading(true);
        const response = await fetch("/api/tasks", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskId, updates }),
        });
        if (!response.ok) throw new Error("Failed to update task");
        const updatedTask = await response.json();
        setTasks(
          (prevTasks) =>
            prevTasks?.map((t) => (t.$id === taskId ? updatedTask : t)) || null
        );
      } catch (err) {
        console.error("Failed to update task:", err);
        setError("Failed to update task");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId }),
      });
      if (!response.ok) throw new Error("Failed to delete task");
      setTasks(
        (prevTasks) => prevTasks?.filter((t) => t.$id !== taskId) || null
      );
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Failed to delete task");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
