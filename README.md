# DriftGuard AI — Autonomous Multi-Account Portfolio Rebalancing Engine

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **DriftGuard AI** is an autonomous, client-facing portfolio surveillance and tax-aware rebalancing engine built for Independent Registered Investment Advisors (RIAs) and Wealth Managers. It continuously monitors multi-asset drift against mandate tolerance corridors, prioritizes cash-flow routing, sequences tax-lot liquidations via HIFO to harvest losses, avoids IRS 30-day wash sales, and stages institutional block orders with 1-click human-in-the-loop fiduciary confirmation.

---

## 🚀 Live Demo on GitHub Pages

The application is deployed on GitHub Pages:  
👉 **[https://domainschool.github.io/Robo-Advisor-Portfolio-Rebalancer/](https://domainschool.github.io/Robo-Advisor-Portfolio-Rebalancer/)**

---

## 🎯 The Core Financial Problem Solved

Independent wealth managers face **"The Rebalance Bottleneck"**:
- An advisor overseeing 150 to 300 client accounts spends **15 to 25 minutes per account** in Excel spreadsheets during market rotations (calculating weights, identifying specific tax lots, and keying orders).
- Rebalancing an entire book manually requires **40 to 60 uninterrupted operational hours**.
- Delaying rebalancing violates client **Investment Policy Statements (IPS)** under **SEC Rule 206(4)-7**.
- Hasty, blunt liquidations trigger tens of thousands of dollars in unexpected short-term capital gains taxes for clients.

**DriftGuard AI** eliminates the bottleneck by providing real-time drift detection, HIFO tax optimization, and 1-click custodial execution in under 30 seconds per account.

---

## ⚡ Key Capabilities & Financial Engineering

1. **Deterministic Corridor & Tolerance Bands ($\theta$):**
   - Continuously computes absolute drift metrics: $\text{Drift}_i = |w_{i,\text{actual}} - w_{i,\text{target}}|$.
   - Flags accounts with high-contrast tactical hazard stripes whenever max drift breaches tolerance ($\ge \pm 5.0\%$).
2. **Cash-Flow Directed Allocation:**
   - Routes deposits, dividends, and unallocated cash to buy underweight assets first:
     $$\text{sellReductionFactor} = \max\left(0, 1 - \frac{C}{\text{TotalSellSupply}}\right)$$
   - Directly eliminates forced sales of appreciated equities, saving clients substantial capital gains taxes.
3. **HIFO (Highest-In, First-Out) Tax-Lot Matrix:**
   - Stages liquidation queues ordered descending by cost basis.
   - Automatically prioritizes tax-loss harvesting lots to generate **Tax Alpha** ($-\$$ capital loss offsets) before incurring capital gains.
   - Supports interactive lot-locking so advisors can honor client custom exclusions in real time.
4. **IRS Section 1091 Wash-Sale Protection:**
   - Pairs harvested loss positions with correlated proxy ETFs (e.g., `VOO` $\rightarrow$ `SCHX`, `VTI` $\rightarrow$ `ITOT`, `BND` $\rightarrow$ `AGG`) to keep clients market-invested without losing tax deductions.
5. **SEC Rule 206(4)-7 Fiduciary AI Compliance Memos:**
   - Instant 1-click generation of institutional trade justification memos detailing mathematical breaches and tax efficiency for client CRM records.
6. **Execution Dispatch Bridge & Audit Vault:**
   - Normalizes trades into Alpaca REST fractional share order payloads.
   - Archives every rebalance in an immutable audit vault with before/after drift metrics and order receipts.
7. **Educational Systems Architecture & Learning Deck:**
   - 8-tab learning deck with visual risk flows, consulting project valuations ($164k–$223k), resume strategies, and the prompt runway.

---

## 🎨 Design Philosophy: Neo-Brutalist Financial Command

DriftGuard AI strictly adheres to a high-yield **Neo-Brutalist Trading Switchboard**:
- **Zero Ambiguity:** Hard `#000000` boundaries (`2px`, `3px`, `4px`) with physical hard offsets (`4px 4px 0px 0px #000000`).
- **Tactile Compression:** Buttons and cards physically compress on active click (`translate(2px, 2px) shadow-[2px_2px_0px_0px_#000000]`).
- **100% Sharp Geometry:** Zero rounded corners (`rounded-none: 0px`).
- **Semantic High-Contrast Signals:** Base canvas `#FEFCE8` (cream yellow paper), `#00FF66` (Safe Lime), `#FFE600` (Cyber Yellow), `#FF3333` with black diagonal hazard stripes (Breach), `#FF1493` (Execution Hot Pink).
- **Typography:** `Space Grotesk` (weights 700, 800, 900) for tactical headers; `JetBrains Mono` for tabular ledgers and prices.

---

## 🛠️ Technology Stack

- **Framework:** React 18 + Vite 5 + Strict TypeScript
- **Styling:** Tailwind CSS with custom Neo-Brutalist design tokens
- **Icons:** `lucide-react`
- **Data Visualization:** `recharts`
- **Package Manager:** `pnpm` exclusively
- **Deployment:** GitHub Pages via `gh-pages`

---

## 💻 Local Development & Setup

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 9.0.0 (`npm install -g pnpm`)

### Installation & Run
```bash
# 1. Clone repository
git clone https://github.com/domainschool/Robo-Advisor-Portfolio-Rebalancer.git
cd Robo-Advisor-Portfolio-Rebalancer

# 2. Install dependencies with pnpm
pnpm install

# 3. Start local development server
pnpm run dev

# 4. Open in browser
# http://localhost:5173/
```

### Build & Verification
```bash
# Type check and build production bundle
pnpm run build

# Preview production build locally
pnpm run preview
```

### Deploy to GitHub Pages
```bash
# Builds and pushes /dist directory to gh-pages branch
pnpm run deploy
```

---

## 📁 Repository Structure

```text
├── instructions/             # Domain guides, design specifications, and prompt roadmaps
│   ├── design.md             # Strict Neo-Brutalist design system specifications
│   ├── explainer.md          # Quantitative finance & tax-lot accounting primer
│   ├── instructions.md       # Architectural constraints & deployment guidelines
│   └── prompts.md            # AI prompt engineering roadmap & execution log
├── src/
│   ├── components/
│   │   ├── AboutLearningDeckModal.tsx # 8-tab educational architecture learning deck
│   │   ├── AuditTrailModal.tsx        # Historical execution logs & order IDs
│   │   ├── ClientWatchlist.tsx        # 65% left panel with search and triage cards
│   │   ├── ComplianceMemoModal.tsx    # SEC Rule 206(4)-7 trade justification memo
│   │   ├── CorridorGauge.tsx          # Tactical corridor gauge with hazard stripes
│   │   ├── ExecutionDispatchBar.tsx   # Fiduciary verification & dispatch button
│   │   ├── HIFOLotMatrix.tsx          # Tax-lot liquidation queue table with locks
│   │   ├── PrimaryKPIStrip.tsx        # Monitored AUM, Breaches, Tax Alpha cards
│   │   ├── RebalanceStagingDesk.tsx   # 35% right staging panel with cash controls
│   │   └── TopNavigationBar.tsx       # Live status, proxy ticker tape, advisor pill
│   ├── data/
│   │   └── mockPortfolios.ts          # 4 realistic RIA client accounts
│   ├── types/
│   │   └── portfolio.ts               # Strict TypeScript domain interfaces
│   ├── utils/
│   │   └── rebalanceEngine.ts         # Pure deterministic math & lot optimizer
│   ├── App.tsx                        # Main state orchestrator & localStorage sync
│   ├── index.css                      # Neo-brutalist CSS tokens & hazard stripes
│   └── main.tsx                       # React application entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── project_specs.md          # Formal engineering specifications & DoD
```

---

## 📜 Regulatory & Fiduciary Disclaimer
*DriftGuard AI is engineered for informational, educational, and workflow automation prototyping purposes for wealth management professionals. All algorithmic recommendations should be reviewed by a qualified investment professional in accordance with SEC Rule 206(4)-7 and IRS Section 1091 guidelines.*
