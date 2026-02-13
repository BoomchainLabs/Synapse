import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

// Simulation state
let simulationInterval: NodeJS.Timeout | null = null;

async function runSimulationStep() {
  try {
    const agent = await storage.getRandomAgent();
    const contract = await storage.getRandomContract();

    if (agent && contract) {
      // Random gas usage between 21000 and 200000
      const gasUsed = Math.floor(Math.random() * (200000 - 21000 + 1)) + 21000;
      const gasPrice = (Math.random() * (50 - 10) + 10).toFixed(2);
      
      await storage.createTransaction({
        agentId: agent.id,
        contractId: contract.id,
        status: 'approved',
        gasUsed,
        gasPrice: parseFloat(gasPrice),
      });
      console.log(`Simulation: Agent ${agent.name} called ${contract.name} (Gas: ${gasUsed})`);
    }
  } catch (error) {
    console.error("Simulation error:", error);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === SEED DATA ===
  const existingContracts = await storage.getContracts();
  if (existingContracts.length === 0) {
    console.log("Seeding contracts...");
    await storage.createContract({ address: "0xContract1", name: "Synapse EntryPoint", dailyLimit: 1000, category: "core" });
    await storage.createContract({ address: "0xContract2", name: "Synapse Paymaster", dailyLimit: 5000, category: "infrastructure" });
    await storage.createContract({ address: "0xContract3", name: "Wallet Factory", dailyLimit: 2000, category: "factory" });
    await storage.createContract({ address: "0xContract4", name: "Demo Token", dailyLimit: 10000, category: "defi" });
  }

  const existingAgents = await storage.getAgents();
  if (existingAgents.length === 0) {
    console.log("Seeding agents...");
    for (let i = 1; i <= 10; i++) {
      await storage.createAgent({ 
        name: `Agent ${String(i).padStart(2, '0')}`, 
        walletAddress: `0xWallet${i}`,
        status: i % 3 === 0 ? "idle" : "online",
        reputation: 100 - (i * 2)
      });
    }
  }

  // === ROUTES ===

  app.get(api.contracts.list.path, async (req, res) => {
    const contracts = await storage.getContracts();
    res.json(contracts);
  });

  app.patch(api.contracts.updateStatus.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const updated = await storage.updateContractStatus(id, status);
    res.json(updated);
  });

  app.get(api.agents.list.path, async (req, res) => {
    const agents = await storage.getAgents();
    res.json(agents);
  });

  app.patch(api.agents.updateStatus.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const updated = await storage.updateAgentStatus(id, status);
    res.json(updated);
  });

  app.get(api.stats.get.path, async (req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  app.post(api.simulation.toggle.path, async (req, res) => {
    const { enabled } = req.body;
    if (enabled) {
      if (!simulationInterval) {
        simulationInterval = setInterval(runSimulationStep, 2000);
        res.json({ enabled: true, message: "Simulation started" });
      } else {
        res.json({ enabled: true, message: "Simulation already running" });
      }
    } else {
      if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
      }
      res.json({ enabled: false, message: "Simulation stopped" });
    }
  });

  return httpServer;
}
