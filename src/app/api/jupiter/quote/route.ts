import { NextRequest, NextResponse } from "next/server";
import { getQuote } from "@/lib/jupiter";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const inputMint = searchParams.get("inputMint");
    const outputMint = searchParams.get("outputMint");
    const amount = searchParams.get("amount");
    const slippageBps = searchParams.get("slippageBps") || "50";

    if (!inputMint || !outputMint || !amount) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const quote = await getQuote(
      inputMint,
      outputMint,
      amount,
      parseInt(slippageBps)
    );
    return NextResponse.json(quote);
  } catch (error) {
    console.error("Jupiter quote error:", error);
    return NextResponse.json(
      { error: "Failed to get quote" },
      { status: 500 }
    );
  }
}
