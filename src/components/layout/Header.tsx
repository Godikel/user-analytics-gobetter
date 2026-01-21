import { Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-base font-medium text-foreground">User's details</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-destructive" />
        </Button>

        <div className="flex items-center gap-2 pl-4 border-l border-border">
          <Avatar className="w-7 h-7">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
            <AvatarFallback className="text-xs">AD</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">Admin User</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
