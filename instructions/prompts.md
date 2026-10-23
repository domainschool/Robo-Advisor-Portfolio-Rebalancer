# Vibe Coding Execution Roadmap: DriftGuard AI

This roadmap provides production-grade prompts designed for incremental execution in AI development environments such as Cursor, Lovable, Claude Code, or Windsurf. Feed these prompts sequentially into your agent builder to progress from an interactive UI prototype to a live API integration and an enterprise-ready wealth-tech platform.

---

## Tier 1: MVP 1 — Zero-Config Setup, Local State & Drift Math UI

### Prompt 1.1: Project Scaffolding & Design System

```text
Role: Principal Frontend Architect & Financial UI Specialist.
Objective: Initialize a clean, modern Next.js 14+ (App Router) project using Tailwind CSS and shadcn/ui components for a WealthTech application named "DriftGuard AI".

Stack & Setup:
- TypeScript, Tailwind CSS, Lucide-React icons.
- Design Aesthetic: High-end B2B Fintech (like Stripe or Linear) with slate backgrounds, clean typography, tabular numbers (font-mono for monetary/percentage data), and emerald/rose accents for financial performance.

Requirements:
1. Create a dashboard layout with:
   - Top navigation bar: App title "DriftGuard AI", an advisor badge ("David Vance, RIA"), and a system status pill ("Markets Open - Synthetic Local Mode").
   - Metric overview row: "Total Monitored AUM", "Active Portfolios", "Accounts in Drift Warning", and "Pending Staged Orders".
   - Main content split: 65% width for the "Client Drift Watchlist" and 35% width for an interactive "Rebalance Staging Drawer".
2. Use pure client-side state (React useState/useMemo) with ZERO external dependencies or API keys.
3. Include an empty state and clear structural hierarchy. Do not add mock records yet; build the clean layout shell and components first.

```

### Prompt 1.2: Mock Data Architecture & Drift Calculation Engine

```text
Role: Senior Quantitative Financial Engineer.
Objective: Implement the deterministic portfolio math engine and static mock data schemas for DriftGuard AI.

Requirements:
1. Define TypeScript interfaces for:
   - `TaxLot`: id, ticker, purchaseDate, shares, costBasis, currentPrice, isShortTerm (boolean).
   - `Holding`: ticker, assetClass ('US Equities', 'Intl Equities', 'Fixed Income', 'Commodities', 'Cash'), shares, currentPrice.
   - `ModelAllocation`: ticker, targetWeight (e.g., 0.60 for 60%).
   - `Portfolio`: id, clientName, accountType ('Taxable Brokerage' | 'Roth IRA' | 'Traditional IRA'), cashBalance, holdings: Holding[], taxLots: TaxLot[], targetModel: ModelAllocation[], driftCorridor: number (e.g., 0.05 for ±5%).

2. Create a comprehensive mock dataset `initialPortfolios` with at least 4 realistic accounts:
   - Account 1: Severe Equity Drift (Tech rally pushed target 60/40 into 76/24).
   - Account 2: Balanced Portfolio (All assets within ±2% corridor).
   - Account 3: Taxable High-Net-Worth account with multiple tax lots (some showing paper losses, some long-term gains).
   - Account 4: Cash-Rich Account with high unallocated cash reserve.

3. Write a pure TypeScript utility `calculatePortfolioDrift(portfolio: Portfolio)`:
   - Compute Total Asset Value: Cash + sum(shares * currentPrice).
   - Compute Actual Weight for each asset vs. Target Weight.
   - Calculate Absolute Drift: Math.abs(actualWeight - targetWeight).
   - Flag `isBreached: true` if any asset's absolute drift >= portfolio.driftCorridor.
   - Calculate Target Dollar Delta: (targetWeight * totalValue) - (actualShares * currentPrice).
   - Calculate Target Share Delta: dollarDelta / currentPrice.

4. Connect this calculation to the Watchlist UI created in Prompt 1.1:
   - Display a visual drift pill for each account (Green for "Aligned", Amber for "Drifting ±3%", Red for "Breached Corridor >5%").
   - Enable selecting an account to load its details into the side drawer.

```

### Prompt 1.3: Interactive HIFO Rebalance Previewer & Local State Mutator

```text
Role: Financial Software Engineer & UX Designer.
Objective: Build the interactive rebalance staging drawer that applies HIFO (Highest-In, First-Out) logic and allows immediate state execution with local updates.

Requirements:
1. In the side drawer, when a drifted account is selected, render:
   - Asset breakdown table: Ticker, Target % vs. Actual %, Current Value, and Computed Action (BUY / SELL / HOLD).
   - Share adjustment recommendation badge (e.g., "SELL 14.2 shares VTI", "BUY 45.1 shares BND").
2. Implement Tax-Lot Prioritization Display (for Taxable accounts):
   - If an asset must be sold, list the specific tax lots ordered by HIFO (Highest cost basis first to harvest losses or minimize capital gains).
   - Highlight whether each lot sale realizes a Capital Gain or a Tax-Loss Harvest opportunity.
3. Add a "Cash-Flow First" rebalancing toggle:
   - When toggled ON, use existing unallocated cash to buy underweight assets first before generating sell orders on overweight assets.
4. Add an "Execute Rebalance (Simulated)" action button:
   - On click, execute the state mutation in React local state: adjust cash, update share counts, clear the drift flag, and show an inline toast notification: "Portfolio rebalanced to target corridor. 0 wash-sale conflicts."
   - The watchlist item should immediately switch from Red ("Breached") to Green ("Aligned").

```

---

## Tier 2: MVP 2 — Live Market Data, Asynchronous Engine & LLM Intelligence

### Prompt 2.1: Live Market Ingestion & Skeleton States

```text
Role: Full-Stack Next.js Architect.
Objective: Upgrade DriftGuard AI from static prices to asynchronous live market feeds using Yahoo Finance / Alpha Vantage and Next.js Server Actions or Route Handlers.

Requirements:
1. Environment Configuration:
   - Support a local environment variable in `.env.local`: `MARKET_DATA_PROVIDER="yahoo"` (with fallback to `ALPHA_VANTAGE_API_KEY`).
2. Server API Route (`/api/market-prices`):
   - Create a cached server endpoint that accepts an array of tickers (e.g., `["VTI", "BND", "VXUS", "QQQ"]`).
   - If using Yahoo Finance, use the `yahoo-finance2` package to fetch real-time quotes, bid-ask spreads, and previous close prices.
   - Implement an in-memory or Redis-compatible 60-second Time-To-Live (TTL) cache to prevent provider rate-limiting.
3. UI Loading Skeletons & Transitions:
   - Replace static dashboard values with an asynchronous hook (`usePortfolioData`) using SWR or React Query.
   - Build shadcn skeleton placeholders for portfolio cards, drift rings, and table rows while prices update.
   - Add a manual "Refresh Market Quotes" button featuring a spinning sync indicator and a "Last updated: X seconds ago" counter.
4. Fallback Handling:
   - If the API fails or hits a rate limit, gracefully fall back to the Tier 1 mock price dataset and render a non-blocking toast warning: "Live feeds unavailable. Running on cached closing prices."

```

### Prompt 2.2: Brokerage Order Staging via Alpaca Paper API

```text
Role: FinTech Backend Integrator.
Objective: Connect the rebalance calculation engine to Alpaca's Paper Trading REST API for order validation and staging.

Requirements:
1. Secure Config:
   - Read `ALPACA_API_KEY` and `ALPACA_SECRET_KEY` from `.env.local` using Alpaca's paper trading base URL (`https://paper-api.alpaca.markets`).
2. Server Action (`stageAlpacaOrders`):
   - Accept the generated trade deltas from the client drawer (`ticker`, `action`, `shares`, `orderType: "market"`).
   - Validate trading constraints: fractional share eligibility, market hours, and minimum notional limit ($1.00 minimum).
   - Format trade requests into Alpaca-compliant JSON order payloads.
3. Staged Orders Feed Component:
   - Build a "Staged Orders Queue" modal where advisors can review: Ticker, Side, Quantity, Estimated Execution Price, and Estimated Value.
   - Provide a "Dispatch Orders to Custodian" confirmation button.
   - When dispatched, submit the orders to Alpaca paper endpoints, return actual Alpaca `order_id` values, and display real-time execution receipts (Status: `pending_new` -> `filled`).

```

### Prompt 2.3: LLM Advisor Copilot (Gemini / OpenAI API)

```text
Role: AI Systems Engineer & Compliance Specialist.
Objective: Implement a specialized LLM copilot that generates natural-language, SEC-compliant Investment Policy Statement (IPS) justifications for every rebalancing action.

Requirements:
1. Environment Setup:
   - Support `GEMINI_API_KEY` (using `@google/genai` or standard SDK) and `OPENAI_API_KEY` in `.env.local`.
2. Secure API Route (`/api/generate-trade-rationale`):
   - Input payload: Client Risk Profile, Pre-rebalance Weights, Post-rebalance Weights, Realized Gains/Losses, and Lot Selection Reason.
   - System Prompt constraints:
     * "You are an institutional compliance auditor and fiduciary wealth advisor. Generate a 2-paragraph trade rationale for the client's file. Paragraph 1 must state mathematical drift breach and corridor limits. Paragraph 2 must explain tax efficiency (HIFO lot selection, wash-sale avoidance, or cash-flow distribution). Tone: Objective, professional, fiduciary-focused."
3. UI Integration:
   - Add an "AI Fiduciary Memo" card inside the Rebalancing Drawer with a "Generate Compliance Rationale" button.
   - Display a streaming markdown text response with a copy-to-clipboard action and an "Attach to Client File" checkbox.
   - Show an interactive shimmer/skeleton state while the model streams output.

```

---

## Tier 3: Enterprise Scale — Persistence, Auth Guards, Analytics & Theming

### Prompt 3.1: Supabase / Postgres Persistence Layer & Row-Level Security

```text
Role: Database Architect & Cloud Security Specialist.
Objective: Replace client-side mock state with an enterprise Supabase (PostgreSQL) persistence layer complete with relational schemas, migrations, and Row-Level Security (RLS).

Requirements:
1. Create a complete SQL migration script (`schema.sql`):
   - `advisors` (id, email, full_name, firm_name, created_at).
   - `models` (id, advisor_id, name, description, created_at).
   - `model_allocations` (id, model_id, ticker, target_weight).
   - `client_accounts` (id, advisor_id, model_id, account_number, client_name, account_type, cash_balance, corridor_tolerance, updated_at).
   - `holdings` (id, account_id, ticker, shares, cost_basis, asset_class).
   - `tax_lots` (id, holding_id, purchase_date, shares, cost_basis, is_short_term).
   - `rebalance_audit_logs` (id, account_id, advisor_id, timestamp, pre_drift_weights, post_drift_weights, orders_staged, ai_rationale).

2. Implement Row-Level Security (RLS):
   - Ensure authenticated advisors can ONLY read, update, or rebalance client accounts assigned to their specific `advisor_id`.
3. Client Infrastructure:
   - Provide the complete TypeScript Supabase Client initialization (`@supabase/supabase-js` or `@supabase/ssr`).
   - Write typed queries for: `fetchAdvisorDashboardData(advisorId)` and `commitRebalanceTransaction(rebalancePayload)`.

```

### Prompt 3.2: Middleware Route Guards & Role-Based Access Control (RBAC)

```text
Role: Enterprise Security Architect.
Objective: Implement production Next.js middleware guards, session handling, and role-based access control (RBAC).

Requirements:
1. Next.js Middleware (`middleware.ts`):
   - Intercept all routes under `/dashboard/*` and `/api/rebalance/*`.
   - Verify active session token via Supabase Auth.
   - Redirect unauthenticated requests to `/login` with clean `returnUrl` parameters.
2. RBAC System:
   - Define roles: `'advisor_admin'` (can trigger trades, edit models, invite advisors) and `'junior_analyst'` (can view drift and generate AI memos, but cannot execute orders to Alpaca).
   - Build a UI guard component `<PermissionGuard permission="execute:trades">` that gracefully disables or hides the "Dispatch Orders" button for unauthorized roles with a descriptive tooltip: "You need Advisor Admin privileges to dispatch orders."

```

### Prompt 3.3: Interactive Analytics with Recharts & Unified Dark Mode

```text
Role: Senior Design Systems Lead & Data Visualization Engineer.
Objective: Polish DriftGuard AI into an enterprise platform with Recharts visualization and unified light/dark theming.

Requirements:
1. Data Visualization (Recharts integration):
   - Drift Corridor Comparison: Build a responsive dual-bar chart showing "Target Weight %" vs. "Current Actual Weight %" for each asset, with horizontal reference lines indicating the upper and lower corridor bounds (e.g., 55% - 65%).
   - Asset Allocation Donut: Render an interactive Donut chart displaying current sector exposure with custom tooltip hover effects (Ticker, Value, Percent, Drift).
   - Ensure charts auto-resize seamlessly using `<ResponsiveContainer>` across all desktop and mobile viewports.
2. Theme Architecture (next-themes + Tailwind):
   - Implement system-aware light/dark theme toggling with zero flash-of-unauthenticated-theme (FOUT).
   - Ensure all UI states—drift alerts, chart colors, modal surfaces, table borders, and fonts—dynamically adjust:
     * Dark Mode: Deep slate surfaces (`bg-slate-950`, `bg-slate-900`), muted gray borders (`border-slate-800`), bright readable metric values.
     * Light Mode: Clean crisp white/zinc styling (`bg-white`, `border-zinc-200`) with high contrast text.
3. Clean Header Integration:
   - Place an animated theme toggle (Sun/Moon icon) on the top navigation bar alongside an active database status indicator ("Connected to Supabase - Production US-East").

```

---

## Implementation Changelog & Execution Record

### Milestone: MVP Tier 1 Completed (Pure Local Tactical Prototype)
- **Date:** 2026-10-22
- **Implemented Files:**
  - `project_specs.md`: Formal specification defining inputs, workflows, design constraints, and definition of done.
  - `package.json` & `vite.config.ts`: React 18, Vite 5, TypeScript strict config, Tailwind CSS, Lucide icons, Recharts, and deployment scripts.
  - `tailwind.config.js` & `src/index.css`: Exact Neo-Brutalist design tokens (`#FEFCE8`, `#FFFFFF`, `#F4F0DA`, `#FF1493`, `#00FF66`, `#FFE600`, `#FF3333`), hard shadows, sharp 0px radius, tactile active compression, and hazard stripes.
  - `src/types/portfolio.ts`: Strict types for accounts, holdings, tax lots, drift metrics, orders, and audit logs.
  - `src/utils/rebalanceEngine.ts`: Deterministic math engine for valuation, corridor breaches, HIFO tax lot liquidation, cash-flow first prioritization, fiduciary compliance memo generation, and simulated state mutation.
  - `src/data/mockPortfolios.ts`: 4 realistic RIA client accounts exhibiting severe equity drift, cash-rich relief, and multi-price tax lots.
  - `src/components/TopNavigationBar.tsx`: Sticky navigation with custodian feed status, global proxy tickers, and advisor credentials.
  - `src/components/PrimaryKPIStrip.tsx`: 4 dynamic KPI cards (AUM, breaches, harvestable tax alpha, staged orders).
  - `src/components/CorridorGauge.tsx`: Tactical corridor gauge with safe window, target marker, and diagonal hazard stripes on breach.
  - `src/components/HIFOLotMatrix.tsx`: High-contrast lot queue with TLH indicators, tax gain/loss calculations, and interactive lot exclusion locks.
  - `src/components/ExecutionDispatchBar.tsx`: Compliance confirmation checkbox, AI memo trigger, and tactile execution button.
  - `src/components/ClientWatchlist.tsx`: 65% left panel with quick filter pills, search, and tactile client cards.
  - `src/components/RebalanceStagingDesk.tsx`: 35% right panel integrating gauges, cash-flow toggles, trade specifications, and execution controls.
  - `src/components/ComplianceMemoModal.tsx` & `src/components/AuditTrailModal.tsx`: SEC Rule 206(4)-7 trade justification and immutable audit log vault.
  - `src/App.tsx`: State management with `localStorage` persistence, simulated execution latency, and reset capabilities.
- **Quantitative Verification:**
  - 100% test pass on drift math, HIFO lot sorting, cash-flow first protection ($250k cash eliminates equity sale drag), post-rebalance corridor alignment, and wash-sale proxy mapping.
  - Clean TypeScript compile (`tsc && vite build`) with 0 errors.

### Milestone: Educational Learning Deck & Systems Architecture Added
- **Date:** 2026-10-22
- **Implemented Files:**
  - `src/components/AboutLearningDeckModal.tsx`: Comprehensive 8-tab educational learning deck and systems architecture modal matching the user reference design, strictly styled in Neo-Brutalist design tokens.
  - Tabs implemented:
    1. `Problem & Core Concept`: The RIA Rebalance Bottleneck, interactive risk flow cards, manual Excel failure points, and the DriftGuard solution.
    2. `Required Domain Knowledge`: Tolerance corridors ($\theta$), HIFO tax-lot accounting, cash-flow directed relief formula, IRS Section 1091 wash-sale rules with proxy pairing, and an interactive domain glossary.
    3. `Data Flow & Architecture`: 4-stage end-to-end topology from state ingestion to execution bridge.
    4. `Stakeholders & Personas`: Detailed operational personas for David Vance (Managing Principal), Sarah Chen (Paraplanner/Analyst), Marcus Reed (CCO), and Eleanor Rigby (Taxable Client).
    5. `Commercial Valuations`: Realistic enterprise consulting project breakdown table ($164,000–$223,000 across 6 phases) and comparison against Orion/Tamarac SaaS pricing.
    6. `College & Resume Strategy`: Standout differentiator strategy for elite CS/Quant admissions and recruiters, with 4 ready-to-copy bullet points with 1-click clipboard copy.
    7. `AI Vibe-Coding Prompt Runway`: Sequential accordion blocks for all 9 prompts from `prompts.md` with dark code styling and 1-click copy buttons.
    8. `Further Enhancements`: Direct indexing single-stock TLH, multi-account household rebalancing, dynamic volatility corridors, and FIX 4.4 protocol gateways.
  - `src/components/TopNavigationBar.tsx`: Added high-contrast `ABOUT & ARCHITECTURE` trigger button.
  - `src/App.tsx`: Wired up state and modal display.
- **Verification:**
  - `tsc && vite build` passed cleanly with 0 errors.
  - Dev server verified at `http://localhost:5173/`.