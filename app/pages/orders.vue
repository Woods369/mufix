<template>
  <div class="orders-page">
    <section class="orders-hero">
      <div class="container">
        <div class="orders-badge">Repair dashboard</div>
        <h1 class="orders-title">Repair <span class="text-gold">orders</span></h1>
        <p class="orders-sub">Track each item that comes in for repair.</p>
      </div>
    </section>

    <p v-if="banner" class="banner" :class="banner.type" role="status">{{ banner.text }}</p>

    <section v-if="loading" class="section">
      <div class="container loading-wrap">
        <div class="waiting-spinner" />
        <p>Loading orders…</p>
      </div>
    </section>

    <section v-else class="section">
      <div class="container">
        <div class="form-card">
          <h2 class="form-title">Add repair item</h2>
          <form class="order-form" @submit.prevent="addOrder">
            <div class="form-row">
              <div class="form-group grow">
                <label for="product">Product name *</label>
                <input id="product" v-model="form.product" type="text" placeholder="e.g. AKAI MPK Mini" required maxlength="200" />
              </div>
              <div class="form-group">
                <label for="itype">Type</label>
                <select id="itype" v-model="form.instrumentType">
                  <option value="">-</option>
                  <option value="midi">MIDI / keys</option>
                  <option value="guitar">Guitar / bass</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group grow">
                <label for="cname">Customer name</label>
                <input id="cname" v-model="form.customerName" type="text" maxlength="200" />
              </div>
              <div class="form-group grow">
                <label for="ccontact">Customer contact</label>
                <input id="ccontact" v-model="form.customerContact" type="text" placeholder="Phone or email" maxlength="200" />
              </div>
            </div>
            <div class="form-group">
              <label for="desc">Description</label>
              <textarea id="desc" v-model="form.description" rows="2" maxlength="2000" placeholder="Condition, colour, serial, known issues…" />
            </div>
            <div class="form-group">
              <label for="notes">Notes</label>
              <textarea id="notes" v-model="form.notes" rows="3" maxlength="5000" placeholder="Diagnosis, parts, customer notes…" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="status">Status</label>
                <select id="status" v-model="form.status">
                  <option v-for="s in statuses" :key="s" :value="s">{{ statusLabel(s) }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="quote">Quote (£)</label>
                <input id="quote" v-model="form.quoteAmount" type="number" min="0" step="0.01" placeholder="Optional" />
              </div>
            </div>
            <div class="form-group">
              <label>Photos</label>
              <div
                class="upload-area"
                :class="{ 'upload-area--busy': uploading }"
                @click="imageInput?.click()"
                @dragover.prevent
                @drop.prevent="handleDrop"
              >
                <input ref="imageInput" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden @change="handleFiles" />
                <template v-if="uploading">
                  <div class="waiting-spinner" />
                  <span>Uploading…</span>
                </template>
                <template v-else>
                  <Upload :size="24" />
                  <span>Click or drop photos (max 5MB each)</span>
                </template>
              </div>
              <div v-if="form.images.length" class="upload-previews">
                <div v-for="(img, i) in form.images" :key="i" class="upload-preview">
                  <img :src="img" alt="" />
                  <button type="button" class="preview-remove" @click="form.images.splice(i, 1)"><X :size="14" /></button>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="submitting || !form.product.trim()">
                <PackagePlus :size="18" />
                {{ submitting ? 'Adding…' : 'Add order' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <section v-if="!loading" class="section section-alt">
      <div class="container">
        <div class="orders-header">
          <h2 class="section-title" style="margin-bottom:0">
            {{ filteredOrders.length }} order{{ filteredOrders.length !== 1 ? 's' : '' }}
          </h2>
          <div class="filters">
            <div class="view-toggle">
              <button type="button" class="view-btn" :class="{ active: viewMode === 'board' }" @click="viewMode = 'board'">Board</button>
              <button type="button" class="view-btn" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">Grid</button>
            </div>
            <input v-model="search" type="search" placeholder="Search…" class="filter-input" />
            <select v-if="viewMode === 'grid'" v-model="statusFilter" class="filter-input">
              <option value="">All statuses</option>
              <option v-for="s in statuses" :key="s" :value="s">{{ statusLabel(s) }}</option>
            </select>
          </div>
        </div>

        <p v-if="!filteredOrders.length" class="orders-empty">No orders match.</p>

        <div v-else-if="viewMode === 'board'" class="kanban">
          <div v-for="col in kanbanColumns" :key="col" class="kanban-col">
            <div class="kanban-col-head">
              <span>{{ statusLabel(col) }}</span>
              <span class="kanban-count">{{ ordersByStatus(col).length }}</span>
            </div>
            <div class="kanban-cards">
              <div v-for="order in ordersByStatus(col)" :key="order.id" class="kanban-card">
                <div class="kanban-card-top">
                  <strong>{{ order.product }}</strong>
                  <span class="order-date">{{ formatDate(order.createdAt) }}</span>
                </div>
                <p v-if="order.customerName" class="order-customer">{{ order.customerName }}</p>
                <p v-if="order.notes" class="kanban-notes">{{ order.notes }}</p>
                <div class="kanban-card-actions">
                  <select class="status-select" :value="order.status" @change="onStatusChange(order, ($event.target as HTMLSelectElement).value)">
                    <option v-for="s in statuses" :key="s" :value="s">{{ statusLabel(s) }}</option>
                  </select>
                  <button class="btn btn-outline btn-sm" type="button" @click="openEditModal(order)">Edit</button>
                </div>
              </div>
              <p v-if="!ordersByStatus(col).length" class="kanban-empty">Empty</p>
            </div>
          </div>
        </div>

        <div v-else class="orders-grid">
          <div v-for="order in filteredOrders" :key="order.id" class="order-card">
            <div v-if="order.images?.length" class="order-images">
              <div
                v-for="(img, i) in order.images"
                :key="i"
                class="order-img-wrap"
                :class="{ 'order-img-cover': i === 0 }"
              >
                <img :src="img" alt="" @click="expandedImg = img" />
              </div>
            </div>
            <div class="order-body">
              <div class="order-meta">
                <span class="order-product">{{ order.product }}</span>
                <span class="order-date">{{ formatDate(order.createdAt) }}</span>
              </div>
              <div class="order-tags">
                <span class="status-pill" :data-status="order.status">{{ statusLabel(order.status) }}</span>
                <span v-if="order.instrumentType" class="tag">{{ order.instrumentType }}</span>
                <span v-if="order.quoteAmount != null" class="tag">£{{ order.quoteAmount }}</span>
              </div>
              <p v-if="order.customerName || order.customerContact" class="order-customer">
                {{ order.customerName }}
                <span v-if="order.customerContact"> · {{ order.customerContact }}</span>
              </p>
              <p v-if="order.description" class="order-desc">{{ order.description }}</p>
              <p v-if="order.notes" class="order-notes"><StickyNote :size="14" />{{ order.notes }}</p>
            </div>
            <div class="order-actions">
              <select class="status-select" :value="order.status" @change="onStatusChange(order, ($event.target as HTMLSelectElement).value)">
                <option v-for="s in statuses" :key="s" :value="s">{{ statusLabel(s) }}</option>
              </select>
              <button class="btn btn-outline btn-sm" type="button" @click="openEditModal(order)">
                <FileEdit :size="14" /> Edit
              </button>
              <button class="btn btn-outline btn-sm btn-danger" type="button" @click="confirmDelete(order)">
                <Trash2 :size="14" /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="editingOrder" class="modal-overlay" @click.self="closeEditModal">
        <div class="modal-card" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h3 class="modal-title">{{ editingOrder.product }}</h3>
            <button class="modal-close" type="button" @click="closeEditModal"><X :size="20" /></button>
          </div>
          <label class="modal-label">Notes</label>
          <textarea v-model="editNotesText" class="modal-textarea" rows="5" />
          <label class="modal-label">Quote (£)</label>
          <input v-model="editQuote" class="modal-input" type="number" min="0" step="0.01" />
          <div class="modal-actions">
            <button class="btn btn-outline btn-sm" type="button" @click="closeEditModal">Cancel</button>
            <button class="btn btn-primary btn-sm" type="button" :disabled="savingNotes" @click="saveEdit">
              {{ savingNotes ? 'Saving…' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="expandedImg" class="lightbox" @click="expandedImg = null">
        <button class="lightbox-close" type="button"><X :size="24" /></button>
        <img :src="expandedImg" class="lightbox-img" alt="" />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Upload, X, PackagePlus, Trash2, StickyNote, FileEdit } from 'lucide-vue-next'

definePageMeta({ middleware: 'auth' })

type OrderStatus = 'intake' | 'diagnosing' | 'quoted' | 'approved' | 'in_repair' | 'ready' | 'returned' | 'cancelled'

interface Order {
  id: string
  product: string
  description: string
  notes: string
  images: string[]
  status: OrderStatus
  customerName: string
  customerContact: string
  instrumentType: string
  quoteAmount: number | null
  createdAt: number
  updatedAt: number
}

const statuses: OrderStatus[] = ['intake', 'diagnosing', 'quoted', 'approved', 'in_repair', 'ready', 'returned', 'cancelled']

function statusLabel(s: string) {
  return s.replace(/_/g, ' ')
}

const orders = ref<Order[]>([])
const loading = ref(true)
const submitting = ref(false)
const imageInput = ref<HTMLInputElement | null>(null)
const expandedImg = ref<string | null>(null)
const search = ref('')
const statusFilter = ref('')
const viewMode = ref<'board' | 'grid'>('board')
const kanbanColumns: OrderStatus[] = ['intake', 'diagnosing', 'quoted', 'approved', 'in_repair', 'ready', 'returned', 'cancelled']
const banner = ref<{ type: 'ok' | 'err'; text: string } | null>(null)

const editingOrder = ref<Order | null>(null)
const editNotesText = ref('')
const editQuote = ref<string>('')
const savingNotes = ref(false)
const uploading = ref(false)

const form = reactive({
  product: '',
  description: '',
  notes: '',
  images: [] as string[],
  status: 'intake' as OrderStatus,
  customerName: '',
  customerContact: '',
  instrumentType: '',
  quoteAmount: '' as string | number,
})

function ordersByStatus(status: OrderStatus) {
  const q = search.value.trim().toLowerCase()
  return orders.value.filter((o) => {
    if (o.status !== status) return false
    if (!q) return true
    return [o.product, o.description, o.notes, o.customerName, o.customerContact, o.instrumentType]
      .join(' ')
      .toLowerCase()
      .includes(q)
  })
}

const filteredOrders = computed(() => {
  const q = search.value.trim().toLowerCase()
  return orders.value.filter((o) => {
    if (statusFilter.value && o.status !== statusFilter.value) return false
    if (!q) return true
    return [o.product, o.description, o.notes, o.customerName, o.customerContact, o.instrumentType]
      .join(' ')
      .toLowerCase()
      .includes(q)
  })
})

function showBanner(type: 'ok' | 'err', text: string) {
  banner.value = { type, text }
  setTimeout(() => { if (banner.value?.text === text) banner.value = null }, 4000)
}

function friendlyError(e: unknown): string {
  const err = e as { data?: { statusMessage?: string }; statusMessage?: string }
  return err?.data?.statusMessage || err?.statusMessage || 'Request failed'
}

async function loadOrders() {
  loading.value = true
  try {
    orders.value = await $fetch<Order[]>('/api/orders')
  } catch (e) {
    orders.value = []
    showBanner('err', friendlyError(e))
  } finally {
    loading.value = false
  }
}

onMounted(loadOrders)

async function addOrder() {
  if (!form.product.trim() || submitting.value) return
  submitting.value = true
  try {
    const newOrder = await $fetch<Order>('/api/orders', {
      method: 'POST',
      body: {
        product: form.product.trim(),
        description: form.description.trim(),
        notes: form.notes.trim(),
        images: form.images,
        status: form.status,
        customerName: form.customerName.trim(),
        customerContact: form.customerContact.trim(),
        instrumentType: form.instrumentType,
        quoteAmount: form.quoteAmount === '' ? null : Number(form.quoteAmount),
      },
    })
    orders.value.unshift(newOrder)
    form.product = ''
    form.description = ''
    form.notes = ''
    form.images = []
    form.customerName = ''
    form.customerContact = ''
    form.instrumentType = ''
    form.quoteAmount = ''
    form.status = 'intake'
    showBanner('ok', 'Order added')
  } catch (e) {
    showBanner('err', friendlyError(e))
  } finally {
    submitting.value = false
  }
}

async function confirmDelete(order: Order) {
  if (!confirm(`Delete “${order.product}”? This cannot be undone.`)) return
  try {
    await $fetch(`/api/orders/${order.id}`, { method: 'DELETE' })
    orders.value = orders.value.filter(o => o.id !== order.id)
    showBanner('ok', 'Order deleted')
  } catch (e) {
    showBanner('err', friendlyError(e))
  }
}

async function onStatusChange(order: Order, status: string) {
  try {
    const updated = await $fetch<Order>(`/api/orders/${order.id}`, {
      method: 'PATCH',
      body: { status },
    })
    const idx = orders.value.findIndex(o => o.id === updated.id)
    if (idx !== -1) orders.value[idx] = updated
  } catch (e) {
    showBanner('err', friendlyError(e))
    await loadOrders()
  }
}

function openEditModal(order: Order) {
  editingOrder.value = order
  editNotesText.value = order.notes
  editQuote.value = order.quoteAmount == null ? '' : String(order.quoteAmount)
}

function closeEditModal() {
  editingOrder.value = null
  editNotesText.value = ''
  editQuote.value = ''
}

async function saveEdit() {
  if (!editingOrder.value || savingNotes.value) return
  savingNotes.value = true
  try {
    const updated = await $fetch<Order>(`/api/orders/${editingOrder.value.id}`, {
      method: 'PATCH',
      body: {
        notes: editNotesText.value,
        quoteAmount: editQuote.value === '' ? null : Number(editQuote.value),
      },
    })
    const idx = orders.value.findIndex(o => o.id === updated.id)
    if (idx !== -1) orders.value[idx] = updated
    closeEditModal()
    showBanner('ok', 'Saved')
  } catch (e) {
    showBanner('err', friendlyError(e))
  } finally {
    savingNotes.value = false
  }
}

async function uploadFile(file: File): Promise<string | null> {
  const fd = new FormData()
  fd.append('file', file)
  try {
    const res = await $fetch<{ url: string }>('/api/upload', { method: 'POST', body: fd })
    return res.url
  } catch (e) {
    showBanner('err', friendlyError(e))
    return null
  }
}

async function processFiles(files: FileList | File[]) {
  uploading.value = true
  for (const file of Array.from(files)) {
    if (file.type.startsWith('image/')) {
      const url = await uploadFile(file)
      if (url) form.images.push(url)
    }
  }
  uploading.value = false
}

async function handleFiles(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  await processFiles(input.files)
  if (imageInput.value) imageInput.value.value = ''
}

async function handleDrop(e: DragEvent) {
  if (!e.dataTransfer?.files?.length) return
  await processFiles(e.dataTransfer.files)
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

useHead({ title: 'Repair Orders – Mufix' })
</script>

<style scoped>
.orders-page { padding-top: 3.5rem; }
.orders-hero {
  padding: 5rem 0 2rem; text-align: center; position: relative; z-index: 1;
  background: radial-gradient(ellipse 80% 50% at 50% 20%, var(--purple-glow), transparent);
}
.orders-badge {
  display: inline-block; font-size: 0.75rem; font-weight: 600; color: var(--purple);
  background: rgba(167, 139, 250, 0.08); border: 1px solid rgba(167, 139, 250, 0.2);
  padding: 0.375rem 0.75rem; border-radius: 100px; margin-bottom: 1.5rem;
  letter-spacing: 0.04em; text-transform: uppercase;
}
.orders-title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 1rem; }
.text-gold { color: var(--gold); }
.orders-sub { font-size: 1.125rem; color: var(--text-muted); max-width: 480px; margin: 0 auto; }
.banner {
  max-width: 600px; margin: 1rem auto 0; padding: 0.75rem 1rem; border-radius: 8px;
  text-align: center; font-size: 0.875rem;
}
.banner.ok { background: rgba(74, 222, 128, 0.12); color: #4ade80; }
.banner.err { background: rgba(239, 68, 68, 0.12); color: #fca5a5; }
.loading-wrap { display: flex; flex-direction: column; align-items: center; gap: 1rem; color: var(--text-muted); padding: 4rem 0; }
.waiting-spinner {
  width: 28px; height: 28px; border: 3px solid var(--border); border-top-color: var(--purple);
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.form-card {
  max-width: 640px; margin: 0 auto; background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 2rem;
}
.form-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; }
.order-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-row { display: flex; gap: 1rem; flex-wrap: wrap; }
.form-group { display: flex; flex-direction: column; gap: 0.375rem; min-width: 140px; }
.form-group.grow { flex: 1; }
.form-group label { font-size: 0.8125rem; font-weight: 600; color: var(--text-muted); }
.form-group input, .form-group textarea, .form-group select, .filter-input, .status-select, .modal-input {
  background: var(--bg); border: 1px solid var(--border); border-radius: 8px;
  padding: 0.625rem 0.875rem; font-size: 0.9375rem; color: var(--text); font-family: inherit; outline: none;
}
.form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: var(--purple); }
.upload-area {
  display: flex; flex-direction: column; align-items: center; gap: 0.375rem; padding: 1.5rem;
  border: 1px dashed var(--border); border-radius: 8px; cursor: pointer; color: var(--text-muted); font-size: 0.875rem;
}
.upload-area:hover { border-color: var(--purple); background: rgba(167, 139, 250, 0.04); }
.upload-area--busy { cursor: wait; pointer-events: none; opacity: 0.7; }
.upload-previews { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
.upload-preview { position: relative; width: 72px; height: 72px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); }
.upload-preview img { width: 100%; height: 100%; object-fit: cover; }
.preview-remove {
  position: absolute; top: 2px; right: 2px; width: 20px; height: 20px; border-radius: 50%; border: none;
  background: rgba(0,0,0,0.7); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.form-actions { display: flex; gap: 0.75rem; padding-top: 0.5rem; }
.orders-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
.filters { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.filter-input { min-width: 140px; }
.orders-empty { text-align: center; color: var(--text-muted); }
.orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; }
.order-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.order-card:hover { border-color: rgba(167, 139, 250, 0.3); }
.order-images { display: flex; gap: 2px; overflow-x: auto; }
.order-img-wrap { flex: 0 0 auto; width: 80px; height: 80px; cursor: pointer; }
.order-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
.order-img-cover { width: 140px; }
.order-body { padding: 1rem 1.25rem; }
.order-meta { display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.5rem; }
.order-product { font-weight: 700; }
.order-date { font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; }
.order-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.5rem; }
.status-pill, .tag {
  font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
  padding: 0.2rem 0.5rem; border-radius: 999px; background: rgba(167,139,250,0.12); color: var(--purple);
}
.status-pill[data-status="ready"], .status-pill[data-status="returned"] { background: rgba(74,222,128,0.12); color: #4ade80; }
.status-pill[data-status="cancelled"] { background: rgba(239,68,68,0.12); color: #fca5a5; }
.status-pill[data-status="quoted"], .status-pill[data-status="approved"] { background: var(--gold-dim); color: var(--gold); }
.order-customer { font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 0.35rem; }
.order-desc { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem; }
.order-notes {
  display: flex; align-items: flex-start; gap: 0.375rem; font-size: 0.8125rem; color: var(--text-muted);
  background: var(--bg); padding: 0.5rem 0.75rem; border-radius: 6px;
}
.order-notes svg { flex-shrink: 0; margin-top: 2px; color: var(--gold); }
.order-actions {
  padding: 0.75rem 1.25rem; border-top: 1px solid var(--border); display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;
}
.status-select { font-size: 0.8125rem; padding: 0.35rem 0.5rem; }
.modal-overlay {
  position: fixed; inset: 0; z-index: 9998; background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center; padding: 1.5rem;
}
.modal-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; width: 100%; max-width: 480px; }
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.modal-title { font-size: 1.125rem; font-weight: 700; }
.modal-close { background: none; border: none; color: var(--text-muted); cursor: pointer; }
.modal-label { display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.35rem; }
.modal-textarea, .modal-input { width: 100%; margin-bottom: 1rem; }
.modal-textarea { resize: vertical; min-height: 100px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
.lightbox {
  position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.9);
  display: flex; align-items: center; justify-content: center; cursor: zoom-out; padding: 2rem;
}
.lightbox-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: #fff; cursor: pointer; }
.lightbox-img { max-width: 100%; max-height: 100%; object-fit: contain; }
@media (max-width: 640px) {
  .orders-grid { grid-template-columns: 1fr; }
  .form-card { padding: 1.25rem; }
}

.view-toggle {
  display: inline-flex;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.view-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 0.4rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.view-btn.active {
  background: rgba(167,139,250,0.15);
  color: var(--purple);
}
.kanban {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
  align-items: start;
  overflow-x: auto;
}
.kanban-col {
  background: rgba(10,9,12,0.5);
  border: 1px solid var(--border);
  border-radius: 12px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
}
.kanban-col-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0.85rem;
  border-bottom: 1px solid var(--border);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}
.kanban-count {
  background: rgba(167,139,250,0.15);
  color: var(--purple);
  border-radius: 999px;
  padding: 0.1rem 0.45rem;
  font-size: 0.6875rem;
}
.kanban-cards {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 70vh;
  overflow-y: auto;
}
.kanban-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.75rem;
}
.kanban-card-top {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
  font-size: 0.875rem;
}
.kanban-notes {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0.35rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.kanban-card-actions {
  display: flex;
  gap: 0.35rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}
.kanban-empty {
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-muted);
  padding: 1rem 0.5rem;
  opacity: 0.6;
}

</style>
