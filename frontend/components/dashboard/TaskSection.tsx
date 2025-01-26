"use client";

import { useProjects } from "@/components/context/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectSection() {
  const { projects, currentProject, setCurrentIndex } = useProjects();

  if (!projects) return <div>No projects found</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <Card 
          key={project.$id}
          className={`cursor-pointer ${
            currentProject?.$id === project.$id ? 'border-primary' : ''
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