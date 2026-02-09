"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogIn, Wallet, Twitter, Github, Volume2, VolumeX } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { NAV_LINKS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LoginModal } from "@/components/auth/login-modal";
import { useBGM } from "@/hooks/use-bgm";

function shortenAddress(addr: string) {
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { connected, publicKey } = useWallet();
  const { isMuted, toggle: toggleBGM } = useBGM();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-chloe-pink/15 bg-chloe-void/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          {/* Logo - Glitch */}
          <Link href="/" className="group flex items-center gap-2.5">
            <Image
              src="/images/logo.png"
              alt="Chloe"
              width={32}
              height={32}
              className="rounded-full border border-chloe-pink/30 group-hover:border-chloe-pink/60 group-hover:shadow-[0_0_12px_#FF149330] transition-all"
            />
            <span
              className="glitch-text text-xl font-title uppercase tracking-[0.2em] text-chloe-pink"
              data-text="CHLOE"
            >
              CHLOE
            </span>
            <span className="hidden text-[10px] font-mono uppercase tracking-[0.3em] text-chloe-ash sm:inline">
              ✝ agent.sys
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] transition-all duration-200",
                  pathname === link.href
                    ? "text-chloe-pink"
                    : "text-chloe-smoke hover:text-chloe-pink"
                )}
              >
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-2 right-2 h-px bg-chloe-pink shadow-[0_0_8px_#FF1493]" />
                )}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/chloe-code-chan/chloe"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center justify-center h-8 w-8 border border-chloe-pink/30 text-chloe-pink/80 hover:text-chloe-pink hover:border-chloe-pink/60 hover:bg-chloe-pink/10 hover:shadow-[0_0_12px_#FF149325] transition-all"
            >
              <Github className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://x.com/xx_chloechan_xx"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 h-8 px-3 border border-chloe-pink/30 text-chloe-pink/80 hover:text-chloe-pink hover:border-chloe-pink/60 hover:bg-chloe-pink/10 hover:shadow-[0_0_12px_#FF149325] transition-all font-mono text-[10px] tracking-wide"
            >
              <Twitter className="h-3 w-3" />
              @xx_chloechan_xx
            </a>
            <a
              href="https://pump.fun/coin/DWZQTTJf5LTzUY6WdzKK36ku1xXgBFDn2ZsEreCppump"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center h-8 px-3 border border-chloe-pink/40 text-chloe-pink hover:bg-chloe-pink/10 hover:border-chloe-pink hover:shadow-[0_0_12px_#FF149330] transition-all font-mono text-[10px] font-bold tracking-wider uppercase"
            >
              $CHLOE
            </a>
            <button
              onClick={toggleBGM}
              className={cn(
                "flex items-center justify-center h-8 w-8 border transition-all",
                isMuted
                  ? "border-chloe-elevated/60 text-chloe-ash hover:text-chloe-smoke hover:border-chloe-elevated"
                  : "border-chloe-pink/30 text-chloe-pink/70 hover:text-chloe-pink hover:border-chloe-pink/50 hover:shadow-[0_0_10px_#FF149320]"
              )}
              title={isMuted ? "Unmute BGM" : "Mute BGM"}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={() => setLoginOpen(true)}
              className={cn(
                "flex items-center gap-2 border px-4 h-8 font-mono text-xs uppercase tracking-wider transition-all",
                connected
                  ? "border-chloe-cyan/30 text-chloe-cyan hover:bg-chloe-cyan/10 hover:border-chloe-cyan/50"
                  : "border-chloe-pink/40 text-chloe-pink hover:bg-chloe-pink/10 hover:border-chloe-pink hover:shadow-[0_0_15px_#FF149340]"
              )}
            >
              {connected && publicKey ? (
                <>
                  <Wallet className="h-3 w-3" />
                  <span>{shortenAddress(publicKey.toBase58())}</span>
                </>
              ) : (
                <>
                  <LogIn className="h-3 w-3" />
                  <span>Login</span>
                </>
              )}
            </button>

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-chloe-pink hover:bg-chloe-pink/10">
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 border-chloe-pink/10 bg-chloe-void">
                <nav className="mt-8 flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "px-3 py-2.5 font-mono text-xs uppercase tracking-[0.15em] transition-colors",
                        pathname === link.href
                          ? "border-l-2 border-chloe-pink bg-chloe-pink/5 text-chloe-pink"
                          : "text-chloe-smoke hover:text-chloe-pink hover:bg-chloe-pink/5"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <a
                    href="https://github.com/chloe-code-chan/chloe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center gap-2 px-3 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-chloe-smoke hover:text-chloe-pink hover:bg-chloe-pink/5 transition-colors"
                  >
                    <Github className="h-3.5 w-3.5" />
                    GitHub
                  </a>
                  <a
                    href="https://x.com/xx_chloechan_xx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-chloe-smoke hover:text-chloe-pink hover:bg-chloe-pink/5 transition-colors"
                  >
                    <Twitter className="h-3.5 w-3.5" />
                    @xx_chloechan_xx
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
