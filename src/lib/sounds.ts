// Hi-Tech Click sound system using preloaded MP3 files
// 8 variations for natural feel, split between hover (softer) and click (punchier)

const HOVER_SOUNDS = ["/sounds/click-1.mp3", "/sounds/click-3.mp3", "/sounds/click-5.mp3", "/sounds/click-7.mp3"];
const CLICK_SOUNDS = ["/sounds/click-2.mp3", "/sounds/click-4.mp3", "/sounds/click-6.mp3", "/sounds/click-8.mp3"];

const HOVER_VOLUME = 0.15;
const CLICK_VOLUME = 0.3;

// Audio element pool for overlapping playback
const audioPool: HTMLAudioElement[] = [];
const POOL_SIZE = 6;

function getPooledAudio(): HTMLAudioElement | null {
  // Reuse a finished audio element or create one if pool not full
  let audio = audioPool.find((a) => a.paused || a.ended);
  if (!audio && audioPool.length < POOL_SIZE) {
    audio = new Audio();
    audioPool.push(audio);
  }
  return audio ?? null;
}

function playSound(files: string[], volume: number) {
  try {
    const audio = getPooledAudio();
    if (!audio) return;
    const src = files[Math.floor(Math.random() * files.length)];
    audio.src = src;
    audio.volume = volume;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch {
    // Silently fail if audio not available
  }
}

export function playHoverSound() {
  playSound(HOVER_SOUNDS, HOVER_VOLUME);
}

export function playClickSound() {
  playSound(CLICK_SOUNDS, CLICK_VOLUME);
}

// Preload all sounds so first interaction has no delay
export function preloadSounds() {
  [...HOVER_SOUNDS, ...CLICK_SOUNDS].forEach((src) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = src;
    link.as = "fetch";
    document.head.appendChild(link);
  });
}
