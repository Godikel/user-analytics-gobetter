import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, ArrowUp, ArrowDown, ExternalLink, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardDetail {
  courseId: string;
  courseName: string;
  cardId: string;
  cardTitle: string;
  cardType: "Learning" | "Question";
  viewDate: string;
  durationSeconds: number;
  pointsEarned: number;
}

interface Course {
  id: string;
  name: string;
  completionStatus: "Completed" | "Ongoing" | "Not Started";
  distributionDate: string;
  completionDate: string;
  trainerName: string;
  alternateTrainer: string;
  mandatory: "Yes" | "No";
  coins: number;
  feedbackRating: number | null;
  feedbackComments: string;
  distributionType: "Independent" | "Automatic";
  autoDistributionGroup: string;
  tags: string[];
  enforced: "No" | "Hard" | "Soft";
  version: string;
  learningCards: CardDetail[];
  questionCards: CardDetail[];
}

const generateDateTime = (): string => {
  const day = Math.floor(Math.random() * 28) + 1;
  const hours = Math.floor(Math.random() * 12) + 1;
  const mins = Math.floor(Math.random() * 60);
  const ampm = Math.random() > 0.5 ? "AM" : "PM";
  return `${day} Dec 2024, ${hours}:${mins.toString().padStart(2, '0')} ${ampm}`;
};

const courseNames = [
  "Leadership Fundamentals", "Data Analytics 101", "Project Management Excellence", "Communication Skills Mastery",
  "Strategic Thinking Workshop", "Team Collaboration Best Practices", "Customer Focus Training", "Innovation Mindset",
  "Sales Excellence Program", "Technical Writing Essentials", "Design Thinking Bootcamp", "Agile Methodology Certification"
];

const trainerNames = ["John Smith", "Sarah Wilson", "Mike Chen", "Lisa Kumar", "David Park", "Emily Brown", "Robert Lee"];
const autoGroups = ["Sales Team Alpha", "Engineering Division", "Marketing Squad", "Operations Team Beta", "Customer Success Group"];
const tagOptions = ["Mandatory", "Leadership", "Technical", "Soft Skills", "Compliance", "Onboarding", "Advanced", "Beginner"];
const feedbackOptions = [
  "Great course, very informative!",
  "Could use more practical examples.",
  "Excellent trainer, learned a lot.",
  "Content was relevant to my role.",
  "Would recommend to colleagues.",
  ""
];

const generateCardDetails = (courseId: string, courseName: string, type: "Learning" | "Question", count: number): CardDetail[] => {
  const cardTitles = type === "Learning" 
    ? ["Introduction", "Core Concepts", "Advanced Topics", "Best Practices", "Case Studies", "Summary"]
    : ["Quiz 1", "Assessment", "Final Test", "Practice Questions", "Knowledge Check"];
  
  return Array.from({ length: count }, (_, i) => ({
    courseId,
    courseName,
    cardId: `${courseId}-${type[0]}${String(i + 1).padStart(3, '0')}`,
    cardTitle: cardTitles[i % cardTitles.length],
    cardType: type,
    viewDate: generateDateTime(),
    durationSeconds: Math.floor(Math.random() * 300) + 30,
    pointsEarned: Math.floor(Math.random() * 50) + 10,
  }));
};

import { moduleStats } from "@/data/moduleData";

const generateCourses = (): Course[] => {
  const total = moduleStats.courses.distributed;
  const completed = moduleStats.courses.completed;
  const enforcedOptions: Course["enforced"][] = ["No", "Hard", "Soft"];
  
  return Array.from({ length: total }, (_, i) => {
    const courseId = `CRS${String(i + 1).padStart(4, '0')}`;
    const courseName = courseNames[i % courseNames.length];
    // Distribute statuses: first 'completed' items are Completed, rest are Ongoing or Not Started
    const status: Course["completionStatus"] = i < completed ? "Completed" : (i < completed + Math.floor((total - completed) / 2) ? "Ongoing" : "Not Started");
    const distType = i % 2 === 0 ? "Independent" : "Automatic";
    
    return {
      id: courseId,
      name: courseName,
      completionStatus: status,
      distributionDate: generateDateTime(),
      completionDate: status === "Completed" ? generateDateTime() : "-",
      trainerName: trainerNames[i % trainerNames.length],
      alternateTrainer: trainerNames[(i + 3) % trainerNames.length],
      mandatory: i % 3 === 0 ? "Yes" : "No",
      coins: Math.floor(Math.random() * 100) + 10,
      feedbackRating: status === "Completed" ? Math.floor(Math.random() * 5) + 1 : null,
      feedbackComments: status === "Completed" ? feedbackOptions[i % feedbackOptions.length] : "",
      distributionType: distType,
      autoDistributionGroup: distType === "Automatic" ? autoGroups[i % autoGroups.length] : "-",
      tags: [tagOptions[i % tagOptions.length], tagOptions[(i + 2) % tagOptions.length]],
      enforced: enforcedOptions[i % enforcedOptions.length],
      version: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}`,
      learningCards: generateCardDetails(courseId, courseName, "Learning", Math.floor(Math.random() * 5) + 2),
      questionCards: generateCardDetails(courseId, courseName, "Question", Math.floor(Math.random() * 3) + 1),
    };
  });
};

const courses = generateCourses();

type SortColumn = "distributionDate" | "completionDate" | null;
type SortDirection = "asc" | "desc";

function LevelDetailsDialog({ course }: { course: Course }) {
  const downloadExcel = (type: "learning" | "question") => {
    const cards = type === "learning" ? course.learningCards : course.questionCards;
    const headers = ["Course ID", "Course Name", "Card ID", "Card Title", "Card Type", "View Date", "Duration (sec)", "Points Earned"];
    const rows = cards.map(c => [c.courseId, c.courseName, c.cardId, c.cardTitle, c.cardType, c.viewDate, c.durationSeconds, c.pointsEarned]);
    
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${course.id}_${type}_cards.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 text-xs">
          <Eye className="h-3 w-3" />
          Level Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{course.name} - Level Details</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="learning" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="learning">Learning Cards ({course.learningCards.length})</TabsTrigger>
            <TabsTrigger value="question">Question Cards ({course.questionCards.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="learning" className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => downloadExcel("learning")} className="gap-1">
                <Download className="h-3 w-3" />
                Download
              </Button>
            </div>
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="font-semibold">Course ID</TableHead>
                    <TableHead className="font-semibold">Course Name</TableHead>
                    <TableHead className="font-semibold">Card ID</TableHead>
                    <TableHead className="font-semibold">Card Title</TableHead>
                    <TableHead className="font-semibold">Card Type</TableHead>
                    <TableHead className="font-semibold">View Date</TableHead>
                    <TableHead className="font-semibold">Duration (sec)</TableHead>
                    <TableHead className="font-semibold">Points Earned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {course.learningCards.map((card) => (
                    <TableRow key={card.cardId}>
                      <TableCell className="font-mono text-xs">{card.courseId}</TableCell>
                      <TableCell>{card.courseName}</TableCell>
                      <TableCell className="font-mono text-xs">{card.cardId}</TableCell>
                      <TableCell>{card.cardTitle}</TableCell>
                      <TableCell><Badge variant="outline">{card.cardType}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{card.viewDate}</TableCell>
                      <TableCell className="font-mono">{card.durationSeconds}</TableCell>
                      <TableCell className="font-mono text-journeys">{card.pointsEarned}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="question" className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => downloadExcel("question")} className="gap-1">
                <Download className="h-3 w-3" />
                Download
              </Button>
            </div>
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="font-semibold">Course ID</TableHead>
                    <TableHead className="font-semibold">Course Name</TableHead>
                    <TableHead className="font-semibold">Card ID</TableHead>
                    <TableHead className="font-semibold">Card Title</TableHead>
                    <TableHead className="font-semibold">Card Type</TableHead>
                    <TableHead className="font-semibold">View Date</TableHead>
                    <TableHead className="font-semibold">Duration (sec)</TableHead>
                    <TableHead className="font-semibold">Points Earned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {course.questionCards.map((card) => (
                    <TableRow key={card.cardId}>
                      <TableCell className="font-mono text-xs">{card.courseId}</TableCell>
                      <TableCell>{card.courseName}</TableCell>
                      <TableCell className="font-mono text-xs">{card.cardId}</TableCell>
                      <TableCell>{card.cardTitle}</TableCell>
                      <TableCell><Badge variant="outline">{card.cardType}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{card.viewDate}</TableCell>
                      <TableCell className="font-mono">{card.durationSeconds}</TableCell>
                      <TableCell className="font-mono text-journeys">{card.pointsEarned}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export function CoursesTable() {
  // Search states
  const [courseIdSearch, setCourseIdSearch] = useState("");
  const [courseNameSearch, setCourseNameSearch] = useState("");
  const [trainerSearch, setTrainerSearch] = useState("");
  const [altTrainerSearch, setAltTrainerSearch] = useState("");
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [mandatoryFilter, setMandatoryFilter] = useState<string>("all");
  const [distributionTypeFilter, setDistributionTypeFilter] = useState<string>("all");
  const [enforcedFilter, setEnforcedFilter] = useState<string>("all");
  const [versionFilter, setVersionFilter] = useState<string>("all");
  
  // Sort states
  const [sortColumn, setSortColumn] = useState<SortColumn>("distributionDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      if (sortDirection === "desc") {
        setSortDirection("asc");
      } else {
        setSortColumn(null);
        setSortDirection("desc");
      }
    } else {
      setSortColumn(column);
      setSortDirection("desc");
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

  const uniqueVersions = [...new Set(courses.map(c => c.version))].sort();

  const filteredCourses = courses.filter((course) => {
    const matchesCourseId = course.id.toLowerCase().includes(courseIdSearch.toLowerCase());
    const matchesCourseName = course.name.toLowerCase().includes(courseNameSearch.toLowerCase());
    const matchesTrainer = course.trainerName.toLowerCase().includes(trainerSearch.toLowerCase());
    const matchesAltTrainer = course.alternateTrainer.toLowerCase().includes(altTrainerSearch.toLowerCase());
    const matchesStatus = statusFilter === "all" || course.completionStatus === statusFilter;
    const matchesMandatory = mandatoryFilter === "all" || course.mandatory === mandatoryFilter;
    const matchesDistType = distributionTypeFilter === "all" || course.distributionType === distributionTypeFilter;
    const matchesEnforced = enforcedFilter === "all" || course.enforced === enforcedFilter;
    const matchesVersion = versionFilter === "all" || course.version === versionFilter;

    return matchesCourseId && matchesCourseName && matchesTrainer && matchesAltTrainer && 
           matchesStatus && matchesMandatory && matchesDistType && matchesEnforced && matchesVersion;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const dateA = parseDate(a[sortColumn]);
    const dateB = parseDate(b[sortColumn]);
    
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    const comparison = dateA.getTime() - dateB.getTime();
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const getStatusColor = (status: Course["completionStatus"]) => {
    switch (status) {
      case "Completed": return "bg-live-classes/20 text-live-classes border-live-classes/30";
      case "Ongoing": return "bg-journeys/20 text-journeys border-journeys/30";
      case "Not Started": return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getEnforcedColor = (enforced: Course["enforced"]) => {
    switch (enforced) {
      case "Hard": return "bg-destructive/20 text-destructive border-destructive/30";
      case "Soft": return "bg-journeys/20 text-journeys border-journeys/30";
      case "No": return "bg-muted text-muted-foreground border-muted";
    }
  };

  const downloadAllCourses = () => {
    const headers = ["Course ID", "Course Name", "Status", "Distribution Date", "Completion Date", "Trainer", "Alt Trainer", "Mandatory", "Coins", "Rating", "Feedback", "Distribution Type", "Auto Group", "Tags", "Enforced", "Version"];
    const rows = sortedCourses.map(c => [
      c.id, c.name, c.completionStatus, c.distributionDate, c.completionDate, c.trainerName, c.alternateTrainer, 
      c.mandatory, c.coins, c.feedbackRating || "-", c.feedbackComments, c.distributionType, c.autoDistributionGroup,
      c.tags.join("; "), c.enforced, c.version
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(r => r.map(cell => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "courses_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "200ms" }}>
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <CardTitle className="text-lg">Courses</CardTitle>
        <Button variant="outline" size="sm" className="gap-2" onClick={downloadAllCourses}>
          <Download className="h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-x-auto">
          <Table className="min-w-[2000px]">
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                {/* Course ID - Search */}
                <TableHead className="font-semibold min-w-[120px]">
                  <div className="space-y-2">
                    <span>Course ID</span>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={courseIdSearch}
                        onChange={(e) => setCourseIdSearch(e.target.value)}
                        className="pl-7 h-7 text-xs bg-background/50 border-border"
                      />
                    </div>
                  </div>
                </TableHead>
                
                {/* Course Name - Search */}
                <TableHead className="font-semibold min-w-[180px]">
                  <div className="space-y-2">
                    <span>Course Name</span>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={courseNameSearch}
                        onChange={(e) => setCourseNameSearch(e.target.value)}
                        className="pl-7 h-7 text-xs bg-background/50 border-border"
                      />
                    </div>
                  </div>
                </TableHead>

                {/* Completion Status - Filter */}
                <TableHead className="font-semibold min-w-[140px]">
                  <div className="space-y-2">
                    <span>Status</span>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-7 text-xs bg-background/50 border-border">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>

                {/* Distribution Date - Sort (default desc) */}
                <TableHead 
                  className="font-semibold whitespace-nowrap cursor-pointer hover:bg-secondary/70 transition-colors min-w-[140px]"
                  onClick={() => handleSort("distributionDate")}
                >
                  <div className="flex items-center gap-1">
                    Distribution
                    {sortColumn === "distributionDate" && (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>

                {/* Completion Date - Sort */}
                <TableHead 
                  className="font-semibold whitespace-nowrap cursor-pointer hover:bg-secondary/70 transition-colors min-w-[140px]"
                  onClick={() => handleSort("completionDate")}
                >
                  <div className="flex items-center gap-1">
                    Completion
                    {sortColumn === "completionDate" && (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>

                {/* Trainer Name - Search */}
                <TableHead className="font-semibold min-w-[140px]">
                  <div className="space-y-2">
                    <span>Trainer</span>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={trainerSearch}
                        onChange={(e) => setTrainerSearch(e.target.value)}
                        className="pl-7 h-7 text-xs bg-background/50 border-border"
                      />
                    </div>
                  </div>
                </TableHead>

                {/* Alternate Trainer - Search */}
                <TableHead className="font-semibold min-w-[140px]">
                  <div className="space-y-2">
                    <span>Alt Trainer</span>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={altTrainerSearch}
                        onChange={(e) => setAltTrainerSearch(e.target.value)}
                        className="pl-7 h-7 text-xs bg-background/50 border-border"
                      />
                    </div>
                  </div>
                </TableHead>

                {/* Mandatory - Filter */}
                <TableHead className="font-semibold min-w-[100px]">
                  <div className="space-y-2">
                    <span>Mandatory</span>
                    <Select value={mandatoryFilter} onValueChange={setMandatoryFilter}>
                      <SelectTrigger className="h-7 text-xs bg-background/50 border-border">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>

                <TableHead className="font-semibold whitespace-nowrap">Coins</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Rating</TableHead>
                <TableHead className="font-semibold min-w-[150px]">Feedback</TableHead>

                {/* Distribution Type - Filter */}
                <TableHead className="font-semibold min-w-[130px]">
                  <div className="space-y-2">
                    <span>Dist. Type</span>
                    <Select value={distributionTypeFilter} onValueChange={setDistributionTypeFilter}>
                      <SelectTrigger className="h-7 text-xs bg-background/50 border-border">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Independent">Independent</SelectItem>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>

                
                <TableHead className="font-semibold whitespace-nowrap min-w-[120px]">Tags</TableHead>

                {/* Enforced - Filter */}
                <TableHead className="font-semibold min-w-[100px]">
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

                {/* Version - Filter */}
                <TableHead className="font-semibold min-w-[100px]">
                  <div className="space-y-2">
                    <span>Version</span>
                    <Select value={versionFilter} onValueChange={setVersionFilter}>
                      <SelectTrigger className="h-7 text-xs bg-background/50 border-border">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {uniqueVersions.map(v => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>

                <TableHead className="font-semibold whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCourses.map((course) => (
                <TableRow key={course.id} className="hover:bg-secondary/30">
                  <TableCell className="font-mono text-xs whitespace-nowrap">{course.id}</TableCell>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs whitespace-nowrap", getStatusColor(course.completionStatus))}>
                      {course.completionStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{course.distributionDate}</TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{course.completionDate}</TableCell>
                  <TableCell className="text-sm whitespace-nowrap">{course.trainerName}</TableCell>
                  <TableCell className="text-sm whitespace-nowrap">{course.alternateTrainer}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs", course.mandatory === "Yes" ? "bg-courses/20 text-courses border-courses/30" : "bg-muted text-muted-foreground")}>
                      {course.mandatory}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-journeys">{course.coins}</TableCell>
                  <TableCell>
                    {course.feedbackRating ? (
                      <span className="font-mono text-sm">{course.feedbackRating}/5</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate" title={course.feedbackComments}>
                    {course.feedbackComments || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {course.distributionType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {course.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs", getEnforcedColor(course.enforced))}>
                      {course.enforced}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{course.version}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <LevelDetailsDialog course={course} />
                      <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        <ExternalLink className="h-3 w-3" />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {sortedCourses.length} of {courses.length} courses
        </div>
      </CardContent>
    </Card>
  );
}
