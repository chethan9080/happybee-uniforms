import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ 
  title = "No data available", 
  description = "Get started by adding your first item.", 
  action 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-border/60 bg-card/40 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
        <PackageOpen className="w-10 h-10 text-primary/60" />
      </div>
      <h3 className="text-xl font-bold text-foreground tracking-tight">{title}</h3>
      <p className="text-sm font-medium text-muted-foreground mt-2 max-w-sm mx-auto mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
