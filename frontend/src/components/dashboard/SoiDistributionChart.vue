<template>
  <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-base font-bold text-slate-800">จำนวนแปลงที่ดินแยกตามซอย</h3>
        <p class="text-xs text-slate-500">การกระจายตัวของแปลงที่ดิน ส.ป.ก. ในแต่ละซอย</p>
      </div>
    </div>

    <div class="flex-1 min-h-[260px] relative flex items-center justify-center">
      <Bar v-if="hasData" :data="chartData" :options="chartOptions" />
      <div v-else class="text-center text-slate-400 py-8">
        <svg class="w-12 h-12 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p class="text-sm">ไม่มีข้อมูลการกระจายตัวตามซอย</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
});

const hasData = computed(() => props.data && props.data.length > 0);

const chartData = computed(() => {
  const labels = props.data.map(item => `ซอย ${item.soi}`);
  const counts = props.data.map(item => item.count);

  return {
    labels,
    datasets: [
      {
        label: 'จำนวนแปลง',
        data: counts,
        backgroundColor: '#10b981',
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return ` จำนวน: ${context.parsed.y} แปลง`;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          family: 'Sarabun, sans-serif',
          size: 11
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: '#f1f5f9'
      },
      ticks: {
        stepSize: 1,
        font: {
          family: 'Sarabun, sans-serif',
          size: 11
        }
      }
    }
  }
};
</script>
