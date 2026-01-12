import { User } from "@/data/users";
import { Phone, Mail } from "lucide-react";

interface UserProfileHeaderProps {
  user: User;
}

export function UserProfileHeader({ user }: UserProfileHeaderProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-4 animate-slide-up">
      <h1 className="text-2xl font-bold">{user.name}</h1>
      <span className="text-muted-foreground">|</span>
      <span className="text-muted-foreground">{user.role}</span>
      <span className="text-muted-foreground">|</span>
      <div className="flex items-center gap-1 text-muted-foreground">
        <Phone className="h-4 w-4" />
        <span>{user.phone}</span>
      </div>
      <span className="text-muted-foreground">|</span>
      <div className="flex items-center gap-1 text-muted-foreground">
        <Mail className="h-4 w-4" />
        <span>{user.email}</span>
      </div>
    </div>
  );
}
