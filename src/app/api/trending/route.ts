import { NextResponse } from "next/server";

interface TrendingToken {
  symbol: string;
  name: string;
  thumb: string;
  price_change_24h: number;
  market_cap_rank: number | null;
  tag: string;
}

const FALLBACK_TRENDING: TrendingToken[] = [
  { symbol: "BONK", name: "Bonk", thumb: "", price_change_24h: 12.34, market_cap_rank: 70, tag: "MEME" },
  { symbol: "WIF", name: "dogwifhat", thumb: "", price_change_24h: 8.92, market_cap_rank: 45, tag: "MEME" },
  { symbol: "RAY", name: "Raydium", thumb: "", price_change_24h: 5.67, market_cap_rank: 90, tag: "DEFI" },
  { symbol: "JUP", name: "Jupiter", thumb: "", price_change_24h: -2.45, market_cap_rank: 60, tag: "DEFI" },
  { symbol: "PYTH", name: "Pyth Network", thumb: "", price_change_24h: 0.89, market_cap_rank: 100, tag: "ORACLE" },
];

const TAG_MAP: Record<string, string> = {
  bonk: "MEME",
  dogwifhat: "MEME",
  pepe: "MEME",
  floki: "MEME",
  shiba: "MEME",
  doge: "MEME",
  brett: "MEME",
  popcat: "MEME",
  mog: "MEME",
  raydium: "DEFI",
  jupiter: "DEFI",
  uniswap: "DEFI",
  aave: "DEFI",
  lido: "DEFI",
  maker: "DEFI",
  pyth: "ORACLE",
  chainlink: "ORACLE",
  band: "ORACLE",
  bitcoin: "L1",
  ethereum: "L1",
  solana: "L1",
  avalanche: "L1",
  polygon: "L2",
  arbitrum: "L2",
  optimism: "L2",
  render: "AI",
  fetch: "AI",
  ocean: "AI",
};

function inferTag(name: string, symbol: string): string {
  const lower = name.toLowerCase();
  const symLower = symbol.toLowerCase();

  for (const [keyword, tag] of Object.entries(TAG_MAP)) {
    if (lower.includes(keyword) || symLower.includes(keyword)) {
      return tag;
    }
  }

  return "ALT";
}

let cachedTrending: TrendingToken[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  const now = Date.now();

  if (cachedTrending && now - lastFetchTime < CACHE_TTL) {
    return NextResponse.json(cachedTrending);
  }

  const apiKey = process.env.COINGECKO_API_KEY;
  if (!apiKey) {
    return NextResponse.json(cachedTrending ?? FALLBACK_TRENDING);
  }

  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/search/trending",
      { headers: { "x-cg-demo-api-key": apiKey } }
    );

    if (!res.ok) {
      throw new Error(`CoinGecko responded with ${res.status}`);
    }

    const data = await res.json();

    const trending: TrendingToken[] = (data.coins ?? [])
      .slice(0, 5)
      .map(
        (entry: {
          item: {
            symbol: string;
            name: string;
            thumb: string;
            data?: { price_change_percentage_24h?: Record<string, number> };
            market_cap_rank: number | null;
          };
        }) => {
          const coin = entry.item;
          const change =
            coin.data?.price_change_percentage_24h?.usd ?? 0;

          return {
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            thumb: coin.thumb ?? "",
            price_change_24h: Math.round(change * 100) / 100,
            market_cap_rank: coin.market_cap_rank ?? null,
            tag: inferTag(coin.name, coin.symbol),
          };
        }
      );

    cachedTrending = trending;
    lastFetchTime = now;

    return NextResponse.json(trending);
  } catch {
    return NextResponse.json(cachedTrending ?? FALLBACK_TRENDING);
  }
}
