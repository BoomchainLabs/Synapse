import { z } from 'zod';
import { insertContractSchema, insertAgentSchema, insertTransactionSchema, contracts, agents, transactions } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  stats: {
    get: {
      method: 'GET' as const,
      path: '/api/stats' as const,
      responses: {
        200: z.object({
          totalTransactions: z.number(),
          activeAgents: z.number(),
          registeredContracts: z.number(),
          recentTransactions: z.array(z.custom<typeof transactions.$inferSelect & { agentName: string; contractName: string }>()),
          activityByAgent: z.array(z.object({ name: z.string(), value: z.number() })),
        }),
      },
    },
  },
  contracts: {
    list: {
      method: 'GET' as const,
      path: '/api/contracts' as const,
      responses: {
        200: z.array(z.custom<typeof contracts.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/contracts' as const,
      input: insertContractSchema,
      responses: {
        201: z.custom<typeof contracts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  agents: {
    list: {
      method: 'GET' as const,
      path: '/api/agents' as const,
      responses: {
        200: z.array(z.custom<typeof agents.$inferSelect>()),
      },
    },
  },
  simulation: {
    toggle: {
      method: 'POST' as const,
      path: '/api/simulation/toggle' as const,
      input: z.object({ enabled: z.boolean() }),
      responses: {
        200: z.object({ enabled: z.boolean(), message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
