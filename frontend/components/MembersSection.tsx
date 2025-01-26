"use client";

import { useProjects } from "@/components/context/ProjectContext";
import { useUsers } from "@/components/context/UsersContext";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";

export function MembersSection() {
  const { currentProject } = useProjects();
  const { users, loading: usersLoading, error: usersError } = useUsers();

  useEffect(() => {
    console.log("Current Project:", currentProject);
    console.log("Users:", users);
  }, [currentProject, users]);

  if (usersLoading) {
    return (
      <Card className="md:col-span-3 border-gray-800 bg-transparent p-4">
        Loading users...
      </Card>
    );
  }

  if (usersError) {
    return (
      <Card className="md:col-span-3 border-gray-800 bg-transparent p-4">
        Error loading users: {usersError}
      </Card>
    );
  }

  if (!currentProject) {
    return (
      <Card className="md:col-span-3 border-gray-800 bg-transparent p-4">
        No project selected
      </Card>
    );
  }

  const projectMembers = users?.filter(
    (user) => currentProject.members.includes(user.userId) 
  );

  console.log("Project Members:", projectMembers);

  return (
    <Card className="md:col-span-3 border-gray-800 bg-transparent overflow-hidden">
      <div className="h-full p-3 md:p-4 flex flex-col">
        <h2 className="mb-2 md:mb-4 text-sm text-gray-400">members</h2>
        <div className="flex-grow overflow-auto">
          {projectMembers && projectMembers.length > 0 ? (
            <ul className="space-y-2">
              {projectMembers.map((member) => (
                <li key={member.$id} className="bg-gray-800 p-2 rounded">
                  <p className="font-semibold">{member.username}</p>
                  <p className="text-sm text-gray-400">{member.email}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No members found for this project.</p>
          )}
        </div>
      </div>
    </Card>
  );
}
