"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjects } from "@/components/context/ProjectContext";
import { useTasks } from "@/components/context/TaskContext";
import { useUsers } from "@/components/context/UsersContext";
import { MemberList } from "@/components/play/MemberList";
import { TaskList } from "@/components/play/TaskList";
import { ChatAgent } from "@/components/play/ChatAgent";
import { AddTaskDialog } from "@/components/play/AddTaskDialog";
import { AddMemberDialog } from "@/components/play/AddMemberDialog";

export default function Dashboard() {
  const { currentProject, updateProject } = useProjects();
  const { currentTasks, loading: tasksLoading } = useTasks();
  const { users, loading: usersLoading } = useUsers();
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentProject) {
      updateProject(currentProject.$id, { pro_name: e.target.value });
    }
  };

  const projectMembers = users?.filter((user) =>
    currentProject?.members.includes(user.$id)
  );

  if (tasksLoading || usersLoading) return <div>Loading...</div>;

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Input
            type="text"
            placeholder="Project name"
            className="text-lg font-semibold bg-transparent border-none w-auto"
            value={currentProject?.pro_name || ""}
            onChange={handleProjectNameChange}
          />
          <Button
            variant="outline"
            onClick={() => setIsAddMemberDialogOpen(true)}
          >
            Add members
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow overflow-hidden">
        <div className="h-full max-w-7xl mx-auto p-4 grid grid-cols-12 gap-4">
          {/* Left Sidebar - Members */}
          <Card className="col-span-3 overflow-hidden flex flex-col">
            <CardHeader>
              <CardTitle>Members</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
              <ScrollArea className="h-full">
                <MemberList members={projectMembers || []} />
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Main Content - Tasks */}
          <Card className="col-span-6 overflow-hidden flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Tasks</CardTitle>
              <Button
                size="sm"
                onClick={() => setIsAddTaskDialogOpen(true)}
                disabled={tasksLoading}
              >
                {tasksLoading ? "Loading..." : "Add Task"}
              </Button>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
              <ScrollArea className="h-full">
                <TaskList tasks={currentTasks || []} />
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Right Sidebar - Progress and Chat */}
          <div className="col-span-3 space-y-4 flex flex-col">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-muted rounded-md"></div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden flex-grow flex flex-col">
              <CardHeader>
                <CardTitle>Chat</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden">
                <ChatAgent />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AddTaskDialog
        open={isAddTaskDialogOpen}
        onOpenChange={setIsAddTaskDialogOpen}
        projectMembers={projectMembers || []}
      />

      <AddMemberDialog
        open={isAddMemberDialogOpen}
        onOpenChange={setIsAddMemberDialogOpen}
      />
    </div>
  );
}
