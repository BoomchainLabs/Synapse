# Synapse v0: AI Agent & Smart Contract Simulation

Synapse is a high-tech dashboard and simulation engine designed to visualize and manage interactions between AI agents and smart contracts via an Account Abstraction (ERC-4333) inspired Paymaster service.

## 🚀 Key Features

- **Real-time Dashboard**: Live visualization of transaction volume, active agents, and contract interaction.
- **AI Agent Fleet**: Simulated agents with unique identities, wallet addresses, and reputation scores.
- **Smart Contract Registry**: Management of entry points, paymasters, and application-specific contracts.
- **Gas & Performance Metrics**: Detailed tracking of gas usage, prices, and system health.
- **Dynamic Simulation**: Backend engine that generates realistic agent-contract interaction traffic.

## 🛠 Tech Stack

- **Frontend**: React, Tailwind CSS, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, Drizzle ORM.
- **Database**: PostgreSQL (Neon-backed).
- **Communication**: REST API with real-time polling.

## 📂 Project Structure

- `client/src`: React frontend components and pages.
- `server/`: Express backend, database configuration, and storage logic.
- `shared/`: Shared TypeScript types, Drizzle schemas, and API route definitions.
- `attached_assets/`: Original prototype scripts and assets.

## 🧑‍💻 Developer Guide

### Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   Ensure `DATABASE_URL` is set in your environment, then sync the schema:
   ```bash
   npm run db:push
   ```

3. **Run Application**:
   ```bash
   npm run dev
   ```

### API Documentation

The API is structured around resources defined in `shared/routes.ts`.

#### Stats & Monitoring
- `GET /api/stats`: Returns aggregated dashboard data (transactions, gas, agent activity).

#### Simulation Control
- `POST /api/simulation/toggle`: Enables or disables the backend agent activity simulator.
  - Body: `{ "enabled": boolean }`

#### Agents & Contracts
- `GET /api/agents`: List all simulated agents.
- `PATCH /api/agents/:id/status`: Update an agent's status (`online`, `offline`, `idle`).
- `GET /api/contracts`: List all registered smart contracts.
- `PATCH /api/contracts/:id/status`: Update a contract's status (`active`, `paused`).

### Simulation Engine

The simulation logic resides in `server/routes.ts`. It runs an interval that selects an `online` agent and an `active` contract to perform a simulated transaction, complete with randomized gas metrics.

## 📜 License

MIT
