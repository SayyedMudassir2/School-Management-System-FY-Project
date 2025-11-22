
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BarChart, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

type IncomeData = { month: string; income: number };
type ExpenseData = { month: string; expenses: number };
type ChartDataType = { name: string; income: number; expenses: number };

type IncomeExpenseClientProps = {
  incomeData: IncomeData[];
  expenseData: ExpenseData[];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const chartConfig = {
  income: { label: "Income", color: "hsl(var(--chart-2))" },
  expenses: { label: "Expenses", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;


export function IncomeExpenseClient({ incomeData, expenseData }: IncomeExpenseClientProps) {
  const chartData: ChartDataType[] = useMemo(() => {
    return incomeData.map(inc => {
      const exp = expenseData.find(exp => exp.month === inc.month);
      return {
        name: inc.month,
        income: inc.income,
        expenses: exp ? exp.expenses : 0
      };
    });
  }, [incomeData, expenseData]);

  const currentMonthData = chartData[chartData.length - 1];
  const netProfit = currentMonthData.income - currentMonthData.expenses;
  const cashInHand = 500000; // Placeholder value

  const expenseBreakdown = [
    { name: 'Salary', value: 150000 },
    { name: 'Utilities', value: 25000 },
    { name: 'Maintenance', value: 15000 },
    { name: 'Stationery', value: 5000 },
    { name: 'Transport', value: 10000 },
    { name: 'Miscellaneous', value: 8000 },
  ];
  
  const totalExpenses = expenseBreakdown.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income (This Month)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMonthData.income.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expense (This Month)</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMonthData.expenses.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit (This Month)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${netProfit.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash in Hand (Approx.)</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${cashInHand.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="glassmorphic lg:col-span-3">
          <CardHeader>
            <CardTitle>Income vs. Expense</CardTitle>
            <CardDescription>Monthly comparison for the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                <Tooltip 
                  cursor={{ fill: 'hsla(var(--muted), 0.2)'}}
                  content={<ChartTooltipContent indicator="dot" />} 
                />
                <Legend />
                <Bar dataKey="income" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="glassmorphic lg:col-span-2">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Categorical expense distribution for this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <PieChart>
                <Tooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={expenseBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconSize={10}
                  formatter={(value, entry) => {
                    const { color } = entry;
                    const item = expenseBreakdown.find(d => d.name === value);
                    const percentage = item ? ((item.value / totalExpenses) * 100).toFixed(2) : 0;
                    return <span style={{ color: 'hsl(var(--muted-foreground))' }} className="text-xs">{value} ({percentage}%)</span>;
                  }}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

