import Image from "next/image";
import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-chloe-pink/10 bg-chloe-void">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Chloe" width={20} height={20} className="rounded-full border border-chloe-pink/20" />
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-chloe-ash/70">
            <span className="text-chloe-pink/70">CHLOE</span>
            {" "}&#x2720;{" "}
            {new Date().getFullYear()}
            {" "}// all_rights_void
          </p>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="https://github.com/chloe-code-chan/chloe"
            target="_blank"
            rel="noopener noreferrer"
            className="text-chloe-ash/70 transition-all duration-200 hover:text-chloe-pink hover:drop-shadow-[0_0_8px_#FF1493]"
          >
            <Github className="h-4 w-4" />
          </Link>
          <Link
            href="https://x.com/xx_chloechan_xx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-chloe-ash/70 transition-all duration-200 hover:text-chloe-cyan hover:drop-shadow-[0_0_8px_#00FFFF]"
          >
            <Twitter className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
