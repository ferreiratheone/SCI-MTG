"use client"

import { cn } from "@/lib/utils"
import type { PageType } from "@/app/page"
import { BarChart3, Box, Users, ArrowLeftRight, History } from "lucide-react"

interface SidebarProps {
  currentPage: PageType
  onPageChange: (page: PageType) => void
}

const menuItems = [
  { id: "dashboard" as PageType, label: "Dashboard", icon: BarChart3 },
  { id: "materials" as PageType, label: "Materiais", icon: Box },
  { id: "operators" as PageType, label: "Operadores", icon: Users },
  { id: "entry-exit" as PageType, label: "Entrada/Saída", icon: ArrowLeftRight },
  { id: "history" as PageType, label: "Histórico", icon: History },
]

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <nav className="w-80 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-lg relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700" />

      <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <h2 className="text-xl font-bold tracking-tight relative z-10">Gestão de Materiais</h2>
      </div>

      <ul className="p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id

          return (
            <li key={item.id}>
              <button
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-4 rounded-xl font-medium transition-all duration-200 relative overflow-hidden group",
                  isActive
                    ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-gray-50 hover:text-blue-700 hover:translate-x-1",
                )}
              >
                <div
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-0 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-200 rounded-r",
                    isActive && "w-1",
                    !isActive && "group-hover:w-1",
                  )}
                />

                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive && "scale-110",
                    !isActive && "group-hover:scale-110",
                  )}
                />

                <span className="relative z-10">{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
