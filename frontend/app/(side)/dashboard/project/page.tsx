"use client";

import { useProjects } from "@/components/context/ProjectContext";

export default function ProjectsPage() {
  const {
    projects,
    loading,
    error,
    currentProject,
    currentIndex,
    setCurrentIndex,
  } = useProjects();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {projects?.map((project, index) => (
          <li key={project.$id}>
            <button onClick={() => setCurrentIndex(index)}>
              {project.pro_name}
            </button>
          </li>
        ))}
      </ul>

      {currentProject && (
        <div>
          <h2>Current Project: {currentProject.pro_name}</h2>
          <p>{currentProject.proj_des}</p>
          <p>Status: {currentProject.status}</p>
        </div>
      )}
    </div>
  );
}
