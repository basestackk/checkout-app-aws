"use client"

import { useEffect } from "react"
import { ReactFlowProvider } from "@xyflow/react"
import { SidebarModule } from "@/components/sidebar/sidebar-module"
import { type IFlowState, useFlowStore } from "@/stores/flow-store"
import TablePage from "./table-page"

const DashboardPage = () => {
  const setWorkflow = useFlowStore((s) => s.actions.setWorkflow)

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-dvh p-0">
        <div className="flex grow divide-x divide-card-foreground/10 p-0">
          <SidebarModule />
          <div className="grow bg-card md:bg-transparent">
            <TablePage />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  )
}

export default DashboardPage;  // Ensure this is the default export
