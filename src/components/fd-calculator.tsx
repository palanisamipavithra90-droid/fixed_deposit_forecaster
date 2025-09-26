"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";

export function FdCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7.5);
  const [time, setTime] = useState(5);
  const [timeUnit, setTimeUnit] = useState("Years");

  const { totalValue, estimatedReturns } = useMemo(() => {
    const p = principal;
    const r = rate / 100;
    let t = time;

    if (timeUnit === "Months") {
      t = time / 12;
    } else if (timeUnit === "Days") {
      t = time / 365;
    }

    if (p > 0 && r > 0 && t > 0) {
      // Compounding annually
      const amount = p * Math.pow(1 + r, t);
      const returns = amount - p;
      return { totalValue: amount, estimatedReturns: returns };
    }
    return { totalValue: p, estimatedReturns: 0 };
  }, [principal, rate, time, timeUnit]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const handlePrincipalSliderChange = (value: number[]) => {
    setPrincipal(value[0]);
  };
  
  const handlePrincipalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPrincipal(Math.min(Number(value), 5000000));
  };
  
  const handleRateSliderChange = (value: number[]) => {
    setRate(value[0]);
  };
  
  const handleRateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setRate(Math.min(Number(value), 20));
  };

  const chartConfig = {
    invested: {
      label: "Invested",
      color: "hsl(var(--accent))",
    },
    returns: {
      label: "Returns",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  const chartData = useMemo(
    () => [
      { type: "invested", value: principal },
      { type: "returns", value: estimatedReturns },
    ],
    [principal, estimatedReturns]
  );
  
  const totalChartValue = principal + estimatedReturns;

  return (
    <Card className="w-full max-w-4xl shadow-2xl rounded-2xl">
      <CardHeader className="items-center">
        <CardTitle className="text-3xl font-bold text-primary font-headline tracking-tight">
          Fixed Deposit Forecaster
        </CardTitle>
        <CardDescription className="text-center">
          Calculate your potential returns on fixed deposits with ease.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="principal" className="font-medium">Total Investment</Label>
              </div>
              <div className="relative">
                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹</span>
                <Input
                  id="principal"
                  type="text"
                  value={new Intl.NumberFormat('en-IN').format(principal)}
                  onChange={handlePrincipalInputChange}
                  className="pl-7 font-semibold text-lg"
                />
              </div>
              <Slider
                value={[principal]}
                max={5000000}
                min={1000}
                step={1000}
                onValueChange={handlePrincipalSliderChange}
                className="pt-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest-rate" className="font-medium">Rate of Interest (p.a)</Label>
               <div className="relative">
                 <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground">%</span>
                <Input
                  id="interest-rate"
                  type="text"
                  value={rate}
                  onChange={handleRateInputChange}
                  className="pr-7 font-semibold text-lg"
                />
              </div>
              <Slider
                value={[rate]}
                max={20}
                min={1}
                step={0.1}
                onValueChange={handleRateSliderChange}
                className="pt-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-period" className="font-medium">Time Period</Label>
              <div className="flex gap-4">
                <Input
                  id="time-period"
                  type="number"
                  value={time}
                  onChange={(e) => setTime(Number(e.target.value))}
                  className="font-semibold text-lg"
                />
                <Select value={timeUnit} onValueChange={setTimeUnit}>
                  <SelectTrigger className="w-[180px] font-semibold">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Years">Years</SelectItem>
                    <SelectItem value="Months">Months</SelectItem>
                    <SelectItem value="Days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center space-y-6 pt-4 lg:pt-0">
             <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px] w-full">
               <PieChart>
                 <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="type"
                    innerRadius={80}
                    outerRadius={120}
                    strokeWidth={5}
                    startAngle={90}
                    endAngle={450}
                  >
                     {chartData.map((entry) => (
                      <Cell key={entry.type} fill={`var(--color-${entry.type})`} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"/>
                    ))}
                  </Pie>
               </PieChart>
             </ChartContainer>
             <div className="w-full space-y-4 rounded-lg bg-background/50 p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                      <span className="text-muted-foreground">Invested Amount</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(principal)}</span>
                </div>
                <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Est. Returns</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(estimatedReturns)}</span>
                </div>
                <Separator/>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Total Value</span>
                    <span className="font-semibold text-lg text-primary">{formatCurrency(totalValue)}</span>
                </div>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
