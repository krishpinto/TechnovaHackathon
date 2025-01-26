import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type User = {
  $id: string;
  username: string;
};

export function MemberList({ members }: { members: User[] }) {
  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div key={member.$id} className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${member.username}`}
            />
            <AvatarFallback>
              {member.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">
              {member.username}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
