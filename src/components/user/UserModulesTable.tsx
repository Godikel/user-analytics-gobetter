import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Filter } from "lucide-react";
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

  return Array.from({ length: count }, (_, i) => ({
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
    distributionType: i % 2 === 0 ? "Independent" : "Automatic",
    version: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}`,
  }));
};

const modules = generateModules(25);

export function UserModulesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.trainer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || module.type === typeFilter;
    const matchesStatus = statusFilter === "all" || module.completionStatus === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
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
        <CardTitle className="text-lg">Modules</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-[200px] bg-secondary/50 border-border"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] bg-secondary/50 border-border">
              <SelectValue placeholder="Type" />
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-secondary/50 border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Yet to Start">Yet to Start</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="font-semibold">Module ID</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Distribution</TableHead>
                <TableHead className="font-semibold">Completion</TableHead>
                <TableHead className="font-semibold">Trainer</TableHead>
                <TableHead className="font-semibold">Coins</TableHead>
                <TableHead className="font-semibold">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModules.map((module) => (
                <TableRow key={module.id} className="hover:bg-secondary/30">
                  <TableCell className="font-mono text-xs">{module.id}</TableCell>
                  <TableCell className="font-medium">{module.name}</TableCell>
                  <TableCell>
                    <span className={cn("text-sm", getTypeColor(module.type))}>
                      {module.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs", getStatusColor(module.completionStatus))}>
                      {module.completionStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{module.distributionDate}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{module.completionDate}</TableCell>
                  <TableCell className="text-sm">{module.trainer}</TableCell>
                  <TableCell className="font-mono text-journeys">{module.coins}</TableCell>
                  <TableCell>
                    {module.feedbackRating ? (
                      <span className="font-mono text-sm">{module.feedbackRating}/5</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredModules.length} of {modules.length} modules
        </div>
      </CardContent>
    </Card>
  );
}
