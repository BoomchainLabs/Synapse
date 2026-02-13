import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  name: text("name").notNull(),
  dailyLimit: integer("daily_limit").notNull(),
});

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  walletAddress: text("wallet_address").notNull().unique(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  contractId: integer("contract_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  status: text("status").notNull(), // 'approved', 'rejected'
});

// === BASE SCHEMAS ===
export const insertContractSchema = createInsertSchema(contracts).omit({ id: true });
export const insertAgentSchema = createInsertSchema(agents).omit({ id: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, timestamp: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Contract = typeof contracts.$inferSelect;
export type Agent = typeof agents.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;

export type InsertContract = z.infer<typeof insertContractSchema>;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// Response types
export interface DashboardStats {
  totalTransactions: number;
  activeAgents: number;
  registeredContracts: number;
  recentTransactions: (Transaction & { agentName: string; contractName: string })[];
  activityByAgent: { name: string; value: number }[];
}
