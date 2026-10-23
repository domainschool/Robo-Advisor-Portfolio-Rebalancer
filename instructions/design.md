# Design Specification: DriftGuard AI — Neo-Brutalist Financial Command

---

## 1. Design Concept & Philosophy

### Core Metaphor: The Algorithmic Ticker Tape & Fiduciary Control Desk

The core metaphor is an industrial, unadorned **Tactical Trading Console**. Unlike standard enterprise fintech platforms that obscure financial trade realities behind soft drop-shadows, blurred gradients, and low-contrast pastel alerts, DriftGuard AI employs a **Neo-Brutalist High-Yield Engineering System**.

The design treats financial drift, tax lots, and trade orders as physical, hard-edged instrument panels:

* Risk is tactile.
* Drift corridor violations hit the screen with physical weight.
* Every interactive element mimics a physical, punchy industrial switchboard.

### UX Principles

1. **Zero-Ambiguity Spatial Weight (Tactile Confirmation):**
Every interactive button, drawer, and table row features physical hard offsets (`4px 4px 0px 0px #000000`). Clicking an element compresses this shadow down to zero (`translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_0px_#000000]`), confirming state changes with zero latency. Financial trades demand absolute visual finality.
2. **Deterministic Information Density (No Hidden Layers):**
Advisors rebalancing 300 client books cannot tolerate nested menus, hidden hover tooltips, or smooth accordion animations. Absolute mathematical values (target weight, current weight, delta share counts, realized loss/gain) must be visible at a glance in pure tabular monospace.
3. **High-Contrast Semantic Friction:**
Every trade action has immediate tax and regulatory consequences. Non-destructive actions (monitoring, cash-flow routing) feature high-voltage lime and electric cyan; irreversible actions (custodial order dispatch, capital gain realization) demand stark, unapologetic hot pink and high-contrast black framing to force human-in-the-loop deliberate intent.

---

## 2. Color System & Semantic Tokens

All interactive elements, cards, modals, and metric boxes are bounded by strict `#000000` boundaries with hard geometric offsets.

```
       [ Pale Canvas: #FEFCE8 / #FFFDF0 ]
       ┌──────────────────────────────────────────────────┐
       │ Card: #FFFFFF | Border: 3px #000000              │
       │ Shadow: 4px 4px 0px 0px #000000                  │
       │                                                  │
       │  ┌──────────────┐  ┌──────────────┐  ┌────────┐  │
       │  │ Primary Action│  │ Status: Safe │  │ Breach │  │
       │  │ Hot Pink     │  │ Lime Green   │  │ Violet │  │
       │  │ #FF1493      │  │ #00FF66      │  │ #8A2BE2│  │
       │  └──────────────┘  └──────────────┘  └────────┘  │
       └──────────────────────────────────────────────────┘

```

### Precise Hex & Role Specifications

#### Surface & Background Tokens

* **Base Canvas (`surface-base`):** `#FEFCE8` (Tailwind `yellow-50` / Pale Cream Yellow)
*Role:* The global backdrop. Replaces cold digital whites with an archival, print-like paper stock.
* **Raised Container / Card (`surface-raised`):** `#FFFFFF` (Pure Stark White)
*Role:* Metric cards, client watchlists, trade queue drawers. Always framed by a hard black border.
* **Recessed Trench (`surface-recessed`):** `#F4F0DA` (Deep Muted Bone)
*Role:* Inactive table headers, code blocks, tax lot breakdowns, and historical data logs.
* **Modal / Drawer Overlay (`surface-overlay`):** `rgba(0, 0, 0, 0.75)` with solid black hatch/grid pattern.

#### Brand Accents

* **Brand Primary (`brand-pink`):** `#FF1493` (Deep Hot Pink / Fluorescent Magenta)
*Role:* Primary workflow triggers (`Calculate Rebalance`, `Dispatch Batch to Custodian`, Active Drawer Tabs).
* **Brand Secondary (`brand-violet`):** `#7B2CBF` (Electric Violet)
*Role:* Structural accents, advisor profile pills, secondary filter buttons, and AI IPS memo header tags.
* **Brand Tertiary (`brand-cyan`):** `#00F0FF` (Hyper Cyan)
*Role:* Cash-flow rebalancing triggers, cash balance indicators, and system connection badges.

#### Semantic Signals (Engineered for Financial Legibility)

* **Status Aligned / Low Drift (`signal-safe`):** `#00FF66` (Neon Lime Green)
*Role:* Portfolios within the $\pm 3\%$ corridor, tax-loss harvest indicators ($-\$$ loss harvested = tax alpha). Black text on this surface passes WCAG AAA.
* **Status Warning / Drifting (`signal-warning`):** `#FFE600` (Electric Cyber Yellow)
*Role:* Accounts approaching boundary conditions ($3.0\% - 4.9\%$ drift). Black text only.
* **Status Breach / Rebalance Mandated (`signal-breach`):** `#FF3333` (Signal Red-Orange)
*Role:* Out-of-corridor breaches ($\ge 5.0\%$). Indicates SEC Investment Policy Statement violation risk.
* **Fiduciary AI Memo / Informational (`signal-info`):** `#D946EF` (Fuchsia / Neon Purple)
*Role:* LLM Compliance audit notes, Wash-Sale proxy substitutions.

#### Text Hierarchy

* **Text Primary (`text-primary`):** `#000000` (Pure Pitch Black). Used across 95% of the interface.
* **Text Secondary (`text-secondary`):** `#1E1E1E` (Off-Black/Dark Carbon).
* **Text Inverse (`text-inverse`):** `#FFFFFF` (Stark White). Used strictly inside `#000000`, `#7B2CBF`, or `#FF1493` solid badges.
* **Text Muted / Caption (`text-muted`):** `#4B5563` (Cool Gray 700). Never dropped below 4.5:1 contrast against `#FEFCE8`.

#### Contrast & Accessibility Audit

* `#000000` on `#FEFCE8` yields a contrast ratio of **18.7:1** (Exceeds WCAG AAA).
* `#000000` on `#00FF66` (Lime) yields **13.4:1** (Exceeds WCAG AAA).
* `#000000` on `#FFE600` (Yellow) yields **16.2:1** (Exceeds WCAG AAA).
* `#FFFFFF` on `#FF1493` (Hot Pink) yields **4.7:1** (Exceeds WCAG AA for standard text; used primarily with bold/headline tokens). For small badges, `#000000` on `#FF1493` provides **6.2:1** (WCAG AAA).

---

## 3. Typography & Scale

The type system pairs an uncompromising, ultra-heavy geometric sans-serif for structure and headings with a stark, dense monospace for financial ledgers, lot allocations, and delta calculations.

```
DISPLAY:  SPACE GROTESK BOLD (900)  - Uppercase, Tight Tracking
HEADINGS: SPACE GROTESK BOLD (700)  - High Contrast, Structured
DATA:     JETBRAINS MONO MEDIUM     - Monospaced, Tabular, High-Legibility

```

### Font Families

* **Primary Display & Headings:** `Space Grotesk` (Google Fonts) or `Cabinet Grotesk` (Fallback: `Trebuchet MS`, `Arial Black`, `sans-serif`)
* **Data, Figures, Ledgers & Controls:** `JetBrains Mono` or `IBM Plex Mono` (Fallback: `Courier New`, `monospace`)

### Type Scale Hierarchy

| Token | Family | Size | Weight | Tracking | Line Height | Case / Style | Usage |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `type-display` | Space Grotesk | 48px (`3rem`) | 900 (Black) | `-0.04em` | 1.05 | UPPERCASE | Total AUM Value, Breach Alert Counters |
| `type-h1` | Space Grotesk | 32px (`2rem`) | 800 (ExtraBold) | `-0.03em` | 1.15 | Sentence Case | Screen Titles, Modal Super-headers |
| `type-h2` | Space Grotesk | 24px (`1.5rem`) | 700 (Bold) | `-0.02em` | 1.25 | Sentence Case | Card Titles, Drawer Section Titles |
| `type-h3` | Space Grotesk | 18px (`1.125rem`) | 700 (Bold) | `-0.01em` | 1.30 | Sentence Case | Table Group Headers, Model Portfolio Tags |
| `type-body` | Space Grotesk | 15px (`0.9375rem`) | 500 (Medium) | `0em` | 1.45 | Sentence Case | Client Notes, Compliance Disclaimers |
| `type-data-lg` | JetBrains Mono | 20px (`1.25rem`) | 700 (Bold) | `-0.02em` | 1.20 | Tabular Figures | Staged Trade Notional Totals, Drift Deltas |
| `type-data-md` | JetBrains Mono | 14px (`0.875rem`) | 500 (Medium) | `-0.01em` | 1.35 | Tabular Figures | Table Cells (Shares, Prices, Weights) |
| `type-data-sm` | JetBrains Mono | 12px (`0.75rem`) | 400 (Regular) | `0em` | 1.30 | Tabular Figures | Tax Lot Dates, Cost Basis, CUSIP/Ticker |
| `type-label` | JetBrains Mono | 11px (`0.6875rem`) | 700 (Bold) | `+0.08em` | 1.00 | ALL CAPS | Table Header Labels, Status Pills, Badges |

---

## 4. Spatial System & Elevation

### Grid & Base Units

* **Base Spatial Increment:** **`4px`** (Strict 4/8/16/24/32/48/64 layout scale).
* **Layout Grid:** 12-column fluid grid (`max-w-[1720px]`), 24px gutters, framed by a continuous `border-l-4 border-r-4 border-black` main application container.

### Component Spacing & Padding Tokens

* **Card Internal Padding:** `p-5` (`20px`) or `p-6` (`24px`).
* **Table Cell Padding:** `py-3 px-4` (Dense data mode: `py-2 px-3`).
* **Section Gap:** `gap-6` (`24px`).
* **Input / Button Padding:** `px-4 py-2.5` (`16px 10px`).

### Elevation, Borders & Hard Shadow Tokens

No blurs, no soft ambient lighting. Elevation is strictly physical and 2-dimensional.

```css
/* Tailwind Plugin / CSS Token Configuration */

/* Borders */
--border-thick: 4px solid #000000;
--border-medium: 3px solid #000000;
--border-thin: 2px solid #000000;

/* Neo-Brutalist Hard Shadows */
--shadow-sm: 2px 2px 0px 0px #000000;
--shadow-base: 4px 4px 0px 0px #000000;
--shadow-lg: 8px 8px 0px 0px #000000;
--shadow-accent-pink: 4px 4px 0px 0px #FF1493;
--shadow-accent-lime: 4px 4px 0px 0px #00FF66;

/* Active Press Transform */
--press-active: translate(2px, 2px);
--press-shadow-active: 2px 2px 0px 0px #000000;

/* Border Radii */
--radius-none: 0px; /* STRICT: 100% sharp corners across entire system */

```

---

## 5. Signature UI Components (Tailored to Core Problem)

### Component 1: The Tactical Drift Corridor Gauge (`<CorridorGauge/>`)

* **Problem Solved:** Advisors need to instantly spot which asset is causing a model breach without calculating mental percentages.

```
  [0% --- 35% ------ 55% [ TARGET: 60% ] 65% ------- 76% ----- 100%]
  ┌─────────────────────────────────────────────────────────────────┐
  │░░░░░░░░░░░░░░░░░░░░░░░|==== SAFE ====|████████████████████      │
  └─────────────────────────────────────────────────────────────────┘
                          ▲              ▲             ▲
                   Inner Bound: 55%    Target: 60%   Actual: 76% (BREACH)

```

#### Anatomy & Specifications

1. **Container Track:** `h-8 w-full bg-white border-2 border-black rounded-none relative`.
2. **Safe Corridor Window (Inner Band):** Positioned absolute, e.g., `left-[55%] width-[10%] bg-[#00FF66]/30 border-l-2 border-r-2 border-black border-dashed`.
3. **Target Marker:** A vertical solid black line `w-1 h-full bg-black left-[60%] z-20` topped with an inverted black triangle pointer `▲`.
4. **Current Weight Fill Bar:** Solid high-contrast fill from 0 to actual value.
* If actual is within safe corridor: `bg-[#00FF66]` (Lime).
* If actual is outside safe corridor: `bg-[#FF3333]` (Signal Red) with diagonal black hazard stripes (`repeating-linear-gradient(45deg, #FF3333, #FF3333 10px, #000000 10px, #000000 12px)`).


5. **State Metrics:** Monospaced readouts flanked on right: `ACTUAL: 76.2% | TGT: 60.0% | DELTA: +16.2% [BREACH]`.

#### Interaction & Speed Value

Replaces complex multi-axis charts with an immediate visual test. If the striped red bar protrudes beyond the dotted box, the advisor knows instantly this asset requires liquidation.

---

### Component 2: The HIFO Tax-Lot Liquidation Queue (`<HIFOLotMatrix/>`)

* **Problem Solved:** When trimming an overweight position, selling the wrong lots triggers tax liabilities. This component visually stages the exact tax-lot disposal sequence before execution.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ STAGED LOTS FOR LIQUIDATION: VTI (TOTAL TRIM: 14.2 SHARES)                      │
├───────┬────────────┬─────────┬────────────┬───────────┬──────────────┬───────────┤
│ QUEUE │ LOT DATE   │ SHARES  │ COST BASIS │ MKT PRICE │ TAX GAIN/LOSS│ SELECTION │
├───────┼────────────┼─────────┼────────────┼───────────┼──────────────┼───────────┤
│ [01]  │ 2024-10-10 │ 10.0000 │ $242.50    │ $220.00   │ -$225.00 [TLH│ [X] AUTO  │
│ [02]  │ 2025-01-14 │  4.2000 │ $228.00    │ $220.00   │  -$33.60 [TLH│ [X] PARTL │
│ [03]  │ 2023-05-12 │  0.0000 │ $170.00    │ $220.00   │  +$0.00 (GAIN│ [ ] EXCL  │
└───────┴────────────┴─────────┴────────────┴───────────┴──────────────┴───────────┘
 * NET TAX BENEFIT HARVESTED: -$258.60 (CAPITAL LOSS GENERATED)

```

#### Anatomy & Specifications

1. **Container:** Solid white background, `border-3 border-black shadow-[4px_4px_0px_0px_#000000] rounded-none`.
2. **Lot Row Highlighting:**
* **Loss Lots (Tax-Loss Harvest):** Rows have a subtle pale green tint (`bg-[#00FF66]/10`) with bold text and a badge: `bg-[#00FF66] text-black border border-black px-1.5 py-0.5 text-[10px] font-mono: "HARVEST LOSS"`.
* **Gain Lots (Tax Drag):** If the trade must sell lots with capital gains, rows carry an amber warning tint (`bg-[#FFE600]/10`) and display: `bg-[#FFE600] text-black border border-black: "SHORT-TERM GAIN"`.


3. **Interactive Overrides:** Checkbox controls feature custom square markers (`w-5 h-5 border-2 border-black rounded-none checked:bg-black checked:text-white`). Advisors can uncheck a lot to lock it from sale; the algorithm recalculates the remaining lot distribution in real time.

---

### Component 3: One-Click Custodial Dispatch Bar (`<ExecutionDispatchBar/>`)

* **Problem Solved:** Bridges the gap between algorithmic calculation and execution. Reduces 20 minutes of trade desk entry to a verified, single-click action with explicit safeguards.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ TOTAL ORDERS: 2 | SELL: $3,124.00 | BUY: $3,124.00 | SLIPPAGE TOL: 0.10%        │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [ ] I VERIFY IPS COMPLIANCE (SEC RULE 206(4)-7)                                  │
│                                                                                  │
│ ┌───────────────────────────────────┐  ┌───────────────────────────────────────┐ │
│ │ [AI] GENERATE COMPLIANCE MEMO     │  │ DISPATCH BATCH TO ALPACA (2 TRADES) ▶ │ │
│ │ bg-[#7B2CBF] text-white shadow-md │  │ bg-[#FF1493] text-white shadow-lg     │ │
│ └───────────────────────────────────┘  └───────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────┘

```

#### States & Micro-interactions

* **Default (Unchecked Verification):** "DISPATCH BATCH" button is `bg-gray-300 text-gray-600 border-2 border-black shadow-none cursor-not-allowed`.
* **Verified (Checkbox Ticked):** Button flips instantly to `bg-[#FF1493] text-white border-3 border-black shadow-[4px_4px_0px_0px_#000000] cursor-pointer`.
* **Hover State:** Button translates: `translate-x-[-1px] translate-y-[-1px] shadow-[6px_6px_0px_0px_#000000]`.
* **Active Press:** Button translates: `translate-x-[2px] translate-y-[2px] shadow-[1px_1px_0px_0px_#000000]`.
* **Executing State:** Button switches to repeating yellow/black diagonal warning stripes with pulsing text: `TRANSMITTING TO FIX GATEWAY...`.

---

## 6. Layout Architecture & Screen Flow Blueprint

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP BAR: DRIFTGUARD AI [LIVE] │ AUM: $142.8M │ WARNINGS: 14 │ ADV: D. VANCE, RIA      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ METRIC RAIL:                                                                           │
│ [ AUM AT RISK: $12.4M ] [ DRIFTED ACCOUNTS: 18 ] [ TAX-ALPHA MTD: +$42.1K ]           │
├────────────────────────────────────────────────────┬───────────────────────────────────┤
│ CLIENT WATCHLIST (65% Width)                       │ REBALANCE STAGING DESK (35% Width)│
│                                                    │                                   │
│ Filter: [ ALL ] [ BREACHED (18) ] [ CASH-RICH ]    │ ACCOUNT: #8492 - ELEANOR RIGBY    │
│ Search: [ TICKER / CLIENT ID ................ ]    │ Model: Aggressive Growth (80/20)  │
│                                                    │ Corridor: ±5.0%                   │
│ ┌────────────────────────────────────────────────┐ │ ┌───────────────────────────────┐ │
│ │ [!] #8492 ELEANOR RIGBY - TAXABLE BROKERAGE    │ │ │ CORRIDOR STATUS: BREACHED     │ │
│ │ Drift: +12.4% (VTI OVERWEIGHT)                 │ │ │ Current Drift: +12.4%         │ │
│ │ Total: $1,420,500.00 | Cash: $14,200.00        │ │ ├───────────────────────────────┤ │
│ ├────────────────────────────────────────────────┤ │ │ ASSET BREAKDOWN (TABLE)       │ │
│ │ [✓] #3019 MARCUS VANCE - ROTH IRA              │ │ │ VTI: 92.4% -> 80.0% [SELL]    │ │
│ │ Drift: +1.2% (ALIGNED)                         │ │ │ BND:  7.6% -> 20.0% [BUY]     │ │
│ │ Total: $480,200.00   | Cash: $1,100.00         │ │ ├───────────────────────────────┤ │
│ ├────────────────────────────────────────────────┤ │ │ TAX-LOT LIQUIDATION QUEUE     │ │
│ │ [!] #1094 SARAH CONNOR - TAXABLE FAMILY TRUST  │ │ │ (HIFO Selection Matrix)       │ │
│ │ Drift: -8.1% (FIXED INCOME DEFICIT)            │ │ ├───────────────────────────────┤ │
│ │ Total: $3,210,000.00 | Cash: $250,000.00       │ │ │ ONE-CLICK DISPATCH BAR        │ │
│ └────────────────────────────────────────────────┘ │ └───────────────────────────────┘ │
└────────────────────────────────────────────────────┴───────────────────────────────────┘

```

### Main Shell Structure

* **Top Navigation Bar (`h-16 w-full bg-[#FEFCE8] border-b-4 border-black px-6 flex items-center justify-between`):**
* Left: Brand mark `DRIFTGUARD AI` in `Space Grotesk 900` accompanied by a pulsing status block: `bg-[#00FF66] border-2 border-black px-2 py-0.5 text-xs font-mono: "CUSTODIAN FEED ACTIVE"`.
* Center: Global Ticker Readout: Real-time price updates for broad proxies (`VTI: 262.40 ▲`, `BND: 72.10 ▼`, `VXUS: 58.20 ▲`).
* Right: Advisor credential pill: `bg-white border-2 border-black px-3 py-1 font-mono text-sm shadow-[2px_2px_0px_0px_#000000]`.


* **Primary KPI Strip (`w-full bg-[#F4F0DA] border-b-4 border-black p-4 grid grid-cols-4 gap-4`):**
* Four stark cards (`bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000000]`):
1. *Monitored AUM:* `$142,840,210.00`
2. *Accounts in Corridor Breach:* `18 / 240` (Card has `bg-[#FF3333]/15` fill)
3. *Potential Tax Alpha (Harvestable Losses):* `-$64,280.00` (Text `text-black bg-[#00FF66] px-1`)
4. *Pending Staged Orders:* `42 Orders ($1.8M)`





---

### Step-by-Step Primary Workflow Screen Walkthrough

#### Step 1: Triage on the Client Watchlist (Left 65% Panel)

1. The advisor filters by `[BREACHED CORRIDOR (>5%)]`.
2. The list populates with high-contrast warning cards (`border-3 border-black shadow-[4px_4px_0px_0px_#000000] mb-3`).
3. Card `#8492 Eleanor Rigby` shows a severe breach alert:
* Header: `bg-[#FF3333] text-black font-bold px-2 py-1 text-xs font-mono inline-block border-b-2 border-r-2 border-black: "BREACH: +12.4% EQUITY DRIFT"`.
* Body: Displays target model vs actual: `Target: 80% Equity / 20% Fixed Income` $\rightarrow$ `Actual: 92.4% Equity / 7.6% Fixed Income`.


4. The advisor clicks the card. The card translates `translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_0px_#000000] bg-[#FEFCE8]`, and the Right Panel loads Account #8492.

#### Step 2: Inspection on the Rebalance Staging Desk (Right 35% Panel)

1. **Corridor Visualizer:** Shows the `<CorridorGauge/>` component with `VTI` extending past the safe box in red hazard stripes.
2. **Cash Flow Check:** The system detects `$14,200.00` in idle uninvested cash.
* A toggle: `[X] DEPLOY CASH FIRST (AVOID TAX SALES)` is switched on by default.
* The engine automatically routes the `$14,200.00` to purchase `BND` first, reducing the necessary equity sales from `$176,000` down to `$161,800`.


3. **Tax Optimization Matrix:** The system outputs the `<HIFOLotMatrix/>` showing 3 specific lots of `VTI` staged for liquidation:
* Lot #1 (Purchased 2024-10-10 at $242.50) is sold first, generating a **`-$2,250.00` tax loss**.
* The UI displays: `ESTIMATED CAPITAL GAINS TAX GENERATED: $0.00`.



#### Step 3: Fiduciary AI Rationale Generation

1. Inside the staging desk, the advisor clicks `[AI: GENERATE COMPLIANCE MEMO]`.
2. A dense, high-contrast modal or inline card expands (`bg-[#F4F0DA] border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000000]`):
* Typography: `JetBrains Mono 13px`.
* Content: *"Rebalance triggered due to 12.4% positive drift in US Large Cap Equity allocation violating the 5.0% corridor established in client IPS dated 2024-03-01. Execution utilizes HIFO lot selection harvesting $2,250 in short-term capital losses to offset ordinary income."*
* Includes a one-click button: `[ATTACH TO CRM / IPS RECORD]`.



#### Step 4: Verification and Final Custodial Order Dispatch

1. The advisor reviews the final staged transaction:
* `SELL 620 SHARES VTI @ MKT (~$161,800.00)`
* `BUY 2,444 SHARES BND @ MKT (~$176,000.00)`


2. The advisor checks `[X] I CONFIRM FIDUCIARY AUTHORIZATION`.
3. The `<ExecutionDispatchBar/>` activates with a hot pink fill (`#FF1493`).
4. The advisor clicks **`DISPATCH BATCH TO ALPACA ▶`**.
5. The button triggers an active state:
* Hard shadow compresses to zero.
* Status updates in real-time monospace:
`STATUS: 200 OK | ALPACA ORDER IDS: #ord_8921a, #ord_8921b | PORTFOLIO RESTORED TO ±0.0% DRIFT`.


6. Card `#8492` on the left watchlist shifts from Red (`BREACH`) to a vibrant Lime Green badge (`ALIGNED`), automatically selecting the next drifted account in the queue.

---

## 7. Component Token Mapping Table (Ready for Tailwind Implementation)

| Component Element | Neo-Brutalist Utility Classes |
| --- | --- |
| **App Background** | `bg-[#FEFCE8] text-black min-h-screen selection:bg-[#FF1493] selection:text-white` |
| **Standard Card** | `bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000000] rounded-none p-5` |
| **Primary Action Button** | `bg-[#FF1493] text-white font-bold border-3 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000000] rounded-none px-4 py-2 font-mono uppercase tracking-wider` |
| **Success / Safe Badge** | `bg-[#00FF66] text-black font-mono font-bold border-2 border-black px-2 py-0.5 text-xs rounded-none shadow-[2px_2px_0px_0px_#000000]` |
| **Breach Alert Badge** | `bg-[#FF3333] text-black font-mono font-bold border-2 border-black px-2 py-0.5 text-xs rounded-none shadow-[2px_2px_0px_0px_#000000]` |
| **Table Head / Rail** | `bg-[#F4F0DA] border-b-3 border-black font-mono text-xs uppercase tracking-widest text-black font-bold p-3` |
| **Input / Search Field** | `bg-white border-3 border-black px-3 py-2 font-mono text-sm placeholder:text-gray-500 focus:outline-none focus:bg-[#FEFCE8] focus:shadow-[4px_4px_0px_0px_#000000] rounded-none` |
| **Modal / Dialog** | `bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] rounded-none p-6 max-w-2xl w-full` |