import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  delay?: number;
}

const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, delay = 0 }: StatCardProps) => {
  return (
    <div
      className="stat-card opacity-0 animate-fade-in group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {(subtitle || trendValue) && (
            <div className="flex items-center gap-2 mt-1">
              {trend && (
                <span className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                  trend === "up" ? "bg-success/20 text-success" :
                  trend === "down" ? "bg-destructive/20 text-destructive" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {trend === "up" && <TrendingUp className="w-3 h-3 mr-1" />}
                  {trend === "down" && <TrendingDown className="w-3 h-3 mr-1" />}
                  {trend === "neutral" && <Minus className="w-3 h-3 mr-1" />}
                  {trendValue}
                </span>
              )}
              {subtitle && <span className="text-xs text-muted-foreground font-medium">{subtitle}</span>}
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
