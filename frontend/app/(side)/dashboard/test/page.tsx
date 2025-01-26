"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { TasksSection } from "@/components/TasksSection";
import { MembersSection } from "@/components/MembersSection";
import { ChatSection } from "@/components/ChatSection";
import { useProjects } from "@/components/context/ProjectContext";

export default function Dashboard() {
  const { currentProject, updateProject } = useProjects();

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentProject) {
      updateProject(currentProject.$id, { pro_name: e.target.value });
    }
  };

  return (
    <div className="h-screen bg-black flex">
      <div className="flex-grow p-4 flex flex-col">
        <div className="flex-grow flex flex-col max-w-7xl mx-auto w-full space-y-4">
          {/* Header */}
          <header className="flex items-center justify-between rounded-lg border border-gray-800 p-3 md:p-4">
            <input
              type="text"
              placeholder="project name"
              className="bg-transparent text-white focus:outline-none"
              value={currentProject?.pro_name || ""}
              onChange={handleProjectNameChange}
            />
            <Button variant="outline" className="text-white text-sm">
              add members
            </Button>
          </header>

          {/* Main Grid Layout */}
          <div className="flex-grow grid grid-rows-[auto_1fr] md:grid-rows-1 md:grid-cols-12 gap-4 min-h-0">
            {/* Members Section */}
            <MembersSection />

            {/* Tasks Section */}
            <TasksSection />

            {/* Right Column */}
            <div className="md:col-span-4 grid grid-rows-2 gap-4">
              {/* Progress Graph */}
              <Card className="border-gray-800 bg-transparent overflow-hidden">
                <div className="h-full p-3 md:p-4 flex flex-col">
                  <h2 className="mb-2 md:mb-4 text-sm text-gray-400">
                    progress graph
                  </h2>
                  <div className="flex-grow overflow-auto">
                    {/* Add progress graph content here */}
                  </div>
                </div>
              </Card>

              {/* Chat Section */}
              <ChatSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
