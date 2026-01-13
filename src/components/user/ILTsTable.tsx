import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { moduleStats } from "@/data/moduleData";

interface ILT {
  id: string;
  name: string;
  type: string;
  subType: string;
  mode: "Online" | "Offline";
  distributionDate: string;
  attendanceStatus: "Attended" | "Not Attended";
  classStartDateTime: string;
  classEndDateTime: string;
  trainer: string;
  altTrainer: string | null;
  totalTime: number; // in minutes
  attendedTime: number; // in minutes
  feedback: string | null;
  feedbackRating: number | null;
  enforced: "No" | "Hard" | "Soft";
}

const generateDateTime = (): string => {
  const day = Math.floor(Math.random() * 28) + 1;
  const hours = Math.floor(Math.random() * 12) + 1;
  const mins = Math.floor(Math.random() * 60);
  const ampm = Math.random() > 0.5 ? "AM" : "PM";
  return `${day} Dec 2024, ${hours}:${mins.toString().padStart(2, '0')} ${ampm}`;
};

const generateILTs = (): ILT[] => {
  const total = moduleStats.ilts.distributed;
  const completed = moduleStats.ilts.completed;
  const names = [
    "Leadership Workshop", "Sales Training Session", "Technical Deep Dive", "Team Building",
    "Product Launch Training", "Customer Service Excellence", "Safety Workshop", "Compliance Training",
    "Agile Methodology", "Design Thinking Workshop", "Innovation Lab", "Strategy Session"
  ];
  const types = ["Classroom", "Virtual", "Hybrid", "On-site"];
  const subTypes = ["Workshop", "Seminar", "Bootcamp", "Webinar", "Conference", "Training Session"];
  const trainers = ["John Smith", "Sarah Wilson", "Mike Chen", "Lisa Kumar", "David Park"];
  const altTrainers = ["Emily Brown", "James Lee", "Anna Garcia", "Robert Taylor", null];
  const feedbackOptions = [
    "Great session, very informative",
    "Excellent trainer, learned a lot",
    "Could use more practical examples",
    "Very engaging and interactive",
    "Good content but too long",
    null
  ];
  const enforcedOptions: ILT["enforced"][] = ["No", "Hard", "Soft"];
  const modeOptions: ILT["mode"][] = ["Online", "Offline"];

  return Array.from({ length: total }, (_, i) => {
    const isAttended = i < completed;
    const totalTime = Math.floor(Math.random() * 120) + 30; // 30-150 minutes
    const attendedTime = isAttended ? Math.floor(Math.random() * totalTime * 0.4) + totalTime * 0.6 : 0; // 60-100% of total if attended

    return {
      id: `ILT${String(i + 1).padStart(4, '0')}`,
      name: names[i % names.length],
      type: types[i % types.length],
      subType: subTypes[i % subTypes.length],
      mode: modeOptions[i % modeOptions.length],
      distributionDate: generateDateTime(),
      attendanceStatus: isAttended ? "Attended" : "Not Attended",
      classStartDateTime: generateDateTime(),
      classEndDateTime: generateDateTime(),
      trainer: trainers[i % trainers.length],
      altTrainer: altTrainers[i % altTrainers.length],
      totalTime,
      attendedTime: Math.round(attendedTime),
      feedback: isAttended ? feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)] : null,
      feedbackRating: isAttended ? Math.floor(Math.random() * 5) + 1 : null,
      enforced: enforcedOptions[i % enforcedOptions.length],
    };
  });
};

const ilts = generateILTs();

type SortColumn = "distributionDate" | "classStartDateTime" | "classEndDateTime" | null;
type SortDirection = "asc" | "desc";

const getStatusColor = (status: ILT["attendanceStatus"]) => {
  switch (status) {
    case "Attended": return "bg-live-classes/20 text-live-classes border-live-classes/30";
    case "Not Attended": return "bg-muted text-muted-foreground border-muted";
  }
};

export function ILTsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [enforcedFilter, setEnforcedFilter] = useState<string>("all");
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
    const match = dateStr.match(/(\d+) (\w+) (\d+), (\d+):(\d+) (AM|PM)/);
    if (!match) return null;
    const [, day, month, year, hours, mins, ampm] = match;
    const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(month);
    let hour = parseInt(hours);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return new Date(parseInt(year), monthIndex, parseInt(day), hour, parseInt(mins));
  };

  const filteredILTs = ilts.filter((ilt) => {
    const matchesSearch =
      ilt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ilt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ilt.trainer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || ilt.attendanceStatus === statusFilter;
    const matchesEnforced = enforcedFilter === "all" || ilt.enforced === enforcedFilter;

    return matchesSearch && matchesStatus && matchesEnforced;
  });

  const sortedILTs = [...filteredILTs].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const dateA = parseDate(a[sortColumn]);
    const dateB = parseDate(b[sortColumn]);
    
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    const comparison = dateA.getTime() - dateB.getTime();
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "200ms" }}>
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <CardTitle className="text-lg">ILTs</CardTitle>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-x-auto">
          <Table className="min-w-[1100px]">
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="font-semibold whitespace-nowrap">ILT ID</TableHead>
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
                <TableHead className="font-semibold whitespace-nowrap">Type</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Sub-type</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Mode</TableHead>
                <TableHead className="font-semibold min-w-[140px]">
                  <div className="space-y-2">
                    <span>Status</span>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-7 text-xs bg-background/50 border-border">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Attended">Attended</SelectItem>
                        <SelectItem value="Not Attended">Not Attended</SelectItem>
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
                  onClick={() => handleSort("classStartDateTime")}
                >
                  <div className="flex items-center gap-1">
                    Class Start
                    {sortColumn === "classStartDateTime" && (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold whitespace-nowrap cursor-pointer hover:bg-secondary/70 transition-colors"
                  onClick={() => handleSort("classEndDateTime")}
                >
                  <div className="flex items-center gap-1">
                    Class End
                    {sortColumn === "classEndDateTime" && (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Trainer</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Alt Trainer</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Time Attended</TableHead>
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
                <TableHead className="font-semibold whitespace-nowrap">Feedback Rating</TableHead>
                <TableHead className="font-semibold whitespace-nowrap min-w-[200px]">Feedback</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedILTs.map((ilt) => (
                <TableRow key={ilt.id} className="hover:bg-secondary/30">
                  <TableCell className="font-mono text-xs whitespace-nowrap">{ilt.id}</TableCell>
                  <TableCell className="font-medium">{ilt.name}</TableCell>
                  <TableCell className="text-sm whitespace-nowrap">{ilt.type}</TableCell>
                  <TableCell className="text-sm whitespace-nowrap">{ilt.subType}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "text-xs whitespace-nowrap",
                      ilt.mode === "Online" 
                        ? "bg-journeys/20 text-journeys border-journeys/30" 
                        : "bg-courses/20 text-courses border-courses/30"
                    )}>
                      {ilt.mode}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs whitespace-nowrap", getStatusColor(ilt.attendanceStatus))}>
                      {ilt.attendanceStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{ilt.distributionDate}</TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{ilt.classStartDateTime}</TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{ilt.classEndDateTime}</TableCell>
                  <TableCell className="text-sm whitespace-nowrap">{ilt.trainer}</TableCell>
                  <TableCell className="text-sm whitespace-nowrap text-muted-foreground">{ilt.altTrainer || "-"}</TableCell>
                  <TableCell className="font-mono text-xs whitespace-nowrap">
                    {ilt.attendanceStatus === "Attended" ? (
                      <span className={cn(
                        ilt.attendedTime / ilt.totalTime >= 0.8 ? "text-live-classes" : "text-journeys"
                      )}>
                        {formatTime(ilt.attendedTime)} / {formatTime(ilt.totalTime)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "text-xs whitespace-nowrap",
                      ilt.enforced === "Hard" 
                        ? "bg-destructive/20 text-destructive border-destructive/30" 
                        : ilt.enforced === "Soft"
                        ? "bg-journeys/20 text-journeys border-journeys/30"
                        : "bg-muted text-muted-foreground border-muted"
                    )}>
                      {ilt.enforced}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {ilt.feedbackRating ? (
                      <span className="font-mono text-sm">{ilt.feedbackRating}/5</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                    {ilt.feedback ?? "-"}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Go to Module
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredILTs.length} of {ilts.length} ILTs
        </div>
      </CardContent>
    </Card>
  );
}
