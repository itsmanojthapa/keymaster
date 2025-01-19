"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function Result({
  arrWps,
}: {
  arrWps: { time: number; wpm: number }[];
}) {
  const chartConfig = {
    desktop: {
      label: "WPM",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "WPM",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;
  // console.log(arrWps);

  return (
    <Card className="dark mt-3">
      <CardHeader>
        <CardTitle>Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={arrWps}
            margin={{
              left: -20,
              right: 12,
            }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={arrWps?.length < 10 ? arrWps?.length : 10}
              tickFormatter={(value) => value}
            />
            <YAxis
              dataKey="wpm"
              tickLine={false}
              axisLine={false}
              tickMargin={arrWps?.length < 10 ? arrWps?.length : 10}
              tickFormatter={(value) => value}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Area
              dataKey="wpm"
              name="wpm"
              type="natural"
              fill="none"
              className="bg-blue-500"
              fillOpacity={100}
              stroke="teal"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
