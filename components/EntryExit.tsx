"use client"

import { useState } from "react"
import { useMaterial } from "@/contexts/MaterialContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, ArrowDown, ArrowUp, Info } from "lucide-react"

export function EntryExit() {
  const { materials, operators, processMovement } = useMaterial()
  const [materialSearch, setMaterialSearch] = useState("")
  const [operatorSearch, setOperatorSearch] = useState("")
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null)
  const [selectedOperator, setSelectedOperator] = useState<any>(null)
  const [showMaterialSuggestions, setShowMaterialSuggestions] = useState(false)
  const [showOperatorSuggestions, setShowOperatorSuggestions] = useState(false)

  const materialSuggestions = materials
    .filter(
      (m) =>
        m.description.toLowerCase().includes(materialSearch.toLowerCase()) ||
        m.code.toLowerCase().includes(materialSearch.toLowerCase()),
    )
    .slice(0, 5)

  const operatorSuggestions = operators
    .filter(
      (o) =>
        o.nome.toLowerCase().includes(operatorSearch.toLowerCase()) ||
        o.registro.toLowerCase().includes(operatorSearch.toLowerCase()),
    )
    .filter((o) => o.status === "ativo")
    .slice(0, 5)

  const handleMaterialSelect = (material: any) => {
    setSelectedMaterial(material)
    setMaterialSearch(`${material.code} - ${material.description}`)
    setShowMaterialSuggestions(false)
  }

  const handleOperatorSelect = (operator: any) => {
    setSelectedOperator(operator)
    setOperatorSearch(`${operator.registro} - ${operator.nome}`)
    setShowOperatorSuggestions(false)
  }

  const handleMovement = (type: "entrada" | "saida") => {
    if (!selectedMaterial || !selectedOperator) {
      return
    }

    processMovement(selectedMaterial.id, selectedOperator.id, type)

    // Clear selections
    setMaterialSearch("")
    setOperatorSearch("")
    setSelectedMaterial(null)
    setSelectedOperator(null)
  }

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Controle de Entrada/Saída
        </h1>
        <p className="text-gray-600 text-lg">Registre a movimentação de materiais</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Buscar Material ou Operador</CardTitle>
              <p className="text-gray-600">Digite o código do material ou nome do operador</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Código ou Nome do Material</Label>
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Ex: 1.1.17.001.001 ou Plástico Magnético"
                      value={materialSearch}
                      onChange={(e) => {
                        setMaterialSearch(e.target.value)
                        setShowMaterialSuggestions(e.target.value.length >= 2)
                        if (e.target.value.length < 2) setSelectedMaterial(null)
                      }}
                      className="pl-10"
                    />
                  </div>
                  {showMaterialSuggestions && materialSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                      {materialSuggestions.map((material) => (
                        <div
                          key={material.id}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleMaterialSelect(material)}
                        >
                          <div className="font-semibold">{material.code}</div>
                          <div className="text-sm text-gray-600">{material.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>Nome ou Registro do Operador</Label>
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Ex: Fernando Martins ou 107"
                      value={operatorSearch}
                      onChange={(e) => {
                        setOperatorSearch(e.target.value)
                        setShowOperatorSuggestions(e.target.value.length >= 2)
                        if (e.target.value.length < 2) setSelectedOperator(null)
                      }}
                      className="pl-10"
                    />
                  </div>
                  {showOperatorSuggestions && operatorSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                      {operatorSuggestions.map((operator) => (
                        <div
                          key={operator.id}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleOperatorSelect(operator)}
                        >
                          <div className="font-semibold">{operator.registro}</div>
                          <div className="text-sm text-gray-600">{operator.nome}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => handleMovement("entrada")}
              disabled={!selectedMaterial || !selectedOperator}
              className="h-24 flex-col gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <ArrowDown className="w-6 h-6" />
              ENTRADA
            </Button>
            <Button
              onClick={() => handleMovement("saida")}
              disabled={!selectedMaterial || !selectedOperator}
              className="h-24 flex-col gap-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
            >
              <ArrowUp className="w-6 h-6" />
              SAÍDA
            </Button>
          </div>
        </div>

        <div>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <Info className="w-5 h-5" />
                Informações
              </CardTitle>
              <p className="text-gray-600">Instruções para uso do sistema</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-800 mb-2">Como registrar uma saída:</h4>
                <ol className="text-sm text-blue-700 space-y-1 ml-4">
                  <li>1. Busque o material pelo código ou descrição</li>
                  <li>2. Busque o operador pelo nome ou registro</li>
                  <li>3. Clique no botão "SAÍDA" para registrar</li>
                </ol>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-800 mb-2">Como registrar uma entrada:</h4>
                <ol className="text-sm text-green-700 space-y-1 ml-4">
                  <li>1. Busque o material que está sendo devolvido</li>
                  <li>2. Confirme o operador que está devolvendo</li>
                  <li>3. Clique no botão "ENTRADA" para registrar</li>
                </ol>
              </div>

              <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border-l-4 border-yellow-500">
                <h4 className="font-semibold text-yellow-800 mb-2">Dicas importantes:</h4>
                <ul className="text-sm text-yellow-700 space-y-1 ml-4">
                  <li>• Verifique sempre os dados antes de confirmar</li>
                  <li>• Materiais em uso não podem ter nova saída</li>
                  <li>• Todas as movimentações são registradas no histórico</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
