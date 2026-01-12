import { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { UserProfileHeader } from "@/components/user/UserProfileHeader";
import { ModuleStatsGrid } from "@/components/user/ModuleStatsGrid";
import { UserModulesTable } from "@/components/user/UserModulesTable";
import { CoursesTable } from "@/components/user/CoursesTable";
import { AssessmentsTable } from "@/components/user/AssessmentsTable";
import { PlaylistModulesTable } from "@/components/user/PlaylistModulesTable";
import { ILTsTable } from "@/components/user/ILTsTable";
import { getUserById } from "@/data/users";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserAnalytics = () => {
  const { userId } = useParams<{ userId: string }>();
  const user = getUserById(userId || "");
  const [activeTab, setActiveTab] = useState("modules");
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleModuleClick = (tabValue: string) => {
    setActiveTab(tabValue);
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="p-6 flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
            <p className="text-muted-foreground mb-4">The user you're looking for doesn't exist.</p>
            <Link to="/users">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-6 space-y-6 max-w-7xl mx-auto">
          {/* Breadcrumb & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to="/users">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Users
                </Button>
              </Link>
              <span className="text-muted-foreground text-sm">
                Last updated: Just now
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                User Attributes
              </Button>
            </div>
          </div>

          {/* User Profile Header */}
          <UserProfileHeader user={user} />

          {/* Module Stats */}
          <ModuleStatsGrid onModuleClick={handleModuleClick} />

          {/* Tabs for Different Views */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-slide-up" style={{ animationDelay: "150ms" }} ref={tabsRef}>
            <TabsList className="bg-secondary/50 border border-border">
              <TabsTrigger value="modules">All Modules</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
              <TabsTrigger value="surveys">Surveys</TabsTrigger>
              <TabsTrigger value="journeys">Learning Journeys</TabsTrigger>
              <TabsTrigger value="ilts">ILTs</TabsTrigger>
              
            </TabsList>

            <TabsContent value="modules" className="mt-6">
              <UserModulesTable showTypeColumn={true} title="All Modules" />
            </TabsContent>

            <TabsContent value="courses" className="mt-6">
              <CoursesTable />
            </TabsContent>

            <TabsContent value="assessments" className="mt-6">
              <AssessmentsTable />
            </TabsContent>

            <TabsContent value="surveys" className="mt-6">
              <UserModulesTable showTypeColumn={false} title="Surveys" filterByType="Survey" idColumnLabel="Survey ID" />
            </TabsContent>

            <TabsContent value="journeys" className="mt-6">
              <PlaylistModulesTable />
            </TabsContent>

            <TabsContent value="ilts" className="mt-6">
              <ILTsTable />
            </TabsContent>

            
          </Tabs>
      </main>
    </div>
  );
};

export default UserAnalytics;
