import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  MessageSquare,
  Route,
  Video,
  Rss,
  Users,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: BookOpen, label: "Courses", color: "text-courses" },
  { icon: ClipboardCheck, label: "Assessments", color: "text-assessments" },
  { icon: MessageSquare, label: "Surveys", color: "text-surveys" },
  { icon: Route, label: "Journeys", color: "text-journeys" },
  { icon: Video, label: "Live Classes", color: "text-live-classes" },
  { icon: Rss, label: "Feeds", color: "text-feeds" },
  { icon: Users, label: "Users" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-courses flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">L</span>
            </div>
            <span className="font-semibold text-sidebar-foreground">LearnHub</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-2 rounded-lg hover:bg-sidebar-accent transition-colors",
            collapsed && "mx-auto"
          )}
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 text-sidebar-foreground transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
              item.active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent",
              collapsed && "justify-center px-2"
            )}
          >
            <item.icon
              className={cn("w-5 h-5 flex-shrink-0", item.color && !item.active && item.color)}
            />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-2 border-t border-sidebar-border">
        <button
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </button>
      </div>
    </aside>
  );
}
