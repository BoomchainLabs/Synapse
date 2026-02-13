import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertContract } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useContracts() {
  return useQuery({
    queryKey: [api.contracts.list.path],
    queryFn: async () => {
      const res = await fetch(api.contracts.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch contracts");
      return api.contracts.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertContract) => {
      // Ensure dailyLimit is a number, even if form sends string
      const payload = {
        ...data,
        dailyLimit: Number(data.dailyLimit),
      };
      
      const validated = api.contracts.create.input.parse(payload);
      
      const res = await fetch(api.contracts.create.path, {
        method: api.contracts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.contracts.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create contract");
      }
      return api.contracts.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.contracts.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
      toast({
        title: "Contract Deployed",
        description: "New contract has been successfully registered.",
      });
    },
    onError: (error) => {
      toast({
        title: "Deployment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
