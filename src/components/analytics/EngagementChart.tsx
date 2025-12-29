import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", users: 2400, sessions: 4000, completions: 1800 },
  { name: "Tue", users: 1398, sessions: 3000, completions: 1200 },
  { name: "Wed", users: 9800, sessions: 5000, completions: 4500 },
  { name: "Thu", users: 3908, sessions: 4780, completions: 2890 },
  { name: "Fri", users: 4800, sessions: 5890, completions: 3200 },
  { name: "Sat", users: 3800, sessions: 4390, completions: 2100 },
  { name: "Sun", users: 4300, sessions: 4900, completions: 2800 },
];

export function EngagementChart() {
  return (
    <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "100ms" }}>
      <CardHeader>
        <CardTitle className="text-lg">Weekly Engagement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(270, 70%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(270, 70%, 60%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
              <XAxis
                dataKey="name"
                stroke="hsl(215, 20%, 55%)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(215, 20%, 55%)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222, 47%, 10%)",
                  border: "1px solid hsl(222, 30%, 16%)",
                  borderRadius: "8px",
                  color: "hsl(210, 40%, 98%)",
                }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="hsl(199, 89%, 48%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="hsl(270, 70%, 60%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSessions)"
              />
              <Area
                type="monotone"
                dataKey="completions"
                stroke="hsl(160, 84%, 39%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCompletions)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-courses" />
            <span className="text-sm text-muted-foreground">Active Users</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-assessments" />
            <span className="text-sm text-muted-foreground">Sessions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-live-classes" />
            <span className="text-sm text-muted-foreground">Completions</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
