"use client";

import { useState } from "react";
import { useTasks } from "@/components/context/TaskContext";
import { useProjects } from "@/components/context/ProjectContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

export function TasksSection() {
  const { currentTasks, createTask, updateTask, deleteTask } = useTasks();
  const { currentProject } = useProjects();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      await updateTask(editingTask.$id, {
        task_name: taskName,
        priority,
        deadline,
      });
    } else {
      await createTask({
        project_id: currentProject?.$id,
        task_name: taskName,
        priority,
        deadline,
      });
    }
    resetForm();
  };

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setTaskName(task.task_name);
    setPriority(task.priority);
    setDeadline(task.deadline);
    setIsDialogOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(taskId);
    }
  };

  const resetForm = () => {
    setEditingTask(null);
    setTaskName("");
    setPriority("low");
    setDeadline("");
    setIsDialogOpen(false);
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">Add Task</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Add New Task"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Task name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
            <Select
              value={priority}
              onValueChange={(value: any) => setPriority(value)}
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
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
            <Button type="submit">
              {editingTask ? "Update Task" : "Create Task"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ul className="space-y-2">
        {currentTasks?.map((task) => (
          <li
            key={task.$id}
            className="flex items-center justify-between p-2 bg-muted rounded-md"
          >
            <span>{task.task_name}</span>
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(task)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(task.$id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
