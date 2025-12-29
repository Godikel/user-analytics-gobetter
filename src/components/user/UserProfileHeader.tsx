import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { User } from "@/data/users";
import { MapPin, Phone, Mail, Clock, CheckCircle2, Calendar } from "lucide-react";

interface UserProfileHeaderProps {
  user: User;
}

export function UserProfileHeader({ user }: UserProfileHeaderProps) {
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-live-classes/20 text-live-classes border-live-classes/30";
      case "Hired": return "bg-courses/20 text-courses border-courses/30";
      case "Inactive": return "bg-muted text-muted-foreground border-muted";
      case "Terminated": return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "";
    }
  };

  return (
    <Card variant="elevated" className="p-6 animate-slide-up">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-border">
            <AvatarFallback className="bg-secondary text-foreground text-2xl">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <span className="text-muted-foreground">|</span>
              <span className="font-mono text-muted-foreground">{user.userId}</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">{user.gender}</span>
            </div>
            
            <p className="text-muted-foreground mb-2">
              {user.role} @ {user.organization} | {user.userId}
            </p>
            
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge variant="outline" className={getStatusColor(user.status)}>
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {user.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                BPSS reference ID: {user.referenceId}
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Time Info Section */}
        <div className="lg:ml-auto flex flex-col gap-2 text-sm border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created on {user.createdOn}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Joined {user.joiningDate}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last active: {user.lastActive}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="h-4 w-4 text-courses" />
            <span className="font-semibold">Time Spent: {user.timeSpent}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
