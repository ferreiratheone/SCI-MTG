"use client"

import { useState } from "react"
import { useMaterial } from "@/contexts/MaterialContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Download, HistoryIcon, ArrowUp, ArrowDown, Calendar, Filter } from "lucide-react"

export function History() {
  const { history, exportData } = useMaterial()
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [viewingMovement, setViewingMovement] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const filteredHistory = history.filter((movement) => {
    const matchesSearch =
      movement.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.operador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.registro.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDate = !dateFilter || movement.data.includes(dateFilter)

    return matchesSearch && matchesDate
  })

  const openViewDialog = (movement: any) => {
    setViewingMovement(movement)
    setIsViewDialogOpen(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Histórico de Movimentações
          </h1>
          <p className="text-gray-600 text-lg">Visualize todo o histórico de movimentações registradas</p>
        </div>
        <Button onClick={exportData} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por código, material ou operador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="pl-10" />
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Filter className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Movimentações ({filteredHistory.length})</CardTitle>
          <p className="text-gray-600">Histórico completo de todas as movimentações</p>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <HistoryIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {history.length === 0 ? "Nenhuma movimentação registrada" : "Nenhuma movimentação encontrada"}
              </h3>
              <p className="text-gray-500 mb-4">
                {history.length === 0
                  ? "Quando houver movimentações de materiais, elas aparecerão aqui."
                  : "Tente ajustar os filtros de busca."}
              </p>
              {history.length === 0 && (
                <Button onClick={() => (window.location.hash = "entry-exit")}>Registrar Movimentação</Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Código</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Descrição</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Registro</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Operador</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Operação</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((movement) => (
                    <tr
                      key={movement.id}
                      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-gray-50 transition-all duration-200"
                    >
                      <td className="py-3 px-4">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">{movement.codigo}</code>
                      </td>
                      <td className="py-3 px-4 font-medium">{movement.descricao}</td>
                      <td className="py-3 px-4">{movement.registro}</td>
                      <td className="py-3 px-4">{movement.operador}</td>
                      <td className="py-3 px-4 text-gray-600">{movement.data}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={movement.operacao === "saida" ? "destructive" : "default"}
                          className="flex items-center gap-1 w-fit"
                        >
                          {movement.operacao === "saida" ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : (
                            <ArrowDown className="w-3 h-3" />
                          )}
                          {movement.operacao === "saida" ? "Saída" : "Entrada"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm" onClick={() => openViewDialog(movement)}>
                          Detalhes
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Movement Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Movimentação</DialogTitle>
          </DialogHeader>
          {viewingMovement && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
                  <span className="font-semibold text-gray-700">Código:</span>
                  <span className="font-medium">{viewingMovement.codigo}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
                  <span className="font-semibold text-gray-700">Material:</span>
                  <span className="font-medium">{viewingMovement.descricao}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
                  <span className="font-semibold text-gray-700">Registro:</span>
                  <span className="font-medium">{viewingMovement.registro}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
                  <span className="font-semibold text-gray-700">Operador:</span>
                  <span className="font-medium">{viewingMovement.operador}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
                  <span className="font-semibold text-gray-700">Data/Hora:</span>
                  <span className="font-medium">{viewingMovement.data}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
                  <span className="font-semibold text-gray-700">Operação:</span>
                  <Badge variant={viewingMovement.operacao === "saida" ? "destructive" : "default"}>
                    {viewingMovement.operacao === "saida" ? "Saída" : "Entrada"}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsViewDialogOpen(false)}>Fechar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
