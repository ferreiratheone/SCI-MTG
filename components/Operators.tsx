"use client"

import type React from "react"

import { useState } from "react"
import { useMaterial } from "@/contexts/MaterialContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Users, Eye } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function Operators() {
  const { operators, addOperator, updateOperator, deleteOperator } = useMaterial()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [editingOperator, setEditingOperator] = useState<any>(null)
  const [viewingOperator, setViewingOperator] = useState<any>(null)

  const filteredOperators = operators.filter(
    (operator) =>
      operator.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operator.registro.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddOperator = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    addOperator({
      registro: formData.get("registro") as string,
      nome: formData.get("nome") as string,
      status: formData.get("status") as "ativo" | "inativo",
    })
    setIsAddDialogOpen(false)
    e.currentTarget.reset()
  }

  const handleEditOperator = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    updateOperator(editingOperator.id, {
      registro: formData.get("registro") as string,
      nome: formData.get("nome") as string,
      status: formData.get("status") as "ativo" | "inativo",
    })
    setIsEditDialogOpen(false)
    setEditingOperator(null)
  }

  const openEditDialog = (operator: any) => {
    setEditingOperator(operator)
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (operator: any) => {
    setViewingOperator(operator)
    setIsViewDialogOpen(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Operadores
          </h1>
          <p className="text-gray-600 text-lg">Cadastro e consulta de operadores</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Plus className="w-4 h-4 mr-2" />
              Novo Operador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Operador</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddOperator} className="space-y-4">
              <div>
                <Label htmlFor="registro">Registro *</Label>
                <Input id="registro" name="registro" required />
              </div>
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input id="nome" name="nome" required />
              </div>
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select name="status" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por registro ou nome do operador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Operators Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            Lista de Operadores ({filteredOperators.length})
          </CardTitle>
          <p className="text-gray-600">Gerencie todos os operadores do sistema</p>
        </CardHeader>
        <CardContent>
          {filteredOperators.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {operators.length === 0 ? "Nenhum operador cadastrado" : "Nenhum operador encontrado"}
              </h3>
              <p className="text-gray-500 mb-4">
                {operators.length === 0
                  ? "Comece adicionando seu primeiro operador ao sistema."
                  : "Tente ajustar o termo de busca."}
              </p>
              {operators.length === 0 && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Operador
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Registro</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Materiais em Uso</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOperators.map((operator) => (
                    <tr
                      key={operator.id}
                      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-gray-50 transition-all duration-200"
                    >
                      <td className="py-3 px-4">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">{operator.registro}</code>
                      </td>
                      <td className="py-3 px-4 font-medium">{operator.nome}</td>
                      <td className="py-3 px-4">
                        <Badge variant={operator.status === "ativo" ? "default" : "secondary"}>
                          {operator.status === "ativo" ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {operator.materiaisEmUso > 0 ? (
                          <Badge variant="destructive">{operator.materiaisEmUso} material(is)</Badge>
                        ) : (
                          <span className="text-gray-500">Nenhum</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openViewDialog(operator)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(operator)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o operador "{operator.nome}"?
                                  {operator.materiaisEmUso > 0 && (
                                    <span className="block mt-2 text-red-600 font-medium">
                                      Atenção: Este operador possui materiais em uso e não pode ser excluído.
                                    </span>
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteOperator(operator.id)}
                                  disabled={operator.materiaisEmUso > 0}
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Operador</DialogTitle>
          </DialogHeader>
          {editingOperator && (
            <form onSubmit={handleEditOperator} className="space-y-4">
              <div>
                <Label htmlFor="edit-registro">Registro *</Label>
                <Input id="edit-registro" name="registro" defaultValue={editingOperator.registro} required />
              </div>
              <div>
                <Label htmlFor="edit-nome">Nome Completo *</Label>
                <Input id="edit-nome" name="nome" defaultValue={editingOperator.nome} required />
              </div>
              <div>
                <Label htmlFor="edit-status">Status *</Label>
                <Select name="status" defaultValue={editingOperator.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Operador</DialogTitle>
          </DialogHeader>
          {viewingOperator && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
                  <span className="font-semibold text-gray-700">Registro:</span>
                  <span className="font-medium">{viewingOperator.registro}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
                  <span className="font-semibold text-gray-700">Nome:</span>
                  <span className="font-medium">{viewingOperator.nome}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
                  <span className="font-semibold text-gray-700">Status:</span>
                  <Badge variant={viewingOperator.status === "ativo" ? "default" : "secondary"}>
                    {viewingOperator.status === "ativo" ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
                  <span className="font-semibold text-gray-700">Materiais em Uso:</span>
                  <span className="font-medium">{viewingOperator.materiaisEmUso}</span>
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
