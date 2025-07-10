"use client"

import { useMaterial } from "@/contexts/MaterialContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Box, ArrowUp, Warehouse, Users, ArrowDown, ArrowLeftRight } from "lucide-react"

export function Dashboard() {
  const { materials, operators, history } = useMaterial()

  const totalMaterials = materials.length
  const materialsInUse = materials.filter((m) => m.status === "em_uso").length
  const materialsAvailable = materials.filter((m) => m.status === "disponivel").length
  const totalOperators = operators.length

  const materialsInUseList = materials.filter((m) => m.status === "em_uso")
  const recentMovements = history.slice(-5).reverse()

  const getOperatorForMaterial = (materialId: number) => {
    const lastMovement = history
      .filter((h) => h.materialId === materialId && h.operacao === "saida")
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0]

    return lastMovement ? operators.find((o) => o.id === lastMovement.operadorId) : null
  }

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 text-lg">Visão geral do sistema de gestão de materiais</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Total Materiais
            </CardTitle>
            <Box className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalMaterials}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Em Uso</CardTitle>
            <ArrowUp className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{materialsInUse}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Em Estoque</CardTitle>
            <Warehouse className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{materialsAvailable}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Operadores</CardTitle>
            <Users className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalOperators}</div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Materiais em Uso</CardTitle>
            <p className="text-gray-600">Materiais atualmente em uso pelos operadores</p>
          </CardHeader>
          <CardContent>
            {materialsInUseList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Box className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">Nenhum material em uso</p>
                <p className="text-sm">Materiais em uso aparecerão aqui</p>
              </div>
            ) : (
              <div className="space-y-3">
                {materialsInUseList.map((material) => {
                  const operator = getOperatorForMaterial(material.id)
                  return (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-white transition-all duration-200"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{material.description}</p>
                        <p className="text-sm text-gray-600">{operator?.nome || "Operador não encontrado"}</p>
                      </div>
                      <Badge variant="destructive">Em Uso</Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Últimas Movimentações</CardTitle>
            <p className="text-gray-600">Movimentações recentes de materiais</p>
          </CardHeader>
          <CardContent>
            {recentMovements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ArrowLeftRight className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">Nenhuma movimentação registrada</p>
                <p className="text-sm">Movimentações recentes aparecerão aqui</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMovements.map((movement) => (
                  <div
                    key={movement.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      {movement.operacao === "saida" ? (
                        <ArrowUp className="w-4 h-4 text-red-600" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-green-600" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{movement.descricao}</p>
                        <p className="text-sm text-gray-600">{movement.operador}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={movement.operacao === "saida" ? "destructive" : "default"}>
                        {movement.operacao === "saida" ? "Saída" : "Entrada"}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{movement.data}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
