"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { startBGM, resumeBGMOnInteraction } from "@/hooks/use-bgm";

const STORAGE_KEY = "chloe-entered";
const LOAD_DURATION = 900; // ms
const LOAD_INTERVAL = 30;

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [entered, setEntered] = useState(true);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const already = sessionStorage.getItem(STORAGE_KEY);
    if (already) {
      setEntered(true);
      resumeBGMOnInteraction();
      return;
    }
    setEntered(false);
    setVisible(true);

    // Fake loading 0→100
    let current = 0;
    const step = 100 / (LOAD_DURATION / LOAD_INTERVAL);
    intervalRef.current = setInterval(() => {
      current += step + Math.random() * step * 0.5;
      if (current >= 100) {
        current = 100;
        if (intervalRef.current) clearInterval(intervalRef.current);
        setLoaded(true);
      }
      setProgress(Math.min(100, Math.floor(current)));
    }, LOAD_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function handleEnter(withSound: boolean) {
    sessionStorage.setItem(STORAGE_KEY, "1");
    if (withSound) startBGM();
    setFading(true);
    setTimeout(() => {
      setEntered(true);
      setVisible(false);
    }, 700);
  }

  if (entered && !visible) return <>{children}</>;

  return (
    <>
      <div className={entered ? "" : "invisible h-0 overflow-hidden"}>{children}</div>

      {visible && (
        <div
          className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-chloe-void transition-opacity duration-700 ${fading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <div className="crt-overlay" />

          {/* Center content */}
          <div className="relative flex flex-col items-center">
            {/* Logo */}
            <Image
              src="/images/logo.png"
              alt="Chloe"
              width={96}
              height={96}
              className="rounded-full border-2 border-chloe-pink/30 shadow-[0_0_30px_#FF149325] mb-6"
              priority
            />

            {/* CHLOE */}
            <div
              className="glitch-text text-7xl sm:text-9xl font-title uppercase tracking-[0.25em] text-chloe-pink leading-none"
              data-text="CHLOE"
            >
              CHLOE
            </div>

            {/* SHE♰KNOWS */}
            <div className="mt-3 text-2xl sm:text-3xl font-title uppercase tracking-[0.2em] leading-none">
              <span className="gradient-menheera">SHE</span>
              <span className="text-chloe-blood/40 mx-1 text-xl align-middle">&#9776;</span>
              <span className="gradient-menheera">KNOWS</span>
            </div>

            {/* Loading bar */}
            <div className="mt-10 w-64 sm:w-80">
              <div className="relative h-[2px] w-full bg-chloe-elevated/60 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-chloe-pink transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-mono text-[9px] text-chloe-ash/60 tracking-wider">
                  {loaded ? "READY" : "LOADING"}
                </span>
                <span className="font-mono text-[9px] text-chloe-pink/70 tabular-nums">
                  {progress}%
                </span>
              </div>
            </div>

            {/* Enter buttons — appear after loading */}
            <div
              className={`mt-8 flex flex-col items-center gap-3 transition-all duration-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}
            >
              <button
                onClick={() => handleEnter(true)}
                className="group font-mono text-[11px] text-chloe-pink/80 tracking-[0.25em] uppercase border border-chloe-pink/30 px-10 py-3 hover:text-chloe-pink hover:border-chloe-pink/60 hover:bg-chloe-pink/5 hover:shadow-[0_0_25px_#FF149330] transition-all"
              >
                ENTER
              </button>
              <button
                onClick={() => handleEnter(false)}
                className="font-mono text-[8px] text-chloe-ash/40 tracking-wider hover:text-chloe-ash/70 transition-colors"
              >
                enter without sound
              </button>
            </div>
          </div>

          {/* Cookie banner — bottom right */}
          <div className="absolute bottom-6 right-6 max-w-[280px] border border-chloe-elevated/40 bg-chloe-abyss/80 backdrop-blur-sm p-4">
            <p className="font-mono text-[8px] text-chloe-ash/50 leading-relaxed tracking-wide">
              This site uses cookies for session management and preferences.
              By entering, you agree to our use of cookies.
            </p>
          </div>

          {/* Version — bottom left */}
          <div className="absolute bottom-6 left-6">
            <span className="font-mono text-[8px] text-chloe-ash/25 tracking-[0.3em]">v1.0.0</span>
          </div>
        </div>
      )}
    </>
  );
}
