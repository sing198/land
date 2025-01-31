<template>
  <div class="space-y-6">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">แผนที่แปลงที่ดินเชิงพื้นที่ (GIS Land Explorer)</h2>
        <p class="text-sm text-slate-500">แสดงขอบเขตและตำแหน่งแปลงที่ดิน ส.ป.ก. 4-01 ในเขตปฏิรูปที่ดิน</p>
      </div>

      <div class="flex items-center space-x-3">
        <router-link
          v-if="authStore.isLandOfficer"
          to="/lands/create"
          class="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-xs transition"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          เพิ่มแปลงที่ดิน
        </router-link>
      </div>
    </div>

    <!-- Quick Stats Bar -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <p class="text-xs text-slate-500 font-medium">แปลงที่ดินทั้งหมด</p>
        <p class="text-xl font-bold text-slate-800 mt-1">{{ totalLandsCount }} แปลง</p>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <p class="text-xs text-slate-500 font-medium">พื้นที่รวมโดยประมาณ</p>
        <p class="text-xl font-bold text-emerald-600 mt-1">{{ totalRaiCount }} ไร่</p>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <p class="text-xs text-slate-500 font-medium">แปลงสวนยางพารา</p>
        <p class="text-xl font-bold text-slate-800 mt-1">{{ rubberCount }} แปลง</p>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <p class="text-xs text-slate-500 font-medium">แปลงสวนผลไม้</p>
        <p class="text-xl font-bold text-amber-600 mt-1">{{ fruitCount }} แปลง</p>
      </div>
    </div>

    <!-- GIS Map Component -->
    <div class="h-[620px] bg-white rounded-2xl p-2 shadow-xs border border-slate-100">
      <GisMap :lands="mapLands" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { landApi } from '@/api/landApi';
import { useAuthStore } from '@/stores/authStore';
import GisMap from '@/components/map/GisMap.vue';

const authStore = useAuthStore();
const mapLands = ref([]);
const loading = ref(true);

const fetchMapData = async () => {
  loading.value = true;
  try {
    const res = await landApi.getMapPolygons();
    mapLands.value = res.data || [];
  } catch (error) {
    console.error('Failed to fetch map polygons:', error);
  } finally {
    loading.value = false;
  }
};

const totalLandsCount = computed(() => mapLands.value.length);
const totalRaiCount = computed(() => {
  const sum = mapLands.value.reduce((acc, curr) => acc + (Number(curr.total_rai) || 0), 0);
  return sum.toFixed(1);
});
const rubberCount = computed(() => mapLands.value.filter(l => l.land_use_type === 'ยางพารา').length);
const fruitCount = computed(() => mapLands.value.filter(l => l.land_use_type === 'สวนผลไม้').length);

onMounted(() => {
  fetchMapData();
});
</script>
