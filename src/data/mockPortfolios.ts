import { ClientAccount } from '@/types/portfolio';

export const INITIAL_PORTFOLIOS: ClientAccount[] = [
  {
    id: 'acc-8492',
    accountNumber: '8492',
    clientName: 'Eleanor Rigby',
    accountType: 'Taxable Brokerage',
    modelName: 'Aggressive Growth (80/20)',
    driftCorridor: 0.05, // ±5.0%
    cashBalance: 14200.0,
    lastRebalanced: '2026-08-15',
    targetModel: [
      {
        ticker: 'VTI',
        assetName: 'Vanguard Total Stock Market ETF',
        assetClass: 'US Equities',
        targetWeight: 0.8, // 80%
      },
      {
        ticker: 'BND',
        assetName: 'Vanguard Total Bond Market ETF',
        assetClass: 'Fixed Income',
        targetWeight: 0.2, // 20%
      },
    ],
    holdings: [
      {
        ticker: 'VTI',
        assetName: 'Vanguard Total Stock Market ETF',
        assetClass: 'US Equities',
        shares: 5960.0,
        currentPrice: 220.0, // $1,311,200 (approx 92.3%)
        proxyTicker: 'ITOT',
      },
      {
        ticker: 'BND',
        assetName: 'Vanguard Total Bond Market ETF',
        assetClass: 'Fixed Income',
        shares: 1320.0,
        currentPrice: 72.0, // $95,040 (approx 6.7%)
        proxyTicker: 'AGG',
      },
    ],
    taxLots: [
      {
        id: 'lot-8492-1',
        ticker: 'VTI',
        purchaseDate: '2024-10-10',
        shares: 650.0,
        costBasis: 242.5, // Loss of -$22.50 / share -> $14,625 harvestable loss!
        currentPrice: 220.0,
        isShortTerm: true,
      },
      {
        id: 'lot-8492-2',
        ticker: 'VTI',
        purchaseDate: '2025-01-14',
        shares: 800.0,
        costBasis: 228.0, // Loss of -$8.00 / share -> $6,400 harvestable loss!
        currentPrice: 220.0,
        isShortTerm: true,
      },
      {
        id: 'lot-8492-3',
        ticker: 'VTI',
        purchaseDate: '2023-05-12',
        shares: 4510.0,
        costBasis: 170.0, // Capital Gain of +$50.00 / share
        currentPrice: 220.0,
        isShortTerm: false,
      },
      {
        id: 'lot-8492-4',
        ticker: 'BND',
        purchaseDate: '2024-02-18',
        shares: 1320.0,
        costBasis: 74.0,
        currentPrice: 72.0,
        isShortTerm: false,
      },
    ],
  },
  {
    id: 'acc-3019',
    accountNumber: '3019',
    clientName: 'Marcus Vance',
    accountType: 'Roth IRA',
    modelName: 'Balanced Growth (60/40)',
    driftCorridor: 0.05,
    cashBalance: 3400.0,
    lastRebalanced: '2026-09-30',
    targetModel: [
      {
        ticker: 'VTI',
        assetName: 'Vanguard Total Stock Market ETF',
        assetClass: 'US Equities',
        targetWeight: 0.6, // 60%
      },
      {
        ticker: 'BND',
        assetName: 'Vanguard Total Bond Market ETF',
        assetClass: 'Fixed Income',
        targetWeight: 0.4, // 40%
      },
    ],
    holdings: [
      {
        ticker: 'VTI',
        assetName: 'Vanguard Total Stock Market ETF',
        assetClass: 'US Equities',
        shares: 1320.0,
        currentPrice: 220.0, // $290,400 (60.5%)
        proxyTicker: 'ITOT',
      },
      {
        ticker: 'BND',
        assetName: 'Vanguard Total Bond Market ETF',
        assetClass: 'Fixed Income',
        shares: 2590.0,
        currentPrice: 72.0, // $186,480 (38.8%)
        proxyTicker: 'AGG',
      },
    ],
    taxLots: [
      {
        id: 'lot-3019-1',
        ticker: 'VTI',
        purchaseDate: '2023-01-10',
        shares: 1320.0,
        costBasis: 195.0,
        currentPrice: 220.0,
        isShortTerm: false,
      },
      {
        id: 'lot-3019-2',
        ticker: 'BND',
        purchaseDate: '2023-03-22',
        shares: 2590.0,
        costBasis: 73.5,
        currentPrice: 72.0,
        isShortTerm: false,
      },
    ],
  },
  {
    id: 'acc-1094',
    accountNumber: '1094',
    clientName: 'Sarah Connor',
    accountType: 'Taxable Brokerage',
    modelName: 'Capital Preservation (50/50)',
    driftCorridor: 0.05,
    cashBalance: 250000.0, // High cash deployment opportunity!
    lastRebalanced: '2026-07-12',
    targetModel: [
      {
        ticker: 'VTI',
        assetName: 'Vanguard Total Stock Market ETF',
        assetClass: 'US Equities',
        targetWeight: 0.5, // 50%
      },
      {
        ticker: 'BND',
        assetName: 'Vanguard Total Bond Market ETF',
        assetClass: 'Fixed Income',
        targetWeight: 0.5, // 50%
      },
    ],
    holdings: [
      {
        ticker: 'VTI',
        assetName: 'Vanguard Total Stock Market ETF',
        assetClass: 'US Equities',
        shares: 7800.0,
        currentPrice: 220.0, // $1,716,000 (55.0%)
        proxyTicker: 'ITOT',
      },
      {
        ticker: 'BND',
        assetName: 'Vanguard Total Bond Market ETF',
        assetClass: 'Fixed Income',
        shares: 16000.0,
        currentPrice: 72.0, // $1,152,000 (36.9%)
        proxyTicker: 'AGG',
      },
    ],
    taxLots: [
      {
        id: 'lot-1094-1',
        ticker: 'VTI',
        purchaseDate: '2024-04-10',
        shares: 1200.0,
        costBasis: 235.0, // Loss: -$15/share
        currentPrice: 220.0,
        isShortTerm: true,
      },
      {
        id: 'lot-1094-2',
        ticker: 'VTI',
        purchaseDate: '2022-11-05',
        shares: 6600.0,
        costBasis: 160.0, // Heavy gain
        currentPrice: 220.0,
        isShortTerm: false,
      },
      {
        id: 'lot-1094-3',
        ticker: 'BND',
        purchaseDate: '2023-08-15',
        shares: 16000.0,
        costBasis: 71.0,
        currentPrice: 72.0,
        isShortTerm: false,
      },
    ],
  },
  {
    id: 'acc-5521',
    accountNumber: '5521',
    clientName: 'Dr. Jonathan Osterman',
    accountType: 'Taxable Brokerage',
    modelName: 'Global Technology Tilt (40/30/20/10)',
    driftCorridor: 0.05,
    cashBalance: 24500.0,
    lastRebalanced: '2026-06-20',
    targetModel: [
      {
        ticker: 'QQQ',
        assetName: 'Invesco QQQ Trust (NASDAQ 100)',
        assetClass: 'US Equities',
        targetWeight: 0.4, // 40%
      },
      {
        ticker: 'VTI',
        assetName: 'Vanguard Total Stock Market ETF',
        assetClass: 'US Equities',
        targetWeight: 0.3, // 30%
      },
      {
        ticker: 'VXUS',
        assetName: 'Vanguard Total International Stock ETF',
        assetClass: 'Intl Equities',
        targetWeight: 0.2, // 20%
      },
      {
        ticker: 'BND',
        assetName: 'Vanguard Total Bond Market ETF',
        assetClass: 'Fixed Income',
        targetWeight: 0.1, // 10%
      },
    ],
    holdings: [
      {
        ticker: 'QQQ',
        assetName: 'Invesco QQQ Trust (NASDAQ 100)',
        assetClass: 'US Equities',
        shares: 2600.0,
        currentPrice: 480.0, // $1,248,000 (54.2% -> severe breach!)
        proxyTicker: 'QQQM',
      },
      {
        ticker: 'VTI',
        assetName: 'Vanguard Total Stock Market ETF',
        assetClass: 'US Equities',
        shares: 2500.0,
        currentPrice: 220.0, // $550,000 (23.9%)
        proxyTicker: 'ITOT',
      },
      {
        ticker: 'VXUS',
        assetName: 'Vanguard Total International Stock ETF',
        assetClass: 'Intl Equities',
        shares: 5800.0,
        currentPrice: 58.0, // $336,400 (14.6%)
        proxyTicker: 'IXUS',
      },
      {
        ticker: 'BND',
        assetName: 'Vanguard Total Bond Market ETF',
        assetClass: 'Fixed Income',
        shares: 2000.0,
        currentPrice: 72.0, // $144,000 (6.3%)
        proxyTicker: 'AGG',
      },
    ],
    taxLots: [
      {
        id: 'lot-5521-1',
        ticker: 'QQQ',
        purchaseDate: '2024-11-12',
        shares: 400.0,
        costBasis: 495.0, // Loss: -$15/share -> $6,000 tax alpha!
        currentPrice: 480.0,
        isShortTerm: true,
      },
      {
        id: 'lot-5521-2',
        ticker: 'QQQ',
        purchaseDate: '2023-04-18',
        shares: 2200.0,
        costBasis: 340.0, // Large long-term gain
        currentPrice: 480.0,
        isShortTerm: false,
      },
    ],
  },
];
