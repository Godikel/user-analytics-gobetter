import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
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
  { icon: Users, label: "Users", path: "/users" },
  { icon: LayoutDashboard, label: "Analytics", path: "/analytics" },
  { icon: BookOpen, label: "Courses", path: "#", color: "text-courses" },
  { icon: ClipboardCheck, label: "Assessments", path: "#", color: "text-assessments" },
  { icon: MessageSquare, label: "Surveys", path: "#", color: "text-surveys" },
  { icon: Route, label: "Journeys", path: "#", color: "text-journeys" },
  { icon: Video, label: "Live Classes", path: "#", color: "text-live-classes" },
  { icon: Rss, label: "Feeds", path: "#", color: "text-feeds" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/users") {
      return location.pathname === "/" || location.pathname.startsWith("/users");
    }
    return location.pathname === path;
  };

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
          <Link
            key={item.label}
            to={item.path}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
              isActive(item.path)
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent",
              collapsed && "justify-center px-2"
            )}
          >
            <item.icon
              className={cn("w-5 h-5 flex-shrink-0", item.color && !isActive(item.path) && item.color)}
            />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
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
