import { NextRequest, NextResponse } from "next/server";
import { getSwapTransaction } from "@/lib/jupiter";

export async function POST(req: NextRequest) {
  try {
    const { quoteResponse, userPublicKey } = await req.json();

    if (!quoteResponse || !userPublicKey) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const swapResult = await getSwapTransaction(quoteResponse, userPublicKey);
    return NextResponse.json(swapResult);
  } catch (error) {
    console.error("Jupiter swap error:", error);
    return NextResponse.json(
      { error: "Failed to create swap transaction" },
      { status: 500 }
    );
  }
}
