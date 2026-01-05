import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, ArrowUp, ArrowDown, ExternalLink, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Module {
  id: string;
  name: string;
  type: "Course" | "Assessment" | "Survey" | "Learning Journey" | "ILT";
  distributionDate: string;
  completionStatus: "Completed" | "Ongoing" | "Not Started";
  startDate: string;
  completionDate: string;
  trainer: string;
  coins: number;
  feedbackRating: number | null;
  distributionType: "Independent" | "Automatic";
  version: string;
  autoDistributionGroup: string | null;
  enforced: "No" | "Hard" | "Soft";
}

// Generate sample modules data
const generateDateTime = (): string => {
  const day = Math.floor(Math.random() * 28) + 1;
  const hours = Math.floor(Math.random() * 12) + 1;
  const mins = Math.floor(Math.random() * 60);
  const ampm = Math.random() > 0.5 ? "AM" : "PM";
  return `${day} Dec 2024, ${hours}:${mins.toString().padStart(2, '0')} ${ampm}`;
};

const generateModules = (count: number): Module[] => {
  const types: Module["type"][] = ["Course", "Assessment", "Survey", "Learning Journey", "ILT"];
  const statuses: Module["completionStatus"][] = ["Completed", "Ongoing", "Not Started"];
  const names = [
    "Leadership Fundamentals", "Data Analytics 101", "Project Management", "Communication Skills",
    "Strategic Thinking", "Team Collaboration", "Customer Focus", "Innovation Mindset",
    "Sales Excellence", "Technical Writing", "Design Thinking", "Agile Methodology"
  ];
  const trainers = ["John Smith", "Sarah Wilson", "Mike Chen", "Lisa Kumar", "David Park"];
  const autoDistGroups = ["New Hires 2024", "Sales Team Q1", "Engineering Onboarding", "Leadership Track", "Compliance Annual"];

  const enforcedOptions: Module["enforced"][] = ["No", "Hard", "Soft"];

  return Array.from({ length: count }, (_, i) => {
    const isAutomatic = i % 2 !== 0;
    return {
      id: `MOD${String(i + 1).padStart(4, '0')}`,
      name: names[i % names.length],
      type: types[i % types.length],
      distributionDate: generateDateTime(),
      completionStatus: statuses[Math.floor(Math.random() * statuses.length)],
      startDate: statuses[i % 3] === "Not Started" ? "-" : generateDateTime(),
      completionDate: statuses[i % 3] === "Completed" ? generateDateTime() : "-",
      trainer: trainers[i % trainers.length],
      coins: Math.floor(Math.random() * 100) + 10,
      feedbackRating: statuses[i % 3] === "Completed" ? Math.floor(Math.random() * 5) + 1 : null,
      distributionType: isAutomatic ? "Automatic" : "Independent",
      version: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}`,
      autoDistributionGroup: isAutomatic ? autoDistGroups[i % autoDistGroups.length] : null,
      enforced: enforcedOptions[i % enforcedOptions.length],
    };
  });
};

const modules = generateModules(25);

interface UserModulesTableProps {
  showTypeColumn?: boolean;
  title?: string;
  filterByType?: Module["type"];
  idColumnLabel?: string;
  hideDistributionTypeAndVersion?: boolean;
}

type SortColumn = "distributionDate" | "startDate" | "completionDate" | null;
type SortDirection = "asc" | "desc";

export function UserModulesTable({ showTypeColumn = true, title = "All Modules", filterByType, idColumnLabel, hideDistributionTypeAndVersion = false }: UserModulesTableProps) {
  const [distributionTypeFilter, setDistributionTypeFilter] = useState<string>("all");
  const [versionFilter, setVersionFilter] = useState<string>("all");
  const [enforcedFilter, setEnforcedFilter] = useState<string>("all");

  // Get unique versions for the filter
  const uniqueVersions = [...new Set(modules.map(m => m.version))].sort();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

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
    // Parse "15 Dec 2024, 3:45 PM" format
    const match = dateStr.match(/(\d+) (\w+) (\d+), (\d+):(\d+) (AM|PM)/);
    if (!match) return null;
    const [, day, month, year, hours, mins, ampm] = match;
    const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(month);
    let hour = parseInt(hours);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return new Date(parseInt(year), monthIndex, parseInt(day), hour, parseInt(mins));
  };

  // First filter by the fixed type if provided
  const baseModules = filterByType ? modules.filter(m => m.type === filterByType) : modules;

  const filteredModules = baseModules.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.trainer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || module.type === typeFilter;
    const matchesStatus = statusFilter === "all" || module.completionStatus === statusFilter;
    const matchesDistributionType = distributionTypeFilter === "all" || module.distributionType === distributionTypeFilter;
    const matchesVersion = versionFilter === "all" || module.version === versionFilter;
    const matchesEnforced = enforcedFilter === "all" || module.enforced === enforcedFilter;

    return matchesSearch && matchesType && matchesStatus && matchesDistributionType && matchesVersion && matchesEnforced;
  });

  const sortedModules = [...filteredModules].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const dateA = parseDate(a[sortColumn]);
    const dateB = parseDate(b[sortColumn]);
    
    // Handle null dates (put them at the end)
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    const comparison = dateA.getTime() - dateB.getTime();
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const getStatusColor = (status: Module["completionStatus"]) => {
    switch (status) {
      case "Completed": return "bg-live-classes/20 text-live-classes border-live-classes/30";
      case "Ongoing": return "bg-journeys/20 text-journeys border-journeys/30";
      case "Not Started": return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getTypeColor = (type: Module["type"]) => {
    switch (type) {
      case "Course": return "text-courses";
      case "Assessment": return "text-assessments";
      case "Survey": return "text-surveys";
      case "Learning Journey": return "text-journeys";
      case "ILT": return "text-live-classes";
    }
  };

  return (
    <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "200ms" }}>
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <CardTitle className="text-lg">{title}</CardTitle>
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
                {idColumnLabel && <TableHead className="font-semibold whitespace-nowrap">{idColumnLabel}</TableHead>}
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
                {showTypeColumn && (
                  <TableHead className="font-semibold min-w-[140px]">
                    <div className="space-y-2">
                      <span>Type</span>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="h-7 text-xs bg-background/50 border-border">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Course">Course</SelectItem>
                          <SelectItem value="Assessment">Assessment</SelectItem>
                          <SelectItem value="Survey">Survey</SelectItem>
                          <SelectItem value="Learning Journey">Learning Journey</SelectItem>
                          <SelectItem value="ILT">ILT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableHead>
                )}
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
                <TableHead 
                  className="font-semibold whitespace-nowrap cursor-pointer hover:bg-secondary/70 transition-colors"
                  onClick={() => handleSort("startDate")}
                >
                  <div className="flex items-center gap-1">
                    Start
                    {sortColumn === "startDate" && (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold whitespace-nowrap cursor-pointer hover:bg-secondary/70 transition-colors"
                  onClick={() => handleSort("completionDate")}
                >
                  <div className="flex items-center gap-1">
                    Completion
                    {sortColumn === "completionDate" && (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Trainer</TableHead>
                {!hideDistributionTypeAndVersion && (
                  <TableHead className="font-semibold min-w-[160px]">
                    <div className="space-y-2">
                      <span>Distribution Type</span>
                      <Select value={distributionTypeFilter} onValueChange={setDistributionTypeFilter}>
                        <SelectTrigger className="h-7 text-xs bg-background/50 border-border">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Independent">Independent</SelectItem>
                          <SelectItem value="Automatic">Automatic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableHead>
                )}
                {!hideDistributionTypeAndVersion && (
                  <TableHead className="font-semibold whitespace-nowrap">Auto-dist Group</TableHead>
                )}
                {!hideDistributionTypeAndVersion && (
                  <TableHead className="font-semibold min-w-[120px]">
                    <div className="space-y-2">
                      <span>Version</span>
                      <Select value={versionFilter} onValueChange={setVersionFilter}>
                        <SelectTrigger className="h-7 text-xs bg-background/50 border-border">
                          <SelectValue placeholder="All Versions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Versions</SelectItem>
                          {uniqueVersions.map(version => (
                            <SelectItem key={version} value={version}>{version}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableHead>
                )}
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
                <TableHead className="font-semibold whitespace-nowrap">Coins</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Rating</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedModules.map((module) => (
                <TableRow key={module.id} className="hover:bg-secondary/30">
                  {idColumnLabel && <TableCell className="font-mono text-xs whitespace-nowrap">{module.id}</TableCell>}
                  <TableCell className="font-medium">{module.name}</TableCell>
                  {showTypeColumn && (
                    <TableCell>
                      <span className={cn("text-sm", getTypeColor(module.type))}>
                        {module.type}
                      </span>
                    </TableCell>
                  )}
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs whitespace-nowrap", getStatusColor(module.completionStatus))}>
                      {module.completionStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{module.distributionDate}</TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{module.startDate}</TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{module.completionDate}</TableCell>
                  <TableCell className="text-sm whitespace-nowrap">{module.trainer}</TableCell>
                  {!hideDistributionTypeAndVersion && (
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "text-xs whitespace-nowrap",
                        module.distributionType === "Automatic" 
                          ? "bg-journeys/20 text-journeys border-journeys/30" 
                          : "bg-muted text-muted-foreground border-muted"
                      )}>
                        {module.distributionType}
                      </Badge>
                    </TableCell>
                  )}
                  {!hideDistributionTypeAndVersion && (
                    <TableCell>
                      {module.distributionType === "Automatic" && module.autoDistributionGroup ? (
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                          <Users className="h-3 w-3" />
                          {module.autoDistributionGroup}
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                  )}
                  {!hideDistributionTypeAndVersion && (
                    <TableCell className="font-mono text-xs">{module.version}</TableCell>
                  )}
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "text-xs whitespace-nowrap",
                      module.enforced === "Hard" 
                        ? "bg-destructive/20 text-destructive border-destructive/30" 
                        : module.enforced === "Soft"
                        ? "bg-journeys/20 text-journeys border-journeys/30"
                        : "bg-muted text-muted-foreground border-muted"
                    )}>
                      {module.enforced}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-journeys">{module.coins}</TableCell>
                  <TableCell>
                    {module.feedbackRating ? (
                      <span className="font-mono text-sm">{module.feedbackRating}/5</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Go to module
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredModules.length} of {baseModules.length} {title.toLowerCase()}
        </div>
      </CardContent>
    </Card>
  );
}
