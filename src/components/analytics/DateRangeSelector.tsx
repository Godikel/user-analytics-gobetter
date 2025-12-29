import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const timeRanges = ["Today", "7 Days", "30 Days", "90 Days", "Custom"];

export function DateRangeSelector() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {timeRanges.map((range) => (
        <Button
          key={range}
          variant={range === "30 Days" ? "default" : "outline"}
          size="sm"
          className="text-xs"
        >
          {range === "Custom" && <Calendar className="w-3 h-3 mr-1" />}
          {range}
          {range === "Custom" && <ChevronDown className="w-3 h-3 ml-1" />}
        </Button>
      ))}
    </div>
  );
}
