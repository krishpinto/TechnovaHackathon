"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTasks } from "@/components/context/TaskContext"
import { useProjects } from "@/components/context/ProjectContext"

type User = {
  $id: string
  username: string
}

export function AddTaskDialog({
  open,
  onOpenChange,
  projectMembers,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectMembers: User[]
}) {
  const { currentProject } = useProjects()
  const { createTask } = useTasks()
  const [taskName, setTaskName] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low")
  const [deadline, setDeadline] = useState("")
  const [assignedUsers, setAssignedUsers] = useState<string[]>([])
  const [formError, setFormError] = useState<string | null>(null)
  const [openCombobox, setOpenCombobox] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!taskName || !deadline) {
      setFormError("Please fill in all required fields.")
      return
    }

    if (!currentProject) {
      setFormError("No project selected.")
      return
    }

    try {
      await createTask({
        project_id: currentProject.$id,
        task_name: taskName,
        priority,
        deadline,
        assigned_users: assignedUsers,
      })

      onOpenChange(false)
      setTaskName("")
      setPriority("low")
      setDeadline("")
      setAssignedUsers([])
      setFormError(null)
    } catch (err) {
      console.error("Failed to create task:", err)
      setFormError("Failed to create task. Please try again.")
    }
  }

  const toggleUser = (userId: string) => {
    setAssignedUsers((current) =>
      current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId],
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="taskName">Task Name</Label>
              <Input id="taskName" value={taskName} onChange={(e) => setTaskName(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Assigned Users</Label>
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCombobox}
                    className="w-full justify-between"
                  >
                    {assignedUsers.length > 0
                      ? `${assignedUsers.length} user${assignedUsers.length > 1 ? "s" : ""} selected`
                      : "Select users..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search users..." />
                    <CommandList>
                      <CommandEmpty>No user found.</CommandEmpty>
                      <CommandGroup>
                        {projectMembers.map((user) => (
                          <CommandItem key={user.$id} onSelect={() => toggleUser(user.$id)}>
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                assignedUsers.includes(user.$id) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {user.username}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {formError && <p className="text-sm text-destructive">{formError}</p>}

            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

