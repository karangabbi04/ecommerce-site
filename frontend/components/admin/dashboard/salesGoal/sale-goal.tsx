"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SalesGoalProps {
  goal: number;
  currentSales: number;
}

export default function SalesGoal({
  goal,
  currentSales,
}: SalesGoalProps) {
  const progress = Math.min((currentSales / goal) * 100, 100);
  const remaining = Math.max(goal - currentSales, 0);
  const completed = currentSales >= goal;

  const format = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <Card
      className={`overflow-hidden rounded-2xl border transition-all duration-500 ${
        completed
          ? "border-green-500 bg-green-50 dark:bg-green-950/30"
          : "border-border"
      }`}
    >
      <CardContent className="space-y-2 p-4 py-0">
        <div>
          <h3 className="text-lg font-semibold">Monthly Goal</h3>
          <p className="text-sm text-muted-foreground">
            Goal: {format(goal)}
          </p>
        </div>

        {!completed ? (
          <>
            <Progress value={progress} className="h-3 rounded-full bg-gray-400" />

            <div className="flex justify-between text-sm">
              <div>
                <p className="text-muted-foreground">Completed</p>
                <p className="font-semibold text-primary">
                  {format(currentSales)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-muted-foreground">Remaining</p>
                <p className="font-semibold text-orange-500">
                  {format(remaining)}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-xl bg-green-500/10 p-5 text-center">
            <h2 className="text-xl font-bold text-green-600">
              🎉 Congratulations!
            </h2>

            <p className="mt-2 text-sm text-green-700 dark:text-green-300">
              You achieved your monthly sales goal.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}