import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Task = {
  $id: string
  task_name: string
  priority: "low" | "medium" | "high"
  deadline: string
  assigned_users: string[]
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.$id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{task.task_name}</h3>
                <p className="text-sm text-muted-foreground">Due: {new Date(task.deadline).toLocaleDateString()}</p>
              </div>
              <Badge
                variant={
                  task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                }
              >
                {task.priority}
              </Badge>
            </div>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">Assigned to: {task.assigned_users.join(", ")}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

