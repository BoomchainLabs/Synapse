import { db } from "./db";
import {
  contracts, agents, transactions,
  type InsertContract, type InsertAgent, type InsertTransaction,
  type Contract, type Agent, type Transaction,
  type DashboardStats
} from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Contracts
  getContracts(): Promise<Contract[]>;
  createContract(contract: InsertContract): Promise<Contract>;
  getContract(id: number): Promise<Contract | undefined>;
  updateContractStatus(id: number, status: string): Promise<Contract>;

  // Agents
  getAgents(): Promise<Agent[]>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  getAgent(id: number): Promise<Agent | undefined>;
  updateAgentStatus(id: number, status: string): Promise<Agent>;

  // Transactions
  createTransaction(tx: InsertTransaction): Promise<Transaction>;
  getRecentTransactions(limit: number): Promise<(Transaction & { agentName: string; contractName: string })[]>;
  
  // Stats
  getDashboardStats(): Promise<DashboardStats>;
  
  // Simulation Helpers
  getRandomAgent(): Promise<Agent | undefined>;
  getRandomContract(): Promise<Contract | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getContracts(): Promise<Contract[]> {
    return await db.select().from(contracts);
  }

  async createContract(contract: InsertContract): Promise<Contract> {
    const [newContract] = await db.insert(contracts).values(contract).returning();
    return newContract;
  }

  async getContract(id: number): Promise<Contract | undefined> {
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, id));
    return contract;
  }

  async updateContractStatus(id: number, status: string): Promise<Contract> {
    const [updated] = await db.update(contracts).set({ status }).where(eq(contracts.id, id)).returning();
    return updated;
  }

  async getAgents(): Promise<Agent[]> {
    return await db.select().from(agents);
  }

  async createAgent(agent: InsertAgent): Promise<Agent> {
    const [newAgent] = await db.insert(agents).values(agent).returning();
    return newAgent;
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent;
  }

  async updateAgentStatus(id: number, status: string): Promise<Agent> {
    const [updated] = await db.update(agents).set({ status }).where(eq(agents.id, id)).returning();
    return updated;
  }

  async createTransaction(tx: InsertTransaction): Promise<Transaction> {
    const [newTx] = await db.insert(transactions).values(tx).returning();
    return newTx;
  }

  async getRecentTransactions(limit: number): Promise<(Transaction & { agentName: string; contractName: string })[]> {
    const result = await db
      .select({
        id: transactions.id,
        agentId: transactions.agentId,
        contractId: transactions.contractId,
        timestamp: transactions.timestamp,
        status: transactions.status,
        gasUsed: transactions.gasUsed,
        gasPrice: transactions.gasPrice,
        agentName: agents.name,
        contractName: contracts.name,
      })
      .from(transactions)
      .leftJoin(agents, eq(transactions.agentId, agents.id))
      .leftJoin(contracts, eq(transactions.contractId, contracts.id))
      .orderBy(desc(transactions.timestamp))
      .limit(limit);

    return result.map(row => ({
      ...row,
      agentName: row.agentName || 'Unknown Agent',
      contractName: row.contractName || 'Unknown Contract',
    }));
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const [txCount] = await db.select({ count: sql<number>`count(*)` }).from(transactions);
    const [agentCount] = await db.select({ count: sql<number>`count(*)` }).from(agents);
    const [contractCount] = await db.select({ count: sql<number>`count(*)` }).from(contracts);
    const [gasSum] = await db.select({ sum: sql<number>`sum(${transactions.gasUsed})` }).from(transactions);
    const recent = await this.getRecentTransactions(10);
    
    const agentActivity = await db
      .select({
        name: agents.name,
        value: sql<number>`count(${transactions.id})`.mapWith(Number)
      })
      .from(agents)
      .leftJoin(transactions, eq(agents.id, transactions.agentId))
      .groupBy(agents.id, agents.name)
      .orderBy(desc(sql`count(${transactions.id})`))
      .limit(5);

    const gasUsage = await db
      .select({
        name: contracts.name,
        value: sql<number>`sum(${transactions.gasUsed})`.mapWith(Number)
      })
      .from(contracts)
      .leftJoin(transactions, eq(contracts.id, transactions.contractId))
      .groupBy(contracts.id, contracts.name)
      .orderBy(desc(sql`sum(${transactions.gasUsed})`))
      .limit(5);

    return {
      totalTransactions: Number(txCount.count),
      activeAgents: Number(agentCount.count),
      registeredContracts: Number(contractCount.count),
      totalGasSpent: Number(gasSum.sum || 0),
      recentTransactions: recent,
      activityByAgent: agentActivity,
      gasUsageByContract: gasUsage,
    };
  }

  async getRandomAgent(): Promise<Agent | undefined> {
    const all = await this.getAgents();
    const online = all.filter(a => a.status === 'online');
    if (online.length === 0) return undefined;
    return online[Math.floor(Math.random() * online.length)];
  }

  async getRandomContract(): Promise<Contract | undefined> {
    const all = await this.getContracts();
    const active = all.filter(c => c.status === 'active');
    if (active.length === 0) return undefined;
    return active[Math.floor(Math.random() * active.length)];
  }
}

export const storage = new DatabaseStorage();
