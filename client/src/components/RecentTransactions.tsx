import { Transaction } from "@shared/schema";
import { format } from "date-fns";
import { CheckCircle2, XCircle, ArrowRightLeft } from "lucide-react";

type TransactionWithDetails = Transaction & { agentName: string; contractName: string };

interface RecentTransactionsProps {
  transactions: TransactionWithDetails[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <ArrowRightLeft className="w-12 h-12 mb-3 opacity-20" />
        <p>No recent activity recorded</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div 
          key={tx.id}
          className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/[0.07] transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-full ${tx.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              {tx.status === 'approved' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{tx.agentName}</span>
                <span className="text-muted-foreground text-xs">interacted with</span>
                <span className="font-medium text-primary">{tx.contractName}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {tx.timestamp ? format(new Date(tx.timestamp), "MMM d, HH:mm:ss") : 'Just now'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-xs font-mono px-2 py-1 rounded-full uppercase border ${
              tx.status === 'approved' 
                ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/10' 
                : 'border-red-500/20 text-red-500 bg-red-500/10'
            }`}>
              {tx.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
