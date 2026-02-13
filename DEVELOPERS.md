# Developer Documentation: Synapse v0

## Overview
Synapse is built to demonstrate the coordination between autonomous AI agents and smart contract infrastructure. This document provides technical details for developers looking to extend or modify the system.

## Data Model (Schema)

The system uses a PostgreSQL database managed by Drizzle ORM. Key entities defined in `shared/schema.ts`:

- **Agents**: Represents the AI actors. Tracked by `wallet_address`, `status`, and `reputation`.
- **Contracts**: Represents the target smart contracts. Tracked by `address`, `daily_limit`, `status`, and `category`.
- **Transactions**: Records the interactions. Stores `gas_used`, `gas_price`, and `status`.

## API Integration Pattern

We use a "Shared Routes" pattern to ensure type safety between the frontend and backend.

1.  **Define**: Add the route definition to the `api` object in `shared/routes.ts`.
2.  **Implement (Backend)**: Add the handler in `server/routes.ts` using the path from the shared routes.
3.  **Consume (Frontend)**: Use TanStack Query (React Query) to call the endpoint, using `buildUrl` from `shared/routes.ts` for parameter interpolation.

## Extending the Simulation

To add new simulation behaviors:
1.  Modify `runSimulationStep` in `server/routes.ts`.
2.  Add logic for specific contract types or agent personas.
3.  Update the `transactions` table if new metrics (like value transfer or custom data) are needed.

## Frontend Customization

The dashboard uses a custom Tailwind theme defined in `client/src/index.css`.
- **Theme Variable**: We use HSL variables for easy theme swapping.
- **Glassmorphism**: Use the `.glass-card` utility for themed panels.
- **Glow Effects**: Use `.glow-text` for emphasized data points.

## Deployment

The application is designed to be deployed as a standard Node.js application.
- `server/index.ts` handles serving the static frontend assets and API routes.
- Database migrations should be handled via `drizzle-kit push` in development or appropriate migration scripts in production.
