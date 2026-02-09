"use client";

import { useCallback, useSyncExternalStore } from "react";

const BGM_SRC = "/sounds/bgmusic.mp3";
const BGM_VOLUME = 0.2;
const FADE_MS = 600;
const STORAGE_KEY = "chloe-bgm-muted";

// ---- Module-level singleton ----
let audio: HTMLAudioElement | null = null;
let muted = false;
let listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return muted;
}

function fadeVolume(el: HTMLAudioElement, to: number) {
  const from = el.volume;
  const steps = 15;
  const stepMs = FADE_MS / steps;
  const delta = (to - from) / steps;
  let step = 0;
  const id = setInterval(() => {
    step++;
    el.volume = Math.max(0, Math.min(1, from + delta * step));
    if (step >= steps) {
      clearInterval(id);
      el.volume = to;
      if (to === 0) el.pause();
    }
  }, stepMs);
}

/** Call this from a user-gesture handler (e.g. splash screen click) */
export function startBGM() {
  if (!audio) {
    audio = new Audio(BGM_SRC);
    audio.loop = true;
    audio.preload = "auto";
    muted = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "true";
    notify();
  }
  if (muted) return;
  audio.volume = 0;
  audio.play().then(() => fadeVolume(audio!, BGM_VOLUME)).catch(() => {});
}

export function useBGM() {
  const isMuted = useSyncExternalStore(subscribe, getSnapshot, () => false);

  const toggle = useCallback(() => {
    if (!audio) return;
    muted = !muted;
    localStorage.setItem(STORAGE_KEY, String(muted));
    notify();

    if (muted) {
      fadeVolume(audio, 0);
    } else {
      audio.volume = 0;
      audio.play().then(() => fadeVolume(audio!, BGM_VOLUME)).catch(() => {});
    }
  }, []);

  return { isMuted, toggle };
}
