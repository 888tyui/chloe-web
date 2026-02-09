"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Live2DCanvasProps {
  modelPath?: string;
  width?: number;
  height?: number;
  className?: string;
  onModelReady?: (model: unknown) => void;
  scaleMultiplier?: number;
  offsetY?: number;
}

export default function Live2DCanvas({
  modelPath = "/live2d/chloe/chloe.model3.json",
  className = "",
  onModelReady,
  scaleMultiplier = 0.85,
  offsetY = 0.5,
}: Live2DCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<unknown>(null);
  const modelRef = useRef<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model = modelRef.current as any;
    if (!model || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    const coreModel = model.internalModel?.coreModel;
    if (!coreModel) return;

    try {
      // ParamAngleX/Y feed into physics-driven facial changes (eye squint,
      // mouth warp, eye widening) so we skip them entirely.
      // ParamBodyAngleX is safe at low values — just a subtle body sway.
      coreModel.setParameterValueById?.("ParamBodyAngleX", x * 3);
      coreModel.setParameterValueById?.("ParamEyeBallX", x * 0.8);
      coreModel.setParameterValueById?.("ParamEyeBallY", -y * 0.8);
    } catch {
      // Silently fail if params don't exist
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    let destroyed = false;

    const initLive2D = async () => {
      try {
        const PIXI = await import("pixi.js");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).PIXI = PIXI;

        const { Live2DModel } = await import("pixi-live2d-display/cubism4");

        if (destroyed || !canvasRef.current) return;

        const app = new PIXI.Application({
          backgroundAlpha: 0,
          resizeTo: canvasRef.current,
          antialias: true,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        canvasRef.current.appendChild((app as any).view as HTMLCanvasElement);
        appRef.current = app;

        const model = await Live2DModel.from(modelPath, {
          autoInteract: false,
        });

        if (destroyed) {
          model.destroy();
          return;
        }

        modelRef.current = model;

        // Disable Pixi event system on Live2D model to prevent
        // isInteractive errors from pixi-live2d-display compatibility
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (model as any).eventMode = "none";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (model as any).interactiveChildren = false;

        const scale = Math.min(
          canvasRef.current.clientWidth / model.width,
          canvasRef.current.clientHeight / model.height
        );
        model.scale.set(scale * scaleMultiplier);
        model.anchor.set(0.5, 0.5);
        model.x = canvasRef.current.clientWidth / 2;
        model.y = canvasRef.current.clientHeight * offsetY;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (app.stage as any).addChild(model as any);

        setLoading(false);
        onModelReady?.(model);

        window.addEventListener("mousemove", handleMouseMove);
      } catch (err) {
        console.error("Live2D init error:", err);
        if (!destroyed) {
          setError("Failed to load Live2D model");
          setLoading(false);
        }
      }
    };

    initLive2D();

    return () => {
      destroyed = true;
      window.removeEventListener("mousemove", handleMouseMove);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const app = appRef.current as any;
      if (app) {
        try {
          app.destroy(true, { children: true, texture: true, baseTexture: true });
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [modelPath, onModelReady, handleMouseMove]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const model = modelRef.current as any;
      if (!model || !canvasRef.current) return;

      const scale = Math.min(
        canvasRef.current.clientWidth / model.width,
        canvasRef.current.clientHeight / model.height
      );
      model.scale.set(scale * scaleMultiplier);
      model.x = canvasRef.current.clientWidth / 2;
      model.y = canvasRef.current.clientHeight * offsetY;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center text-muted-foreground ${className}`}
      >
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className={`live2d-canvas relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="h-48 w-48 rounded-full" />
            <p className="animate-pulse text-sm text-chloe-pink">
              Loading CHLOE...
            </p>
          </div>
        </div>
      )}
      <div ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
