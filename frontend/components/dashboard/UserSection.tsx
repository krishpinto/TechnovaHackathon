"use client";

import { useTasks } from "@/components/context/TaskContext";
import { useProjects } from "@/components/context/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TaskSection() {
  const { currentTasks } = useTasks();
  const { currentProject } = useProjects();

  if (!currentProject) {
    return <div>Please select a project to view tasks</div>;
  }

  if (!currentTasks) {
    return <div>No tasks found for this project</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Tasks for {currentProject.pro_name}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentTasks.map((task) => (
          <Card key={task.$id}>
            <CardHeader>
              <CardTitle>{task.task_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className={`px-2 py-1 rounded-full text-xs inline-block ${
                  task.priority === 'high' ? 'bg-red-200' :
                  task.priority === 'medium' ? 'bg-yellow-200' :
                  'bg-green-200'
                }`}>
                  {task.priority} priority
                </div>
                <p>Due: {new Date(task.deadline).toLocaleDateString()}</p>
                <p>Assigned to: {task.assigned_users.length} users</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}