"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

export interface Material {
  id: number
  code: string
  description: string
  status: "disponivel" | "em_uso"
  lastMovement: string
}

export interface Operator {
  id: number
  registro: string
  nome: string
  status: "ativo" | "inativo"
  materiaisEmUso: number
}

export interface Movement {
  id: number
  materialId: number
  operadorId: number
  codigo: string
  descricao: string
  registro: string
  operador: string
  data: string
  operacao: "entrada" | "saida"
}

interface MaterialContextType {
  materials: Material[]
  operators: Operator[]
  history: Movement[]
  addMaterial: (material: Omit<Material, "id" | "status" | "lastMovement">) => void
  updateMaterial: (id: number, material: Partial<Material>) => void
  deleteMaterial: (id: number) => void
  addOperator: (operator: Omit<Operator, "id" | "materiaisEmUso">) => void
  updateOperator: (id: number, operator: Partial<Operator>) => void
  deleteOperator: (id: number) => void
  processMovement: (materialId: number, operatorId: number, type: "entrada" | "saida") => void
  exportData: () => void
}

const MaterialContext = createContext<MaterialContextType | undefined>(undefined)

export function MaterialProvider({ children }: { children: ReactNode }) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [operators, setOperators] = useState<Operator[]>([])
  const [history, setHistory] = useState<Movement[]>([])
  const { toast } = useToast()

  // Load data from localStorage on mount
  useEffect(() => {
    const savedMaterials = localStorage.getItem("materialsData")
    const savedOperators = localStorage.getItem("operatorsData")
    const savedHistory = localStorage.getItem("historyData")

    if (savedMaterials) setMaterials(JSON.parse(savedMaterials))
    if (savedOperators) setOperators(JSON.parse(savedOperators))
    if (savedHistory) setHistory(JSON.parse(savedHistory))
  }, [])

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("materialsData", JSON.stringify(materials))
  }, [materials])

  useEffect(() => {
    localStorage.setItem("operatorsData", JSON.stringify(operators))
  }, [operators])

  useEffect(() => {
    localStorage.setItem("historyData", JSON.stringify(history))
  }, [history])

  const addMaterial = (materialData: Omit<Material, "id" | "status" | "lastMovement">) => {
    // Check if code already exists
    if (materials.some((m) => m.code === materialData.code)) {
      toast({
        title: "Erro",
        description: "Código já existe!",
        variant: "destructive",
      })
      return
    }

    const newId = Math.max(...materials.map((m) => m.id), 0) + 1
    const newMaterial: Material = {
      id: newId,
      ...materialData,
      status: "disponivel",
      lastMovement: new Date().toLocaleDateString("pt-BR"),
    }

    setMaterials((prev) => [...prev, newMaterial])
    toast({
      title: "Sucesso",
      description: "Material adicionado com sucesso!",
    })
  }

  const updateMaterial = (id: number, materialData: Partial<Material>) => {
    setMaterials((prev) =>
      prev.map((material) =>
        material.id === id
          ? { ...material, ...materialData, lastMovement: new Date().toLocaleDateString("pt-BR") }
          : material,
      ),
    )
    toast({
      title: "Sucesso",
      description: "Material atualizado com sucesso!",
    })
  }

  const deleteMaterial = (id: number) => {
    setMaterials((prev) => prev.filter((material) => material.id !== id))
    toast({
      title: "Sucesso",
      description: "Material excluído com sucesso!",
    })
  }

  const addOperator = (operatorData: Omit<Operator, "id" | "materiaisEmUso">) => {
    // Check if registro already exists
    if (operators.some((o) => o.registro === operatorData.registro)) {
      toast({
        title: "Erro",
        description: "Registro já existe!",
        variant: "destructive",
      })
      return
    }

    const newId = Math.max(...operators.map((o) => o.id), 0) + 1
    const newOperator: Operator = {
      id: newId,
      ...operatorData,
      nome: operatorData.nome.toUpperCase(),
      materiaisEmUso: 0,
    }

    setOperators((prev) => [...prev, newOperator])
    toast({
      title: "Sucesso",
      description: "Operador adicionado com sucesso!",
    })
  }

  const updateOperator = (id: number, operatorData: Partial<Operator>) => {
    setOperators((prev) =>
      prev.map((operator) =>
        operator.id === id
          ? { ...operator, ...operatorData, nome: operatorData.nome?.toUpperCase() || operator.nome }
          : operator,
      ),
    )
    toast({
      title: "Sucesso",
      description: "Operador atualizado com sucesso!",
    })
  }

  const deleteOperator = (id: number) => {
    const operator = operators.find((o) => o.id === id)
    if (operator && operator.materiaisEmUso > 0) {
      toast({
        title: "Erro",
        description: "Não é possível excluir operador com materiais em uso!",
        variant: "destructive",
      })
      return
    }

    setOperators((prev) => prev.filter((operator) => operator.id !== id))
    toast({
      title: "Sucesso",
      description: "Operador excluído com sucesso!",
    })
  }

  const processMovement = (materialId: number, operadorId: number, type: "entrada" | "saida") => {
    const material = materials.find((m) => m.id === materialId)
    const operator = operators.find((o) => o.id === operadorId)

    if (!material || !operator) {
      toast({
        title: "Erro",
        description: "Material ou operador não encontrado!",
        variant: "destructive",
      })
      return
    }

    // Validations
    if (type === "saida" && material.status === "em_uso") {
      toast({
        title: "Erro",
        description: "Este material já está em uso!",
        variant: "destructive",
      })
      return
    }

    if (type === "entrada" && material.status === "disponivel") {
      toast({
        title: "Erro",
        description: "Este material não está em uso!",
        variant: "destructive",
      })
      return
    }

    // Create movement record
    const newMovement: Movement = {
      id: history.length + 1,
      materialId,
      operadorId,
      codigo: material.code,
      descricao: material.description,
      registro: operator.registro,
      operador: operator.nome,
      data: new Date().toLocaleString("pt-BR"),
      operacao: type,
    }

    setHistory((prev) => [...prev, newMovement])

    // Update material status
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === materialId
          ? {
              ...m,
              status: type === "saida" ? "em_uso" : "disponivel",
              lastMovement: new Date().toLocaleDateString("pt-BR"),
            }
          : m,
      ),
    )

    // Update operator materials count
    setOperators((prev) =>
      prev.map((o) =>
        o.id === operadorId
          ? { ...o, materiaisEmUso: type === "saida" ? o.materiaisEmUso + 1 : Math.max(0, o.materiaisEmUso - 1) }
          : o,
      ),
    )

    toast({
      title: "Sucesso",
      description: `${type === "entrada" ? "Entrada" : "Saída"} registrada com sucesso!`,
    })
  }

  const exportData = () => {
    const data = {
      materials,
      operators,
      history,
      exportDate: new Date().toLocaleString("pt-BR"),
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(dataBlob)
    link.download = `gestao_materiais_${new Date().toISOString().split("T")[0]}.json`
    link.click()

    toast({
      title: "Sucesso",
      description: "Dados exportados com sucesso!",
    })
  }

  return (
    <MaterialContext.Provider
      value={{
        materials,
        operators,
        history,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        addOperator,
        updateOperator,
        deleteOperator,
        processMovement,
        exportData,
      }}
    >
      {children}
    </MaterialContext.Provider>
  )
}

export function useMaterial() {
  const context = useContext(MaterialContext)
  if (context === undefined) {
    throw new Error("useMaterial must be used within a MaterialProvider")
  }
  return context
}
