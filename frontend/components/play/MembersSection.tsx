"use client";

import { useState } from "react";
import { useProjects } from "@/components/context/ProjectContext";
import { useUsers } from "@/components/context/UsersContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

export function MembersSection() {
  const { currentProject, updateProject } = useProjects();
  const { users } = useUsers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const projectMembers = users?.filter((user) =>
    currentProject?.members.includes(user.$id)
  );

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMember = users?.find((user) => user.email === newMemberEmail);
    if (newMember && currentProject) {
      const updatedMembers = [...currentProject.members, newMember.$id];
      await updateProject(currentProject.$id, { members: updatedMembers });
      setNewMemberEmail("");
      setIsDialogOpen(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (currentProject) {
      const updatedMembers = currentProject.members.filter(
        (id) => id !== memberId
      );
      await updateProject(currentProject.$id, { members: updatedMembers });
    }
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">Add Member</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMember} className="space-y-4">
            <Input
              type="email"
              placeholder="Member email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              required
            />
            <Button type="submit">Add Member</Button>
          </form>
        </DialogContent>
      </Dialog>

      <ul className="space-y-2">
        {projectMembers?.map((member) => (
          <li
            key={member.$id}
            className="flex items-center justify-between p-2 bg-muted rounded-md"
          >
            <span>{member.username}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveMember(member.$id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
