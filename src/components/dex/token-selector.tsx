"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { TOKEN_LIST, type TokenInfo } from "@/lib/jupiter";

interface TokenSelectorProps {
  selected: TokenInfo;
  onSelect: (token: TokenInfo) => void;
  excludeMint?: string;
}

export function TokenSelector({
  selected,
  onSelect,
  excludeMint,
}: TokenSelectorProps) {
  const [open, setOpen] = useState(false);

  const filteredTokens = TOKEN_LIST.filter((t) => t.mint !== excludeMint);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-32 justify-between border-chloe-pink/20 bg-chloe-surface text-foreground font-mono hover:bg-chloe-pink/10 hover:border-chloe-pink/40"
        >
          <span className="font-mono font-bold text-xs">{selected.symbol}</span>
          <ChevronDown className="h-3.5 w-3.5 text-chloe-ash" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0 border-chloe-pink/20 bg-chloe-abyss" align="start">
        <Command className="bg-transparent">
          <CommandInput
            placeholder="Search token..."
            className="font-mono text-xs"
          />
          <CommandList>
            <CommandEmpty className="font-mono text-xs text-chloe-ash p-4">
              No token found.
            </CommandEmpty>
            <CommandGroup>
              {filteredTokens.map((token) => (
                <CommandItem
                  key={token.mint}
                  value={token.symbol}
                  onSelect={() => {
                    onSelect(token);
                    setOpen(false);
                  }}
                  className="cursor-pointer font-mono hover:bg-chloe-pink/10"
                >
                  <span className="font-bold text-xs text-foreground">{token.symbol}</span>
                  <span className="ml-2 text-[10px] text-chloe-ash">
                    {token.name}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
