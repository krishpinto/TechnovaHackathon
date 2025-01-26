"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle, Folder } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useProjects } from "@/components/context/ProjectContext";

export function ProjectSwitcher() {
  const { projects, currentProject, setCurrentIndex, createProject } =
    useProjects();
  const [open, setOpen] = React.useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = React.useState(false);
  const [newProjectName, setNewProjectName] = React.useState("");
  const [newProjectDescription, setNewProjectDescription] = React.useState("");

  const handleSelectProject = (projectId: string) => {
    const index = projects?.findIndex((p) => p.$id === projectId) ?? -1;
    setCurrentIndex(index);
    setOpen(false);
  };

  const handleCreateProject = async () => {
    if (newProjectName) {
      await createProject({
        pro_name: newProjectName,
        proj_des: newProjectDescription,
        members: [],
        status: "ongoing",
        end_date: new Date().toISOString(),
        tasks: [],
      });
      setNewProjectName("");
      setNewProjectDescription("");
      setShowNewProjectDialog(false);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog
          open={showNewProjectDialog}
          onOpenChange={setShowNewProjectDialog}
        >
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Folder className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {currentProject?.pro_name || "Select a Project"}
                  </span>
                  <span className="truncate text-xs">
                    {currentProject?.status || "No project selected"}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandList>
                  <CommandInput placeholder="Search project..." />
                  <CommandEmpty>No project found.</CommandEmpty>
                  <CommandGroup heading="Projects">
                    {projects?.map((project) => (
                      <CommandItem
                        key={project.$id}
                        onSelect={() => handleSelectProject(project.$id)}
                      >
                        <Folder className="mr-2 size-4" />
                        {project.pro_name}
                        <Check
                          className={cn(
                            "ml-auto size-4",
                            currentProject?.$id === project.$id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
                <CommandSeparator />
                <CommandList>
                  <CommandGroup>
                    <DialogTrigger asChild>
                      <CommandItem
                        onSelect={() => {
                          setOpen(false);
                          setShowNewProjectDialog(true);
                        }}
                      >
                        <PlusCircle className="mr-2 size-5" />
                        Create Project
                      </CommandItem>
                    </DialogTrigger>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create project</DialogTitle>
              <DialogDescription>
                Add a new project to your workspace.
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project name</Label>
                  <Input
                    id="name"
                    placeholder="My Awesome Project"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="A brief description of your project"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowNewProjectDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" onClick={handleCreateProject}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
