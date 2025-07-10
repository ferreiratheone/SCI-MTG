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
import { Plus, Search, Edit, Trash2, Box } from "lucide-react"
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

export function Materials() {
  const { materials, addMaterial, updateMaterial, deleteMaterial } = useMaterial()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<any>(null)

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || material.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddMaterial = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    addMaterial({
      code: formData.get("code") as string,
      description: formData.get("description") as string,
    })
    setIsAddDialogOpen(false)
    e.currentTarget.reset()
  }

  const handleEditMaterial = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    updateMaterial(editingMaterial.id, {
      code: formData.get("code") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as "disponivel" | "em_uso",
    })
    setIsEditDialogOpen(false)
    setEditingMaterial(null)
  }

  const openEditDialog = (material: any) => {
    setEditingMaterial(material)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Materiais
          </h1>
          <p className="text-gray-600 text-lg">Cadastro e consulta de materiais</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Plus className="w-4 h-4 mr-2" />
              Novo Material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Material</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div>
                <Label htmlFor="code">Código *</Label>
                <Input id="code" name="code" required />
              </div>
              <div>
                <Label htmlFor="description">Descrição *</Label>
                <Input id="description" name="description" required />
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

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por código ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="em_uso">Em Uso</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Materials Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            Lista de Materiais ({filteredMaterials.length})
          </CardTitle>
          <p className="text-gray-600">Gerencie todos os materiais do sistema</p>
        </CardHeader>
        <CardContent>
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-12">
              <Box className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {materials.length === 0 ? "Nenhum material cadastrado" : "Nenhum material encontrado"}
              </h3>
              <p className="text-gray-500 mb-4">
                {materials.length === 0
                  ? "Comece adicionando seu primeiro material ao sistema."
                  : "Tente ajustar os filtros de busca."}
              </p>
              {materials.length === 0 && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Material
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Código</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Descrição</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Última Movimentação</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map((material) => (
                    <tr
                      key={material.id}
                      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-gray-50 transition-all duration-200"
                    >
                      <td className="py-3 px-4">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">{material.code}</code>
                      </td>
                      <td className="py-3 px-4 font-medium">{material.description}</td>
                      <td className="py-3 px-4">
                        <Badge variant={material.status === "disponivel" ? "default" : "destructive"}>
                          {material.status === "disponivel" ? "Disponível" : "Em Uso"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{material.lastMovement}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(material)}>
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
                                  Tem certeza que deseja excluir o material "{material.description}"? Esta ação não pode
                                  ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteMaterial(material.id)}>
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
            <DialogTitle>Editar Material</DialogTitle>
          </DialogHeader>
          {editingMaterial && (
            <form onSubmit={handleEditMaterial} className="space-y-4">
              <div>
                <Label htmlFor="edit-code">Código *</Label>
                <Input id="edit-code" name="code" defaultValue={editingMaterial.code} required />
              </div>
              <div>
                <Label htmlFor="edit-description">Descrição *</Label>
                <Input id="edit-description" name="description" defaultValue={editingMaterial.description} required />
              </div>
              <div>
                <Label htmlFor="edit-status">Status *</Label>
                <Select name="status" defaultValue={editingMaterial.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponivel">Disponível</SelectItem>
                    <SelectItem value="em_uso">Em Uso</SelectItem>
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
    </div>
  )
}
