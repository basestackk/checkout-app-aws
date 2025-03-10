import type { ComponentPropsWithoutRef } from "react";
import { useFlowStore } from "@/stores/flow-store"; // Import the store hook
import { cn } from "@/lib/utils";

type SidebarPanelWrapperProps = Readonly<ComponentPropsWithoutRef<"div">>;

export default function SidebarPanelWrapper({
  children,
  className,
  ...props
}: SidebarPanelWrapperProps) {
  const activePanel = useFlowStore((state) => state.workflow.sidebar.active); // Get the active panel

  return (
    <div
      className={cn(
        "flex flex-col w-80 h-full bg-background/60",
        activePanel === "console" ? "h-screen flex" : "",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
