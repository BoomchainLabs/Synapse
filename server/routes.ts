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
      await storage.createTransaction({
        agentId: agent.id,
        contractId: contract.id,
        status: 'approved',
      });
      console.log(`Simulation: Agent ${agent.name} called ${contract.name}`);
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
  // Create initial contracts and agents if they don't exist
  const existingContracts = await storage.getContracts();
  if (existingContracts.length === 0) {
    console.log("Seeding contracts...");
    await storage.createContract({ address: "0xContract1", name: "Synapse EntryPoint", dailyLimit: 1000 });
    await storage.createContract({ address: "0xContract2", name: "Synapse Paymaster", dailyLimit: 5000 });
    await storage.createContract({ address: "0xContract3", name: "Wallet Factory", dailyLimit: 2000 });
    await storage.createContract({ address: "0xContract4", name: "Demo Token", dailyLimit: 10000 });
  }

  const existingAgents = await storage.getAgents();
  if (existingAgents.length === 0) {
    console.log("Seeding agents...");
    for (let i = 1; i <= 10; i++) {
      await storage.createAgent({ 
        name: `Agent ${String(i).padStart(2, '0')}`, 
        walletAddress: `0xWallet${i}` 
      });
    }
  }

  // === ROUTES ===

  app.get(api.contracts.list.path, async (req, res) => {
    const contracts = await storage.getContracts();
    res.json(contracts);
  });

  app.post(api.contracts.create.path, async (req, res) => {
    try {
      const input = api.contracts.create.input.parse(req.body);
      const contract = await storage.createContract(input);
      res.status(201).json(contract);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get(api.agents.list.path, async (req, res) => {
    const agents = await storage.getAgents();
    res.json(agents);
  });

  app.get(api.stats.get.path, async (req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  app.post(api.simulation.toggle.path, async (req, res) => {
    const { enabled } = req.body;
    
    if (enabled) {
      if (!simulationInterval) {
        // Run every 1-3 seconds randomly to look natural
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
