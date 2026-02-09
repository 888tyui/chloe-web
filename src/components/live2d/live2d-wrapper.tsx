"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const Live2DCanvas = dynamic(() => import("./live2d-canvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-48 w-48 rounded-full" />
        <p className="animate-pulse text-sm text-chloe-pink">
          Loading CHLOE...
        </p>
      </div>
    </div>
  ),
});

interface Live2DWrapperProps {
  className?: string;
  onModelReady?: (model: unknown) => void;
  scaleMultiplier?: number;
  offsetY?: number;
}

export function Live2DWrapper({ className, onModelReady, scaleMultiplier, offsetY }: Live2DWrapperProps) {
  return (
    <Live2DCanvas
      className={className}
      onModelReady={onModelReady}
      scaleMultiplier={scaleMultiplier}
      offsetY={offsetY}
    />
  );
}
