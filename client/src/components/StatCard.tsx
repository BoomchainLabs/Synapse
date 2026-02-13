import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={`glass-card rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 ${className}`}>
      {/* Background glow effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-primary/10" />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <h3 className="mt-2 text-3xl font-display font-bold text-foreground tabular-nums tracking-tight">{value}</h3>
          {trend && (
            <p className="mt-1 text-sm text-primary font-medium flex items-center gap-1">
              {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20 shadow-[0_0_15px_-3px_var(--primary)]">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
