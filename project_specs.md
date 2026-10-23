# Project Specifications: DriftGuard AI

**Product Name:** DriftGuard AI — Autonomous Multi-Account Portfolio Rebalancer & Tactical Command Desk  
**Target Users:** Independent Registered Investment Advisors (RIAs) & Wealth Managers managing $50M–$250M AUM  
**Architectural Standard:** Deterministic Quantitative Math Engine + Tax-Lot Optimizer + Neo-Brutalist Tactical Trading Console  

---

## 1. Executive Summary & Problem Statement

Independent wealth managers face "The Rebalance Bottleneck": manually calculating portfolio drift, identifying specific tax lots under HIFO rules, avoiding IRS 30-day Wash-Sale violations, and staging block orders across hundreds of accounts during volatile market shifts takes 15–25 minutes per account (40–60 operational hours per firm). Delays lead to either:
1. Unhedged downside risk and Investment Policy Statement (IPS) fiduciary compliance breaches (SEC Rule 206(4)-7).
2. Costly short-term capital gains tax hits for high-net-worth clients caused by blunt, non-tax-aware liquidations.

**DriftGuard AI** provides an autonomous, client-facing portfolio monitoring and tax-aware rebalancing engine that continuously tracks asset drift against tolerance corridors, prioritizes cash-flow routing, sequences tax-loss harvesting via HIFO, protects against wash sales, and stages custodial orders with 1-click human-in-the-loop fiduciary confirmation.

---

## 2. User Inputs & Configurable Parameters

| Input Category | Parameter | Description & Constraints |
| :--- | :--- | :--- |
| **Account Metadata** | Account ID, Client Name | Unique identifier and household account name. |
| **Tax Status** | `Taxable Brokerage` \| `Roth IRA` \| `Traditional IRA` | Determines whether tax-lot rules (HIFO/capital gains) apply or are tax-deferred. |
| **Target Model Allocations** | Asset Tickers & Target Weights | Target weight vector $W_{\text{target}} = [w_1, \dots, w_N]$ where $\sum w_i = 1.0$ (e.g., 80% Equity / 20% Fixed Income). |
| **Tolerance Corridor ($\theta$)** | Drift Threshold Percentage | Default $\pm 5.0\%$ corridor. Configurable between $\pm 2.0\%$ and $\pm 10.0\%$. |
| **Cash Inflows / Outflows** | Cash Balance Adjustment | Add deposit or withdrawal amounts to immediately simulate drift impacts. |
| **Rebalance Preferences** | `Deploy Cash First` Toggle | Directs idle cash and deposits to underweight assets first, suppressing unnecessary asset sales. |
| **Tax Accounting Method** | `HIFO` (Default) vs `FIFO` | Highest-In, First-Out lot selection to maximize tax-loss harvesting and minimize realized capital gains. |
| **Wash-Sale Protection** | Proxy Pairing Toggle | Replaces harvested loss positions with correlated proxy ETFs (e.g., `VOO` $\rightarrow$ `SCHX`, `VTI` $\rightarrow$ `ITOT`) to avoid IRS Section 1091 30-day disallowance. |
| **Lot Selection Overrides** | Interactive Lot Checkboxes | Allows the advisor to manually exclude or lock specific tax lots from liquidation; re-allocates share deltas in real-time. |
| **Fiduciary Verification** | IPS Compliance Checkbox | Required checkbox confirming SEC Rule 206(4)-7 compliance before custodial dispatch activates. |

---

## 3. Core Workflows & Financial Algorithms

### 3.1 Valuation & Drift Detection Vector Math
1. **Total Portfolio Valuation ($V$):**
   $$V = \sum_{i=1}^{N} (Q_i \cdot P_i) + C$$
   Where $Q_i$ is shares held of asset $i$, $P_i$ is current price, and $C$ is uninvested cash balance.

2. **Actual Asset Weight ($w_{i,\text{actual}}$):**
   $$w_{i,\text{actual}} = \frac{Q_i \cdot P_i}{V}$$

3. **Absolute Drift ($\text{Drift}_i$):**
   $$\text{Drift}_i = \vert w_{i,\text{actual}} - w_{i,\text{target}} \vert$$

4. **Corridor Breach Trigger:**
   $$\text{Breached} \iff \max_{i}(\text{Drift}_i) \ge \theta \quad (\text{Default } \theta = 0.05)$$
   - **Aligned (Safe):** Drift $\le 3.0\%$ (Status: Lime Green `#00FF66`).
   - **Warning (Drifting):** $3.0\% \le \text{Drift} < 5.0\%$ (Status: Yellow `#FFE600`).
   - **Breach (Mandated Rebalance):** Drift $\ge 5.0\%$ (Status: Signal Red `#FF3333` with hazard stripes).

5. **Target Trade Delta:**
   $$\Delta V_i = (w_{i,\text{target}} \cdot V) - (Q_i \cdot P_i)$$
   $$\Delta Q_i = \frac{\Delta V_i}{P_i} \quad (\Delta Q_i > 0 \implies \text{BUY}, \Delta Q_i < 0 \implies \text{SELL})$$

### 3.2 Cash-Flow Prioritized Rebalancing
- When `Deploy Cash First` is enabled, uninvested cash $C$ is allocated proportionally to all assets with $\Delta V_i > 0$ (underweight assets).
- This reduces or completely eliminates required trims ($\Delta V_k < 0$) on appreciated overweight assets, saving clients significant capital gains taxes.

### 3.3 HIFO Tax-Lot Sequencing & Loss Harvesting
- For taxable accounts where asset sales are mandatory, holdings are broken down into individual tax lots ($Q_{i,j}, \text{CostBasis}_{i,j}, \text{Date}_{i,j}$).
- Lots are sorted in descending order of cost basis ($\text{CostBasis} \downarrow$).
- **Tax-Loss Harvest Lots:** If $\text{CostBasis} > P_i$, selling realizes a capital loss ($-\$$ Tax Alpha).
- **Gain Lots:** If $\text{CostBasis} \le P_i$, selling incurs capital gains; prioritized after all loss lots are consumed, favoring long-term holding periods ($> 365$ days).
- Advisors can manually lock/unlock lots; the engine automatically re-queues subsequent lots to fulfill the exact target share trim.

### 3.4 Wash-Sale Protection Engine
- Pre-mapped proxy pairs:
  - `VOO` (Vanguard S&P 500) $\leftrightarrow$ `SCHX` (Schwab U.S. Large-Cap) or `IVV` (iShares S&P 500)
  - `VTI` (Total US Stock) $\leftrightarrow$ `ITOT` (iShares Core S&P Total US)
  - `BND` (Total Bond Market) $\leftrightarrow$ `AGG` (iShares Core US Aggregate Bond)
  - `VXUS` (Total International) $\leftrightarrow$ `IXUS` (iShares Core MSCI Total Intl)
- When a tax-loss harvest trade is executed, proceeds are routed to the paired proxy asset to preserve target asset class exposure while avoiding IRS Section 1091 wash-sale disallowance.

### 3.5 Fiduciary AI Trade Rationale Memo
- Generates SEC-compliant trade justification documentation citing mathematical drift metrics, corridor breach specifics, tax optimization methods applied (HIFO, cash-flow routing), and tax alpha generated.
- Streaming UI output with 1-click clipboard copy and audit record attachment.

### 3.6 Order Staging & Execution Bridge
- Normalizes trade recommendations into fractional-share order tickets.
- Staged Orders Queue displaying Side (BUY/SELL), Ticker, Quantity, Estimated Price, Total Value, and Lot Attribution.
- Dual execution paths:
  1. **Simulated Local Execution:** Instantly mutates client-side portfolio state, clears drift, and logs transaction to audit history.
  2. **Alpaca REST Paper Trading Bridge:** Validates fractional limits and market orders, staging payloads compliant with institutional broker APIs.

---

## 4. Design & UI System (Neo-Brutalist Financial Command)

*Strict adherence to `design.md`. All default component styles and generic enterprise fintech pastels are strictly forbidden.*

### 4.1 Aesthetic Philosophy
- **Physical Weight & Tactility:** Industrial trading switchboard with hard geometric black borders (`2px`, `3px`, `4px` `#000000`) and high-contrast hard drop shadows (`shadow-[4px_4px_0px_0px_#000000]`).
- **Tactile Compression:** Interactive button press compresses shadow to `2px 2px` (`translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_0px_#000000]`).
- **Sharp Geometry:** `rounded-none` (100% sharp corners across every container, button, badge, and input).
- **Tabular Monospace Density:** All financial numbers, weights, deltas, and share counts displayed in `JetBrains Mono`.

### 4.2 Color Palette & Semantic Tokens
- **Base Canvas (`surface-base`):** `#FEFCE8` (Pale Cream Yellow paper stock)
- **Raised Card (`surface-raised`):** `#FFFFFF` (Stark White) with `border-3 border-black shadow-[4px_4px_0px_0px_#000000]`
- **Recessed Trench (`surface-recessed`):** `#F4F0DA` (Deep Muted Bone)
- **Brand Primary (`brand-pink`):** `#FF1493` (Fluorescent Magenta / Hot Pink) — Primary execution actions
- **Brand Secondary (`brand-violet`):** `#7B2CBF` (Electric Violet) — AI Compliance Memos & structural accents
- **Brand Tertiary (`brand-cyan`):** `#00F0FF` (Hyper Cyan) — Cash balance indicators & cash-flow rebalance triggers
- **Semantic Signals:**
  - `signal-safe`: `#00FF66` (Neon Lime Green, WCAG AAA compliant with black text)
  - `signal-warning`: `#FFE600` (Electric Cyber Yellow)
  - `signal-breach`: `#FF3333` (Signal Red-Orange) with diagonal black hazard stripes for active breaches:  
    `repeating-linear-gradient(45deg, #FF3333, #FF3333 10px, #000000 10px, #000000 12px)`
  - `signal-info`: `#D946EF` (Fuchsia / Neon Purple)

### 4.3 Typography Scale
- **Headings & Display:** `Space Grotesk` (Weights: 700, 800, 900 Black), tight tracking (`-0.03em`), uppercase.
- **Data, Figures, Ledgers, Controls:** `JetBrains Mono` (Weights: 400, 500, 700), tabular figures.

### 4.4 Signature UI Components
1. **`<CorridorGauge />`:** Tactical visual corridor track with target marker pointer, dashed safe inner band, and solid fill bar turning into red/black diagonal hazard stripes upon breach.
2. **`<HIFOLotMatrix />`:** High-contrast tax-lot queue table displaying lot dates, cost basis, unrealized gain/loss, interactive check/uncheck locks, and `HARVEST LOSS` / `SHORT-TERM GAIN` badges.
3. **`<ExecutionDispatchBar />`:** Institutional dispatch bar with SEC Rule 206(4)-7 compliance confirmation checkbox, AI compliance memo trigger, and tactile hot-pink execution dispatch button.
4. **`<TopNavigationBar />`:** Live custodial status ticker (`CUSTODIAN FEED ACTIVE`), real-time market proxies ticker (`VTI`, `BND`, `VXUS`), and advisor credential pill.
5. **`<PrimaryKPIStrip />`:** Four metric cards displaying Total Monitored AUM, Accounts in Corridor Breach, Potential Tax Alpha Harvestable, and Pending Staged Orders.
6. **Watchlist & Staging Desk Split:** 65% Client Watchlist (cards with quick-filter pills: All, Breached, Cash-Rich, Aligned) and 35% Rebalance Staging Desk.

---

## 5. Technology Stack & Ecosystem

- **Build Tool & Framework:** Vite + React 18+ with strict TypeScript (`tsconfig` with `strict: true`, `noImplicitAny: true`).
- **Package Manager:** `pnpm` exclusively.
- **Styling:** Tailwind CSS configured with custom Neo-Brutalist tokens, custom font families (`Space Grotesk`, `JetBrains Mono`), and custom utilities.
- **Icons:** `lucide-react`.
- **Data Visualization:** `recharts` for drift corridor comparisons and asset allocation donut charts, styled with neo-brutalist borders and color tokens.
- **State Management & Persistence:** Typed React state + custom hooks (`useDriftEngine`, `useMarketFeed`, `useHIFOOstimizer`) with local persistence in `localStorage`.
- **API Adapters:**
  - Mock Market Feeds + live adapter infrastructure (Yahoo Finance / Alpha Vantage format).
  - Alpaca REST API order payload generator and paper execution simulator.
  - Gemini / OpenAI prompt orchestrator for fiduciary compliance memos.
- **Deployment:** GitHub Pages (`gh-pages`) via Vite client-side build with relative/custom base configuration.

---

## 6. Expected Outputs & Deliverables

1. **Calculated Metrics:** Exact portfolio valuations, actual vs target weight deviations, dollar deltas ($\Delta V_i$), and share counts ($\Delta Q_i$).
2. **Interactive Staging Desk:** Real-time preview of buy/sell recommendations, tax-lot allocations, realized gain/loss balance, and cash deployment impact.
3. **Audit Trail & Memo:** Generated SEC-compliant Investment Policy Statement (IPS) trade justification memos ready to copy or download.
4. **Custodial Order Payloads:** Alpaca-compatible fractional market order batches.
5. **Living Documentation:** Maintained `explainer.md` and `prompts.md`.

---

## 7. Definition of "Done" for MVP (Tier 1)

- [ ] Complete Neo-Brutalist design system implemented with 100% adherence to `design.md` (exact colors, fonts, sharp corners, tactile shadows).
- [ ] 4+ diverse, realistic client accounts loaded (severe equity breach, balanced, high-net-worth multi-lot taxable, cash-rich).
- [ ] Deterministic mathematical drift engine accurately flags breaches based on corridor $\theta$.
- [ ] Interactive `<CorridorGauge />` accurately reflects inner band and displays diagonal hazard stripes on breach.
- [ ] `<HIFOLotMatrix />` sorts lots by HIFO, identifies tax-loss harvesting opportunities, and supports interactive lot exclusion.
- [ ] "Deploy Cash First" toggle recalculates order deltas dynamically.
- [ ] "Execute Rebalance (Simulated)" mutates state, eliminates drift, updates watchlist badge to Lime Green, and logs transaction to audit history.
- [ ] Built-in AI Compliance Memo generator produces institutional trade justifications.
- [ ] Zero TypeScript errors (`tsc --noEmit` clean).
- [ ] Production build succeeds cleanly via `pnpm run build`.
- [ ] User testing satisfies all workflow expectations prior to deployment.
