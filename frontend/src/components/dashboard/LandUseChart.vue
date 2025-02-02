<template>
  <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-base font-bold text-slate-800">สัดส่วนการใช้ประโยชน์ที่ดิน</h3>
        <p class="text-xs text-slate-500">จำแนกตามประเภทกิจกรรมการเกษตร</p>
      </div>
      <span class="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full">
        Real-time
      </span>
    </div>

    <div class="flex-1 min-h-[260px] relative flex items-center justify-center">
      <Doughnut v-if="hasData" :data="chartData" :options="chartOptions" />
      <div v-else class="text-center text-slate-400 py-8">
        <svg class="w-12 h-12 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
        <p class="text-sm">ไม่มีข้อมูลการใช้ประโยชน์ที่ดิน</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
});

const hasData = computed(() => props.data && props.data.length > 0);

const colorPalette = [
  '#16a34a', // Emerald Green (ยางพารา)
  '#f59e0b', // Amber (สวนผลไม้)
  '#0284c7', // Sky Blue (ปศุสัตว์)
  '#8b5cf6', // Purple (พืชไร่)
  '#f43f5e', // Rose (ที่อยู่อาศัย)
  '#64748b', // Slate (อื่นๆ)
];

const chartData = computed(() => {
  const labels = props.data.map(item => item.use_type || 'อื่นๆ');
  const counts = props.data.map(item => item.count);

  return {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: colorPalette.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: {
          family: 'Sarabun, sans-serif',
          size: 12
        },
        padding: 16,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return ` ${label}: ${value} แปลง (${percentage}%)`;
        }
      }
    }
  },
  cutout: '65%'
};
</script>
