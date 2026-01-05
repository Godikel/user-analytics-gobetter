import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Download, ArrowUp, ArrowDown, ChevronDown, ChevronRight, BookOpen, ClipboardCheck, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { moduleStats } from "@/data/moduleData";

interface PlaylistItem {
  id: string;
  name: string;
  type: "Course" | "Assessment" | "Survey";
  status: "Completed" | "Ongoing" | "Not Started";
  completionDate: string;
}

interface Playlist {
  id: string;
  name: string;
  state: "Published" | "Draft" | "Archived";
  coursesCount: number;
  assessmentsCount: number;
  surveysCount: number;
  distributionDate: string;
  status: "Completed" | "Ongoing" | "Not Started";
  items: PlaylistItem[];
  enforced: "No" | "Hard" | "Soft";
}

const generateDateTime = (): string => {
  const day = Math.floor(Math.random() * 28) + 1;
  const hours = Math.floor(Math.random() * 12) + 1;
  const mins = Math.floor(Math.random() * 60);
  const ampm = Math.random() > 0.5 ? "AM" : "PM";
  return `${day} Dec 2024, ${hours}:${mins.toString().padStart(2, '0')} ${ampm}`;
};

const playlistNames = [
  "Leadership Excellence Program",
  "Sales Mastery Journey",
  "New Hire Onboarding",
  "Compliance & Ethics Training",
  "Technical Skills Bootcamp",
  "Customer Success Pathway",
  "Manager Development Track",
  "Data Analytics Certification"
];

const courseNames = ["Leadership Basics", "Communication Skills", "Team Dynamics", "Strategic Thinking", "Project Management"];
const assessmentNames = ["Knowledge Check", "Skills Assessment", "Final Exam", "Progress Quiz"];
const surveyNames = ["Feedback Survey", "Satisfaction Poll"];

const generatePlaylistItems = (coursesCount: number, assessmentsCount: number, surveysCount: number, playlistStatus: Playlist["status"]): PlaylistItem[] => {
  const items: PlaylistItem[] = [];
  let itemIndex = 0;
  const totalItems = coursesCount + assessmentsCount + surveysCount;
  
  // Calculate how many items should be completed based on playlist status
  const completedCount = playlistStatus === "Completed" 
    ? totalItems 
    : playlistStatus === "Ongoing" 
      ? Math.floor(totalItems * 0.5) 
      : 0;
  
  for (let i = 0; i < coursesCount; i++) {
    const isCompleted = itemIndex < completedCount;
    items.push({
      id: `CRS${String(itemIndex + 1).padStart(3, '0')}`,
      name: courseNames[i % courseNames.length],
      type: "Course",
      status: isCompleted ? "Completed" : (itemIndex < completedCount + 2 ? "Ongoing" : "Not Started"),
      completionDate: isCompleted ? generateDateTime() : "-",
    });
    itemIndex++;
  }
  
  for (let i = 0; i < assessmentsCount; i++) {
    const isCompleted = itemIndex < completedCount;
    items.push({
      id: `ASM${String(itemIndex + 1).padStart(3, '0')}`,
      name: assessmentNames[i % assessmentNames.length],
      type: "Assessment",
      status: isCompleted ? "Completed" : (itemIndex < completedCount + 2 ? "Ongoing" : "Not Started"),
      completionDate: isCompleted ? generateDateTime() : "-",
    });
    itemIndex++;
  }

  for (let i = 0; i < surveysCount; i++) {
    const isCompleted = itemIndex < completedCount;
    items.push({
      id: `SRV${String(itemIndex + 1).padStart(3, '0')}`,
      name: surveyNames[i % surveyNames.length],
      type: "Survey",
      status: isCompleted ? "Completed" : "Not Started",
      completionDate: isCompleted ? generateDateTime() : "-",
    });
    itemIndex++;
  }
  
  return items;
};

const generatePlaylists = (): Playlist[] => {
  const total = moduleStats.learningJourneys.distributed;
  const completed = moduleStats.learningJourneys.completed;
  const states: Playlist["state"][] = ["Published", "Draft", "Archived"];
  const enforcedOptions: Playlist["enforced"][] = ["No", "Hard", "Soft"];
  
  return Array.from({ length: total }, (_, i) => {
    const status: Playlist["status"] = i < completed ? "Completed" : (i < completed + 1 ? "Ongoing" : "Not Started");
    const coursesCount = Math.floor(Math.random() * 4) + 2;
    const assessmentsCount = Math.floor(Math.random() * 3) + 1;
    const surveysCount = Math.floor(Math.random() * 2) + 1;
    
    return {
      id: `PLY${String(i + 1).padStart(4, '0')}`,
      name: playlistNames[i % playlistNames.length],
      state: states[i % states.length],
      coursesCount,
      assessmentsCount,
      surveysCount,
      distributionDate: generateDateTime(),
      status,
      items: generatePlaylistItems(coursesCount, assessmentsCount, surveysCount, status),
      enforced: enforcedOptions[i % enforcedOptions.length],
    };
  });
};

const playlists = generatePlaylists();

type SortColumn = "distributionDate" | null;
type SortDirection = "asc" | "desc";

export function PlaylistModulesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [enforcedFilter, setEnforcedFilter] = useState<string>("all");
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortColumn(null);
        setSortDirection("asc");
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const parseDate = (dateStr: string): Date | null => {
    if (dateStr === "-") return null;
    const match = dateStr.match(/(\d+) (\w+) (\d+), (\d+):(\d+) (AM|PM)/);
    if (!match) return null;
    const [, day, month, year, hours, mins, ampm] = match;
    const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(month);
    let hour = parseInt(hours);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return new Date(parseInt(year), monthIndex, parseInt(day), hour, parseInt(mins));
  };

  const filteredPlaylists = playlists.filter((playlist) => {
    const matchesSearch = playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      playlist.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || playlist.status === statusFilter;
    const matchesState = stateFilter === "all" || playlist.state === stateFilter;
    const matchesEnforced = enforcedFilter === "all" || playlist.enforced === enforcedFilter;
    return matchesSearch && matchesStatus && matchesState && matchesEnforced;
  });

  const sortedPlaylists = [...filteredPlaylists].sort((a, b) => {
    if (!sortColumn) return 0;
    const dateA = parseDate(a[sortColumn]);
    const dateB = parseDate(b[sortColumn]);
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    const comparison = dateA.getTime() - dateB.getTime();
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const getStatusColor = (status: Playlist["status"]) => {
    switch (status) {
      case "Completed": return "bg-live-classes/20 text-live-classes border-live-classes/30";
      case "Ongoing": return "bg-journeys/20 text-journeys border-journeys/30";
      case "Not Started": return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getStateColor = (state: Playlist["state"]) => {
    switch (state) {
      case "Published": return "bg-courses/20 text-courses border-courses/30";
      case "Draft": return "bg-assessments/20 text-assessments border-assessments/30";
      case "Archived": return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getItemTypeIcon = (type: PlaylistItem["type"]) => {
    switch (type) {
      case "Course": return <BookOpen className="h-3 w-3 text-courses" />;
      case "Assessment": return <ClipboardCheck className="h-3 w-3 text-assessments" />;
      case "Survey": return <ClipboardCheck className="h-3 w-3 text-surveys" />;
    }
  };

  return (
    <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "200ms" }}>
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <CardTitle className="text-lg">Playlists / Learning Journeys</CardTitle>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Playlist ID</TableHead>
                <TableHead className="font-semibold min-w-[200px]">
                  <div className="space-y-2">
                    <span>Name</span>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-7 h-7 text-xs bg-background/50 border-border"
                      />
                    </div>
                  </div>
                </TableHead>
                <TableHead className="font-semibold min-w-[120px]">
                  <div className="space-y-2">
                    <span>State</span>
                    <Select value={stateFilter} onValueChange={setStateFilter}>
                      <SelectTrigger className="h-7 text-xs bg-background/50 border-border">
                        <SelectValue placeholder="All States" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">Courses</TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">Assessments</TableHead>
                <TableHead className="font-semibold whitespace-nowrap text-center">Surveys</TableHead>
                <TableHead 
                  className="font-semibold whitespace-nowrap cursor-pointer hover:bg-secondary/70 transition-colors"
                  onClick={() => handleSort("distributionDate")}
                >
                  <div className="flex items-center gap-1">
                    Distribution
                    {sortColumn === "distributionDate" && (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="font-semibold min-w-[140px]">
                  <div className="space-y-2">
                    <span>Status</span>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-7 text-xs bg-background/50 border-border">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>
                <TableHead className="font-semibold min-w-[120px]">
                  <div className="space-y-2">
                    <span>Enforced</span>
                    <Select value={enforcedFilter} onValueChange={setEnforcedFilter}>
                      <SelectTrigger className="h-7 text-xs bg-background/50 border-border">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                        <SelectItem value="Soft">Soft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPlaylists.map((playlist) => (
                <Collapsible key={playlist.id} asChild open={expandedRows.has(playlist.id)} onOpenChange={() => toggleRow(playlist.id)}>
                  <>
                    <TableRow className="hover:bg-secondary/30">
                      <TableCell>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            {expandedRows.has(playlist.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </TableCell>
                      <TableCell className="font-mono text-xs whitespace-nowrap">{playlist.id}</TableCell>
                      <TableCell className="font-medium">{playlist.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-xs whitespace-nowrap", getStateColor(playlist.state))}>
                          {playlist.state}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-mono">{playlist.coursesCount}</TableCell>
                      <TableCell className="text-center font-mono">{playlist.assessmentsCount}</TableCell>
                      <TableCell className="text-center font-mono">{playlist.surveysCount}</TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{playlist.distributionDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-xs whitespace-nowrap", getStatusColor(playlist.status))}>
                          {playlist.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "text-xs whitespace-nowrap",
                          playlist.enforced === "Hard" 
                            ? "bg-destructive/20 text-destructive border-destructive/30" 
                            : playlist.enforced === "Soft"
                            ? "bg-journeys/20 text-journeys border-journeys/30"
                            : "bg-muted text-muted-foreground border-muted"
                        )}>
                          {playlist.enforced}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                          <ExternalLink className="h-3 w-3" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <CollapsibleContent asChild>
                      <TableRow className="bg-secondary/20 hover:bg-secondary/30">
                        <TableCell colSpan={11} className="p-0">
                          <div className="px-8 py-4">
                            <h4 className="text-sm font-medium mb-3 text-muted-foreground">Playlist Contents</h4>
                            <div className="rounded-md border border-border overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-background/50">
                                    <TableHead className="text-xs font-medium">ID</TableHead>
                                    <TableHead className="text-xs font-medium">Name</TableHead>
                                    <TableHead className="text-xs font-medium">Type</TableHead>
                                    <TableHead className="text-xs font-medium">Status</TableHead>
                                    <TableHead className="text-xs font-medium">Completion</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {playlist.items.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-background/30">
                                      <TableCell className="font-mono text-xs">{item.id}</TableCell>
                                      <TableCell className="text-sm">{item.name}</TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-1.5">
                                          {getItemTypeIcon(item.type)}
                                          <span className="text-xs">{item.type}</span>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant="outline" className={cn("text-xs", getStatusColor(item.status))}>
                                          {item.status}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-xs text-muted-foreground">{item.completionDate}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredPlaylists.length} of {playlists.length} playlists
        </div>
      </CardContent>
    </Card>
  );
}
