"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import { revenueOverviewData } from "@/lib/mock-data"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig

export function RevenueOverviewChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart 
        accessibilityLayer 
        data={revenueOverviewData}
        margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
        }}
        >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis 
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            domain={[0, 80000]}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideIndicator />}
        />
        <Bar
          dataKey="revenue"
          fill="var(--color-revenue)"
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  )
}
