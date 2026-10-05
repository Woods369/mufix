<template>
  <div class="diag-page">
    <header class="diag-header">
      <h1 class="diag-title">MIDI Diagnostic</h1>
      <div class="status-chip" :class="{ ready: accessGranted || demoMode, connected: sessionActive }">
        <span class="status-dot" />
        <span>{{ statusLabel }}</span>
      </div>
    </header>

    <section class="diag-toolbar">
      <div class="toolbar-row">
        <div v-if="devices.length && !demoMode" class="field">
          <label class="field-label" for="input-device">Input</label>
          <select id="input-device" v-model="selectedInputId" class="device-select">
            <option v-for="d in devices" :key="d.id" :value="d.id">{{ d.name }}</option>
          </select>
        </div>

        <div class="field">
          <span class="field-label">Range</span>
          <div class="preset-pills">
            <button
              v-for="p in presets"
              :key="p.id"
              type="button"
              class="preset-pill"
              :class="{ active: presetId === p.id }"
              @click="setPreset(p.id)"
            >{{ p.label }}</button>
          </div>
        </div>

        <div class="toolbar-actions">
          <button v-if="!midiSupported && !demoMode" class="btn btn-outline btn-sm" disabled>
            Unsupported
          </button>
          <button
            v-else-if="!midiConnected && !demoMode"
            class="btn btn-primary btn-sm"
            type="button"
            @click="connectMidi"
          >
            Connect
          </button>
          <button
            v-if="!sessionActive"
            class="btn btn-outline btn-sm btn-demo"
            type="button"
            @click="startDemo"
          >
            Demo
          </button>
          <button
            v-if="demoMode"
            class="btn btn-outline btn-sm"
            type="button"
            @click="stopDemo"
          >
            Stop demo
          </button>
          <button
            v-if="sessionActive"
            class="btn btn-outline btn-sm"
            type="button"
            @click="clearLog"
          >
            Reset
          </button>
        </div>
      </div>

      <p v-if="connectError" class="toolbar-helper" role="alert">{{ connectError }}</p>
      <p v-else-if="!midiSupported && !demoMode" class="toolbar-helper">Web MIDI needs Chrome or Edge on desktop.</p>
    </section>

    <section v-if="sessionActive" class="diag-stats">
      <div class="stat-tile">
        <span class="stat-num">{{ coveragePct }}%</span>
        <span class="stat-label">Coverage</span>
      </div>
      <div class="stat-tile">
        <span class="stat-num">{{ testedCount }}/{{ totalKeys }}</span>
        <span class="stat-label">Tested</span>
      </div>
      <div class="stat-tile">
        <span class="stat-num">{{ activeCount }}</span>
        <span class="stat-label">Active</span>
      </div>
      <div class="stat-tile">
        <span class="stat-num">{{ totalPresses }}</span>
        <span class="stat-label">Presses</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" :style="{ width: coveragePct + '%' }" /></div>
    </section>

    <section class="diag-main">
      <template v-if="sessionActive">
        <p v-if="lastNote" class="last-note">
          Last: <strong>{{ lastNote }}</strong>
          <span class="note-velocity">vel {{ lastVelocity }}</span>
        </p>
        <div class="piano-wrapper">
          <div
            class="piano"
            :style="{ height: KEY_H + 'px', width: whiteKeys.length * KEY_W + 'px' }"
          >
            <div
              v-for="key in whiteKeys"
              :key="'w'+key.midi"
              class="piano-key white"
              :class="keyClass(key.midi)"
              :style="whiteStyle(key)"
            >
              <span class="key-label">{{ key.note }}</span>
            </div>
            <div
              v-for="key in blackKeys"
              :key="'b'+key.midi"
              class="piano-key black"
              :class="keyClass(key.midi)"
              :style="blackStyle(key)"
            >
              <span class="key-label">{{ key.note }}</span>
            </div>
          </div>
        </div>
        <p class="heatmap-legend">
          <span><i class="swatch cold" /> Untested</span>
          <span><i class="swatch warm" /> Tested</span>
          <span><i class="swatch hot" /> Hard</span>
          <span><i class="swatch live" /> Live</span>
        </p>
      </template>
      <p v-else class="diag-placeholder">Connect a device or start demo mode to see live key data.</p>
    </section>

    <section v-if="sessionActive" class="diag-log">
      <div class="log-header">
        <h2 class="panel-title">Log</h2>
        <div class="log-actions">
          <button type="button" class="btn btn-outline btn-sm" @click="exportReport">Export</button>
          <button v-if="noteLog.length" type="button" class="btn btn-outline btn-sm" @click="clearLog">Clear</button>
        </div>
      </div>
      <div v-if="noteLog.length" class="log-list">
        <div v-for="(entry, i) in noteLog.slice().reverse().slice(0, 50)" :key="i" class="log-entry">
          <span class="log-note">{{ entry.note }}</span>
          <span class="log-action" :class="entry.type">{{ entry.type === 'on' ? 'ON' : 'OFF' }}</span>
          <span class="log-vel">vel {{ entry.velocity }}</span>
        </div>
      </div>
      <p v-else class="log-empty">No presses yet.</p>
    </section>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, computed } from 'vue'

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const KEY_W = 48
const KEY_H = 180
const BLACK_W = 30
const BLACK_H = 110

const presets = [
  { id: 'mini', label: '25-key', start: 48, end: 72 },
  { id: '49', label: '49-key', start: 36, end: 84 },
  { id: '61', label: '61-key', start: 36, end: 96 },
  { id: 'full', label: 'C3–B6', start: 48, end: 95 },
]

const presetId = ref('full')
const startNote = ref(48)
const endNote = ref(95)

function noteName(midi) {
  const octave = Math.floor(midi / 12) - 1
  return NOTE_NAMES[midi % 12] + octave
}
function isBlack(midi) {
  return [1, 3, 6, 8, 10].includes(midi % 12)
}
function blackOffset(midi, start) {
  const semitone = midi % 12
  const gapPositions = { 1: 0, 3: 1, 6: 3, 8: 4, 10: 5 }
  const whiteIdxInOctave = gapPositions[semitone]
  const octavesBefore = Math.floor((midi - start) / 12)
  const totalWhiteBefore = octavesBefore * 7 + whiteIdxInOctave
  return totalWhiteBefore * KEY_W + KEY_W * 0.68 - BLACK_W / 2
}

const whiteKeys = ref([])
const blackKeys = ref([])

function rebuildKeys() {
  const w = []
  const b = []
  let whiteIdx = 0
  const s = startNote.value
  const e = endNote.value
  for (let m = s; m <= e; m++) {
    const key = { midi: m, note: noteName(m) }
    if (isBlack(m)) b.push({ ...key, left: blackOffset(m, s) })
    else {
      w.push({ ...key, left: whiteIdx * KEY_W })
      whiteIdx++
    }
  }
  whiteKeys.value = w
  blackKeys.value = b
}
rebuildKeys()

function setPreset(id) {
  const p = presets.find(x => x.id === id) || presets[3]
  presetId.value = p.id
  startNote.value = p.start
  endNote.value = p.end
  rebuildKeys()
  clearLog()
}

const activeNotes = reactive(new Set())
const testedNotes = reactive(new Set())
const velocityMax = reactive(new Map())
const testedCount = ref(0)
const activeCount = ref(0)
const totalPresses = ref(0)
const noteLog = ref([])
const lastNote = ref('')
const lastVelocity = ref(0)
const midiConnected = ref(false)
const accessGranted = ref(false)
const midiSupported = ref(true)
const devices = ref([])
const selectedInputId = ref('')
const connectError = ref('')
const demoMode = ref(false)

const sessionActive = computed(() => midiConnected.value || demoMode.value)
const totalKeys = computed(() => endNote.value - startNote.value + 1)
const missingCount = computed(() => Math.max(0, totalKeys.value - testedCount.value))
const coveragePct = computed(() => totalKeys.value ? Math.round((testedCount.value / totalKeys.value) * 100) : 0)

const statusLabel = computed(() => {
  if (demoMode.value) return 'Demo keyboard playing'
  if (midiConnected.value) return 'MIDI device connected'
  if (accessGranted.value) return 'MIDI access granted — waiting for device'
  return 'No MIDI device detected'
})

let midiAccess = null
let demoTimer = null
let audioCtx = null

function syncCounts() {
  testedCount.value = testedNotes.size
  activeCount.value = activeNotes.size
}

function playClick(velocity = 80) {
  try {
    if (typeof window === 'undefined') return
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const t = audioCtx.currentTime
    const o = audioCtx.createOscillator()
    const g = audioCtx.createGain()
    o.type = 'triangle'
    o.frequency.value = 220 + velocity * 4
    g.gain.value = 0.0001
    g.gain.exponentialRampToValueAtTime(Math.min(0.08, velocity / 1600), t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)
    o.connect(g)
    g.connect(audioCtx.destination)
    o.start(t)
    o.stop(t + 0.14)
  } catch { /* ignore audio failures */ }
}

function handleNote(note, velocity, isOn) {
  if (note < startNote.value || note > endNote.value) return
  if (isOn) {
    activeNotes.add(note)
    testedNotes.add(note)
    const prev = velocityMax.get(note) || 0
    if (velocity > prev) velocityMax.set(note, velocity)
    totalPresses.value++
    lastNote.value = noteName(note)
    lastVelocity.value = velocity
    noteLog.value.push({ note: noteName(note), type: 'on', velocity, midi: note })
    playClick(velocity)
  } else {
    activeNotes.delete(note)
    noteLog.value.push({ note: noteName(note), type: 'off', velocity, midi: note })
  }
  syncCounts()
}

function onMidiMessage(inputId, msg) {
  if (demoMode.value) return
  if (selectedInputId.value && inputId !== selectedInputId.value) return
  const [status, note, velocity] = msg.data
  const cmd = status & 0xf0
  const isNoteOn = cmd === 0x90 && velocity > 0
  const isNoteOff = cmd === 0x80 || (cmd === 0x90 && velocity === 0)
  if (!isNoteOn && !isNoteOff) return
  handleNote(note, velocity || 0, isNoteOn)
}

function keyClass(midi) {
  const active = activeNotes.has(midi)
  const tested = testedNotes.has(midi)
  const vel = velocityMax.get(midi) || 0
  return {
    active,
    tested,
    'hit-soft': tested && vel > 0 && vel < 50,
    'hit-hard': tested && vel >= 90,
  }
}

function whiteStyle(key) {
  const vel = velocityMax.get(key.midi) || 0
  const heat = testedNotes.has(key.midi) ? Math.min(1, vel / 127) : 0
  return {
    left: key.left + 'px',
    width: KEY_W + 'px',
    height: KEY_H + 'px',
    '--heat': String(heat),
  }
}
function blackStyle(key) {
  const vel = velocityMax.get(key.midi) || 0
  const heat = testedNotes.has(key.midi) ? Math.min(1, vel / 127) : 0
  return {
    left: key.left + 'px',
    width: BLACK_W + 'px',
    height: BLACK_H + 'px',
    '--heat': String(heat),
  }
}

function clearLog() {
  noteLog.value = []
  testedNotes.clear()
  activeNotes.clear()
  velocityMax.clear()
  totalPresses.value = 0
  lastNote.value = ''
  lastVelocity.value = 0
  syncCounts()
}

function exportReport() {
  const all = []
  for (let m = startNote.value; m <= endNote.value; m++) all.push(m)
  const tested = [...testedNotes].sort((a, b) => a - b)
  const missing = all.filter(m => !testedNotes.has(m))
  const lines = [
    'Mufix MIDI key diagnostic report',
    `Mode: ${demoMode.value ? 'demo' : 'live'}`,
    `Generated: ${new Date().toISOString()}`,
    `Range: ${noteName(startNote.value)}–${noteName(endNote.value)}`,
    `Keys tested: ${tested.length} / ${all.length} (${coveragePct.value}%)`,
    `Total presses: ${totalPresses.value}`,
    '',
    'Tested keys:',
    tested.map(m => `${noteName(m)} (max vel ${velocityMax.get(m) || 0})`).join(', ') || '(none)',
    '',
    'Not heard in this session:',
    missing.map(noteName).join(', ') || '(none)',
    '',
    'Recent log:',
    ...noteLog.value.slice(-100).map(e => `${e.type.toUpperCase()} ${e.note} vel ${e.velocity}`),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mufix-midi-diagnostic-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

async function connectMidi() {
  connectError.value = ''
  stopDemo(false)
  try {
    midiAccess = await navigator.requestMIDIAccess({ sysex: false })
    accessGranted.value = true
    midiAccess.onstatechange = () => updateDevices()
    updateDevices()
    if (!midiConnected.value) {
      connectError.value = 'MIDI access granted, but no input device was found. Plug in a USB MIDI keyboard and try again — or use Try demo.'
    }
  } catch (e) {
    console.error('MIDI access denied:', e)
    connectError.value = 'Could not access MIDI. Allow permission, use Chrome/Edge, or launch Try demo.'
  }
}

function updateDevices() {
  if (!midiAccess) return
  const list = []
  for (const input of midiAccess.inputs.values()) {
    list.push({ id: input.id, name: input.name || input.id })
    input.onmidimessage = (msg) => onMidiMessage(input.id, msg)
  }
  devices.value = list
  const wasConnected = midiConnected.value
  midiConnected.value = list.length > 0
  if (list.length && !selectedInputId.value) selectedInputId.value = list[0].id
  if (selectedInputId.value && !list.some(d => d.id === selectedInputId.value)) {
    selectedInputId.value = list[0]?.id || ''
  }
  if (midiConnected.value) connectError.value = ''
  else if (wasConnected) {
    clearLog()
    connectError.value = 'MIDI device disconnected.'
  }
}

function startDemo() {
  connectError.value = ''
  demoMode.value = true
  clearLog()
  if (demoTimer) clearInterval(demoTimer)
  // Walk the range with a musical pattern + random velocity
  let i = 0
  const notes = []
  for (let m = startNote.value; m <= endNote.value; m++) notes.push(m)
  demoTimer = setInterval(() => {
    if (!notes.length) return
    // release previous
    const prev = notes[(i - 1 + notes.length) % notes.length]
    handleNote(prev, 0, false)
    const n = notes[i % notes.length]
    const vel = 40 + Math.floor(Math.random() * 80)
    handleNote(n, vel, true)
    i++
    // occasionally skip to simulate "dead" feel on demo? keep all working in demo
  }, 140)
}

function stopDemo(reset = true) {
  if (demoTimer) {
    clearInterval(demoTimer)
    demoTimer = null
  }
  demoMode.value = false
  activeNotes.clear()
  syncCounts()
  if (reset) {
    // keep tested history unless full clear requested elsewhere
  }
}

onMounted(() => {
  if (typeof navigator === 'undefined' || typeof navigator.requestMIDIAccess !== 'function') {
    midiSupported.value = false
  }
})

onBeforeUnmount(() => {
  stopDemo(false)
  if (audioCtx) {
    try { audioCtx.close() } catch {}
  }
})

useHead({ title: 'MIDI Keyboard Diagnostic Tool – Mufix' })
</script>

<style scoped>
.diag-page {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    "header"
    "toolbar"
    "stats"
    "main"
    "log";
  gap: 1.25rem;
  max-width: 1080px;
  margin: 0 auto;
  padding: 5rem 1.5rem 4rem;
}
@media (min-width: 900px) {
  .diag-page {
    grid-template-columns: 1.6fr 1fr;
    grid-template-areas:
      "header header"
      "toolbar toolbar"
      "stats stats"
      "main log";
    align-items: start;
  }
}

.diag-header {
  grid-area: header;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
}
.diag-title { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; }

.status-chip {
  display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; color: var(--text-muted);
  border: 1px solid var(--border); border-radius: 999px; padding: 0.375rem 0.75rem; background: var(--surface);
}
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: #555; flex-shrink: 0; }
.status-chip.ready .status-dot { background: #fbbf24; box-shadow: 0 0 6px rgba(251,191,36,0.4); }
.status-chip.connected .status-dot { background: #4ade80; box-shadow: 0 0 8px rgba(74,222,128,0.55); }

.diag-toolbar {
  grid-area: toolbar; background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
  padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;
}
.toolbar-row { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 1.25rem; }
.field { display: flex; flex-direction: column; gap: 0.35rem; }
.field-label { font-size: 0.6875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
.device-select, .preset-pill {
  background: var(--bg); border: 1px solid var(--border); border-radius: 999px;
  padding: 0.375rem 0.85rem; font-size: 0.8125rem; color: var(--text); font-family: inherit; cursor: pointer;
}
.preset-pills { display: flex; gap: 0.35rem; flex-wrap: wrap; }
.preset-pill.active {
  border-color: var(--purple); color: var(--purple);
  background: rgba(167,139,250,0.12);
}
.toolbar-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-left: auto; }
.btn-demo { border-color: rgba(251, 191, 36, 0.45); color: var(--gold); }
.toolbar-helper {
  font-size: 0.8125rem; color: #fca5a5;
  background: rgba(239, 68, 68, 0.08); padding: 0.5rem 0.75rem; border-radius: 8px;
}

.diag-stats {
  grid-area: stats; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem;
}
.diag-stats .progress-bar { grid-column: 1 / -1; }
.stat-tile {
  background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
  padding: 0.875rem; text-align: center;
}
.stat-num {
  display: block; font-size: 1.375rem; font-weight: 800;
  background: linear-gradient(135deg, var(--purple), var(--gold));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.stat-label { font-size: 0.6875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.03em; }
.progress-bar { height: 6px; border-radius: 999px; background: var(--border); overflow: hidden; }
.progress-fill {
  height: 100%; border-radius: 999px;
  background: linear-gradient(90deg, var(--purple), var(--gold));
  transition: width 0.2s ease;
}

.diag-main {
  grid-area: main; background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
  padding: 1.25rem; overflow-x: auto;
}
.diag-placeholder { color: var(--text-muted); font-size: 0.875rem; text-align: center; padding: 2rem 0; }
.last-note { font-size: 0.9375rem; margin-bottom: 0.75rem; }
.last-note strong { color: var(--purple); }
.note-velocity { font-size: 0.75rem; color: var(--text-muted); margin-left: 0.35rem; }
.piano-wrapper {
  min-width: fit-content; padding: 0.5rem 0 1rem; display: flex; justify-content: center;
  -webkit-overflow-scrolling: touch;
}
.piano { position: relative; }
.piano-key {
  display: flex; align-items: flex-end; justify-content: center; padding-bottom: 6px;
  transition: background 0.08s, box-shadow 0.08s, filter 0.15s; user-select: none;
}
.piano-key.white {
  position: absolute; background: #e8e4ee; border: 1px solid #ccc; border-radius: 0 0 6px 6px;
  color: #666; font-size: 0.625rem; font-weight: 600;
}
.piano-key.white.tested {
  background: color-mix(in srgb, #fde68a calc(var(--heat, 0.4) * 100%), #e8e4ee);
  border-color: var(--gold);
  box-shadow: inset 0 -2px 0 rgba(251,191,36,0.35);
}
.piano-key.white.hit-hard {
  background: linear-gradient(180deg, #fde68a, #fbbf24);
}
.piano-key.white.active {
  background: var(--purple) !important; color: #fff;
  box-shadow: inset 0 -3px 0 var(--purple-deep), 0 0 18px rgba(167,139,250,0.45);
}
.piano-key.black {
  position: absolute; background: #1a1820; border: 1px solid #333; border-radius: 0 0 4px 4px;
  z-index: 2; transform: translateX(50%); color: #888; font-size: 0.5rem; padding-bottom: 3px;
}
.piano-key.black.tested {
  border-color: var(--gold);
  background: color-mix(in srgb, #7c3aed calc(var(--heat, 0.3) * 70%), #1a1820);
}
.piano-key.black.active {
  background: var(--purple-deep) !important; color: #fff;
  box-shadow: inset 0 -3px 0 #5b21b6, 0 0 14px rgba(167,139,250,0.5);
}
.heatmap-legend {
  display: flex; flex-wrap: wrap; gap: 0.85rem; justify-content: center;
  font-size: 0.6875rem; color: var(--text-muted); padding-top: 0.5rem;
}
.heatmap-legend span { display: inline-flex; align-items: center; gap: 0.3rem; }
.swatch { width: 10px; height: 10px; border-radius: 3px; display: inline-block; }
.swatch.cold { background: #e8e4ee; border: 1px solid #ccc; }
.swatch.warm { background: #fde68a; }
.swatch.hot { background: #fbbf24; }
.swatch.live { background: var(--purple); }

.diag-log {
  grid-area: log; background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
  padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; max-height: 440px;
}
.log-header { display: flex; align-items: center; justify-content: space-between; }
.panel-title { font-size: 1rem; font-weight: 700; }
.log-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.log-list { overflow-y: auto; display: flex; flex-direction: column; gap: 0.25rem; }
.log-entry {
  display: flex; align-items: center; gap: 0.75rem; padding: 0.375rem 0.75rem;
  background: var(--bg); border-radius: 6px; font-size: 0.8125rem; font-family: monospace;
}
.log-note { font-weight: 700; color: var(--purple); min-width: 3rem; }
.log-action { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.05em; padding: 0.125rem 0.375rem; border-radius: 4px; }
.log-action.on { background: rgba(74, 222, 128, 0.15); color: #4ade80; }
.log-action.off { background: rgba(255, 255, 255, 0.05); color: #666; }
.log-vel { color: var(--text-muted); margin-left: auto; }
.log-empty { text-align: center; color: var(--text-muted); font-size: 0.8125rem; padding: 1rem 0; }

@media (max-width: 640px) {
  .diag-stats { grid-template-columns: repeat(2, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .piano-key { transition: none; }
}
</style>
