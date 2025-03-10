import type { ComponentPropsWithoutRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SidebarButtonItemProps = Readonly<
  ComponentPropsWithoutRef<"button"> & {
    active?: boolean;
  }
>;

export default function  SidebarButtonItem({
  children,
  className,
  active,
  ...props
}: SidebarButtonItemProps) {
  return (
    <Button
      size={"icon"}
      type="button"
      variant={active ? "ghost" : "ghost"}
      className={cn(
        "size-8 flex items-center justify-center !hover:bg-transparent",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
