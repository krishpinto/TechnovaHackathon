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
  tasks: TaskType[] | null; // All tasks fetched globally
  currentTasks: TaskType[] | null; // Tasks filtered by current project
  loading: boolean;
  error: string | null;
  fetchTasks: () => void; // Fetch all tasks
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<TaskType[] | null>(null); // All tasks
  const [currentTasks, setCurrentTasks] = useState<TaskType[] | null>(null); // Tasks for the current project
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { currentProject } = useProjects();

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data); // Store all tasks globally
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Failed to fetch tasks");
      setTasks(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter tasks based on the current project ID
  useEffect(() => {
    if (tasks && currentProject) {
      const filteredTasks = tasks.filter(
        (task) => task.project_id === currentProject.$id
      );
      setCurrentTasks(filteredTasks); // Store filtered tasks
    } else {
      setCurrentTasks(null); // Reset if no current project
    }
  }, [tasks, currentProject]);

  // Automatically fetch all tasks when the component mounts
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        currentTasks,
        loading,
        error,
        fetchTasks,
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