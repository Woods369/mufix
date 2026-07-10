<template>
  <div class="orders-page">
    <!-- Hero -->
    <section class="orders-hero">
      <div class="container">
        <div class="orders-badge">Repair dashboard</div>
        <h1 class="orders-title">Repair <span class="text-gold">orders</span></h1>
        <p class="orders-sub">Track each item that comes in for repair.</p>
      </div>
    </section>

    <!-- Loading -->
    <section v-if="loading" class="section">
      <div class="container loading-wrap">
        <div class="waiting-spinner"></div>
        <p>Loading orders…</p>
      </div>
    </section>

    <!-- Add order form -->
    <section v-else class="section">
      <div class="container">
        <div class="form-card">
          <h2 class="form-title">Add repair item</h2>
          <form class="order-form" @submit.prevent="addOrder">
            <div class="form-group">
              <label for="product">Product name *</label>
              <input id="product" v-model="form.product" type="text" placeholder="e.g. AKAI MPK Mini" required />
            </div>
            <div class="form-group">
              <label for="desc">Description</label>
              <textarea id="desc" v-model="form.description" rows="2" placeholder="Condition, colour, serial number, known issues…"></textarea>
            </div>
            <div class="form-group">
              <label for="notes">Notes</label>
              <textarea id="notes" v-model="form.notes" rows="3" placeholder="Diagnosis notes, parts needed, customer notes…"></textarea>
            </div>
            <div class="form-group">
              <label>Photos</label>
              <div class="upload-area" @click="imageInput?.click()" @dragover.prevent @drop.prevent="handleDrop">
                <input ref="imageInput" type="file" accept="image/*" multiple hidden @change="handleFiles" />
                <Upload :size="24" />
                <span>Click or drop photos here</span>
                <span class="upload-hint">JPEG, PNG, WebP</span>
              </div>
              <div v-if="form.images.length" class="upload-previews">
                <div v-for="(img, i) in form.images" :key="i" class="upload-preview">
                  <img :src="img" alt="" />
                  <button type="button" class="preview-remove" @click="form.images.splice(i, 1)">
                    <X :size="14" />
                  </button>
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

    <!-- Orders list -->
    <section v-if="!loading" class="section section-alt">
      <div class="container">
        <div class="orders-header">
          <h2 class="section-title" style="margin-bottom: 0;">
            {{ orders.length > 0 ? `${orders.length} order${orders.length !== 1 ? 's' : ''}` : 'Orders' }}
          </h2>
        </div>

        <p v-if="!orders.length" class="orders-empty">
          No orders yet. Add your first repair item above.
        </p>

        <div v-else class="orders-grid">
          <div v-for="order in orders" :key="order.id" class="order-card">
            <!-- Image gallery -->
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
              <p v-if="order.description" class="order-desc">{{ order.description }}</p>
              <p v-if="order.notes" class="order-notes">
                <StickyNote :size="14" />
                {{ order.notes }}
              </p>
            </div>

            <div class="order-actions">
              <button class="btn btn-outline btn-sm" @click="openNotesModal(order)">
                <FileEdit :size="14" />
                Notes
              </button>
              <button class="btn btn-outline btn-sm" @click="deleteOrder(order.id)">
                <Trash2 :size="14" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Notes modal -->
    <Teleport to="body">
      <div v-if="editingOrder" class="modal-overlay" @click.self="closeNotesModal">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title">{{ editingOrder.product }}</h3>
            <button class="modal-close" @click="closeNotesModal">
              <X :size="20" />
            </button>
          </div>
          <textarea
            v-model="editNotesText"
            class="modal-textarea"
            rows="5"
            placeholder="Diagnosis notes, parts needed, customer notes…"
          />
          <div class="modal-actions">
            <button class="btn btn-outline btn-sm" @click="closeNotesModal">Cancel</button>
            <button class="btn btn-primary btn-sm" :disabled="savingNotes" @click="saveNotes">
              {{ savingNotes ? 'Saving…' : 'Save notes' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="expandedImg" class="lightbox" @click="expandedImg = null">
        <button class="lightbox-close" @click="expandedImg = null">
          <X :size="24" />
        </button>
        <img :src="expandedImg" class="lightbox-img" />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Upload, X, PackagePlus, Trash2, StickyNote, FileEdit } from 'lucide-vue-next'

interface Order {
  id: string
  product: string
  description: string
  notes: string
  images: string[]
  createdAt: number
}

const orders = ref<Order[]>([])
const loading = ref(true)
const submitting = ref(false)
const imageInput = ref<HTMLInputElement | null>(null)
const expandedImg = ref<string | null>(null)

// Edit notes modal
const editingOrder = ref<Order | null>(null)
const editNotesText = ref('')
const savingNotes = ref(false)

const form = reactive({
  product: '',
  description: '',
  notes: '',
  images: [] as string[],
})

// --- Load orders from API ---
async function loadOrders() {
  loading.value = true
  try {
    orders.value = await $fetch<Order[]>('/api/orders')
  } catch {
    orders.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadOrders)

// --- CRUD ---
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
      },
    })
    orders.value.unshift(newOrder)
    form.product = ''
    form.description = ''
    form.notes = ''
    form.images = []
  } catch {
    // silently fail
  } finally {
    submitting.value = false
  }
}

async function deleteOrder(id: string) {
  try {
    await $fetch(`/api/orders/${id}`, { method: 'DELETE' })
    orders.value = orders.value.filter(o => o.id !== id)
  } catch {
    // silently fail
  }
}

// --- Edit notes ---
function openNotesModal(order: Order) {
  editingOrder.value = order
  editNotesText.value = order.notes
}

function closeNotesModal() {
  editingOrder.value = null
  editNotesText.value = ''
}

async function saveNotes() {
  if (!editingOrder.value || savingNotes.value) return
  savingNotes.value = true
  try {
    const updated = await $fetch<Order>(`/api/orders/${editingOrder.value.id}`, {
      method: 'PATCH',
      body: { notes: editNotesText.value },
    })
    const idx = orders.value.findIndex(o => o.id === updated.id)
    if (idx !== -1) orders.value[idx] = updated
    closeNotesModal()
  } catch {
    // silently fail
  } finally {
    savingNotes.value = false
  }
}

// --- Image handling ---
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })
}

async function handleFiles(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files?.length) return
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      const dataUrl = await readFileAsDataURL(file)
      form.images.push(dataUrl)
    }
  }
  if (imageInput.value) imageInput.value.value = ''
}

function handleDrop(e: DragEvent) {
  const files = e.dataTransfer?.files
  if (!files?.length) return
  handleFiles({ target: { files } } as unknown as Event)
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

useHead({ title: 'Repair Orders – Mufix' })
</script>

<style scoped>
.orders-page {
  padding-top: 3.5rem;
}

.orders-hero {
  padding: 5rem 0 2rem;
  text-align: center;
  position: relative;
  z-index: 1;
  background: radial-gradient(ellipse 80% 50% at 50% 20%, var(--purple-glow), transparent);
}

.orders-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--purple);
  background: rgba(167, 139, 250, 0.08);
  border: 1px solid rgba(167, 139, 250, 0.2);
  padding: 0.375rem 0.75rem;
  border-radius: 100px;
  margin-bottom: 1.5rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.orders-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 1rem;
}

.text-gold {
  color: var(--gold);
}

.orders-sub {
  font-size: 1.125rem;
  color: var(--text-muted);
  max-width: 480px;
  margin: 0 auto;
}

/* Loading */
.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--text-muted);
  padding: 4rem 0;
}

.waiting-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--border);
  border-top-color: var(--purple);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Form card */
.form-card {
  max-width: 600px;
  margin: 0 auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
}

.form-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.order-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-group label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-muted);
}

.form-group input,
.form-group textarea {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.625rem 0.875rem;
  font-size: 0.9375rem;
  color: var(--text);
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--purple);
}

.form-group textarea {
  resize: vertical;
}

/* Upload */
.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 1.5rem;
  border: 1px dashed var(--border);
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 0.875rem;
  transition: border-color 0.2s, background 0.2s;
}

.upload-area:hover {
  border-color: var(--purple);
  background: rgba(167, 139, 250, 0.04);
}

.upload-hint {
  font-size: 0.75rem;
  opacity: 0.6;
}

.upload-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.upload-preview {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-remove {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

/* Orders header */
.orders-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.orders-empty {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9375rem;
}

/* Orders grid */
.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1rem;
}

.order-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.order-card:hover {
  border-color: rgba(167, 139, 250, 0.3);
}

/* Images */
.order-images {
  display: flex;
  gap: 2px;
  overflow-x: auto;
}

.order-img-wrap {
  flex: 0 0 auto;
  width: 80px;
  height: 80px;
  cursor: pointer;
}

.order-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.order-img-cover {
  width: 140px;
}

/* Body */
.order-body {
  padding: 1rem 1.25rem;
}

.order-meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.order-product {
  font-weight: 700;
  font-size: 1rem;
}

.order-date {
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.order-desc {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.order-notes {
  display: flex;
  align-items: flex-start;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
  background: var(--bg);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  line-height: 1.5;
}

.order-notes svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--gold);
}

/* Actions */
.order-actions {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 0.5rem;
}

/* Lightbox */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  max-width: 480px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 700;
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  transition: color 0.2s;
}

.modal-close:hover {
  color: var(--text);
}

.modal-textarea {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.9375rem;
  color: var(--text);
  font-family: inherit;
  outline: none;
  resize: vertical;
  margin-bottom: 1rem;
  transition: border-color 0.2s;
}

.modal-textarea:focus {
  border-color: var(--purple);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  padding: 2rem;
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.lightbox-close:hover {
  opacity: 1;
}

.lightbox-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

@media (max-width: 640px) {
  .orders-grid {
    grid-template-columns: 1fr;
  }
  .form-card {
    padding: 1.25rem;
  }
}
</style>
