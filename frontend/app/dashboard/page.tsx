"use client";

import { useUser } from "@/components/context/UserContext";
import { useProjects } from "@/components/context/ProjectContext";
import { useTasks } from "@/components/context/TaskContext";
import { useUsers } from "@/components/context/UsersContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectSection from "@/components/dashboard/ProjectSection";
import TaskSection from "@/components/dashboard/TaskSection";
import UserSection from "@/components/dashboard/UserSection";
import { Suspense } from "react";

// Loading components for each section
const SectionLoading = () => (
  <div className="animate-pulse">
    <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-32 bg-gray-200 rounded-lg"></div>
  </div>
);

export default function Dashboard() {
  const { user, loading: userLoading } = useUser();

  // Only check user loading initially
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl mb-2">Loading user data...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl mb-2">Please log in to access the dashboard</div>
          <a href="/login" className="text-blue-500 hover:underline">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {user.username}!
      </h1>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Suspense fallback={<SectionLoading />}>
            <ProjectSection />
          </Suspense>
        </TabsContent>

        <TabsContent value="tasks">
          <Suspense fallback={<SectionLoading />}>
            <TaskSection />
          </Suspense>
        </TabsContent>

        <TabsContent value="team">
          <Suspense fallback={<SectionLoading />}>
            <UserSection />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
} 