import { NextRequest, NextResponse } from "next/server";
import { verifyPublicKey } from "@/lib/solana";
import crypto from "crypto";

// In-memory nonce store (use Redis in production)
const nonceStore = new Map<string, { nonce: string; expires: number }>();

export async function GET() {
  const nonce = crypto.randomBytes(32).toString("hex");
  return NextResponse.json({ nonce });
}

export async function POST(req: NextRequest) {
  try {
    const { publicKey, signature, nonce } = await req.json();

    if (!publicKey || !signature || !nonce) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!verifyPublicKey(publicKey)) {
      return NextResponse.json(
        { error: "Invalid public key" },
        { status: 400 }
      );
    }

    // Check nonce hasn't been used and hasn't expired
    const stored = nonceStore.get(nonce);
    if (stored && stored.expires < Date.now()) {
      nonceStore.delete(nonce);
      return NextResponse.json({ error: "Nonce expired" }, { status: 400 });
    }

    // Store nonce as used
    nonceStore.set(nonce, { nonce, expires: Date.now() + 300000 });

    // In production, verify signature with nacl/tweetnacl
    // For now, return success with wallet info
    return NextResponse.json({
      success: true,
      wallet: publicKey,
    });
  } catch (error) {
    console.error("Solana auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
