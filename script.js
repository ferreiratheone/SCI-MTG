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
})

// ===== MODAL FUNCTIONS =====
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block"
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
  // Reset forms
  const form = document.querySelector(`#${modalId} form`)
  if (form) form.reset()
}

// Close modal when clicking outside
window.onclick = (event) => {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none"
  }
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = "success") {
  const toast = document.getElementById("toast")
  toast.textContent = message
  toast.className = `toast ${type}`
  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}

// ===== CONFIRMATION DIALOG =====
function showConfirmDialog(message, onConfirm) {
  const modal = document.createElement("div")
  modal.className = "modal"
  modal.innerHTML = `
    <div class="modal-content">
      <div class="confirm-dialog">
        <h4>Confirmação</h4>
        <p>${message}</p>
        <div class="modal-actions">
          <button class="btn btn-outline" onclick="this.closest('.modal').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="confirmAction(this)">Confirmar</button>
        </div>
      </div>
    </div>
  `

  modal.querySelector(".btn-primary").onclick = () => {
    onConfirm()
    modal.remove()
  }

  document.body.appendChild(modal)
  modal.style.display = "block"
}

// ===== MATERIALS FUNCTIONS =====
function loadMaterialsTable(data = materialsData) {
  const tbody = document.getElementById("materialsTableBody")
  tbody.innerHTML = ""

  if (data.length === 0) {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td colspan="6" style="text-align: center; padding: 48px; color: #64748b;">
        <i class="fas fa-box" style="font-size: 48px; margin-bottom: 16px; display: block; color: #9ca3af;"></i>
        <h3 style="margin-bottom: 8px; color: #374151;">Nenhum material cadastrado</h3>
        <p style="margin-bottom: 16px;">Comece adicionando seu primeiro material ao sistema.</p>
        <button class="btn btn-primary" onclick="openModal('modalNovoMaterial')">
          <i class="fas fa-plus"></i>
          Adicionar Material
        </button>
      </td>
    `
    tbody.appendChild(row)
    return
  }

  data.forEach((material) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td><code>${material.code}</code></td>
      <td>${material.description}</td>
      <td>
        <span class="badge ${material.status === "disponivel" ? "badge-primary" : "badge-danger"}">
          ${material.status === "disponivel" ? "Disponível" : "Em Uso"}
        </span>
      </td>
      <td>${material.lastMovement}</td>
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
  showToast("Material adicionado com sucesso!")
}

function editMaterial(id) {
  const material = materialsData.find((m) => m.id === id)
  if (!material) return

  // Preencher formulário
  document.getElementById("editMaterialId").value = material.id
  document.getElementById("editMaterialCodigo").value = material.code
  document.getElementById("editMaterialDescricao").value = material.description
  // document.getElementById("editMaterialUnidade").value = material.unit

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
    showToast("Material atualizado com sucesso!")
  }
}

function deleteMaterial(id) {
  const material = materialsData.find((m) => m.id === id)
  if (!material) return

  showConfirmDialog(`Tem certeza que deseja excluir o material "${material.description}"?`, () => {
    materialsData = materialsData.filter((m) => m.id !== id)
    saveData()
    loadMaterialsTable()
    updateCounters()
    showToast("Material excluído com sucesso!")
  })
}

// ===== OPERATORS FUNCTIONS =====
function loadOperatorsTable(data = operatorsData) {
  const tbody = document.getElementById("operatorsTableBody")
  tbody.innerHTML = ""

  if (data.length === 0) {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td colspan="5" style="text-align: center; padding: 48px; color: #64748b;">
        <i class="fas fa-users" style="font-size: 48px; margin-bottom: 16px; display: block; color: #9ca3af;"></i>
        <h3 style="margin-bottom: 8px; color: #374151;">Nenhum operador cadastrado</h3>
        <p style="margin-bottom: 16px;">Comece adicionando seu primeiro operador ao sistema.</p>
        <button class="btn btn-primary" onclick="openModal('modalNovoOperador')">
          <i class="fas fa-plus"></i>
          Adicionar Operador
        </button>
      </td>
    `
    tbody.appendChild(row)
    return
  }

  data.forEach((operator) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td><code>${operator.registro}</code></td>
      <td><strong>${operator.nome}</strong></td>
      <td>
        <span class="badge ${operator.status === "ativo" ? "badge-primary" : "badge-secondary"}">
          ${operator.status === "ativo" ? "Ativo" : "Inativo"}
        </span>
      </td>
      <td>
        ${
          operator.materiaisEmUso > 0
            ? `<span class="badge badge-danger">${operator.materiaisEmUso} material(is)</span>`
            : '<span style="color: #64748b;">Nenhum</span>'
        }
      </td>
      <td>
        <div class="action-buttons-table">
          <button class="btn btn-outline btn-sm" onclick="viewOperator(${operator.id})" title="Visualizar">
            <i class="fas fa-user-check"></i>
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
  showToast("Operador adicionado com sucesso!")
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
    showToast("Operador atualizado com sucesso!")
  }
}

function deleteOperator(id) {
  const operator = operatorsData.find((o) => o.id === id)
  if (!operator) return

  if (operator.materiaisEmUso > 0) {
    showToast("Não é possível excluir operador com materiais em uso!", "error")
    return
  }

  showConfirmDialog(`Tem certeza que deseja excluir o operador "${operator.nome}"?`, () => {
    operatorsData = operatorsData.filter((o) => o.id !== id)
    saveData()
    loadOperatorsTable()
    updateCounters()
    showToast("Operador excluído com sucesso!")
  })
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
        <span class="detail-label">Registro:</span>
        <span class="detail-value">${operator.registro}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Nome:</span>
        <span class="detail-value">${operator.nome}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Status:</span>
        <span class="detail-value">
          <span class="badge ${operator.status === "ativo" ? "badge-primary" : "badge-secondary"}">
            ${operator.status === "ativo" ? "Ativo" : "Inativo"}
          </span>
        </span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Materiais em Uso:</span>
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
  // if (currentFilters.unit) {
  //   filtered = filtered.filter((m) => m.unit === currentFilters.unit)
  // }

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
  if (searchTerm.length < 2) return

  const suggestions = materialsData
    .filter(
      (m) =>
        m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.code.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .slice(0, 5)

  // Remove existing suggestions
  const existingSuggestions = inputElement.parentNode.querySelector(".search-results")
  if (existingSuggestions) {
    existingSuggestions.remove()
  }

  if (suggestions.length === 0) return

  const resultsDiv = document.createElement("div")
  resultsDiv.className = "search-results"

  suggestions.forEach((material) => {
    const item = document.createElement("div")
    item.className = "search-result-item"
    item.innerHTML = `
      <strong>${material.code}</strong><br>
      <small>${material.description}</small>
    `
    item.onclick = () => {
      inputElement.value = `${material.code} - ${material.description}`
      selectedMaterial = material
      resultsDiv.remove()
    }
    resultsDiv.appendChild(item)
  })

  inputElement.parentNode.style.position = "relative"
  inputElement.parentNode.appendChild(resultsDiv)
}

function showOperatorSuggestions(searchTerm, inputElement) {
  if (searchTerm.length < 2) return

  const suggestions = operatorsData
    .filter(
      (o) =>
        o.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.registro.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((o) => o.status === "ativo")
    .slice(0, 5)

  // Remove existing suggestions
  const existingSuggestions = inputElement.parentNode.querySelector(".search-results")
  if (existingSuggestions) {
    existingSuggestions.remove()
  }

  if (suggestions.length === 0) return

  const resultsDiv = document.createElement("div")
  resultsDiv.className = "search-results"

  suggestions.forEach((operator) => {
    const item = document.createElement("div")
    item.className = "search-result-item"
    item.innerHTML = `
      <strong>${operator.registro}</strong><br>
      <small>${operator.nome}</small>
    `
    item.onclick = () => {
      inputElement.value = `${operator.registro} - ${operator.nome}`
      selectedOperator = operator
      resultsDiv.remove()
    }
    resultsDiv.appendChild(item)
  })

  inputElement.parentNode.style.position = "relative"
  inputElement.parentNode.appendChild(resultsDiv)
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

  showToast(`${type === "entrada" ? "Entrada" : "Saída"} registrada com sucesso!`)

  // Show history table if it was empty
  if (historyData.length > 0) {
    document.getElementById("emptyHistory").style.display = "none"
    document.getElementById("historyTable").style.display = "block"
  }
}

// ===== HISTORY FUNCTIONS =====
function loadHistoryTable() {
  const tbody = document.getElementById("historyTableBody")
  if (!tbody) return

  tbody.innerHTML = ""

  historyData.forEach((movement) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td><code>${movement.codigo}</code></td>
      <td>${movement.descricao}</td>
      <td>${movement.registro}</td>
      <td>${movement.operador}</td>
      <td>${movement.data}</td>
      <td>
        <span class="badge ${movement.operacao === "saida" ? "badge-danger" : "badge-success"}">
          <i class="fas fa-arrow-${movement.operacao === "saida" ? "up" : "down"}"></i>
          ${movement.operacao === "saida" ? "Saída" : "Entrada"}
        </span>
      </td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="viewMovement(${movement.id})">
          Detalhes
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
        <span class="detail-label">Código:</span>
        <span class="detail-value">${movement.codigo}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Material:</span>
        <span class="detail-value">${movement.descricao}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Registro:</span>
        <span class="detail-value">${movement.registro}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Operador:</span>
        <span class="detail-value">${movement.operador}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Data/Hora:</span>
        <span class="detail-value">${movement.data}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Operação:</span>
        <span class="detail-value">
          <span class="badge ${movement.operacao === "saida" ? "badge-danger" : "badge-success"}">
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
      code: document.getElementById("materialCodigo").value,
      description: document.getElementById("materialDescricao").value,
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
      code: document.getElementById("editMaterialCodigo").value,
      description: document.getElementById("editMaterialDescricao").value,
      status: document.getElementById("editMaterialStatus").value,
    }

    updateMaterial(id, materialData)
    closeModal("modalEditarMaterial")
  })

  // Novo Operador
  document.getElementById("formNovoOperador").addEventListener("submit", (e) => {
    e.preventDefault()

    const operatorData = {
      registro: document.getElementById("operadorRegistro").value,
      nome: document.getElementById("operadorNome").value.toUpperCase(),
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
      registro: document.getElementById("editOperadorRegistro").value,
      nome: document.getElementById("editOperadorNome").value.toUpperCase(),
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
      unit: document.getElementById("filtroUnidade").value,
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
  const data = {
    materials: materialsData,
    operators: operatorsData,
    history: historyData,
    exportDate: new Date().toLocaleString("pt-BR"),
  }

  const dataStr = JSON.stringify(data, null, 2)
  const dataBlob = new Blob([dataStr], { type: "application/json" })

  const link = document.createElement("a")
  link.href = URL.createObjectURL(dataBlob)
  link.download = `gestao_materiais_${new Date().toISOString().split("T")[0]}.json`
  link.click()

  showToast("Dados exportados com sucesso!")
}

// ===== UPDATE COUNTERS =====
function updateCounters() {
  const totalMaterials = materialsData.length
  const materialsInUse = materialsData.filter((m) => m.status === "em_uso").length
  const materialsAvailable = materialsData.filter((m) => m.status === "disponivel").length
  const totalOperators = operatorsData.length
  const totalHistory = historyData.length

  // Update dashboard stats
  const statValues = document.querySelectorAll(".stat-value")
  if (statValues.length >= 4) {
    statValues[0].textContent = totalMaterials
    statValues[1].textContent = materialsInUse
    statValues[2].textContent = materialsAvailable
    statValues[3].textContent = totalOperators
  }

  // Update page counters
  const materialCount = document.getElementById("materialCount")
  if (materialCount) materialCount.textContent = totalMaterials

  const operatorCount = document.getElementById("operatorCount")
  if (operatorCount) operatorCount.textContent = totalOperators

  const historyCount = document.getElementById("historyCount")
  if (historyCount) historyCount.textContent = totalHistory
}

// Adicionar função para atualizar o dashboard dinamicamente
function updateDashboard() {
  // Update materials in use
  const materialsInUse = materialsData.filter((m) => m.status === "em_uso")
  const materialsInUseContent = document.getElementById("materialsInUseContent")

  if (materialsInUse.length === 0) {
    materialsInUseContent.innerHTML = `
      <div style="text-align: center; padding: 32px; color: #64748b;">
        <i class="fas fa-box" style="font-size: 32px; margin-bottom: 12px; display: block; color: #9ca3af;"></i>
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
            <strong>${material.description}</strong>
            <small>${operator ? operator.nome : "Operador não encontrado"}</small>
          </div>
          <span class="badge badge-danger">Em Uso</span>
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
      <div style="text-align: center; padding: 32px; color: #64748b;">
        <i class="fas fa-history" style="font-size: 32px; margin-bottom: 12px; display: block; color: #9ca3af;"></i>
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
          <i class="fas fa-arrow-${movement.operacao === "saida" ? "up" : "down"} ${movement.operacao === "saida" ? "text-red" : "text-green"}"></i>
          <div>
            <strong>${movement.descricao}</strong>
            <small>${movement.operador}</small>
          </div>
        </div>
        <div class="movement-meta">
          <span class="badge ${movement.operacao === "saida" ? "badge-danger" : "badge-success"}">
            ${movement.operacao === "saida" ? "Saída" : "Entrada"}
          </span>
          <small>${movement.data}</small>
        </div>
      </div>
    `,
      )
      .join("")
  }
}
