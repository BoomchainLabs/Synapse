import { useDashboardStats, useSimulationToggle } from "@/hooks/use-stats";
import { Navigation } from "@/components/Navigation";
import { StatCard } from "@/components/StatCard";
import { ActivityChart } from "@/components/ActivityChart";
import { RecentTransactions } from "@/components/RecentTransactions";
import { Button } from "@/components/ui/button";
import { Loader2, Zap, Users, FileCode, Play, Square, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const { data: stats, isLoading, error } = useDashboardStats();
  const { mutate: toggleSimulation, isPending: isToggling } = useSimulationToggle();
  const [isSimulating, setIsSimulating] = useState(false); // Optimistic state tracking

  // Handle simulation toggle
  const handleToggle = () => {
    const newState = !isSimulating;
    setIsSimulating(newState);
    toggleSimulation(newState);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-primary">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-destructive gap-4">
        <AlertCircle className="h-12 w-12" />
        <h2 className="text-xl font-bold">Failed to load dashboard data</h2>
        <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 hidden md:block fixed h-full bg-card/30 backdrop-blur-sm z-50">
        <Navigation />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-display font-bold glow-text">Network Overview</h2>
              <p className="text-muted-foreground mt-1">Real-time monitoring of agent interactions.</p>
            </div>
            
            <Button
              onClick={handleToggle}
              disabled={isToggling}
              className={`
                h-12 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg border border-white/5
                ${isSimulating 
                  ? "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20" 
                  : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"}
              `}
            >
              {isToggling ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : isSimulating ? (
                <Square className="mr-2 h-5 w-5 fill-current" />
              ) : (
                <Play className="mr-2 h-5 w-5 fill-current" />
              )}
              {isSimulating ? "Stop Simulation" : "Start Simulation"}
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Transactions"
              value={stats.totalTransactions.toLocaleString()}
              icon={Zap}
              trend="+12% from last hour"
              className="md:col-span-1"
            />
            <StatCard
              title="Active Agents"
              value={stats.activeAgents}
              icon={Users}
              className="md:col-span-1"
            />
            <StatCard
              title="Smart Contracts"
              value={stats.registeredContracts}
              icon={FileCode}
              className="md:col-span-1"
            />
          </div>

          {/* Charts & Activity Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Chart */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-lg">Agent Activity Volume</h3>
                <select className="bg-background border border-white/10 text-sm rounded-lg px-3 py-1 text-muted-foreground focus:outline-none focus:border-primary/50">
                  <option>Last 24 Hours</option>
                  <option>Last 7 Days</option>
                </select>
              </div>
              <ActivityChart data={stats.activityByAgent} />
            </div>

            {/* Recent Transactions List */}
            <div className="lg:col-span-1 glass-card rounded-2xl p-6 flex flex-col h-[400px]">
              <h3 className="font-display font-bold text-lg mb-6">Recent Transactions</h3>
              <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 -mr-2">
                <RecentTransactions transactions={stats.recentTransactions} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
