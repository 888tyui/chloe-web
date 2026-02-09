"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplets, Lock, Bell } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function PoolForm() {
  const [notifyClicked, setNotifyClicked] = useState(false);

  return (
    <div className="w-full max-w-md border border-chloe-elevated/80 bg-chloe-abyss/40 p-6 space-y-5 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-chloe-cyan">
          <Droplets className="h-4 w-4" />
          Add Liquidity
        </span>
        <span className="font-mono text-[10px] text-chloe-blood border border-chloe-blood/30 px-2 py-0.5 tracking-wider flex items-center gap-1">
          <Lock className="h-2.5 w-2.5" />
          LOCKED
        </span>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-mono uppercase tracking-wider text-chloe-ash">
            Token A
          </Label>
          <Input
            placeholder="0.00"
            disabled
            className="font-mono border-chloe-pink/10 bg-chloe-void text-foreground"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] font-mono uppercase tracking-wider text-chloe-ash">
            Token B
          </Label>
          <Input
            placeholder="0.00"
            disabled
            className="font-mono border-chloe-pink/10 bg-chloe-void text-foreground"
          />
        </div>

        <button
          disabled
          className="btn-brutal-outline w-full py-3 px-6 text-sm opacity-40 cursor-not-allowed"
        >
          Coming Soon
        </button>

        {/* Notify button */}
        <button
          onClick={() => setNotifyClicked(true)}
          disabled={notifyClicked}
          className={cn(
            "w-full flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-wider py-2 border transition-all",
            notifyClicked
              ? "border-chloe-cyan/30 text-chloe-cyan/60 bg-chloe-cyan/5"
              : "border-chloe-elevated/60 text-chloe-ash/50 hover:border-chloe-pink/30 hover:text-chloe-pink"
          )}
        >
          <Bell className="h-3 w-3" />
          {notifyClicked ? "† Notification Set ♰" : "Notify When Available"}
        </button>

        <p className="text-center font-mono text-[10px] text-chloe-ash/60 tracking-wider">
          Liquidity provision locked<span className="text-chloe-blood/30 mx-1">†</span>Patience is a virtue<span className="text-chloe-blood/30 mx-1">♰</span>
        </p>
      </div>
    </div>
  );
}
