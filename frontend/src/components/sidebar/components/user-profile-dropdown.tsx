"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const menuItems = ["Profile", "Settings", "Logout"];

export function UserProfileDropdown({}: {}) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-foreground rounded-none" // Removed rounded corners
          >
            <span>{"demo@test.com"}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="absolute top-0 right-0 w-48 max-w-xs p-0 mt-1 bg-card text-white z-50 rounded-md">
          {/* Adjusted top position and margin */}
          <Command>
            <CommandList>
              <CommandGroup>
                {menuItems
                  .filter((item) =>
                    item.toLowerCase().includes(inputValue.toLowerCase()),
                  )
                  .map((item) => (
                    <CommandItem
                      key={item}
                      onSelect={() => {
                        setOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", "opacity-0")} />
                      {item}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default UserProfileDropdown;
