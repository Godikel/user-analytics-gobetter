import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { users } from "@/data/users";
import { Search, Users, ArrowDownAZ, CalendarPlus, ExternalLink, Phone, Mail } from "lucide-react";

type SortOption = "alphabetical" | "latest";

const UserManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("alphabetical");
  
  // Column-specific filters
  const [nameSearch, setNameSearch] = useState("");
  const [userIdSearch, setUserIdSearch] = useState("");
  const [roleColumnFilter, setRoleColumnFilter] = useState<string>("all");
  const [statusColumnFilter, setStatusColumnFilter] = useState<string>("all");

  const filteredUsers = users.filter((user) => {
    const matchesGlobalSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    // Column filters
    const matchesNameSearch = nameSearch === "" || 
      user.name.toLowerCase().includes(nameSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(nameSearch.toLowerCase()) ||
      user.phone.includes(nameSearch);
    const matchesUserIdSearch = userIdSearch === "" || user.userId.includes(userIdSearch);
    const matchesRoleColumn = roleColumnFilter === "all" || user.role === roleColumnFilter;
    const matchesStatusColumn = statusColumnFilter === "all" || user.status === statusColumnFilter;

    return matchesGlobalSearch && matchesStatus && matchesRole && 
           matchesNameSearch && matchesUserIdSearch && matchesRoleColumn && matchesStatusColumn;
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


  const handleRowClick = (userId: string) => {
    navigate(`/users/${userId}`);
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

          {/* Global Filters */}
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

        {/* Users Table with Horizontal Scroll + Sticky Actions Column */}
        <div className="rounded-lg border border-border bg-card relative">
          {/* Table component already provides horizontal scrolling via its wrapper */}
          <Table className="min-w-[1200px]">
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="font-semibold min-w-[220px]">
                  <div className="space-y-2">
                    <span>User</span>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={nameSearch}
                        onChange={(e) => setNameSearch(e.target.value)}
                        className="pl-7 h-7 text-xs bg-background/50 border-border"
                      />
                    </div>
                  </div>
                </TableHead>

                <TableHead className="font-semibold min-w-[100px]">
                  <div className="space-y-2">
                    <span>User ID</span>
                    <Input
                      placeholder="Filter..."
                      value={userIdSearch}
                      onChange={(e) => setUserIdSearch(e.target.value)}
                      className="h-7 text-xs bg-background/50 border-border"
                    />
                  </div>
                </TableHead>

                <TableHead className="font-semibold min-w-[160px]">
                  <div className="space-y-2">
                    <span>Role</span>
                    <Select value={roleColumnFilter} onValueChange={setRoleColumnFilter}>
                      <SelectTrigger className="h-7 text-xs bg-background/50 border-border">
                        <SelectValue placeholder="All Roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        {uniqueRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>

                <TableHead className="font-semibold min-w-[120px]">
                  <div className="space-y-2">
                    <span>Status</span>
                    <Select value={statusColumnFilter} onValueChange={setStatusColumnFilter}>
                      <SelectTrigger className="h-7 text-xs bg-background/50 border-border">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Hired">Hired</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>


                <TableHead className="font-semibold whitespace-nowrap sticky right-0 bg-secondary border-l border-border z-20 min-w-[160px] w-[160px] shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                  <div className="space-y-2">
                    <span>Actions</span>
                    <div className="h-7" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className="group hover:bg-secondary/30 cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${Math.min(index * 20, 200)}ms` }}
                    onClick={() => handleRowClick(user.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shrink-0">
                          <span className="text-xs font-semibold text-primary">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-sm truncate">{user.name}</span>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Phone className="h-2.5 w-2.5 shrink-0" />
                            <span className="truncate">{user.phone}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Mail className="h-2.5 w-2.5 shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
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

                    <TableCell className="sticky right-0 bg-card group-hover:bg-muted border-l border-border z-20 min-w-[160px] w-[160px] shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 whitespace-nowrap"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(user.id);
                        }}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
