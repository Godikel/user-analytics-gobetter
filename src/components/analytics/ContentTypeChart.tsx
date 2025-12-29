import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const data = [
  { name: "Courses", value: 42, color: "hsl(199, 89%, 48%)" },
  { name: "Assessments", value: 24, color: "hsl(270, 70%, 60%)" },
  { name: "Surveys", value: 18, color: "hsl(340, 75%, 55%)" },
  { name: "Journeys", value: 28, color: "hsl(45, 93%, 58%)" },
  { name: "Live Classes", value: 15, color: "hsl(160, 84%, 39%)" },
  { name: "Feeds", value: 35, color: "hsl(25, 95%, 53%)" },
];

export function ContentTypeChart() {
  return (
    <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "200ms" }}>
      <CardHeader>
        <CardTitle className="text-lg">Content Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222, 47%, 10%)",
                  border: "1px solid hsl(222, 30%, 16%)",
                  borderRadius: "8px",
                  color: "hsl(210, 40%, 98%)",
                }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                }}
                formatter={(value) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
