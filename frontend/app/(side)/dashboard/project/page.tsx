"use client";

import { useProjects } from "@/components/context/ProjectContext";
import { useTasks } from "@/components/context/TaskContext";
import { useUsers } from "@/components/context/UsersContext"; // Import UsersContext
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    currentTasks,
    loading: tasksLoading,
    error: tasksError,
    fetchTasks,
  } = useTasks();

  const { users, loading: usersLoading, error: usersError } = useUsers(); // Fetch all users

  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [deadline, setDeadline] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]); // Store user IDs
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName || !deadline) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (!currentProject) {
      setFormError("No project selected.");
      return;
    }

    try {
      setFormLoading(true);
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: currentProject.$id,
          task_name: taskName,
          priority,
          deadline,
          assigned_users: assignedUsers, // Send user IDs
        }),
      });

      if (!response.ok) throw new Error("Failed to create task");

      // Refresh tasks after creation
      await fetchTasks();

      // Close the dialog and reset the form
      setIsDialogOpen(false);
      setTaskName("");
      setPriority("low");
      setDeadline("");
      setAssignedUsers([]);
      setFormError(null);
    } catch (err) {
      console.error("Failed to create task:", err);
      setFormError("Failed to create task. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // Filter users for the current project members
  const projectMembers = users?.filter((user) =>
    currentProject?.members.includes(user.$id)
  );

  if (projectsLoading || tasksLoading || usersLoading)
    return <div>Loading...</div>;
  if (projectsError) return <div>Error: {projectsError}</div>;
  if (tasksError) return <div>Error: {tasksError}</div>;
  if (usersError) return <div>Error: {usersError}</div>;

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
          <p>End Date: {currentProject.end_date}</p>

          <h3>Tasks</h3>
          {currentTasks && currentTasks.length > 0 ? (
            <ul>
              {currentTasks.map((task) => (
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

            {/* Add Task Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                <Button>Add Task</Button>
                </DialogTrigger>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                    <div>
                        <Label htmlFor="taskName">Task Name</Label>
                        <Input
                        id="taskName"
                        type="text"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        required
                        />
                    </div>

                    <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                        value={priority}
                        onValueChange={(value: "low" | "medium" | "high") =>
                            setPriority(value)
                        }
                        >
                        <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="deadline">Deadline</Label>
                        <Input
                        id="deadline"
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                        />
                    </div>

                    <div>
                        <Label htmlFor="assignedUsers">Assigned Users</Label>
                        <select
                        id="assignedUsers"
                        multiple // Enable multi-select
                        value={assignedUsers} // Controlled component
                        onChange={(e) => {
                            // Get selected options as an array of user IDs
                            const selectedOptions = Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                            );
                            setAssignedUsers(selectedOptions);
                        }}
                        className="w-full p-2 border rounded"
                        >
                        {projectMembers?.map((user) => (
                            <option key={user.$id} value={user.$id}>
                            {user.username}
                            </option>
                        ))}
                        </select>
                    </div>

                    {formError && (
                        <p className="text-sm text-red-500">{formError}</p>
                    )}

                    <Button type="submit" disabled={formLoading}>
                        {formLoading ? "Creating Task..." : "Create Task"}
                    </Button>
                    </div>
                </form>
                </DialogContent>
            </Dialog>
            </div>
        ) : (
            <p>No project selected.</p>
        )}
        </div>
    );
    }
