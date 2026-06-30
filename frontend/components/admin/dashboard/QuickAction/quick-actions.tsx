import { quickActions } from "./action";
import { QuickActionCard } from "./quick-action-card";

export function QuickActions() {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Quick Actions
        </h2>

        <p className="text-sm text-muted-foreground">
          Frequently used shortcuts to speed up your workflow.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {quickActions.map((action) => (
          <QuickActionCard
            key={action.id}
            action={action}
          />
        ))}
      </div>
    </section>
  );
}