<template>
  <div class="floating-icons" aria-hidden="true">
    <div
      v-for="icon in icons"
      :key="icon.id"
      class="icon-cell"
      :style="icon.cellStyle"
    >
      <component
        :is="icon.component"
        :size="icon.size"
        class="icon-svg"
        :style="icon.svgStyle"
      />
    </div>
  </div>
</template>

<script setup>
import { Music, KeyboardMusic, Activity, AudioLines, AudioWaveform, Guitar, Disc3 } from 'lucide-vue-next'

const pool = [Music, KeyboardMusic, Activity, AudioLines, AudioWaveform, Guitar, Disc3]

const r = (min, max) => Math.random() * (max - min) + min

const icons = Array.from({ length: 30 }, (_, i) => {
  const Icon = pool[i % pool.length]
  const isBig = Math.random() > 0.6
  const size = isBig ? r(36, 60) : r(16, 26)
  const goesUp = Math.random() > 0.4
  const driftPx = r(160, 350)
  const driftY = goesUp ? -driftPx : driftPx
  const speed = r(14, 38)
  return {
    id: i,
    component: Icon,
    size,
    cellStyle: {
      left: `${i * 3.3 + r(0, 4)}%`,
      top: `${(i * 8.7 + r(0, 6)) % 100}%`,
      animationDelay: `${r(0, 22)}s`,
      animationDuration: `${speed}s`,
    },
    svgStyle: {
      '--drift-y': `${driftY}px`,
      color: i % 3 === 1 ? 'var(--gold)' : 'var(--purple)',
      opacity: isBig ? r(0.025, 0.05) : r(0.05, 0.09),
    }
  }
})
</script>

<style scoped>
.floating-icons {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.icon-cell {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: drift var(--duration, 26s) ease-in-out infinite;
}

.icon-svg {
  animation: sway 12s ease-in-out infinite;
}

.icon-cell:nth-child(even) .icon-svg {
  animation-delay: -5s;
}

@keyframes drift {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  8% {
    opacity: var(--opacity, 0.06);
  }
  50% {
    transform: translateY(calc(var(--drift-y) * -0.5));
    opacity: var(--opacity, 0.06);
  }
  92% {
    opacity: 0;
  }
  100% {
    transform: translateY(calc(var(--drift-y) * -1));
    opacity: 0;
  }
}

@keyframes sway {
  0%, 100% {
    transform: translateX(0) rotate(0deg);
  }
  33% {
    transform: translateX(12px) rotate(6deg);
  }
  66% {
    transform: translateX(-8px) rotate(-4deg);
  }
}
</style>
