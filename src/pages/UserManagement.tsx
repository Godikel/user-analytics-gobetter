import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { users } from "@/data/users";
import { Search, Users, ArrowDownAZ, CalendarPlus, ExternalLink, Phone, Mail } from "lucide-react";

type SortOption = "alphabetical" | "latest";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("alphabetical");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "alphabetical") {
      return a.name.localeCompare(b.name);
    } else {
      const parseDate = (dateStr: string): Date => {
        const match = dateStr.match(/(\d+) (\w+) (\d+), (\d+):(\d+) (AM|PM)/);
        if (!match) return new Date(0);
        const [, day, month, year, hours, mins, ampm] = match;
        const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(month);
        let hour = parseInt(hours);
        if (ampm === "PM" && hour !== 12) hour += 12;
        if (ampm === "AM" && hour === 12) hour = 0;
        return new Date(parseInt(year), monthIndex, parseInt(day), hour, parseInt(mins));
      };
      return parseDate(b.createdOn).getTime() - parseDate(a.createdOn).getTime();
    }
  });

  const uniqueRoles = [...new Set(users.map(u => u.role))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-live-classes/20 text-live-classes border-live-classes/30";
      case "Hired": return "bg-courses/20 text-courses border-courses/30";
      case "Inactive": return "bg-muted text-muted-foreground border-muted";
      case "Terminated": return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "";
    }
  };

  const getProgressColor = (completed: number, distributed: number) => {
    const percentage = distributed > 0 ? (completed / distributed) * 100 : 0;
    if (percentage >= 80) return "bg-live-classes";
    if (percentage >= 50) return "bg-journeys";
    if (percentage >= 25) return "bg-assessments";
    return "bg-muted-foreground";
  };

  const renderModuleStatus = (completed: number, distributed: number) => {
    const percentage = distributed > 0 ? (completed / distributed) * 100 : 0;
    return (
      <div className="flex flex-col gap-1 min-w-[100px]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono">{completed}/{distributed}</span>
          <span className="text-muted-foreground">{Math.round(percentage)}%</span>
        </div>
        <Progress 
          value={percentage} 
          className="h-1.5" 
          indicatorClassName={getProgressColor(completed, distributed)}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-6 space-y-6 max-w-full mx-auto">
        {/* Page Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold">User Management</h2>
            <p className="text-muted-foreground text-sm">
              View and manage all users on the platform
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] bg-card border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Hired">Hired</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[200px] bg-card border-border">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {uniqueRoles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[180px] bg-card border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphabetical">
                  <div className="flex items-center gap-2">
                    <ArrowDownAZ className="h-4 w-4" />
                    <span>Alphabetical</span>
                  </div>
                </SelectItem>
                <SelectItem value="latest">
                  <div className="flex items-center gap-2">
                    <CalendarPlus className="h-4 w-4" />
                    <span>Latest Added</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{sortedUsers.length} users found</span>
          </div>
        </div>

        {/* Users Table with Horizontal Scroll */}
        <div className="rounded-lg border border-border bg-card relative">
          <ScrollArea className="w-full">
            <div className="min-w-[1400px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                    <TableHead className="font-semibold min-w-[280px]">User</TableHead>
                    <TableHead className="font-semibold whitespace-nowrap">User ID</TableHead>
                    <TableHead className="font-semibold whitespace-nowrap">Role</TableHead>
                    <TableHead className="font-semibold whitespace-nowrap">Status</TableHead>
                    <TableHead className="font-semibold whitespace-nowrap text-center">Courses</TableHead>
                    <TableHead className="font-semibold whitespace-nowrap text-center">Assessments</TableHead>
                    <TableHead className="font-semibold whitespace-nowrap text-center">Surveys</TableHead>
                    <TableHead className="font-semibold whitespace-nowrap text-center">Playlists</TableHead>
                    <TableHead className="font-semibold whitespace-nowrap text-center">Live Classes</TableHead>
                    <TableHead className="font-semibold whitespace-nowrap text-center">Feeds</TableHead>
                    <TableHead className="font-semibold whitespace-nowrap sticky right-0 bg-secondary/50 z-10">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUsers.map((user, index) => {
                    const totalCompleted = Object.values(user.modules).reduce((acc, m) => acc + m.completed, 0);
                    const totalDistributed = Object.values(user.modules).reduce((acc, m) => acc + m.distributed, 0);
                    const overallProgress = totalDistributed > 0 ? (totalCompleted / totalDistributed) * 100 : 0;

                    return (
                      <TableRow 
                        key={user.id} 
                        className="hover:bg-secondary/30 animate-slide-up"
                        style={{ animationDelay: `${Math.min(index * 20, 200)}ms` }}
                      >
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                                <span className="text-sm font-semibold text-primary">
                                  {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium">{user.name}</span>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {user.phone}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {user.email}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {/* Overall Progress Bar */}
                            <div className="mt-2 flex items-center gap-2">
                              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-courses via-primary to-live-classes rounded-full transition-all"
                                  style={{ width: `${overallProgress}%` }}
                                />
                              </div>
                              <span className="text-xs font-mono text-muted-foreground min-w-[48px]">
                                {Math.round(overallProgress)}%
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{user.userId}</TableCell>
                        <TableCell className="text-sm">{user.role}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(user.status)}`}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{renderModuleStatus(user.modules.courses.completed, user.modules.courses.distributed)}</TableCell>
                        <TableCell>{renderModuleStatus(user.modules.assessments.completed, user.modules.assessments.distributed)}</TableCell>
                        <TableCell>{renderModuleStatus(user.modules.surveys.completed, user.modules.surveys.distributed)}</TableCell>
                        <TableCell>{renderModuleStatus(user.modules.learningJourneys.completed, user.modules.learningJourneys.distributed)}</TableCell>
                        <TableCell>{renderModuleStatus(user.modules.ilts.completed, user.modules.ilts.distributed)}</TableCell>
                        <TableCell>{renderModuleStatus(user.modules.feeds.completed, user.modules.feeds.distributed)}</TableCell>
                        <TableCell className="sticky right-0 bg-card z-10">
                          <Link to={`/users/${user.id}`}>
                            <Button variant="outline" size="sm" className="gap-1.5 whitespace-nowrap">
                              <ExternalLink className="h-3.5 w-3.5" />
                              View Details
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
