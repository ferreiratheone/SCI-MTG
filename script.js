// Dados mockados com localStorage
let materialsData = JSON.parse(localStorage.getItem("materialsData")) || []
let operatorsData = JSON.parse(localStorage.getItem("operatorsData")) || []
const historyData = JSON.parse(localStorage.getItem("historyData")) || []

// Variáveis globais
let currentFilters = {}
let selectedMaterial = null
let selectedOperator = null

// Salvar dados no localStorage
function saveData() {
  localStorage.setItem("materialsData", JSON.stringify(materialsData))
  localStorage.setItem("operatorsData", JSON.stringify(operatorsData))
  localStorage.setItem("historyData", JSON.stringify(historyData))
}

// Navegação
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active")
  })
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.classList.remove("active")
  })
  document.getElementById(pageId).classList.add("active")
  document.querySelector(`[data-page="${pageId}"]`).classList.add("active")
}

// Event listeners para navegação
document.addEventListener("DOMContentLoaded", () => {
  // Menu navigation
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", function () {
      const pageId = this.getAttribute("data-page")
      showPage(pageId)
    })
  })

  // Initialize tables
  loadMaterialsTable()
  loadOperatorsTable()
  loadHistoryTable()

  // Search functionality
  setupSearch()

  // Entry/Exit buttons
  setupEntryExitButtons()

  // Form submissions
  setupForms()

  // Update counters and dashboard
  updateCounters()
  updateDashboard()

  // Show loading for initial setup
  showLoading()
  setTimeout(() => {
    hideLoading()
    showToast("Sistema carregado com sucesso!", "success")
  }, 1000)
})

// ===== LOADING FUNCTIONS =====
function showLoading() {
  document.getElementById("loadingOverlay").style.display = "flex"
}

function hideLoading() {
  document.getElementById("loadingOverlay").style.display = "none"
}

// ===== MODAL FUNCTIONS =====
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block"
  document.body.style.overflow = "hidden"
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
  document.body.style.overflow = "auto"
  // Reset forms
  const form = document.querySelector(`#${modalId} form`)
  if (form) form.reset()
}

// Close modal when clicking outside
window.onclick = (event) => {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none"
    document.body.style.overflow = "auto"
  }
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = "success") {
  const toast = document.getElementById("toast")

  // Add icon based on type
  let icon = ""
  switch (type) {
    case "success":
      icon = '<i class="fas fa-check-circle"></i>'
      break
    case "error":
      icon = '<i class="fas fa-exclamation-circle"></i>'
      break
    case "warning":
      icon = '<i class="fas fa-exclamation-triangle"></i>'
      break
    case "info":
      icon = '<i class="fas fa-info-circle"></i>'
      break
  }

  toast.innerHTML = `${icon} ${message}`
  toast.className = `toast ${type}`
  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 4000)
}

// ===== CONFIRMATION DIALOG =====
function showConfirmDialog(message, onConfirm) {
  const modal = document.createElement("div")
  modal.className = "modal"
  modal.innerHTML = `
    <div class="modal-content">
      <div class="confirm-dialog">
        <h4><i class="fas fa-question-circle"></i> Confirmação</h4>
        <p>${message}</p>
        <div class="modal-actions">
          <button class="btn btn-outline" onclick="this.closest('.modal').remove(); document.body.style.overflow = 'auto'">
            <i class="fas fa-times"></i> Cancelar
          </button>
          <button class="btn btn-primary" onclick="confirmAction(this)">
            <i class="fas fa-check"></i> Confirmar
          </button>
        </div>
      </div>
    </div>
  `

  modal.querySelector(".btn-primary").onclick = () => {
    onConfirm()
    modal.remove()
    document.body.style.overflow = "auto"
  }

  document.body.appendChild(modal)
  modal.style.display = "block"
  document.body.style.overflow = "hidden"
}

// ===== MATERIALS FUNCTIONS =====
function loadMaterialsTable(data = materialsData) {
  const tbody = document.getElementById("materialsTableBody")
  tbody.innerHTML = ""

  if (data.length === 0) {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td colspan="5" style="text-align: center; padding: 48px; color: #64748b;">
        <div class="empty-state-small">
          <i class="fas fa-box"></i>
          <h3 style="margin-bottom: 8px; color: #374151;">Nenhum material cadastrado</h3>
          <p style="margin-bottom: 16px;">Comece adicionando seu primeiro material ao sistema.</p>
          <button class="btn btn-primary" onclick="openModal('modalNovoMaterial')">
            <i class="fas fa-plus"></i>
            Adicionar Material
          </button>
        </div>
      </td>
    `
    tbody.appendChild(row)
    return
  }

  data.forEach((material) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td><code style="background: var(--gray-100); padding: 4px 8px; border-radius: 4px; font-size: 12px;">${material.code}</code></td>
      <td><strong>${material.description}</strong></td>
      <td>
        <span class="badge ${material.status === "disponivel" ? "badge-primary" : "badge-danger"}">
          <i class="fas fa-${material.status === "disponivel" ? "check" : "tools"}"></i>
          ${material.status === "disponivel" ? "Disponível" : "Em Uso"}
        </span>
      </td>
      <td><i class="fas fa-calendar"></i> ${material.lastMovement}</td>
      <td>
        <div class="action-buttons-table">
          <button class="btn btn-outline btn-sm" onclick="editMaterial(${material.id})" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-outline btn-sm" onclick="deleteMaterial(${material.id})" style="color: #dc2626;" title="Excluir">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `
    tbody.appendChild(row)
  })
}

function addMaterial(materialData) {
  const newId = Math.max(...materialsData.map((m) => m.id), 0) + 1
  const newMaterial = {
    id: newId,
    code: materialData.code,
    description: materialData.description,
    status: "disponivel",
    lastMovement: new Date().toLocaleDateString("pt-BR"),
  }

  materialsData.push(newMaterial)
  saveData()
  loadMaterialsTable()
  updateCounters()
  updateDashboard()
  showToast("Material adicionado com sucesso!", "success")
}

function editMaterial(id) {
  const material = materialsData.find((m) => m.id === id)
  if (!material) return

  // Preencher formulário
  document.getElementById("editMaterialId").value = material.id
  document.getElementById("editMaterialCodigo").value = material.code
  document.getElementById("editMaterialDescricao").value = material.description
  document.getElementById("editMaterialStatus").value = material.status

  openModal("modalEditarMaterial")
}

function updateMaterial(id, materialData) {
  const index = materialsData.findIndex((m) => m.id === id)
  if (index !== -1) {
    materialsData[index] = {
      ...materialsData[index],
      ...materialData,
      lastMovement: new Date().toLocaleDateString("pt-BR"),
    }
    saveData()
    loadMaterialsTable()
    updateCounters()
    updateDashboard()
    showToast("Material atualizado com sucesso!", "success")
  }
}

function deleteMaterial(id) {
  const material = materialsData.find((m) => m.id === id)
  if (!material) return

  showConfirmDialog(
    `Tem certeza que deseja excluir o material "<strong>${material.description}</strong>"?<br><small style="color: #dc2626;">Esta ação não pode ser desfeita.</small>`,
    () => {
      materialsData = materialsData.filter((m) => m.id !== id)
      saveData()
      loadMaterialsTable()
      updateCounters()
      updateDashboard()
      showToast("Material excluído com sucesso!", "success")
    },
  )
}

// ===== OPERATORS FUNCTIONS =====
function loadOperatorsTable(data = operatorsData) {
  const tbody = document.getElementById("operatorsTableBody")
  tbody.innerHTML = ""

  if (data.length === 0) {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td colspan="5" style="text-align: center; padding: 48px; color: #64748b;">
        <div class="empty-state-small">
          <i class="fas fa-users"></i>
          <h3 style="margin-bottom: 8px; color: #374151;">Nenhum operador cadastrado</h3>
          <p style="margin-bottom: 16px;">Comece adicionando seu primeiro operador ao sistema.</p>
          <button class="btn btn-primary" onclick="openModal('modalNovoOperador')">
            <i class="fas fa-plus"></i>
            Adicionar Operador
          </button>
        </div>
      </td>
    `
    tbody.appendChild(row)
    return
  }

  data.forEach((operator) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td><code style="background: var(--gray-100); padding: 4px 8px; border-radius: 4px; font-size: 12px;">${operator.registro}</code></td>
      <td><strong>${operator.nome}</strong></td>
      <td>
        <span class="badge ${operator.status === "ativo" ? "badge-primary" : "badge-secondary"}">
          <i class="fas fa-${operator.status === "ativo" ? "check-circle" : "pause-circle"}"></i>
          ${operator.status === "ativo" ? "Ativo" : "Inativo"}
        </span>
      </td>
      <td>
        ${
          operator.materiaisEmUso > 0
            ? `<span class="badge badge-danger"><i class="fas fa-tools"></i> ${operator.materiaisEmUso} material(is)</span>`
            : '<span style="color: #64748b;"><i class="fas fa-check"></i> Nenhum</span>'
        }
      </td>
      <td>
        <div class="action-buttons-table">
          <button class="btn btn-outline btn-sm" onclick="viewOperator(${operator.id})" title="Visualizar">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-outline btn-sm" onclick="editOperator(${operator.id})" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-outline btn-sm" onclick="deleteOperator(${operator.id})" style="color: #dc2626;" title="Excluir">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `
    tbody.appendChild(row)
  })
}

function addOperator(operatorData) {
  const newId = Math.max(...operatorsData.map((o) => o.id), 0) + 1
  const newOperator = {
    id: newId,
    ...operatorData,
    materiaisEmUso: 0,
  }

  operatorsData.push(newOperator)
  saveData()
  loadOperatorsTable()
  updateCounters()
  updateDashboard()
  showToast("Operador adicionado com sucesso!", "success")
}

function editOperator(id) {
  const operator = operatorsData.find((o) => o.id === id)
  if (!operator) return

  document.getElementById("editOperadorId").value = operator.id
  document.getElementById("editOperadorRegistro").value = operator.registro
  document.getElementById("editOperadorNome").value = operator.nome
  document.getElementById("editOperadorStatus").value = operator.status

  openModal("modalEditarOperador")
}

function updateOperator(id, operatorData) {
  const index = operatorsData.findIndex((o) => o.id === id)
  if (index !== -1) {
    operatorsData[index] = {
      ...operatorsData[index],
      ...operatorData,
    }
    saveData()
    loadOperatorsTable()
    updateCounters()
    updateDashboard()
    showToast("Operador atualizado com sucesso!", "success")
  }
}

function deleteOperator(id) {
  const operator = operatorsData.find((o) => o.id === id)
  if (!operator) return

  if (operator.materiaisEmUso > 0) {
    showToast("Não é possível excluir operador com materiais em uso!", "error")
    return
  }

  showConfirmDialog(
    `Tem certeza que deseja excluir o operador "<strong>${operator.nome}</strong>"?<br><small style="color: #dc2626;">Esta ação não pode ser desfeita.</small>`,
    () => {
      operatorsData = operatorsData.filter((o) => o.id !== id)
      saveData()
      loadOperatorsTable()
      updateCounters()
      updateDashboard()
      showToast("Operador excluído com sucesso!", "success")
    },
  )
}

function viewOperator(id) {
  const operator = operatorsData.find((o) => o.id === id)
  if (!operator) return

  const materialsInUse = historyData
    .filter((h) => h.operadorId === id && h.operacao === "saida")
    .filter(
      (h) => !historyData.some((h2) => h2.materialId === h.materialId && h2.operacao === "entrada" && h2.data > h.data),
    )

  const content = `
    <div class="details-grid">
      <div class="detail-item">
        <span class="detail-label"><i class="fas fa-id-card"></i> Registro:</span>
        <span class="detail-value">${operator.registro}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label"><i class="fas fa-user"></i> Nome:</span>
        <span class="detail-value">${operator.nome}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label"><i class="fas fa-toggle-on"></i> Status:</span>
        <span class="detail-value">
          <span class="badge ${operator.status === "ativo" ? "badge-primary" : "badge-secondary"}">
            <i class="fas fa-${operator.status === "ativo" ? "check-circle" : "pause-circle"}"></i>
            ${operator.status === "ativo" ? "Ativo" : "Inativo"}
          </span>
        </span>
      </div>
      <div class="detail-item">
        <span class="detail-label"><i class="fas fa-tools"></i> Materiais em Uso:</span>
        <span class="detail-value">${operator.materiaisEmUso}</span>
      </div>
    </div>
  `

  document.getElementById("detalhesOperadorContent").innerHTML = content
  openModal("modalDetalhesOperador")
}

// ===== SEARCH FUNCTIONS =====
function setupSearch() {
  const materialSearch = document.getElementById("materialSearch")
  if (materialSearch) {
    materialSearch.addEventListener("input", function () {
      filterMaterials(this.value)
    })
  }

  const operatorSearch = document.getElementById("operatorSearch")
  if (operatorSearch) {
    operatorSearch.addEventListener("input", function () {
      filterOperators(this.value)
    })
  }

  // Entry/Exit search with autocomplete
  setupEntryExitSearch()
}

function filterMaterials(searchTerm) {
  let filtered = materialsData.filter(
    (material) =>
      material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Apply additional filters
  if (currentFilters.status) {
    filtered = filtered.filter((m) => m.status === currentFilters.status)
  }

  loadMaterialsTable(filtered)
  document.getElementById("materialCount").textContent = filtered.length
}

function filterOperators(searchTerm) {
  const filtered = operatorsData.filter(
    (operator) =>
      operator.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operator.registro.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  loadOperatorsTable(filtered)
  document.getElementById("operatorCount").textContent = filtered.length
}

// ===== ENTRY/EXIT FUNCTIONS =====
function setupEntryExitButtons() {
  const entradaBtn = document.getElementById("entradaBtn")
  const saidaBtn = document.getElementById("saidaBtn")

  if (entradaBtn) {
    entradaBtn.addEventListener("click", () => {
      processMovement("entrada")
    })
  }

  if (saidaBtn) {
    saidaBtn.addEventListener("click", () => {
      processMovement("saida")
    })
  }
}

function setupEntryExitSearch() {
  const materialSearchEntry = document.getElementById("materialSearchEntry")
  const operatorSearchEntry = document.getElementById("operatorSearchEntry")

  if (materialSearchEntry) {
    materialSearchEntry.addEventListener("input", function () {
      showMaterialSuggestions(this.value, this)
    })
  }

  if (operatorSearchEntry) {
    operatorSearchEntry.addEventListener("input", function () {
      showOperatorSuggestions(this.value, this)
    })
  }
}

function showMaterialSuggestions(searchTerm, inputElement) {
  if (searchTerm.length < 2) {
    clearSuggestions(inputElement)
    return
  }

  const suggestions = materialsData
    .filter(
      (m) =>
        m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.code.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .slice(0, 5)

  // Remove existing suggestions
  clearSuggestions(inputElement)

  if (suggestions.length === 0) return

  const resultsDiv = document.createElement("div")
  resultsDiv.className = "search-results"

  suggestions.forEach((material) => {
    const item = document.createElement("div")
    item.className = "search-result-item"
    item.innerHTML = `
      <strong><i class="fas fa-barcode"></i> ${material.code}</strong><br>
      <small><i class="fas fa-tag"></i> ${material.description}</small>
      <small style="float: right;">
        <span class="badge ${material.status === "disponivel" ? "badge-primary" : "badge-danger"}">
          ${material.status === "disponivel" ? "Disponível" : "Em Uso"}
        </span>
      </small>
    `
    item.onclick = () => {
      inputElement.value = `${material.code} - ${material.description}`
      selectedMaterial = material
      clearSuggestions(inputElement)
    }
    resultsDiv.appendChild(item)
  })

  inputElement.parentNode.style.position = "relative"
  inputElement.parentNode.appendChild(resultsDiv)
}

function showOperatorSuggestions(searchTerm, inputElement) {
  if (searchTerm.length < 2) {
    clearSuggestions(inputElement)
    return
  }

  const suggestions = operatorsData
    .filter(
      (o) =>
        o.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.registro.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((o) => o.status === "ativo")
    .slice(0, 5)

  // Remove existing suggestions
  clearSuggestions(inputElement)

  if (suggestions.length === 0) return

  const resultsDiv = document.createElement("div")
  resultsDiv.className = "search-results"

  suggestions.forEach((operator) => {
    const item = document.createElement("div")
    item.className = "search-result-item"
    item.innerHTML = `
      <strong><i class="fas fa-id-card"></i> ${operator.registro}</strong><br>
      <small><i class="fas fa-user"></i> ${operator.nome}</small>
      <small style="float: right;">
        <span class="badge badge-primary">
          <i class="fas fa-check-circle"></i> Ativo
        </span>
      </small>
    `
    item.onclick = () => {
      inputElement.value = `${operator.registro} - ${operator.nome}`
      selectedOperator = operator
      clearSuggestions(inputElement)
    }
    resultsDiv.appendChild(item)
  })

  inputElement.parentNode.style.position = "relative"
  inputElement.parentNode.appendChild(resultsDiv)
}

function clearSuggestions(inputElement) {
  const existingSuggestions = inputElement.parentNode.querySelector(".search-results")
  if (existingSuggestions) {
    existingSuggestions.remove()
  }
}

function processMovement(type) {
  if (!selectedMaterial || !selectedOperator) {
    showToast("Por favor, selecione um material e um operador válidos.", "error")
    return
  }

  // Validations
  if (type === "saida" && selectedMaterial.status === "em_uso") {
    showToast("Este material já está em uso!", "error")
    return
  }

  if (type === "entrada" && selectedMaterial.status === "disponivel") {
    showToast("Este material não está em uso!", "error")
    return
  }

  // Show loading
  const button = document.getElementById(type === "entrada" ? "entradaBtn" : "saidaBtn")
  button.classList.add("loading")
  button.disabled = true

  setTimeout(() => {
    // Create movement record
    const movement = {
      id: historyData.length + 1,
      materialId: selectedMaterial.id,
      operadorId: selectedOperator.id,
      codigo: selectedMaterial.code,
      descricao: selectedMaterial.description,
      registro: selectedOperator.registro,
      operador: selectedOperator.nome,
      data: new Date().toLocaleString("pt-BR"),
      operacao: type,
    }

    historyData.push(movement)

    // Update material status
    const materialIndex = materialsData.findIndex((m) => m.id === selectedMaterial.id)
    if (materialIndex !== -1) {
      materialsData[materialIndex].status = type === "saida" ? "em_uso" : "disponivel"
      materialsData[materialIndex].lastMovement = new Date().toLocaleDateString("pt-BR")
    }

    // Update operator materials count
    const operatorIndex = operatorsData.findIndex((o) => o.id === selectedOperator.id)
    if (operatorIndex !== -1) {
      if (type === "saida") {
        operatorsData[operatorIndex].materiaisEmUso++
      } else {
        operatorsData[operatorIndex].materiaisEmUso = Math.max(0, operatorsData[operatorIndex].materiaisEmUso - 1)
      }
    }

    saveData()
    loadMaterialsTable()
    loadOperatorsTable()
    loadHistoryTable()
    updateCounters()
    updateDashboard()

    // Clear fields
    document.getElementById("materialSearchEntry").value = ""
    document.getElementById("operatorSearchEntry").value = ""
    selectedMaterial = null
    selectedOperator = null

    // Remove loading
    button.classList.remove("loading")
    button.disabled = false

    showToast(`${type === "entrada" ? "Entrada" : "Saída"} registrada com sucesso!`, "success")

    // Show history table if it was empty
    if (historyData.length > 0) {
      document.getElementById("emptyHistory").style.display = "none"
      document.getElementById("historyTable").style.display = "block"
    }
  }, 1000)
}

// ===== HISTORY FUNCTIONS =====
function loadHistoryTable() {
  const tbody = document.getElementById("historyTableBody")
  if (!tbody) return

  tbody.innerHTML = ""

  historyData.forEach((movement) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td><code style="background: var(--gray-100); padding: 4px 8px; border-radius: 4px; font-size: 12px;">${movement.codigo}</code></td>
      <td><strong>${movement.descricao}</strong></td>
      <td>${movement.registro}</td>
      <td>${movement.operador}</td>
      <td><i class="fas fa-calendar"></i> ${movement.data}</td>
      <td>
        <span class="badge ${movement.operacao === "saida" ? "badge-danger" : "badge-success"}">
          <i class="fas fa-arrow-${movement.operacao === "saida" ? "up" : "down"}"></i>
          ${movement.operacao === "saida" ? "Saída" : "Entrada"}
        </span>
      </td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="viewMovement(${movement.id})">
          <i class="fas fa-eye"></i> Detalhes
        </button>
      </td>
    `
    tbody.appendChild(row)
  })
}

function viewMovement(id) {
  const movement = historyData.find((m) => m.id === id)
  if (!movement) return

  const content = `
    <div class="details-grid">
      <div class="detail-item">
        <span class="detail-label"><i class="fas fa-barcode"></i> Código:</span>
        <span class="detail-value">${movement.codigo}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label"><i class="fas fa-tag"></i> Material:</span>
        <span class="detail-value">${movement.descricao}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label"><i class="fas fa-id-card"></i> Registro:</span>
        <span class="detail-value">${movement.registro}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label"><i class="fas fa-user"></i> Operador:</span>
        <span class="detail-value">${movement.operador}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label"><i class="fas fa-calendar"></i> Data/Hora:</span>
        <span class="detail-value">${movement.data}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label"><i class="fas fa-exchange-alt"></i> Operação:</span>
        <span class="detail-value">
          <span class="badge ${movement.operacao === "saida" ? "badge-danger" : "badge-success"}">
            <i class="fas fa-arrow-${movement.operacao === "saida" ? "up" : "down"}"></i>
            ${movement.operacao === "saida" ? "Saída" : "Entrada"}
          </span>
        </span>
      </div>
    </div>
  `

  document.getElementById("detalhesMovimentacaoContent").innerHTML = content
  openModal("modalDetalhesMovimentacao")
}

// ===== FORM SETUP =====
function setupForms() {
  // Novo Material
  document.getElementById("formNovoMaterial").addEventListener("submit", (e) => {
    e.preventDefault()
    const materialData = {
      code: document.getElementById("materialCodigo").value.trim(),
      description: document.getElementById("materialDescricao").value.trim(),
    }

    // Check if code already exists
    if (materialsData.some((m) => m.code === materialData.code)) {
      showToast("Código já existe!", "error")
      return
    }

    addMaterial(materialData)
    closeModal("modalNovoMaterial")
  })

  // Editar Material
  document.getElementById("formEditarMaterial").addEventListener("submit", (e) => {
    e.preventDefault()
    const id = Number.parseInt(document.getElementById("editMaterialId").value)
    const materialData = {
      code: document.getElementById("editMaterialCodigo").value.trim(),
      description: document.getElementById("editMaterialDescricao").value.trim(),
      status: document.getElementById("editMaterialStatus").value,
    }

    updateMaterial(id, materialData)
    closeModal("modalEditarMaterial")
  })

  // Novo Operador
  document.getElementById("formNovoOperador").addEventListener("submit", (e) => {
    e.preventDefault()
    const operatorData = {
      registro: document.getElementById("operadorRegistro").value.trim(),
      nome: document.getElementById("operadorNome").value.trim().toUpperCase(),
      status: document.getElementById("operadorStatus").value,
    }

    // Check if registro already exists
    if (operatorsData.some((o) => o.registro === operatorData.registro)) {
      showToast("Registro já existe!", "error")
      return
    }

    addOperator(operatorData)
    closeModal("modalNovoOperador")
  })

  // Editar Operador
  document.getElementById("formEditarOperador").addEventListener("submit", (e) => {
    e.preventDefault()
    const id = Number.parseInt(document.getElementById("editOperadorId").value)
    const operatorData = {
      registro: document.getElementById("editOperadorRegistro").value.trim(),
      nome: document.getElementById("editOperadorNome").value.trim().toUpperCase(),
      status: document.getElementById("editOperadorStatus").value,
    }

    updateOperator(id, operatorData)
    closeModal("modalEditarOperador")
  })

  // Filtros
  document.getElementById("formFiltros").addEventListener("submit", (e) => {
    e.preventDefault()
    currentFilters = {
      status: document.getElementById("filtroStatus").value,
      dateStart: document.getElementById("filtroDataInicio").value,
      dateEnd: document.getElementById("filtroDataFim").value,
    }
    applyFilters()
    closeModal("modalFiltros")
    showToast("Filtros aplicados!", "info")
  })
}

function applyFilters() {
  const searchTerm = document.getElementById("materialSearch").value
  filterMaterials(searchTerm)
}

function limparFiltros() {
  currentFilters = {}
  document.getElementById("formFiltros").reset()
  loadMaterialsTable()
  document.getElementById("materialCount").textContent = materialsData.length
  showToast("Filtros limpos!", "info")
}

// ===== EXPORT FUNCTION =====
function exportarDados() {
  showLoading()

  setTimeout(() => {
    const data = {
      materials: materialsData,
      operators: operatorsData,
      history: historyData,
      exportDate: new Date().toLocaleString("pt-BR"),
      version: "1.0.0",
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(dataBlob)
    link.download = `gestao_materiais_${new Date().toISOString().split("T")[0]}.json`
    link.click()

    hideLoading()
    showToast("Dados exportados com sucesso!", "success")
  }, 1000)
}

// ===== UPDATE COUNTERS =====
function updateCounters() {
  const totalMaterials = materialsData.length
  const materialsInUse = materialsData.filter((m) => m.status === "em_uso").length
  const materialsAvailable = materialsData.filter((m) => m.status === "disponivel").length
  const totalOperators = operatorsData.length

  // Update dashboard stats
  document.getElementById("totalMaterials").textContent = totalMaterials
  document.getElementById("materialsInUse").textContent = materialsInUse
  document.getElementById("materialsAvailable").textContent = materialsAvailable
  document.getElementById("totalOperators").textContent = totalOperators

  // Update page counters
  const materialCount = document.getElementById("materialCount")
  if (materialCount) materialCount.textContent = totalMaterials

  const operatorCount = document.getElementById("operatorCount")
  if (operatorCount) operatorCount.textContent = totalOperators

  const historyCount = document.getElementById("historyCount")
  if (historyCount) historyCount.textContent = historyData.length
}

// ===== UPDATE DASHBOARD =====
function updateDashboard() {
  // Update materials in use
  const materialsInUse = materialsData.filter((m) => m.status === "em_uso")
  const materialsInUseContent = document.getElementById("materialsInUseContent")

  if (materialsInUse.length === 0) {
    materialsInUseContent.innerHTML = `
      <div class="empty-state-small">
        <i class="fas fa-box"></i>
        <p>Nenhum material em uso</p>
        <small>Materiais em uso aparecerão aqui</small>
      </div>
    `
  } else {
    materialsInUseContent.innerHTML = materialsInUse
      .map((material) => {
        const operator = operatorsData.find((o) => {
          // Find operator who has this material
          const lastMovement = historyData
            .filter((h) => h.materialId === material.id && h.operacao === "saida")
            .sort((a, b) => new Date(b.data) - new Date(a.data))[0]
          return lastMovement && lastMovement.operadorId === o.id
        })

        return `
        <div class="material-item">
          <div class="material-info">
            <strong><i class="fas fa-box"></i> ${material.description}</strong>
            <small><i class="fas fa-user"></i> ${operator ? operator.nome : "Operador não encontrado"}</small>
          </div>
          <span class="badge badge-danger">
            <i class="fas fa-tools"></i> Em Uso
          </span>
        </div>
      `
      })
      .join("")
  }

  // Update recent movements
  const recentMovements = historyData.slice(-5).reverse()
  const recentMovementsContent = document.getElementById("recentMovementsContent")

  if (recentMovements.length === 0) {
    recentMovementsContent.innerHTML = `
      <div class="empty-state-small">
        <i class="fas fa-history"></i>
        <p>Nenhuma movimentação registrada</p>
        <small>Movimentações recentes aparecerão aqui</small>
      </div>
    `
  } else {
    recentMovementsContent.innerHTML = recentMovements
      .map(
        (movement) => `
      <div class="movement-item">
        <div class="movement-info">
          <i class="fas fa-arrow-${movement.operacao === "saida" ? "up" : "down"} ${
            movement.operacao === "saida" ? "text-red" : "text-green"
          }"></i>
          <div>
            <strong>${movement.descricao}</strong>
            <small><i class="fas fa-user"></i> ${movement.operador}</small>
          </div>
        </div>
        <div class="movement-meta">
          <span class="badge ${movement.operacao === "saida" ? "badge-danger" : "badge-success"}">
            <i class="fas fa-arrow-${movement.operacao === "saida" ? "up" : "down"}"></i>
            ${movement.operacao === "saida" ? "Saída" : "Entrada"}
          </span>
          <small><i class="fas fa-calendar"></i> ${movement.data}</small>
        </div>
      </div>
    `,
      )
      .join("")
  }
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener("keydown", (e) => {
  // ESC to close modals
  if (e.key === "Escape") {
    const openModal = document.querySelector(".modal[style*='block']")
    if (openModal) {
      openModal.style.display = "none"
      document.body.style.overflow = "auto"
    }
  }

  // Ctrl+N for new material (only on materials page)
  if (e.ctrlKey && e.key === "n" && document.getElementById("materiais").classList.contains("active")) {
    e.preventDefault()
    openModal("modalNovoMaterial")
  }

  // Ctrl+E for export (only on history page)
  if (e.ctrlKey && e.key === "e" && document.getElementById("historico").classList.contains("active")) {
    e.preventDefault()
    exportarDados()
  }
})

// ===== AUTO SAVE =====
setInterval(() => {
  if (materialsData.length > 0 || operatorsData.length > 0 || historyData.length > 0) {
    saveData()
  }
}, 30000) // Auto save every 30 seconds

// ===== PERFORMANCE MONITORING =====
window.addEventListener("load", () => {
  const loadTime = performance.now()
  console.log(`Sistema carregado em ${Math.round(loadTime)}ms`)
})
