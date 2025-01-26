"use client";

import { useProjects } from "@/components/context/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import TaskSection from "./TaskSection";
import UserSection from "./UserSection";

export default function ProjectSection() {
  const { projects, currentProject, setCurrentIndex, loading, error } = useProjects();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading projects: {error}</div>;
  }

  if (!projects?.length) {
    return <div>No projects found</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <Card 
          key={project.$id}
          className={`cursor-pointer transition-all hover:shadow-lg ${
            currentProject?.$id === project.$id ? 'border-primary ring-2 ring-primary' : ''
          }`}
          onClick={() => setCurrentIndex(index)}
        >
          <CardHeader>
            <CardTitle>{project.pro_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{project.proj_des}</p>
            <div className="mt-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                project.status === 'ongoing' ? 'bg-yellow-200' :
                project.status === 'completed' ? 'bg-green-200' :
                'bg-red-200'
              }`}>
                {project.status}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
