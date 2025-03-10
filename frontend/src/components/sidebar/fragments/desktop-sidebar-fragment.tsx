import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import SidebarButtonItem from "../components/sidebar-button-item";
import { useFlowStore } from "@/stores/flow-store";

type DesktopSidebarFragmentProps = Readonly<{
  activePanel: "node-properties" | "available-nodes" | "console" | "none";
  setActivePanel: (
    panel: "node-properties" | "available-nodes" | "console" | "none",
  ) => void;
}>;

export function DesktopSidebarFragment({
  activePanel,
  setActivePanel,
}: DesktopSidebarFragmentProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    if (activePanel === "none") {
      setActivePanel("available-nodes");
    }
  }, [activePanel, setActivePanel]);

  return (
    <div className="relative max-w-sm w-fit flex shrink-0 divide-x divide-card-foreground/10 bg-[#2E3A45]">
      <div
        className={`shrink-0 bg-card p-0 ${
          isCollapsed ? "h-16" : "h-full" // Collapsed state reduces height
        } transition-all`}
      ></div>
      {/* Left Sidebar buttons */}
      <div className="relative max-w-sm w-fit flex shrink-0 divide-x divide-card-foreground/10 bg-[#2E3A45] p-1.5">
        <div className="h-full flex flex-col gap-2">
          <SidebarButtonItem
            active={activePanel === "available-nodes"}
            onClick={() => setActivePanel("available-nodes")}
            className="hover:bg-transparent focus:bg-transparent active:bg-transparent" // Disable hover color change
          >
            <Icon
              icon="mynaui:grid"
              className={`size-5 ${
                activePanel === "available-nodes"
                  ? "text-white"
                  : "text-gray-500"
              } !hover:bg-transparent`}
            />
          </SidebarButtonItem>

          <SidebarButtonItem
            active={activePanel === "node-properties"}
            onClick={() => setActivePanel("node-properties")}
            className="hover:bg-transparent focus:bg-transparent active:bg-transparent" 
          >
            <Icon
              icon="mynaui:layers-three"
              className={`size-5 ${
                activePanel === "node-properties"
                  ? "text-white"
                  : "text-gray-500"
              }`}
            />
          </SidebarButtonItem>

          <SidebarButtonItem
            active={activePanel === "console"}
            onClick={async () => {
            }}
            className="hover:bg-transparent focus:bg-transparent active:bg-transparent" 
          >
            <div className="mx-auto flex items-center justify-center border-2 border-none rounded-full p-1">
              <Icon
                icon="mynaui:play"
                className={`size-10 ${
                  activePanel === "console" ? "text-white" : "text-gray-500"
                }`}
              />
            </div>
          </SidebarButtonItem>

          <SidebarButtonItem
            className="absolute bottom-10 left-1.5 cursor-pointer bg-white rounded-full p-0 shadow-md z-10"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Icon
              icon={isCollapsed ? "mynaui:arrow-right" : "mynaui:arrow-left"}
              className="text-black size-4"
            />
          </SidebarButtonItem>
        </div>
      </div>
      {/* Main sidebar section */}
    
    </div>
  );
}

