<template>
  <div class="diag-page">
    <!-- Header -->
    <section class="diag-hero">
      <div class="container">
        <div class="diag-badge">Free diagnostic tool</div>
        <h1 class="diag-title">MIDI keyboard<br /><span class="text-gold">key tester</span></h1>
        <p class="diag-sub">
          Connect your MIDI keyboard and press each key. Working keys light up — dead keys stay dark.
        </p>
      </div>
    </section>

    <!-- Connection -->
    <section class="section">
      <div class="container diag-controls">
        <div class="diag-status" :class="{ ready: accessGranted, connected: midiConnected }">
          <span class="status-dot" />
          {{ midiConnected ? 'MIDI device connected' : accessGranted ? 'MIDI access granted' : 'No MIDI device detected' }}
        </div>

        <div v-if="devices.length" class="device-list">
          <span class="device-label">Active input:</span>
          <select v-model="selectedInputId" class="device-select">
            <option v-for="d in devices" :key="d.id" :value="d.id">{{ d.name }}</option>
          </select>
        </div>

        <button v-if="!midiSupported" class="btn btn-outline" disabled>
          Web MIDI not supported in this browser
        </button>
        <button v-else-if="!midiConnected" class="btn btn-primary" @click="connectMidi">
          Connect MIDI keyboard
        </button>
        <p v-if="lastNote" class="last-note">
          Last key: <strong>{{ lastNote }}</strong>
          <span class="note-velocity">velocity {{ lastVelocity }}</span>
        </p>
      </div>
    </section>

    <!-- Piano -->
    <section class="section section-alt piano-section">
      <div class="piano-wrapper">
        <div
          class="piano"
          :style="{
            height: KEY_H + 'px',
            width: whiteKeys.length * KEY_W + 'px'
          }"
        >
          <div
            v-for="key in whiteKeys"
            :key="'w'+key.midi"
            class="piano-key white"
            :class="{ active: activeNotes.has(key.midi), tested: testedNotes.has(key.midi) }"
            :style="{
              left: key.left + 'px',
              width: KEY_W + 'px',
              height: KEY_H + 'px'
            }"
          >
            <span class="key-label">{{ key.note }}</span>
          </div>
          <div
            v-for="key in blackKeys"
            :key="'b'+key.midi"
            class="piano-key black"
            :class="{ active: activeNotes.has(key.midi), tested: testedNotes.has(key.midi) }"
            :style="{
              left: key.left + 'px',
              width: BLACK_W + 'px',
              height: BLACK_H + 'px'
            }"
          >
            <span class="key-label">{{ key.note }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-num">{{ testedNotes.size }}</span>
            <span class="stat-label">Keys tested</span>
          </div>
          <div class="stat-card">
            <span class="stat-num">{{ activeNotes.size }}</span>
            <span class="stat-label">Currently pressed</span>
          </div>
          <div class="stat-card">
            <span class="stat-num">{{ totalPresses }}</span>
            <span class="stat-label">Total presses</span>
          </div>
          <div class="stat-card">
            <span class="stat-num">4</span>
            <span class="stat-label">Octave range (C3&ndash;B6)</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Note log -->
    <section class="section section-alt">
      <div class="container">
        <div class="log-header">
          <h2 class="section-title">Note log</h2>
          <button v-if="noteLog.length" class="btn btn-outline btn-sm" @click="noteLog = []">Clear</button>
        </div>
        <div v-if="noteLog.length" class="log-list">
          <div v-for="(entry, i) in noteLog.slice().reverse().slice(0, 50)" :key="i" class="log-entry">
            <span class="log-note">{{ entry.note }}</span>
            <span class="log-action" :class="entry.type">{{ entry.type === 'on' ? 'PRESSED' : 'RELEASED' }}</span>
            <span class="log-vel">vel {{ entry.velocity }}</span>
          </div>
        </div>
        <p v-else class="log-empty">Press some keys to see the log.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const START_NOTE = 48  // C3
const END_NOTE = 95    // B6
const KEY_W = 48
const KEY_H = 180
const BLACK_W = 30
const BLACK_H = 110

function noteName(midi) {
  const octave = Math.floor(midi / 12) - 1
  return NOTE_NAMES[midi % 12] + octave
}

function isBlack(midi) {
  const semitone = midi % 12
  return [1, 3, 6, 8, 10].includes(semitone)
}

function blackOffset(midi) {
  const semitone = midi % 12
  const gapPositions = { 1: 0, 3: 1, 6: 3, 8: 4, 10: 5 }
  const whiteIdxInOctave = gapPositions[semitone]
  const octavesBefore = Math.floor((midi - START_NOTE) / 12)
  const totalWhiteBefore = octavesBefore * 7 + whiteIdxInOctave
  return totalWhiteBefore * KEY_W + KEY_W * 0.68 - BLACK_W / 2
}

const whiteKeys = []
const blackKeys = []
let whiteIdx = 0
for (let m = START_NOTE; m <= END_NOTE; m++) {
  const key = { midi: m, note: noteName(m) }
  if (isBlack(m)) {
    blackKeys.push({ ...key, left: blackOffset(m) })
  } else {
    whiteKeys.push({ ...key, left: whiteIdx * KEY_W })
    whiteIdx++
  }
}

const activeNotes = reactive(new Set())
const testedNotes = reactive(new Set())
const totalPresses = ref(0)
const noteLog = ref([])
const lastNote = ref('')
const lastVelocity = ref(0)
const midiConnected = ref(false)
const accessGranted = ref(false)
const midiSupported = ref(true)
const devices = ref([])
const selectedInputId = ref('')

let midiAccess = null

function onMidiMessage(msg) {
  const [status, note, velocity] = msg.data
  const type = status >= 144 && status < 160 ? 'on' : 'off'

  if (note < START_NOTE || note > END_NOTE) return

  if (type === 'on' && velocity > 0) {
    activeNotes.add(note)
    testedNotes.add(note)
    totalPresses.value++
    lastNote.value = noteName(note)
    lastVelocity.value = velocity
    noteLog.value.push({ note: noteName(note), type: 'on', velocity })
  } else {
    activeNotes.delete(note)
    noteLog.value.push({ note: noteName(note), type: 'off', velocity })
  }
}

async function connectMidi() {
  try {
    midiAccess = await navigator.requestMIDIAccess()
    accessGranted.value = true

    midiAccess.onstatechange = () => updateDevices()
    updateDevices()
  } catch (e) {
    console.error('MIDI access denied:', e)
  }
}

function updateDevices() {
  const list = []
  for (const input of midiAccess.inputs.values()) {
    list.push({ id: input.id, name: input.name })
    input.onmidimessage = onMidiMessage
  }
  devices.value = list
  midiConnected.value = list.length > 0
  if (list.length && !selectedInputId.value) {
    selectedInputId.value = list[0].id
  }
}

onMounted(() => {
  if (typeof navigator.requestMIDIAccess !== 'function') {
    midiSupported.value = false
  }
})

useHead({ title: 'MIDI Keyboard Diagnostic Tool – Mufix' })
</script>

<style scoped>
.diag-page {
  padding-top: 3.5rem;
}

.diag-hero {
  padding: 5rem 0 2rem;
  text-align: center;
  position: relative;
  z-index: 1;
  background: radial-gradient(ellipse 80% 50% at 50% 20%, var(--purple-glow), transparent);
}

.diag-badge {
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

.diag-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 1rem;
}

.text-gold {
  color: var(--gold);
}

.diag-sub {
  font-size: 1.125rem;
  color: var(--text-muted);
  max-width: 480px;
  margin: 0 auto;
}

/* Controls */
.diag-controls {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.diag-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #555;
  transition: background 0.3s;
}

.diag-status.ready .status-dot {
  background: #fbbf24;
  box-shadow: 0 0 6px rgba(251, 191, 36, 0.4);
}

.diag-status.connected .status-dot {
  background: #4ade80;
  box-shadow: 0 0 6px rgba(74, 222, 128, 0.5);
}

.device-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.device-label {
  color: var(--text-muted);
}

.device-select {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  color: var(--text);
  font-family: inherit;
  outline: none;
  cursor: pointer;
}

.device-select option {
  background: var(--surface);
  color: var(--text);
}

.last-note {
  font-size: 1.25rem;
  color: var(--text);
}

.last-note strong {
  color: var(--purple);
  font-size: 1.5rem;
}

.note-velocity {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-left: 0.5rem;
}

/* Piano */
.piano-section {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.piano-wrapper {
  min-width: fit-content;
  padding: 2rem 0;
  display: flex;
  justify-content: center;
}

.piano {
  position: relative;
}

.piano-key {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 6px;
  transition: background 0.08s, box-shadow 0.08s;
  cursor: default;
  user-select: none;
}

.piano-key.white {
  position: absolute;
  background: #e8e4ee;
  border: 1px solid #ccc;
  border-radius: 0 0 6px 6px;
  color: #666;
  font-size: 0.625rem;
  font-weight: 600;
}

.piano-key.white.active {
  background: var(--purple);
  color: #fff;
  box-shadow: inset 0 -3px 0 var(--purple-deep);
}

.piano-key.white.tested {
  border-color: var(--gold);
}

.piano-key.black {
  position: absolute;
  background: #1a1820;
  border: 1px solid #333;
  border-radius: 0 0 4px 4px;
  z-index: 2;
  transform: translateX(50%);
  color: #888;
  font-size: 0.5rem;
  padding-bottom: 3px;
}

.piano-key.black.active {
  background: var(--purple-deep);
  color: #fff;
  box-shadow: inset 0 -3px 0 #5b21b6;
}

.piano-key.black.tested {
  border-color: var(--gold);
}

.key-label {
  pointer-events: none;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.stat-num {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--purple), var(--gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

/* Note log */
.log-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 480px;
  margin: 0 auto;
}

.log-header .section-title {
  margin-bottom: 0;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
}

.log-list {
  max-width: 480px;
  margin: 0 auto;
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.log-entry {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.375rem 0.75rem;
  background: var(--bg);
  border-radius: 6px;
  font-size: 0.8125rem;
  font-family: monospace;
}

.log-note {
  font-weight: 700;
  color: var(--purple);
  min-width: 3rem;
}

.log-action {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

.log-action.on {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
}

.log-action.off {
  background: rgba(255, 255, 255, 0.05);
  color: #666;
}

.log-vel {
  color: var(--text-muted);
  margin-left: auto;
}

.log-empty {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
}

</style>
