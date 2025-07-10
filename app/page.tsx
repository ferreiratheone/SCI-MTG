"use client"

import { MaterialProvider } from "@/contexts/MaterialContext"
import { Sidebar } from "@/components/Sidebar"
import { Dashboard } from "@/components/Dashboard"
import { Materials } from "@/components/Materials"
import { Operators } from "@/components/Operators"
import { EntryExit } from "@/components/EntryExit"
import { History } from "@/components/History"
import { Toaster } from "@/components/ui/toaster"
import { useState } from "react"

export type PageType = "dashboard" | "materials" | "operators" | "entry-exit" | "history"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard")

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "materials":
        return <Materials />
      case "operators":
        return <Operators />
      case "entry-exit":
        return <EntryExit />
      case "history":
        return <History />
      default:
        return <Dashboard />
    }
  }

  return (
    <MaterialProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="flex-1 p-8 overflow-y-auto">{renderPage()}</main>
      </div>
      <Toaster />
    </MaterialProvider>
  )
}
