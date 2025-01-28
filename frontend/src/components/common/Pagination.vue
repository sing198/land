<template>
  <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
    <div class="text-sm text-slate-600">
      แสดงหน้า <span class="font-semibold text-slate-900">{{ currentPage }}</span> จากทั้งหมด <span class="font-semibold text-slate-900">{{ totalPages }}</span> หน้า (ทั้งหมด {{ total }} รายการ)
    </div>

    <div class="flex items-center space-x-1">
      <!-- Previous Button -->
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ก่อนหน้า
      </button>

      <!-- Page Numbers -->
      <template v-for="page in displayedPages" :key="page">
        <span v-if="page === '...'" class="px-2 py-1 text-slate-400">...</span>
        <button
          v-else
          @click="changePage(page)"
          :class="[
            'px-3 py-1.5 rounded-lg text-sm font-medium transition',
            currentPage === page
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
          ]"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next Button -->
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ถัดไป
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    default: 0,
  }
});

const emit = defineEmits(['update:page']);

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('update:page', page);
  }
};

const displayedPages = computed(() => {
  const current = props.currentPage;
  const total = props.totalPages;
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
});
</script>
