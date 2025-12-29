import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "0-20%", count: 12, color: "hsl(0, 72%, 51%)" },
  { name: "21-40%", count: 28, color: "hsl(25, 95%, 53%)" },
  { name: "41-60%", count: 156, color: "hsl(45, 93%, 58%)" },
  { name: "61-80%", count: 298, color: "hsl(160, 84%, 39%)" },
  { name: "81-100%", count: 445, color: "hsl(199, 89%, 48%)" },
];

export function AssessmentResults() {
  return (
    <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "350ms" }}>
      <CardHeader>
        <CardTitle className="text-lg">Assessment Score Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(222, 30%, 16%)"
                horizontal={false}
              />
              <XAxis
                type="number"
                stroke="hsl(215, 20%, 55%)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="hsl(215, 20%, 55%)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222, 47%, 10%)",
                  border: "1px solid hsl(222, 30%, 16%)",
                  borderRadius: "8px",
                  color: "hsl(210, 40%, 98%)",
                }}
                formatter={(value: number) => [`${value} users`, "Count"]}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-live-classes">72%</p>
            <p className="text-xs text-muted-foreground">Avg. Score</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-courses">939</p>
            <p className="text-xs text-muted-foreground">Total Attempts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-assessments">85%</p>
            <p className="text-xs text-muted-foreground">Pass Rate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
