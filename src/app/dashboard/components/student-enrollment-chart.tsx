"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import { studentEnrollmentData } from "@/lib/mock-data"

const chartConfig = {
  enrollment: {
    label: "Enrollment",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function StudentEnrollmentChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <LineChart
        accessibilityLayer
        data={studentEnrollmentData}
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
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[400, 1600]}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
          dataKey="enrollment"
          type="monotone"
          stroke="var(--color-enrollment)"
          strokeWidth={2}
          dot={{
            fill: "var(--color-enrollment)",
          }}
          activeDot={{
            r: 6,
          }}
        />
      </LineChart>
    </ChartContainer>
  )
}
