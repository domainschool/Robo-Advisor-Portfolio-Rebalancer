import React, { useState } from 'react';
import {
  X,
  Compass,
  GraduationCap,
  Database,
  Users,
  DollarSign,
  Briefcase,
  Code2,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AboutLearningDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabKey =
  | 'problem'
  | 'domain'
  | 'architecture'
  | 'stakeholders'
  | 'consulting'
  | 'resume'
  | 'prompts'
  | 'enhancements';

interface PromptItem {
  id: string;
  tag: string;
  title: string;
  content: string;
}

const PROMPT_LIST: PromptItem[] = [
  {
    id: 'p1_1',
    tag: '1.1',
    title: 'Prompt 1.1: Project Scaffolding & Design System',
    content: `Role: Principal Frontend Architect & Financial UI Specialist.
Objective: Initialize a clean, modern Next.js 14+ (App Router) project using Tailwind CSS and shadcn/ui components for a WealthTech application named "DriftGuard AI".

Stack & Setup:
- TypeScript, Tailwind CSS, Lucide-React icons.
- Design Aesthetic: High-end B2B Fintech with neo-brutalist tactile elevation, strict #000000 borders, hard shadows (4px 4px 0px 0px #000000), 0px border radius, tabular numbers (font-mono for monetary/percentage data), and lime/hot-pink accents for financial performance.

Requirements:
1. Create a dashboard layout with:
   - Top navigation bar: App title "DriftGuard AI", an advisor badge ("David Vance, RIA"), and a system status pill ("Custodian Feed Active").
   - Metric overview row: "Total Monitored AUM", "Active Portfolios", "Accounts in Drift Warning", and "Pending Staged Orders".
   - Main content split: 65% width for the "Client Drift Watchlist" and 35% width for an interactive "Rebalance Staging Desk".
2. Use pure client-side state (React useState/useMemo) with ZERO external dependencies or API keys.
3. Include an empty state and clear structural hierarchy. Do not add mock records yet; build the clean layout shell and components first.`,
  },
  {
    id: 'p1_2',
    tag: '1.2',
    title: 'Prompt 1.2: Mock Data Architecture & Drift Calculation Engine',
    content: `Role: Senior Quantitative Financial Engineer.
Objective: Implement the deterministic portfolio math engine and static mock data schemas for DriftGuard AI.

Requirements:
1. Define TypeScript interfaces for:
   - TaxLot: id, ticker, purchaseDate, shares, costBasis, currentPrice, isShortTerm (boolean).
   - Holding: ticker, assetClass ('US Equities', 'Intl Equities', 'Fixed Income', 'Commodities', 'Cash'), shares, currentPrice.
   - ModelAllocation: ticker, targetWeight (e.g., 0.60 for 60%).
   - Portfolio: id, clientName, accountType ('Taxable Brokerage' | 'Roth IRA' | 'Traditional IRA'), cashBalance, holdings: Holding[], taxLots: TaxLot[], targetModel: ModelAllocation[], driftCorridor: number (e.g., 0.05 for ±5%).

2. Create a comprehensive mock dataset initialPortfolios with at least 4 realistic accounts:
   - Account 1: Severe Equity Drift (Tech rally pushed target 60/40 into 76/24).
   - Account 2: Balanced Portfolio (All assets within ±2% corridor).
   - Account 3: Taxable High-Net-Worth account with multiple tax lots (some showing paper losses, some long-term gains).
   - Account 4: Cash-Rich Account with high unallocated cash reserve.

3. Write a pure TypeScript utility calculatePortfolioDrift(portfolio: Portfolio):
   - Compute Total Asset Value: Cash + sum(shares * currentPrice).
   - Compute Actual Weight for each asset vs. Target Weight.
   - Calculate Absolute Drift: Math.abs(actualWeight - targetWeight).
   - Flag isBreached: true if any asset's absolute drift >= portfolio.driftCorridor.
   - Calculate Target Dollar Delta: (targetWeight * totalValue) - (actualShares * currentPrice).
   - Calculate Target Share Delta: dollarDelta / currentPrice.

4. Connect this calculation to the Watchlist UI created in Prompt 1.1:
   - Display a visual drift pill for each account (Green for "Aligned", Amber for "Drifting ±3%", Red for "Breached Corridor >5%").
   - Enable selecting an account to load its details into the side drawer.`,
  },
  {
    id: 'p1_3',
    tag: '1.3',
    title: 'Prompt 1.3: Interactive HIFO Rebalance Previewer & Local State Mutator',
    content: `Role: Financial Software Engineer & UX Designer.
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
   - The watchlist item should immediately switch from Red ("Breached") to Green ("Aligned").`,
  },
  {
    id: 'p2_1',
    tag: '2.1',
    title: 'Prompt 2.1: Live Market Ingestion & Skeleton States',
    content: `Role: Full-Stack Next.js Architect.
Objective: Upgrade DriftGuard AI from static prices to asynchronous live market feeds using Yahoo Finance / Alpha Vantage and Next.js Server Actions or Route Handlers.

Requirements:
1. Environment Configuration:
   - Support a local environment variable in .env.local: MARKET_DATA_PROVIDER="yahoo" (with fallback to ALPHA_VANTAGE_API_KEY).
2. Server API Route (/api/market-prices):
   - Create a cached server endpoint that accepts an array of tickers (e.g., ["VTI", "BND", "VXUS", "QQQ"]).
   - If using Yahoo Finance, use the yahoo-finance2 package to fetch real-time quotes, bid-ask spreads, and previous close prices.
   - Implement an in-memory or Redis-compatible 60-second Time-To-Live (TTL) cache to prevent provider rate-limiting.
3. UI Loading Skeletons & Transitions:
   - Replace static dashboard values with an asynchronous hook (usePortfolioData) using SWR or React Query.
   - Build skeleton placeholders for portfolio cards, drift rings, and table rows while prices update.
   - Add a manual "Refresh Market Quotes" button featuring a spinning sync indicator and a "Last updated: X seconds ago" counter.
4. Fallback Handling:
   - If the API fails or hits a rate limit, gracefully fall back to the Tier 1 mock price dataset and render a non-blocking toast warning: "Live feeds unavailable. Running on cached closing prices."`,
  },
  {
    id: 'p2_2',
    tag: '2.2',
    title: 'Prompt 2.2: Brokerage Order Staging via Alpaca Paper API',
    content: `Role: FinTech Backend Integrator.
Objective: Connect the rebalance calculation engine to Alpaca's Paper Trading REST API for order validation and staging.

Requirements:
1. Secure Config:
   - Read ALPACA_API_KEY and ALPACA_SECRET_KEY from .env.local using Alpaca's paper trading base URL (https://paper-api.alpaca.markets).
2. Server Action (stageAlpacaOrders):
   - Accept the generated trade deltas from the client drawer (ticker, action, shares, orderType: "market").
   - Validate trading constraints: fractional share eligibility, market hours, and minimum notional limit ($1.00 minimum).
   - Format trade requests into Alpaca-compliant JSON order payloads.
3. Staged Orders Feed Component:
   - Build a "Staged Orders Queue" modal where advisors can review: Ticker, Side, Quantity, Estimated Execution Price, and Estimated Value.
   - Provide a "Dispatch Orders to Custodian" confirmation button.
   - When dispatched, submit the orders to Alpaca paper endpoints, return actual Alpaca order_id values, and display real-time execution receipts (Status: pending_new -> filled).`,
  },
  {
    id: 'p2_3',
    tag: '2.3',
    title: 'Prompt 2.3: LLM Advisor Copilot (Gemini / OpenAI API)',
    content: `Role: AI Systems Engineer & Compliance Specialist.
Objective: Implement a specialized LLM copilot that generates natural-language, SEC-compliant Investment Policy Statement (IPS) justifications for every rebalancing action.

Requirements:
1. Environment Setup:
   - Support GEMINI_API_KEY (using @google/genai or standard SDK) and OPENAI_API_KEY in .env.local.
2. Secure API Route (/api/generate-trade-rationale):
   - Input payload: Client Risk Profile, Pre-rebalance Weights, Post-rebalance Weights, Realized Gains/Losses, and Lot Selection Reason.
   - System Prompt constraints:
     "You are an institutional compliance auditor and fiduciary wealth advisor. Generate a 2-paragraph trade rationale for the client's file. Paragraph 1 must state mathematical drift breach and corridor limits. Paragraph 2 must explain tax efficiency (HIFO lot selection, wash-sale avoidance, or cash-flow distribution). Tone: Objective, professional, fiduciary-focused."
3. UI Integration:
   - Add an "AI Fiduciary Memo" card inside the Rebalancing Drawer with a "Generate Compliance Rationale" button.
   - Display a streaming markdown text response with a copy-to-clipboard action and an "Attach to Client File" checkbox.
   - Show an interactive shimmer/skeleton state while the model streams output.`,
  },
  {
    id: 'p3_1',
    tag: '3.1',
    title: 'Prompt 3.1: Supabase / Postgres Persistence Layer & Row-Level Security',
    content: `Role: Database Architect & Cloud Security Specialist.
Objective: Replace client-side mock state with an enterprise Supabase (PostgreSQL) persistence layer complete with relational schemas, migrations, and Row-Level Security (RLS).

Requirements:
1. Create a complete SQL migration script (schema.sql):
   - advisors (id, email, full_name, firm_name, created_at).
   - models (id, advisor_id, name, description, created_at).
   - model_allocations (id, model_id, ticker, target_weight).
   - client_accounts (id, advisor_id, model_id, account_number, client_name, account_type, cash_balance, corridor_tolerance, updated_at).
   - holdings (id, account_id, ticker, shares, cost_basis, asset_class).
   - tax_lots (id, holding_id, purchase_date, shares, cost_basis, is_short_term).
   - rebalance_audit_logs (id, account_id, advisor_id, timestamp, pre_drift_weights, post_drift_weights, orders_staged, ai_rationale).

2. Implement Row-Level Security (RLS):
   - Ensure authenticated advisors can ONLY read, update, or rebalance client accounts assigned to their specific advisor_id.
3. Client Infrastructure:
   - Provide the complete TypeScript Supabase Client initialization (@supabase/supabase-js).
   - Write typed queries for: fetchAdvisorDashboardData(advisorId) and commitRebalanceTransaction(rebalancePayload).`,
  },
  {
    id: 'p3_2',
    tag: '3.2',
    title: 'Prompt 3.2: Middleware Route Guards & Role-Based Access Control (RBAC)',
    content: `Role: Enterprise Security Architect.
Objective: Implement production Next.js middleware guards, session handling, and role-based access control (RBAC).

Requirements:
1. Next.js Middleware (middleware.ts):
   - Intercept all routes under /dashboard/* and /api/rebalance/*.
   - Verify active session token via Supabase Auth.
   - Redirect unauthenticated requests to /login with clean returnUrl parameters.
2. RBAC System:
   - Define roles: 'advisor_admin' (can trigger trades, edit models, invite advisors) and 'junior_analyst' (can view drift and generate AI memos, but cannot execute orders to Alpaca).
   - Build a UI guard component <PermissionGuard permission="execute:trades"> that gracefully disables or hides the "Dispatch Orders" button for unauthorized roles with a descriptive tooltip: "You need Advisor Admin privileges to dispatch orders."`,
  },
  {
    id: 'p3_3',
    tag: '3.3',
    title: 'Prompt 3.3: Interactive Analytics with Recharts & Unified Dark Mode',
    content: `Role: Senior Design Systems Lead & Data Visualization Engineer.
Objective: Polish DriftGuard AI into an enterprise platform with Recharts visualization and unified light/dark theming.

Requirements:
1. Data Visualization (Recharts integration):
   - Drift Corridor Comparison: Build a responsive dual-bar chart showing "Target Weight %" vs. "Current Actual Weight %" for each asset, with horizontal reference lines indicating the upper and lower corridor bounds (e.g., 55% - 65%).
   - Asset Allocation Donut: Render an interactive Donut chart displaying current sector exposure with custom tooltip hover effects (Ticker, Value, Percent, Drift).
   - Ensure charts auto-resize seamlessly using <ResponsiveContainer> across all desktop and mobile viewports.
2. Theme Architecture (next-themes + Tailwind):
   - Implement system-aware light/dark theme toggling with zero flash-of-unauthenticated-theme (FOUT).
   - Ensure all UI states—drift alerts, chart colors, modal surfaces, table borders, and fonts—dynamically adjust:
     * Dark Mode: Deep slate surfaces, muted gray borders, bright readable metric values.
     * Light Mode: Clean crisp white/zinc styling with high contrast text.
3. Clean Header Integration:
   - Place an animated theme toggle on the top navigation bar alongside an active database status indicator.`,
  },
];

export const AboutLearningDeckModal: React.FC<AboutLearningDeckModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('problem');
  const [expandedPromptId, setExpandedPromptId] = useState<string>('p1_1');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const navItems = [
    { key: 'problem' as TabKey, label: '1. Problem & Core Concept', icon: Compass },
    { key: 'domain' as TabKey, label: '2. Required Domain Knowledge', icon: GraduationCap },
    { key: 'architecture' as TabKey, label: '3. Data Flow & Architecture', icon: Database },
    { key: 'stakeholders' as TabKey, label: '4. Stakeholders & Personas', icon: Users },
    { key: 'consulting' as TabKey, label: '5. Commercial Valuations', icon: DollarSign },
    { key: 'resume' as TabKey, label: '6. College & Resume Strategy', icon: Briefcase },
    { key: 'prompts' as TabKey, label: '7. AI Vibe-Coding Prompts', icon: Code2 },
    { key: 'enhancements' as TabKey, label: '8. Further Enhancements', icon: Sparkles },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-none select-none">
      <div className="bg-white border-4 border-black shadow-hard-lg w-full max-w-7xl h-[92vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-100">
        {/* Top Header Bar */}
        <div className="h-14 bg-surface-base border-b-3 border-black px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-brand-violet text-white border-2 border-black flex items-center justify-center font-bold text-xs shadow-hard-sm">
              ?
            </div>
            <span className="font-display font-black text-sm sm:text-base uppercase tracking-tight">
              DRIFTGUARD AI LEARNING DECK & SYSTEMS ARCHITECTURE
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border-2 border-black hover:bg-black hover:text-white transition-colors"
            title="Close Learning Deck"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body (Split into Left Nav Tabs & Right Content Area) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Vertical Navigation Sidebar */}
          <div className="w-full md:w-72 lg:w-80 bg-surface-base border-b-3 md:border-b-0 md:border-r-3 border-black p-3 overflow-y-auto shrink-0 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full text-left px-3 py-2.5 font-mono text-xs font-bold border-2 transition-all flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-brand-violet text-white border-black shadow-hard-sm'
                      : 'bg-white text-black border-black hover:bg-surface-recessed'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-signal-safe' : 'text-black'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Scrollable Content Pane */}
          <div className="flex-1 bg-white p-5 sm:p-7 overflow-y-auto font-display text-text-primary">
            {/* TAB 1: Problem & Core Concept */}
            {activeTab === 'problem' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-brand-violet font-mono text-xs font-bold uppercase tracking-wider mb-1">
                    <Compass className="w-4 h-4" />
                    <span>FOUNDATIONAL PROBLEM STATEMENT</span>
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                    The Business Problem: The RIA Rebalance Bottleneck
                  </h2>
                  <p className="mt-2 text-sm text-gray-800 leading-relaxed font-body">
                    Independent Registered Investment Advisors (RIAs) managing $50M–$250M in Assets Under Management (AUM) oversee 150 to 300 client household accounts. During market shifts (e.g. an aggressive technology rally or fixed income drawdown), target asset weights rapidly drift out of mandate corridors (e.g. a 60/40 model drifting to 76/24).
                  </p>
                </div>

                {/* Tactical Problem Flow Visualizer */}
                <div className="bg-surface-recessed border-2 border-black p-4 shadow-hard-sm">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider block mb-3 text-black">
                    The Fiduciary Risk Flow:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center font-mono text-xs">
                    <div className="bg-white border-2 border-black p-3 font-bold text-black flex items-center justify-center">
                      Market Drawdown or Equity Rally
                    </div>
                    <div className="bg-[#FFE600]/30 border-2 border-black p-3 font-bold text-black flex items-center justify-center">
                      Corridor Drift (&gt;5.0% IPS Breach)
                    </div>
                    <div className="bg-[#FF3333]/20 border-2 border-black p-3 font-bold text-signal-breach flex items-center justify-center">
                      SEC Fiduciary Non-Compliance
                    </div>
                    <div className="bg-brand-pink text-white border-2 border-black p-3 font-bold flex items-center justify-center">
                      40+ Hour Manual Excel Bottleneck
                    </div>
                  </div>
                </div>

                <div className="space-y-3 font-body text-sm text-gray-800 leading-relaxed">
                  <p>
                    Under <strong>SEC Rule 206(4)-7</strong>, wealth managers have a strict fiduciary obligation to keep client assets aligned with their approved Investment Policy Statement (IPS). Allowing an account to drift unchecked exposes retirees to unhedged downside crashes, inviting severe regulatory fines and client lawsuits.
                  </p>
                  <p>
                    Yet, manual rebalancing takes an advisor <strong>15 to 25 minutes per account</strong> in Excel spreadsheets: checking cost basis, selecting lots, avoiding short-term capital gains, and keying in brokerage tickets. Rebalancing a book of 200 clients takes <strong>50+ operational hours</strong>. Advisors either freeze and miss the market window, or execute blunt trades that trigger tens of thousands of dollars in taxable capital gains for clients.
                  </p>
                  <div className="bg-surface-base border-3 border-black p-4 shadow-hard-sm">
                    <h3 className="font-display font-black text-sm uppercase text-black mb-1">
                      The DriftGuard AI Solution:
                    </h3>
                    <p className="font-mono text-xs text-gray-900 leading-normal">
                      DriftGuard AI automates continuous drift surveillance, calculates trade deltas using tolerance corridors, routes cash flows to underweight positions first, sequences tax-lot liquidations via HIFO to harvest losses (tax alpha), protects against IRS 30-day Wash-Sale disallowance using proxy pairings, and produces 1-click execution batches with full SEC audit trails.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Required Domain Knowledge */}
            {activeTab === 'domain' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-brand-violet font-mono text-xs font-bold uppercase tracking-wider mb-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>QUANTITATIVE FINANCIAL ENGINEERING</span>
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                    Required Domain Knowledge & Key Concepts
                  </h2>
                  <p className="mt-2 text-sm text-gray-800 leading-relaxed font-body">
                    To build or understand this application, students and software engineers must master foundational concepts in modern portfolio theory, tax accounting, and institutional compliance:
                  </p>
                </div>

                {/* Key Concepts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="bg-white border-2 border-black p-4 shadow-hard-sm">
                    <div className="bg-black text-white px-2 py-0.5 font-bold inline-block mb-2">
                      1. CORRIDOR TOLERANCE BANDS
                    </div>
                    <p className="text-gray-700 leading-normal">
                      Portfolios are chaotic dynamic systems. You cannot rebalance when an asset moves by 0.01% due to transaction fees and bid-ask slippage. Tolerance corridors (typically ±3% to ±5%) establish safe inner bands. Rebalancing is only mandated when maximum drift breaches the corridor:
                      <code className="block bg-surface-recessed p-1 border border-black mt-2 text-black">
                        Drift = |ActualWeight - TargetWeight| &gt;= theta
                      </code>
                    </p>
                  </div>

                  <div className="bg-white border-2 border-black p-4 shadow-hard-sm">
                    <div className="bg-brand-pink text-white px-2 py-0.5 font-bold inline-block mb-2">
                      2. HIFO TAX-LOT LIQUIDATION
                    </div>
                    <p className="text-gray-700 leading-normal">
                      In taxable accounts, selling shares bought at different prices creates tax consequences. Default FIFO sells oldest shares (often having lowest cost basis and highest taxable gain). HIFO (Highest-In, First-Out) sorts lots descending by cost basis to sell lots with losses first, generating <strong>Tax Alpha</strong> to offset ordinary income.
                    </p>
                  </div>

                  <div className="bg-white border-2 border-black p-4 shadow-hard-sm">
                    <div className="bg-signal-safe text-black px-2 py-0.5 font-bold inline-block border border-black mb-2">
                      3. CASH-FLOW DIRECTED REBALANCING
                    </div>
                    <p className="text-gray-700 leading-normal">
                      Before liquidating overweight assets, the engine inspects unallocated cash and deposits. Routing cash to buy underweight assets directly reduces or eliminates required sales of appreciated assets:
                      <code className="block bg-surface-recessed p-1 border border-black mt-2 text-black">
                        sellReduction = max(0, 1 - Cash / TotalSellSupply)
                      </code>
                    </p>
                  </div>

                  <div className="bg-white border-2 border-black p-4 shadow-hard-sm">
                    <div className="bg-[#00F0FF] text-black px-2 py-0.5 font-bold inline-block border border-black mb-2">
                      4. IRS SEC 1091 WASH-SALE RULE
                    </div>
                    <p className="text-gray-700 leading-normal">
                      If you sell a stock at a loss and buy back the same or "substantially identical" security within 30 days, the IRS disallows the tax deduction. DriftGuard AI pairs correlated proxy ETFs (e.g. VOO → SCHX, VTI → ITOT) so clients stay market-invested without triggering disallowance.
                    </p>
                  </div>
                </div>

                {/* Domain Glossary Chips */}
                <div className="bg-surface-recessed border-2 border-black p-4">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider block mb-2 text-black">
                    Interactive Domain Glossary:
                  </span>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {[
                      'AUM (Assets Under Management)',
                      'Basis Point (bps = 0.01%)',
                      'Cost Basis ($/share)',
                      'Drift Delta ($ & shares)',
                      'Fractional Share Execution',
                      'HIFO Accounting',
                      'Investment Policy Statement (IPS)',
                      'Proxy ETF Substitution',
                      'SEC Rule 206(4)-7',
                      'Tax Alpha ($)',
                      'Wash-Sale Disallowance',
                    ].map((term) => (
                      <span key={term} className="bg-white border border-black px-2 py-1 font-bold shadow-[1px_1px_0px_0px_#000000]">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Data Flow & Architecture */}
            {activeTab === 'architecture' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-brand-violet font-mono text-xs font-bold uppercase tracking-wider mb-1">
                    <Database className="w-4 h-4" />
                    <span>SYSTEM TOPOLOGY & PIPELINES</span>
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                    High-Level Data Flow & Architecture
                  </h2>
                  <p className="mt-2 text-sm text-gray-800 leading-relaxed font-body">
                    DriftGuard AI operates as an event-driven, deterministic calculation engine decoupled from side effects:
                  </p>
                </div>

                {/* Visual Architecture Stages */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="bg-white border-2 border-black p-4 shadow-hard-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold">1</div>
                      <div>
                        <strong className="block text-sm">STATE INGESTION & VALUATION</strong>
                        <span className="text-gray-600 text-[11px]">Custodian Holdings (Alpaca/Schwab) + Live Prices (Yahoo/Alpha Vantage)</span>
                      </div>
                    </div>
                    <span className="bg-surface-recessed border border-black px-2 py-1 text-[11px] font-bold">
                      V = sum(Q_i * P_i) + Cash
                    </span>
                  </div>

                  <div className="flex justify-center text-black font-bold text-sm">↓</div>

                  <div className="bg-white border-2 border-black p-4 shadow-hard-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-pink text-white flex items-center justify-center font-bold">2</div>
                      <div>
                        <strong className="block text-sm">DRIFT ANALYSIS CORE (PURE MATH)</strong>
                        <span className="text-gray-600 text-[11px]">Computes actual weight vectors w_actual, evaluates max |w_actual - w_target|</span>
                      </div>
                    </div>
                    <span className="bg-signal-breach text-black font-bold border border-black px-2 py-1 text-[11px]">
                      Breach Check &gt;= Corridor (5%)
                    </span>
                  </div>

                  <div className="flex justify-center text-black font-bold text-sm">↓</div>

                  <div className="bg-white border-2 border-black p-4 shadow-hard-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-signal-safe text-black border border-black flex items-center justify-center font-bold">3</div>
                      <div>
                        <strong className="block text-sm">TAX-AWARE OPTIMIZER & CASH ROUTING</strong>
                        <span className="text-gray-600 text-[11px]">Deploys cash to buy underweight first; sorts sell lots via HIFO (highest cost basis)</span>
                      </div>
                    </div>
                    <span className="bg-signal-safe text-black font-bold border border-black px-2 py-1 text-[11px]">
                      Tax Alpha Harvesting
                    </span>
                  </div>

                  <div className="flex justify-center text-black font-bold text-sm">↓</div>

                  <div className="bg-white border-2 border-black p-4 shadow-hard-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-violet text-white flex items-center justify-center font-bold">4</div>
                      <div>
                        <strong className="block text-sm">HUMAN-IN-THE-LOOP & CUSTODIAL DISPATCH</strong>
                        <span className="text-gray-600 text-[11px]">Advisor reviews lot locks, verifies SEC Rule 206(4)-7, dispatches to broker FIX API</span>
                      </div>
                    </div>
                    <span className="bg-black text-white font-bold px-2 py-1 text-[11px]">
                      Alpaca Fractional REST
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Stakeholders & Personas */}
            {activeTab === 'stakeholders' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-brand-violet font-mono text-xs font-bold uppercase tracking-wider mb-1">
                    <Users className="w-4 h-4" />
                    <span>USER PERSONAS & ECOSYSTEM</span>
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                    Stakeholders & User Personas
                  </h2>
                  <p className="mt-2 text-sm text-gray-800 leading-relaxed font-body">
                    Understanding who uses DriftGuard AI and how it transforms their daily operational workflow:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  {/* Persona 1 */}
                  <div className="bg-white border-3 border-black p-4 shadow-hard-sm">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-black">
                      <strong className="text-sm">DAVID VANCE, RIA</strong>
                      <span className="bg-brand-violet text-white px-2 py-0.5 text-[10px] font-bold">MANAGING PRINCIPAL</span>
                    </div>
                    <p className="text-gray-700 leading-normal mb-2">
                      <strong>Book:</strong> 250 Households ($142M AUM).
                    </p>
                    <p className="text-gray-700 leading-normal mb-2">
                      <strong>Pain:</strong> Spends 40+ hours every quarter keying manual trade tickets and dreading tax season complaints.
                    </p>
                    <p className="text-gray-900 bg-surface-recessed p-2 border border-black font-bold">
                      <strong>How He Uses DriftGuard:</strong> Opens dashboard, filters by [BREACHED], reviews the HIFO tax savings, checks compliance box, and dispatches batch orders in 30 seconds.
                    </p>
                  </div>

                  {/* Persona 2 */}
                  <div className="bg-white border-3 border-black p-4 shadow-hard-sm">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-black">
                      <strong className="text-sm">SARAH CHEN</strong>
                      <span className="bg-brand-pink text-white px-2 py-0.5 text-[10px] font-bold">PARAPLANNER / ANALYST</span>
                    </div>
                    <p className="text-gray-700 leading-normal mb-2">
                      <strong>Role:</strong> Operations, cash deposit tracking, and model staging.
                    </p>
                    <p className="text-gray-700 leading-normal mb-2">
                      <strong>Pain:</strong> Disjointed custodian spreadsheets with stale prices.
                    </p>
                    <p className="text-gray-900 bg-surface-recessed p-2 border border-black font-bold">
                      <strong>How She Uses DriftGuard:</strong> Simulates cash inflows, unchecks locked tax lots to honor client custom preferences, and generates SEC Rule 206(4)-7 compliance memos.
                    </p>
                  </div>

                  {/* Persona 3 */}
                  <div className="bg-white border-3 border-black p-4 shadow-hard-sm">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-black">
                      <strong className="text-sm">MARCUS REED, JD</strong>
                      <span className="bg-black text-white px-2 py-0.5 text-[10px] font-bold">CHIEF COMPLIANCE OFFICER</span>
                    </div>
                    <p className="text-gray-700 leading-normal mb-2">
                      <strong>Role:</strong> SEC regulatory audits and fiduciary governance.
                    </p>
                    <p className="text-gray-700 leading-normal mb-2">
                      <strong>Pain:</strong> Lack of immutable documentation proving why trades were made.
                    </p>
                    <p className="text-gray-900 bg-surface-recessed p-2 border border-black font-bold">
                      <strong>How He Uses DriftGuard:</strong> Audits the historical Rebalance Audit Vault to demonstrate corridor compliance to SEC examiners during annual reviews.
                    </p>
                  </div>

                  {/* Persona 4 */}
                  <div className="bg-white border-3 border-black p-4 shadow-hard-sm">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-black">
                      <strong className="text-sm">ELEANOR RIGBY</strong>
                      <span className="bg-signal-safe text-black px-2 py-0.5 text-[10px] font-bold border border-black">TAXABLE CLIENT</span>
                    </div>
                    <p className="text-gray-700 leading-normal mb-2">
                      <strong>Account:</strong> $1.42M Taxable Brokerage.
                    </p>
                    <p className="text-gray-700 leading-normal mb-2">
                      <strong>Goal:</strong> Wants growth without massive surprise capital gains taxes.
                    </p>
                    <p className="text-gray-900 bg-surface-recessed p-2 border border-black font-bold">
                      <strong>Client Outcome:</strong> Receives quarterly statement showing portfolio stayed within 80/20 risk while harvesting $15,783 in capital losses to offset taxes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Commercial Valuations & Consulting Cost */}
            {activeTab === 'consulting' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-brand-violet font-mono text-xs font-bold uppercase tracking-wider mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span>CONSULTING VALUATION & ENTERPRISE ECONOMICS</span>
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                    What Would an External Agency Charge to Build This?
                  </h2>
                  <p className="mt-2 text-sm text-gray-800 leading-relaxed font-body">
                    If an independent wealth management firm or RIA aggregator hired an elite fintech software consultancy (e.g. EPAM, ThoughtWorks, or specialized Wall Street development shops) to design, engineer, and deploy DriftGuard AI from scratch:
                  </p>
                </div>

                {/* Consulting Cost Breakdown Table */}
                <div className="overflow-x-auto border-3 border-black shadow-hard-sm bg-white">
                  <table className="w-full border-collapse font-mono text-xs text-left">
                    <thead>
                      <tr className="bg-surface-recessed border-b-2 border-black uppercase text-[10px] text-black font-bold">
                        <th className="py-2.5 px-3 border-r border-black">PROJECT PHASE</th>
                        <th className="py-2.5 px-3 border-r border-black">DELIVERABLES & SCOPE</th>
                        <th className="py-2.5 px-3 border-r border-black text-center">TIMELINE</th>
                        <th className="py-2.5 px-3 text-right">ESTIMATED COST</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="py-2.5 px-3 border-r border-black font-bold">Phase 1: Quant Discovery</td>
                        <td className="py-2.5 px-3 border-r border-black">Financial engineering models, corridor equations, tax-lot accounting schemas</td>
                        <td className="py-2.5 px-3 border-r border-black text-center">3 Weeks</td>
                        <td className="py-2.5 px-3 text-right font-bold">$28,000 – $36,000</td>
                      </tr>
                      <tr className="border-b border-black bg-surface-base">
                        <td className="py-2.5 px-3 border-r border-black font-bold">Phase 2: Tactical UX/UI</td>
                        <td className="py-2.5 px-3 border-r border-black">Neo-brutalist financial command console, corridor gauges, lot matrix UX</td>
                        <td className="py-2.5 px-3 border-r border-black text-center">3 Weeks</td>
                        <td className="py-2.5 px-3 text-right font-bold">$22,000 – $30,000</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="py-2.5 px-3 border-r border-black font-bold">Phase 3: Core Math Engine</td>
                        <td className="py-2.5 px-3 border-r border-black">Vite/React/TS deterministic math, HIFO lot sequencing, cash-flow relief formulas</td>
                        <td className="py-2.5 px-3 border-r border-black text-center">5 Weeks</td>
                        <td className="py-2.5 px-3 text-right font-bold">$50,000 – $65,000</td>
                      </tr>
                      <tr className="border-b border-black bg-surface-base">
                        <td className="py-2.5 px-3 border-r border-black font-bold">Phase 4: Custodial Brokerage</td>
                        <td className="py-2.5 px-3 border-r border-black">Alpaca REST Paper API integration, fractional lot formatting, batch dispatching</td>
                        <td className="py-2.5 px-3 border-r border-black text-center">3 Weeks</td>
                        <td className="py-2.5 px-3 text-right font-bold">$30,000 – $42,000</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="py-2.5 px-3 border-r border-black font-bold">Phase 5: Fiduciary AI Copilot</td>
                        <td className="py-2.5 px-3 border-r border-black">SEC Rule 206(4)-7 trade memo prompt engineering, Gemini/OpenAI streaming</td>
                        <td className="py-2.5 px-3 border-r border-black text-center">2 Weeks</td>
                        <td className="py-2.5 px-3 text-right font-bold">$16,000 – $24,000</td>
                      </tr>
                      <tr className="border-b-2 border-black bg-surface-base">
                        <td className="py-2.5 px-3 border-r border-black font-bold">Phase 6: QA & Audit Vault</td>
                        <td className="py-2.5 px-3 border-r border-black">Financial unit tests, wash-sale rule validation, SEC compliance documentation</td>
                        <td className="py-2.5 px-3 border-r border-black text-center">2 Weeks</td>
                        <td className="py-2.5 px-3 text-right font-bold">$18,000 – $26,000</td>
                      </tr>
                      <tr className="bg-black text-white font-bold text-sm">
                        <td colSpan={2} className="py-3 px-3 uppercase">TOTAL ESTIMATED COMMERCIAL CONTRACT</td>
                        <td className="py-3 px-3 text-center">18 Weeks</td>
                        <td className="py-3 px-3 text-right text-signal-safe font-black">$164,000 – $223,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-surface-recessed border-2 border-black p-4 font-mono text-xs">
                  <span className="font-bold block mb-1 text-black">COMMERCIAL SAAS VALUE COMPARISON:</span>
                  <p className="text-gray-700 leading-normal">
                    Enterprise wealth-management platforms (like Orion Eclipse, Tamarac, or Addepar) charge advisory practices between <strong>$25,000 and $75,000 annually in recurring SaaS fees</strong> just for rebalancing modules. An advisor managing $100M AUM recovers the entire cost of custom software in under two quarters through client tax savings and operational labor reduction.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 6: College & Resume Strategy */}
            {activeTab === 'resume' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-brand-violet font-mono text-xs font-bold uppercase tracking-wider mb-1">
                    <Briefcase className="w-4 h-4" />
                    <span>PORTFOLIO & CAREER ACCELERATION</span>
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                    How This App Differentiates Your Resume & College Application
                  </h2>
                  <p className="mt-2 text-sm text-gray-800 leading-relaxed font-body">
                    95% of student computer science portfolios feature generic Todo lists, weather widgets, or basic e-commerce clones. Admissions officers at elite universities (MIT, Stanford, Wharton M&T, Columbia) and recruiters at top quant firms (Citadel, Two Sigma, Jane Street, Stripe) ignore syntax—they look for <strong>domain depth and high-stakes problem translation</strong>.
                  </p>
                </div>

                {/* Ready-to-Copy Resume Bullets */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs font-bold text-black uppercase">
                    <span>Ready-to-Copy Resume Bullet Points (LaTeX / Markdown):</span>
                  </div>

                  {[
                    {
                      id: 'res-1',
                      title: 'Quantitative Vector Drift Engine',
                      text: 'Engineered an autonomous portfolio rebalancing engine in strict TypeScript and React, implementing tolerance corridor band algorithms (theta = 0.05) to eliminate unnecessary churn across multi-asset allocations.',
                    },
                    {
                      id: 'res-2',
                      title: 'Tax-Lot Optimization & HIFO Accounting',
                      text: 'Architected a deterministic HIFO (Highest-In, First-Out) tax-lot liquidation sequencer that systematically prioritizes loss-harvesting lots, generating quantifiable client tax alpha while avoiding IRS Section 1091 Wash-Sale disallowance via proxy ETF pairing.',
                    },
                    {
                      id: 'res-3',
                      title: 'Cash-Flow Directed Allocation Algorithm',
                      text: 'Formulated a mathematical cash-flow prioritization algorithm (sellReductionFactor = max(0, 1 - Cash/SellSupply)) that absorbs underweight buying deficits using unallocated cash reserves, eliminating forced sales of appreciated equities.',
                    },
                    {
                      id: 'res-4',
                      title: 'Fiduciary AI Compliance & Institutional Design',
                      text: 'Designed an industrial Neo-Brutalist trading switchboard with sub-millisecond tactile elevation, generating SEC Rule 206(4)-7 compliant audit rationale memos and staging fractional-share order batches for broker REST execution.',
                    },
                  ].map((bullet) => (
                    <div key={bullet.id} className="bg-white border-2 border-black p-3.5 shadow-hard-sm">
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black font-mono text-xs">
                        <span className="font-bold text-black">{bullet.title}</span>
                        <button
                          onClick={() => handleCopy(bullet.text, bullet.id)}
                          className="flex items-center gap-1 text-[11px] font-bold text-brand-pink hover:text-black"
                        >
                          {copiedId === bullet.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-signal-safe" />
                              <span>COPIED</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>COPY BULLET</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="font-mono text-xs text-gray-800 leading-normal select-text">
                        • {bullet.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Interview Talking Points */}
                <div className="bg-surface-base border-3 border-black p-4 shadow-hard-sm font-mono text-xs">
                  <strong className="block text-sm uppercase text-black mb-1">
                    What to Say in Quant / Fintech Interviews:
                  </strong>
                  <p className="text-gray-800 leading-normal">
                    "I chose not to build a toy app. I dove into the mechanics of Registered Investment Advisory practices to solve the Rebalance Bottleneck. I had to learn how IRS Section 1091 Wash-Sale rules actually penalize investors, how HIFO lot selection produces tax alpha, and how to write pure side-effect-free math functions that balance multi-asset portfolios back into approved Investment Policy Statement corridors."
                  </p>
                </div>
              </div>
            )}

            {/* TAB 7: AI Vibe-Coding Prompt Runway */}
            {activeTab === 'prompts' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-brand-violet font-mono text-xs font-bold uppercase tracking-wider mb-1">
                    <Code2 className="w-4 h-4" />
                    <span>AI VIBE-CODING PROMPT RUNWAY</span>
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                    Interactive Prompt Runway
                  </h2>
                  <p className="mt-1 text-xs text-gray-700 font-mono">
                    Click any prompt block below to review and copy the exact engineering specifications used to prompt this platform into existence:
                  </p>
                </div>

                {/* Sequential Accordion Blocks */}
                <div className="space-y-3">
                  {PROMPT_LIST.map((p) => {
                    const isExpanded = expandedPromptId === p.id;
                    return (
                      <div
                        key={p.id}
                        className="bg-white border-2 border-black shadow-hard-sm transition-all"
                      >
                        {/* Prompt Header */}
                        <div
                          onClick={() => setExpandedPromptId(isExpanded ? '' : p.id)}
                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-surface-recessed select-none"
                        >
                          <div className="flex items-center gap-2">
                            <span className="bg-brand-violet text-white font-mono text-xs font-bold px-2 py-0.5">
                              {p.tag}
                            </span>
                            <span className="font-mono text-xs font-bold text-black">
                              {p.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(p.content, p.id);
                              }}
                              className="p-1 hover:bg-black/10 border border-black text-black"
                              title="Copy prompt text"
                            >
                              {copiedId === p.id ? (
                                <Check className="w-3.5 h-3.5 text-signal-safe" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-black" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-black" />
                            )}
                          </div>
                        </div>

                        {/* Prompt Body */}
                        {isExpanded && (
                          <div className="border-t-2 border-black bg-[#121212] p-4 text-[#00FF66] font-mono text-xs overflow-x-auto select-text leading-relaxed whitespace-pre-wrap">
                            {p.content}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 8: Further Enhancements */}
            {activeTab === 'enhancements' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-brand-violet font-mono text-xs font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>FUTURE ROADMAP & ENTERPRISE SCALING</span>
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                    Further Architectural Enhancements
                  </h2>
                  <p className="mt-2 text-sm text-gray-800 leading-relaxed font-body">
                    How DriftGuard AI can scale from an RIA workstation prototype to an institutional multi-custodial enterprise platform:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="bg-white border-2 border-black p-4 shadow-hard-sm">
                    <div className="bg-black text-white px-2 py-0.5 font-bold inline-block mb-2">
                      1. DIRECT INDEXING & SINGLE-STOCK TLH
                    </div>
                    <p className="text-gray-700 leading-normal">
                      Instead of buying broad ETFs like VTI or VOO, deconstruct the index into 500 individual corporate equities. This creates continuous daily tax-loss harvesting opportunities even when the overall index finishes positive for the year.
                    </p>
                  </div>

                  <div className="bg-white border-2 border-black p-4 shadow-hard-sm">
                    <div className="bg-brand-pink text-white px-2 py-0.5 font-bold inline-block mb-2">
                      2. MULTI-ACCOUNT HOUSEHOLD REBALANCING
                    </div>
                    <p className="text-gray-700 leading-normal">
                      Optimizing asset location across a household: placing high-growth equities in tax-free Roth IRAs, high-yield fixed income in tax-deferred 401(k)s, and tax-loss harvested equities in taxable brokerage accounts.
                    </p>
                  </div>

                  <div className="bg-white border-2 border-black p-4 shadow-hard-sm">
                    <div className="bg-brand-cyan text-black px-2 py-0.5 font-bold inline-block border border-black mb-2">
                      3. DYNAMIC VOLATILITY-SCALED CORRIDORS
                    </div>
                    <p className="text-gray-700 leading-normal">
                      Dynamically expanding tolerance bands during high-volatility events (e.g. VIX &gt; 35) to prevent whipsaw rebalancing trades that burn capital on bid-ask spreads before market stabilization.
                    </p>
                  </div>

                  <div className="bg-white border-2 border-black p-4 shadow-hard-sm">
                    <div className="bg-brand-violet text-white px-2 py-0.5 font-bold inline-block mb-2">
                      4. FIX PROTOCOL CUSTODIAL GATEWAYS
                    </div>
                    <p className="text-gray-700 leading-normal">
                      Direct integration with Schwab Institutional OpenView Gateway, Fidelity WealthCentral, and BNY Mellon Pershing via institutional Financial Information eXchange (FIX) 4.4 protocol for block trading allocation.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="h-12 bg-surface-recessed border-t-3 border-black px-6 flex items-center justify-between shrink-0 font-mono text-xs">
          <span className="font-bold text-gray-700 hidden sm:inline">
            DRIFTGUARD AI EDUCATION SYSTEM • WEALTH-TECH DOMAIN ENGINEERING
          </span>
          <button
            type="button"
            onClick={onClose}
            className="tactile-btn-primary px-4 py-1 font-mono text-xs font-bold ml-auto"
          >
            RETURN TO COMMAND DESK
          </button>
        </div>
      </div>
    </div>
  );
};
