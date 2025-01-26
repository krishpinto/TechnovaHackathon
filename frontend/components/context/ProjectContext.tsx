"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useUser } from "@/components/context/UserContext";

type ProjectType = {
  proj_id: string;
  pro_name: string;
  proj_des: string;
  members: string[];
  status: "ongoing" | "completed" | "cancelled";
  end_date: string;
  tasks: string[];
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
};

type ProjectContextType = {
  projects: ProjectType[] | null;
  currentProject: ProjectType | null;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (
    project: Omit<
      ProjectType,
      | "proj_id"
      | "$id"
      | "$createdAt"
      | "$updatedAt"
      | "$permissions"
      | "$databaseId"
      | "$collectionId"
    >
  ) => Promise<void>;
  updateProject: (
    projectId: string,
    updates: Partial<ProjectType>
  ) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  setCurrentProject: (project: ProjectType | null) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<ProjectType[] | null>(null);
  const [currentProject, setCurrentProject] = useState<ProjectType | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();

  const fetchProjects = useCallback(async () => {
    console.log("ProjectContext: Starting to fetch projects");
    try {
      const response = await fetch("/api/projects");
      console.log("ProjectContext: API response received", {
        status: response.status,
        ok: response.ok
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to fetch projects");
      }

      const data = await response.json();
      console.log("ProjectContext: Projects data received", {
        count: data.length,
        firstProject: data[0]
      });

      setProjects(data);
      if (data && data.length > 0) {
        setCurrentProject(data[currentIndex]);
      }
    } catch (err) {
      console.error("ProjectContext: Error fetching projects:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
      setProjects(null);
    } finally {
      setLoading(false);
      console.log("ProjectContext: Fetch completed", {
        hasProjects: !!projects,
        hasError: !!error
      });
    }
  }, [currentIndex]);

  const createProject = useCallback(
    async (
      project: Omit<
        ProjectType,
        | "proj_id"
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
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(project),
        });
        if (!response.ok) throw new Error("Failed to create project");
        const newProject = await response.json();
        setProjects((prevProjects) => [...(prevProjects || []), newProject]);
      } catch (err) {
        console.error("Failed to create project:", err);
        setError("Failed to create project");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateProject = useCallback(
    async (projectId: string, updates: Partial<ProjectType>) => {
      try {
        setLoading(true);
        const response = await fetch("/api/projects", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectId, updates }),
        });
        if (!response.ok) throw new Error("Failed to update project");
        const updatedProject = await response.json();
        setProjects(
          (prevProjects) =>
            prevProjects?.map((p) =>
              p.$id === projectId ? updatedProject : p
            ) || null
        );
        if (currentProject?.$id === projectId) {
          setCurrentProject(updatedProject);
        }
      } catch (err) {
        console.error("Failed to update project:", err);
        setError("Failed to update project");
      } finally {
        setLoading(false);
      }
    },
    [currentProject]
  );

  const deleteProject = useCallback(
    async (projectId: string) => {
      try {
        setLoading(true);
        const response = await fetch("/api/projects", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectId }),
        });
        if (!response.ok) throw new Error("Failed to delete project");
        setProjects(
          (prevProjects) =>
            prevProjects?.filter((p) => p.$id !== projectId) || null
        );
        if (currentProject?.$id === projectId) {
          setCurrentProject(null);
          setCurrentIndex(-1);
        }
      } catch (err) {
        console.error("Failed to delete project:", err);
        setError("Failed to delete project");
      } finally {
        setLoading(false);
      }
    },
    [currentProject]
  );

  useEffect(() => {
    console.log("ProjectContext: Initial mount, calling fetchProjects");
    if (user) {
      fetchProjects();
    }
  }, [user, fetchProjects]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      console.log("ProjectContext: Updating current project", {
        index: currentIndex,
        projectName: projects[currentIndex]?.pro_name
      });
      setCurrentProject(projects[currentIndex]);
    }
  }, [currentIndex, projects]);

  console.log("ProjectContext: Rendering with state", {
    hasProjects: !!projects,
    projectsCount: projects?.length,
    currentProjectId: currentProject?.$id,
    isLoading: loading,
    errorMessage: error
  });

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        currentIndex,
        setCurrentIndex,
        loading,
        error,
        fetchProjects,
        createProject,
        updateProject,
        deleteProject,
        setCurrentProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
}
