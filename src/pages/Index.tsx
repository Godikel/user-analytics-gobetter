import { Header } from "@/components/layout/Header";
import { MetricCard } from "@/components/analytics/MetricCard";
import { EngagementChart } from "@/components/analytics/EngagementChart";
import { ContentTypeChart } from "@/components/analytics/ContentTypeChart";
import { CourseProgressTable } from "@/components/analytics/CourseProgressTable";
import { LearningJourneyProgress } from "@/components/analytics/LearningJourneyProgress";
import { LiveClassStats } from "@/components/analytics/LiveClassStats";
import { AssessmentResults } from "@/components/analytics/AssessmentResults";
import { SurveyInsights } from "@/components/analytics/SurveyInsights";
import { FeedEngagement } from "@/components/analytics/FeedEngagement";
import { DateRangeSelector } from "@/components/analytics/DateRangeSelector";
import {
  Users,
  BookOpen,
  Trophy,
  Clock,
  TrendingUp,
  Target,
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-6 space-y-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">User Analytics Overview</h2>
              <p className="text-muted-foreground text-sm">
                Track learner progress, engagement, and performance metrics
              </p>
            </div>
            <DateRangeSelector />
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <MetricCard
              title="Total Users"
              value="12,847"
              change="+12.5% from last month"
              changeType="positive"
              icon={Users}
              iconColor="text-courses"
              delay={0}
            />
            <MetricCard
              title="Active Learners"
              value="8,234"
              change="+8.2% from last month"
              changeType="positive"
              icon={TrendingUp}
              iconColor="text-live-classes"
              delay={50}
            />
            <MetricCard
              title="Courses Completed"
              value="3,456"
              change="+15.3% from last month"
              changeType="positive"
              icon={BookOpen}
              iconColor="text-assessments"
              delay={100}
            />
            <MetricCard
              title="Avg. Completion Rate"
              value="72%"
              change="+3.2% from last month"
              changeType="positive"
              icon={Target}
              iconColor="text-surveys"
              delay={150}
            />
            <MetricCard
              title="Avg. Time Spent"
              value="2.4h"
              change="-5% from last month"
              changeType="negative"
              icon={Clock}
              iconColor="text-journeys"
              delay={200}
            />
            <MetricCard
              title="Certifications"
              value="1,892"
              change="+22.1% from last month"
              changeType="positive"
              icon={Trophy}
              iconColor="text-feeds"
              delay={250}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EngagementChart />
            </div>
            <ContentTypeChart />
          </div>

          {/* Course & Assessment Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CourseProgressTable />
            <AssessmentResults />
          </div>

          {/* Journey & Live Classes Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LearningJourneyProgress />
            <LiveClassStats />
          </div>

          {/* Survey & Feed Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SurveyInsights />
            <FeedEngagement />
          </div>
      </main>
    </div>
  );
};

export default Index;
