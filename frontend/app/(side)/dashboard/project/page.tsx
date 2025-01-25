"use client";

import { useProjects } from "@/components/context/ProjectContext";
import { useTasks } from "@/components/context/TaskContext";

export default function ProjectsPage() {
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    currentProject,
    currentIndex,
    setCurrentIndex,
  } = useProjects();

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useTasks();

  if (projectsLoading || tasksLoading) return <div>Loading...</div>;
  if (projectsError) return <div>Error: {projectsError}</div>;
  if (tasksError) return <div>Error: {tasksError}</div>;

  return (
    <div>
      <h1>Projects</h1>
      {projects && projects.length > 0 ? (
        <ul>
          {projects.map((project, index) => (
            <li key={project.$id}>
              <button onClick={() => setCurrentIndex(index)}>
                {project.pro_name}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects found.</p>
      )}

      {currentProject ? (
        <div>
          <h2>Current Project: {currentProject.pro_name}</h2>
          <p>{currentProject.proj_des}</p>
          <p>Status: {currentProject.status}</p>

          <h3>Tasks</h3>
          {tasks && tasks.length > 0 ? (
            <ul>
              {tasks.map((task) => (
                <li key={task.$id}>
                  <h4>{task.task_name}</h4>
                  <p>Priority: {task.priority}</p>
                  <p>Deadline: {task.deadline}</p>
                  <p>Assigned Users: {task.assigned_users.join(", ")}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks found for this project.</p>
          )}
        </div>
      ) : (
        <p>No project selected.</p>
      )}
    </div>
  );
}