import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useDashboardStats() {
  return useQuery({
    queryKey: [api.stats.get.path],
    queryFn: async () => {
      const res = await fetch(api.stats.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.stats.get.responses[200].parse(await res.json());
    },
    refetchInterval: 3000, // Refresh every 3 seconds for real-time feel
  });
}

export function useSimulationToggle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (enabled: boolean) => {
      const res = await fetch(api.simulation.toggle.path, {
        method: api.simulation.toggle.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to toggle simulation");
      return api.simulation.toggle.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      // Invalidate stats to reflect new simulation state if backend returns it there
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
    },
  });
}
