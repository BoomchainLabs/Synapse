import { useContracts } from "@/hooks/use-contracts";
import { CreateContractDialog } from "@/components/CreateContractDialog";
import { Navigation } from "@/components/Navigation";
import { Loader2, Box, ArrowUpRight, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ContractsPage() {
  const { data: contracts, isLoading } = useContracts();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ description: "Address copied to clipboard" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <aside className="w-64 border-r border-white/5 hidden md:block fixed h-full bg-card/30 backdrop-blur-sm z-50">
        <Navigation />
      </aside>

      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-display font-bold glow-text">Smart Contracts</h2>
              <p className="text-muted-foreground mt-1">Manage protocol registries and limits.</p>
            </div>
            <CreateContractDialog />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contracts?.map((contract) => (
                <div 
                  key={contract.id} 
                  className="glass-card p-6 rounded-2xl group hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-5 h-5 text-primary" />
                  </div>
                  
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                    <Box className="w-6 h-6" />
                  </div>

                  <h3 className="font-display font-bold text-xl mb-1">{contract.name}</h3>
                  
                  <div className="flex items-center gap-2 mt-3 p-2 bg-black/20 rounded-lg border border-white/5">
                    <code className="text-xs font-mono text-muted-foreground truncate flex-1">
                      {contract.address}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(contract.address, contract.id)}
                      className="text-muted-foreground hover:text-white transition-colors"
                    >
                      {copiedId === contract.id ? (
                        <span className="text-xs text-emerald-500 font-bold">Copied</span>
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Daily Limit</span>
                    <span className="font-mono font-bold text-primary">{contract.dailyLimit.toLocaleString()} TXs</span>
                  </div>
                </div>
              ))}
              
              {/* Empty state if needed, though usually we have data */}
              {contracts?.length === 0 && (
                <div className="col-span-full py-20 text-center text-muted-foreground border border-dashed border-white/10 rounded-2xl bg-white/5">
                  <p>No contracts deployed yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
