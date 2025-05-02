import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, Line, LineChart } from "recharts";
import { TravelOffer } from "@/types";

type TimeRange = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
type ComparisonType = "none" | "lastYear" | "lastQuarter" | "lastMonth" | "lastWeek";

interface PerformanceChartProps {
  offers: TravelOffer[];
}

// Define the correct data type including the optional previous property
interface ChartDataItem {
  name: string;
  current: number;
  revenue: number;
  previous?: number; // Add the optional previous property
}

const PerformanceChart = ({ offers }: PerformanceChartProps) => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly");
  const [comparison, setComparison] = useState<ComparisonType>("none");

  // Mock data - in a real app this would be derived from the actual offers
  const generateMockData = (period: TimeRange, includeComparison: boolean = false): ChartDataItem[] => {
    const currentData: ChartDataItem[] = [];

    const getLabels = () => {
      switch (period) {
        case "daily":
          return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        case "weekly":
          return ["Week 1", "Week 2", "Week 3", "Week 4"];
        case "monthly":
          return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        case "quarterly":
          return ["Q1", "Q2", "Q3", "Q4"];
        case "yearly":
          return ["2020", "2021", "2022", "2023", "2024"];
        default:
          return [];
      }
    };

    const labels = getLabels();
    
    for (const label of labels) {
      const currentValue = Math.floor(Math.random() * 50) + 10;
      const chartItem: ChartDataItem = {
        name: label,
        current: currentValue,
        revenue: currentValue * (Math.floor(Math.random() * 100) + 50),
      };
      
      if (includeComparison) {
        chartItem.previous = Math.floor(Math.random() * 50) + 10;
      }
      
      currentData.push(chartItem);
    }

    return currentData;
  };

  const data = generateMockData(timeRange, comparison !== "none");

  const getComparisonLabel = () => {
    switch (comparison) {
      case "lastYear":
        return t("vs Last Year");
      case "lastQuarter":
        return t("vs Last Quarter");
      case "lastMonth":
        return t("vs Last Month");
      case "lastWeek":
        return t("vs Last Week");
      default:
        return "";
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>{t("dashboard.performance")}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <Tabs defaultValue={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div className="flex mt-2 gap-2 flex-wrap">
          <Button 
            variant={comparison === "none" ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setComparison("none")}
          >
            Current
          </Button>
          <Button 
            variant={comparison === "lastYear" ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setComparison("lastYear")}
          >
            vs Last Year
          </Button>
          <Button 
            variant={comparison === "lastQuarter" ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setComparison("lastQuarter")}
          >
            vs Last Quarter
          </Button>
          <Button 
            variant={comparison === "lastMonth" ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setComparison("lastMonth")}
          >
            vs Last Month
          </Button>
          <Button 
            variant={comparison === "lastWeek" ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setComparison("lastWeek")}
          >
            vs Last Week
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            {comparison === "none" ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="current" name="Offers" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#82ca9d" />
              </BarChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip comparison={true} />} />
                <Legend />
                <Line type="monotone" dataKey="current" stroke="#8884d8" name="Current" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="previous" stroke="#82ca9d" name="Previous" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Custom tooltip component for the charts
const CustomTooltip = ({ active, payload, label, comparison = false }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-md p-2 shadow-md">
        <p className="font-semibold">{label}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex justify-between gap-4">
            <span style={{ color: item.color }}>{item.name}:</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default PerformanceChart;
