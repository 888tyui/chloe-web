import { NextResponse } from "next/server";

const COINGECKO_IDS: Record<string, string> = {
  SOL: "solana",
  BTC: "bitcoin",
  ETH: "ethereum",
  USDC: "usd-coin",
  USDT: "tether",
  RAY: "raydium",
  BONK: "bonk",
  JUP: "jupiter-exchange-solana",
  PYTH: "pyth-network",
  WIF: "dogwifhat",
};

const ID_TO_SYMBOL = Object.fromEntries(
  Object.entries(COINGECKO_IDS).map(([sym, id]) => [id, sym])
);

const MOCK_PRICES: Record<string, { price: number; change24h: number }> = {
  SOL: { price: 142.37, change24h: 3.24 },
  BTC: { price: 97420.0, change24h: -0.82 },
  ETH: { price: 3245.67, change24h: 1.56 },
  USDC: { price: 1.0, change24h: 0.01 },
  USDT: { price: 1.0, change24h: -0.01 },
  RAY: { price: 4.82, change24h: 5.67 },
  BONK: { price: 0.00002341, change24h: 12.34 },
  JUP: { price: 1.23, change24h: -2.45 },
  PYTH: { price: 0.45, change24h: 0.89 },
  WIF: { price: 2.15, change24h: 8.92 },
};

let cachedPrices: Record<string, { price: number; change24h: number }> | null =
  null;
let lastFetchTime = 0;
const CACHE_TTL = 10_000; // 10 seconds

export async function GET() {
  const now = Date.now();

  if (cachedPrices && now - lastFetchTime < CACHE_TTL) {
    return NextResponse.json(cachedPrices);
  }

  const apiKey = process.env.COINGECKO_API_KEY;
  if (!apiKey) {
    return NextResponse.json(cachedPrices ?? MOCK_PRICES);
  }

  try {
    const ids = Object.values(COINGECKO_IDS).join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

    const res = await fetch(url, {
      headers: { "x-cg-demo-api-key": apiKey },
    });

    if (!res.ok) {
      throw new Error(`CoinGecko responded with ${res.status}`);
    }

    const data: Record<string, { usd: number; usd_24h_change: number }> =
      await res.json();

    const prices: Record<string, { price: number; change24h: number }> = {};
    for (const [cgId, values] of Object.entries(data)) {
      const symbol = ID_TO_SYMBOL[cgId];
      if (symbol) {
        prices[symbol] = {
          price: values.usd,
          change24h: values.usd_24h_change ?? 0,
        };
      }
    }

    cachedPrices = prices;
    lastFetchTime = now;

    return NextResponse.json(prices);
  } catch {
    return NextResponse.json(cachedPrices ?? MOCK_PRICES);
  }
}
