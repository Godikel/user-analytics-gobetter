import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, ArrowUp, ArrowDown, ExternalLink, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Assessment {
  id: string;
  name: string;
  distributionDate: string;
  completionStatus: "Completed" | "Ongoing" | "Not Started";
  startDate: string;
  completionDate: string;
  rank: number | null;
  timeTaken: string | null;
  score: number | null;
  expPoints: number;
  feedbackRating: number | null;
  feedbackComments: string | null;
  numberOfQuestions: number;
  participants: number;
  mandatory: "Yes" | "No";
  tags: string[];
  enforced: "No" | "Hard" | "Soft";
  distributionType: "Independent" | "Automatic";
  autoDistributionGroup: string | null;
  version: string;
}

const generateDateTime = (): string => {
  const day = Math.floor(Math.random() * 28) + 1;
  const hours = Math.floor(Math.random() * 12) + 1;
  const mins = Math.floor(Math.random() * 60);
  const ampm = Math.random() > 0.5 ? "AM" : "PM";
  return `${day} Dec 2024, ${hours}:${mins.toString().padStart(2, '0')} ${ampm}`;
};

import { moduleStats } from "@/data/moduleData";

const generateAssessments = (): Assessment[] => {
  const total = moduleStats.assessments.distributed;
  const completed = moduleStats.assessments.completed;
  const names = [
    "Sales Knowledge Test", "Compliance Assessment", "Product Certification", "Security Awareness",
    "Leadership Evaluation", "Technical Skills Test", "Customer Service Quiz", "Safety Protocol Test",
    "Onboarding Assessment", "Annual Performance Review", "Skills Gap Analysis", "Competency Check"
  ];
  const tagOptions = ["Compliance", "Technical", "Soft Skills", "Leadership", "Safety", "Sales", "HR", "Onboarding"];
  const feedbackCommentsOptions = [
    "Great assessment, very relevant to my work",
    "Questions were clear and concise",
    "Could use more practical examples",
    "Helpful for understanding the material",
    "Challenging but fair",
    null
  ];
  const autoDistGroups = ["New Hires 2024", "Sales Team Q1", "Engineering Onboarding", "Leadership Track", "Compliance Annual"];

  return Array.from({ length: total }, (_, i) => {
    // Distribute statuses: first 'completed' items are Completed, rest are Ongoing or Not Started
    const status: Assessment["completionStatus"] = i < completed ? "Completed" : (i < completed + Math.floor((total - completed) / 2) ? "Ongoing" : "Not Started");
    const isCompleted = status === "Completed";
    const isAutomatic = i % 2 !== 0;
    const numTags = Math.floor(Math.random() * 3) + 1;
    const selectedTags = [...tagOptions].sort(() => 0.5 - Math.random()).slice(0, numTags);

    return {
      id: `ASM${String(i + 1).padStart(4, '0')}`,
      name: names[i % names.length],
      distributionDate: generateDateTime(),
      completionStatus: status,
      startDate: status === "Not Started" ? "-" : generateDateTime(),
      completionDate: isCompleted ? generateDateTime() : "-",
      rank: isCompleted ? Math.floor(Math.random() * 50) + 1 : null,
      timeTaken: isCompleted ? `${Math.floor(Math.random() * 45) + 5}m ${Math.floor(Math.random() * 60)}s` : null,
      score: isCompleted ? Math.floor(Math.random() * 41) + 60 : null,
      expPoints: Math.floor(Math.random() * 500) + 50,
      feedbackRating: isCompleted ? Math.floor(Math.random() * 5) + 1 : null,
      feedbackComments: isCompleted ? feedbackCommentsOptions[Math.floor(Math.random() * feedbackCommentsOptions.length)] : null,
      numberOfQuestions: Math.floor(Math.random() * 30) + 5,
      participants: Math.floor(Math.random() * 200) + 10,
      mandatory: i % 3 === 0 ? "Yes" : "No",
      tags: selectedTags,
      enforced: ["No", "Hard", "Soft"][i % 3] as "No" | "Hard" | "Soft",
      distributionType: isAutomatic ? "Automatic" : "Independent",
      autoDistributionGroup: isAutomatic ? autoDistGroups[i % autoDistGroups.length] : null,
      version: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}`,
    };
  });
};

const assessments = generateAssessments();

type SortColumn = "distributionDate" | "completionDate" | null;
type SortDirection = "asc" | "desc";

const getStatusColor = (status: Assessment["completionStatus"]) => {
  switch (status) {
    case "Completed": return "bg-courses/20 text-courses border-courses/30";
    case "Ongoing": return "bg-journeys/20 text-journeys border-journeys/30";
    case "Not Started": return "bg-muted text-muted-foreground border-muted";
  }
};

const getEnforcedColor = (enforced: Assessment["enforced"]) => {
  switch (enforced) {
    case "Hard": return "bg-destructive/20 text-destructive border-destructive/30";
    case "Soft": return "bg-journeys/20 text-journeys border-journeys/30";
    case "No": return "bg-muted text-muted-foreground border-muted";
  }
};

export function AssessmentsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [mandatoryFilter, setMandatoryFilter] = useState<string>("all");
  const [enforcedFilter, setEnforcedFilter] = useState<string>("all");
  const [distributionTypeFilter, setDistributionTypeFilter] = useState<string>("all");
  const [versionFilter, setVersionFilter] = useState<string>("all");
  const [sortColumn, setSortColumn] = useState<SortColumn>("distributionDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const uniqueVersions = [...new Set(assessments.map(a => a.version))].sort();

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

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assessment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || assessment.completionStatus === statusFilter;
    const matchesMandatory = mandatoryFilter === "all" || assessment.mandatory === mandatoryFilter;
    const matchesEnforced = enforcedFilter === "all" || assessment.enforced === enforcedFilter;
    const matchesDistType = distributionTypeFilter === "all" || assessment.distributionType === distributionTypeFilter;
    const matchesVersion = versionFilter === "all" || assessment.version === versionFilter;
    return matchesSearch && matchesStatus && matchesMandatory && matchesEnforced && matchesDistType && matchesVersion;
  });

  const sortedAssessments = [...filteredAssessments].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    if (aVal === "-" || bVal === "-") return 0;
    const comparison = aVal.localeCompare(bVal);
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const handleExport = () => {
    const headers = ["Assessment ID", "Name", "Status", "Distribution Date", "Start Date", "Completion Date", "Rank", "Time Taken", "Score", "Exp Points", "Feedback Rating", "Feedback Comments", "Questions", "Participants", "Mandatory", "Tags", "Enforced", "Distribution Type", "Auto-dist Group", "Version"];
    const csvContent = [
      headers.join(","),
      ...sortedAssessments.map(a => [
        a.id, `"${a.name}"`, a.completionStatus, a.distributionDate, a.startDate, a.completionDate,
        a.rank ?? "-", a.timeTaken ?? "-", a.score ?? "-", a.expPoints, a.feedbackRating ?? "-",
        `"${a.feedbackComments ?? "-"}"`, a.numberOfQuestions, a.participants, a.mandatory,
        `"${a.tags.join(", ")}"`, a.enforced, a.distributionType, a.autoDistributionGroup ?? "-", a.version
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "assessments_export.csv";
    link.click();
  };

  return (
    <Card className="bg-card/50 border-border backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-lg text-foreground">Assessments</CardTitle>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 w-64 bg-background/50 border-border"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="font-semibold whitespace-nowrap">Assessment ID</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Name</TableHead>
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
                <TableHead className="font-semibold cursor-pointer whitespace-nowrap" onClick={() => handleSort("distributionDate")}>
                  <div className="flex items-center gap-1">
                    Distribution
                    {sortColumn === "distributionDate" && (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="font-semibold cursor-pointer whitespace-nowrap" onClick={() => handleSort("completionDate")}>
                  <div className="flex items-center gap-1">
                    Completion
                    {sortColumn === "completionDate" && (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Rank</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Time Taken</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Score</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Exp Points</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Rating</TableHead>
                <TableHead className="font-semibold whitespace-nowrap min-w-[200px]">Feedback</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Questions</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">Participants</TableHead>
                <TableHead className="font-semibold min-w-[120px]">
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
                <TableHead className="font-semibold whitespace-nowrap">Tags</TableHead>
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
                <TableHead className="font-semibold whitespace-nowrap">Auto-dist Group</TableHead>
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
                <TableHead className="font-semibold whitespace-nowrap">Review</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAssessments.map((assessment) => (
                <TableRow key={assessment.id} className="hover:bg-secondary/30">
                  <TableCell className="font-mono text-xs whitespace-nowrap">{assessment.id}</TableCell>
                  <TableCell className="font-medium">{assessment.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs whitespace-nowrap", getStatusColor(assessment.completionStatus))}>
                      {assessment.completionStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{assessment.distributionDate}</TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{assessment.completionDate}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {assessment.rank ? `#${assessment.rank}` : <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell className="text-xs whitespace-nowrap">
                    {assessment.timeTaken ?? <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {assessment.score ? (
                      <span className={cn(assessment.score >= 80 ? "text-courses" : assessment.score >= 60 ? "text-journeys" : "text-destructive")}>
                        {assessment.score}%
                      </span>
                    ) : <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell className="font-mono text-assessments">{assessment.expPoints}</TableCell>
                  <TableCell>
                    {assessment.feedbackRating ? (
                      <span className="font-mono text-sm">{assessment.feedbackRating}/5</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                    {assessment.feedbackComments ?? "-"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{assessment.numberOfQuestions}</TableCell>
                  <TableCell className="font-mono text-sm">{assessment.participants}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "text-xs",
                      assessment.mandatory === "Yes" 
                        ? "bg-destructive/20 text-destructive border-destructive/30" 
                        : "bg-muted text-muted-foreground border-muted"
                    )}>
                      {assessment.mandatory}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {assessment.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {assessment.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">+{assessment.tags.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs", getEnforcedColor(assessment.enforced))}>
                      {assessment.enforced}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "text-xs whitespace-nowrap",
                      assessment.distributionType === "Automatic" 
                        ? "bg-journeys/20 text-journeys border-journeys/30" 
                        : "bg-muted text-muted-foreground border-muted"
                    )}>
                      {assessment.distributionType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {assessment.distributionType === "Automatic" && assessment.autoDistributionGroup ? (
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                        <Users className="h-3 w-3" />
                        {assessment.autoDistributionGroup}
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{assessment.version}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                      <FileText className="h-3 w-3" />
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredAssessments.length} of {assessments.length} assessments
        </div>
      </CardContent>
    </Card>
  );
}
