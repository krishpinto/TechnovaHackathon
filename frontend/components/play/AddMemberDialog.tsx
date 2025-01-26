import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProjects } from "@/components/context/ProjectContext";
import { useUsers } from "@/components/context/UsersContext";

export function AddMemberDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { currentProject, updateProject } = useProjects();
  const { users } = useUsers();
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMember = users?.find((user) => user.email === newMemberEmail);
    if (newMember && currentProject) {
      try {
        const updatedMembers = [...currentProject.members, newMember.$id];
        await updateProject(currentProject.$id, { members: updatedMembers });
        onOpenChange(false);
        setNewMemberEmail("");
        setFormError(null);
      } catch (err) {
        console.error("Failed to add member:", err);
        setFormError("Failed to add member. Please try again.");
      }
    } else {
      setFormError("User not found or already a member.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddMember}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="memberEmail">Member Email</Label>
              <Input
                id="memberEmail"
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                required
              />
            </div>

            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}

            <Button type="submit">Add Member</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
