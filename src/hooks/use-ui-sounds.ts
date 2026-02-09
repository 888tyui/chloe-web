"use client";

import { useEffect, useRef } from "react";
import { playHoverSound, playClickSound, preloadSounds } from "@/lib/sounds";

// Selectors for interactive elements that should play sounds
const INTERACTIVE_SELECTOR = [
  "button",
  "a[href]",
  "[role='button']",
  "[role='tab']",
  "[role='menuitem']",
  "input[type='submit']",
  ".btn-brutal",
  ".btn-brutal-outline",
  ".collage-card",
  ".pill-badge",
].join(", ");

// Throttle to prevent sound spam
let lastHoverTime = 0;
const HOVER_THROTTLE = 80; // ms between hover sounds

function handleMouseEnter(e: Event) {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.matches(INTERACTIVE_SELECTOR) && !target.closest(INTERACTIVE_SELECTOR)) return;

  const now = Date.now();
  if (now - lastHoverTime < HOVER_THROTTLE) return;
  lastHoverTime = now;

  playHoverSound();
}

function handleClick(e: Event) {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.matches(INTERACTIVE_SELECTOR) && !target.closest(INTERACTIVE_SELECTOR)) return;

  playClickSound();
}

export function useUISounds() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Preload sound files for instant playback
    preloadSounds();

    // Use event delegation on document for all interactive elements
    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("click", handleClick, true);
      initialized.current = false;
    };
  }, []);
}
