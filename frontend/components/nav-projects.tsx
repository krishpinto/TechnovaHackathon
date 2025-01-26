"use client";

import {
  Folder,
  Forward,
  MoreHorizontal,
  Projector,
  Trash2,
  Check,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useProjects } from "./context/ProjectContext";

export function NavProjects() {
  const { isMobile } = useSidebar();
  const {
    projects,
    loading,
    error,
    fetchProjects,
    currentIndex,
    setCurrentIndex,
    currentProject,
  } = useProjects();

  // Handle project selection
  const handleProjectSelect = (index: number) => {
    setCurrentIndex(index);
  };

  // Handle project deletion
  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await fetchProjects(); // Refresh the project list after deletion
        setCurrentIndex(-1); // Reset the current index if the deleted project was selected
      } catch (err) {
        console.error("Failed to delete project:", err);
      }
    }
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects &&
          projects.map((project, index) => (
            <SidebarMenuItem key={project.$id}>
              <SidebarMenuButton
                asChild
                className={
                  currentIndex === index
                    ? "bg-accent text-accent-foreground"
                    : ""
                }
              >
                <div className="flex items-center gap-2">
                  <Projector />
                  <span>{project.pro_name}</span>
                </div>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem onClick={() => handleProjectSelect(index)}>
                    {currentIndex === index ? (
                      <>
                        <Check className="text-muted-foreground" />
                        <span>Selected</span>
                      </>
                    ) : (
                      <>
                        <Folder className="text-muted-foreground" />
                        <span>Select Project</span>
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward className="text-muted-foreground" />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDeleteProject(project.$id)}
                  >
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
