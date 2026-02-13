import { Link, useLocation } from "wouter";
import { LayoutDashboard, FileCode, Cpu, Shield } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/contracts", label: "Contracts", icon: FileCode },
  ];

  return (
    <nav className="flex flex-col gap-2 p-4 min-h-[calc(100vh-4rem)]">
      <div className="mb-8 px-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Cpu className="text-primary w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl tracking-tight text-white">SYNAPSE</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Protocol</p>
        </div>
      </div>

      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(6,182,212,0.15)] border border-primary/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"}
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto px-4 py-6">
        <div className="p-4 rounded-xl bg-gradient-to-br from-card to-card/50 border border-white/5">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">System Status</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-muted-foreground">Network Operational</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
