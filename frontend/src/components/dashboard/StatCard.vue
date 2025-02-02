<template>
  <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <p class="text-sm font-medium text-slate-500">{{ title }}</p>
        <p class="text-2xl sm:text-3xl font-bold text-slate-800">{{ formattedValue }}</p>
        <p v-if="subtitle" class="text-xs text-slate-400 font-medium">{{ subtitle }}</p>
      </div>

      <div :class="['w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs', colorClass]">
        <component :is="iconComponent" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    default: 0
  },
  subtitle: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'emerald' // emerald, amber, blue, purple
  },
  icon: {
    type: String,
    default: 'land'
  }
});

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString('th-TH');
  }
  return props.value;
});

const colorClass = computed(() => {
  const map = {
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    rose: 'bg-rose-50 text-rose-600'
  };
  return map[props.type] || map.emerald;
});

const iconComponent = computed(() => {
  if (props.icon === 'land') {
    return () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]);
  }
  if (props.icon === 'area') {
    return () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' })
    ]);
  }
  if (props.icon === 'users') {
    return () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })
    ]);
  }
  return () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 10V3L4 14h7v7l9-11h-7z' })
  ]);
});
</script>
