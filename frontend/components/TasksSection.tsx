"use client";

import { useTasks } from "@/components/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function TasksSection() {
  const { currentTasks, loading, error } = useTasks();

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="md:col-span-5 border-gray-800 bg-transparent overflow-hidden">
      <div className="h-full p-3 md:p-4 flex flex-col">
        <Button
          variant="outline"
          className="mb-2 md:mb-4 w-full text-white text-sm"
        >
          Create Task
        </Button>
        <h2 className="mb-2 md:mb-4 text-sm text-gray-400">tasks</h2>
        <div className="flex-grow overflow-auto">
          {currentTasks && currentTasks.length > 0 ? (
            <ul className="space-y-2">
              {currentTasks.map((task) => (
                <li key={task.$id} className="bg-gray-800 p-2 rounded">
                  <h3 className="font-semibold">{task.task_name}</h3>
                  <p className="text-sm text-gray-400">
                    Priority: {task.priority}
                  </p>
                  <p className="text-sm text-gray-400">
                    Deadline: {task.deadline}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No tasks found for this project.</p>
          )}
        </div>
      </div>
    </Card>
  );
}
