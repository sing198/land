<template>
  <div class="flex flex-col items-center justify-center p-8 space-y-3">
    <div class="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
    <p v-if="text" class="text-sm font-medium text-slate-500 animate-pulse">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'กำลังโหลดข้อมูล...'
  }
});
</script>
