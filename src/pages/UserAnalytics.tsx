import { useParams, Link } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { UserProfileHeader } from "@/components/user/UserProfileHeader";
import { ModuleStatsGrid } from "@/components/user/ModuleStatsGrid";
import { UserModulesTable } from "@/components/user/UserModulesTable";
import { getUserById } from "@/data/users";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserAnalytics = () => {
  const { userId } = useParams<{ userId: string }>();
  const user = getUserById(userId || "");

  if (!user) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
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
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
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
          <ModuleStatsGrid modules={user.modules} />

          {/* Tabs for Different Views */}
          <Tabs defaultValue="modules" className="animate-slide-up" style={{ animationDelay: "150ms" }}>
            <TabsList className="bg-secondary/50 border border-border">
              <TabsTrigger value="modules">All Modules</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
              <TabsTrigger value="surveys">Surveys</TabsTrigger>
              <TabsTrigger value="journeys">Learning Journeys</TabsTrigger>
              <TabsTrigger value="ilts">ILTs</TabsTrigger>
              <TabsTrigger value="feeds">Feeds</TabsTrigger>
            </TabsList>

            <TabsContent value="modules" className="mt-6">
              <UserModulesTable />
            </TabsContent>

            <TabsContent value="courses" className="mt-6">
              <UserModulesTable />
            </TabsContent>

            <TabsContent value="assessments" className="mt-6">
              <UserModulesTable />
            </TabsContent>

            <TabsContent value="surveys" className="mt-6">
              <UserModulesTable />
            </TabsContent>

            <TabsContent value="journeys" className="mt-6">
              <UserModulesTable />
            </TabsContent>

            <TabsContent value="ilts" className="mt-6">
              <UserModulesTable />
            </TabsContent>

            <TabsContent value="feeds" className="mt-6">
              <UserModulesTable />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default UserAnalytics;
