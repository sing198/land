<template>
  <div class="space-y-6">
    <!-- Header with Filter -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">แดชบอร์ดสรุปสถิติ (Analytics Dashboard)</h2>
        <p class="text-sm text-slate-500">รายงานภาพรวมการใช้ประโยชน์ที่ดิน ข้อมูลราษฎร และสถิติตามซอย</p>
      </div>

      <!-- Soi Filter Dropdown -->
      <div class="flex items-center space-x-2">
        <label class="text-sm font-medium text-slate-600">กรองตามซอย:</label>
        <select
          v-model="selectedSoi"
          @change="loadDashboard"
          class="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-2xs focus:border-emerald-500 focus:outline-hidden"
        >
          <option :value="null">ทุกซอย (ภาพรวมทั้งหมด)</option>
          <option v-for="soi in 13" :key="soi" :value="soi">
            ซอย {{ soi }}
          </option>
          <option :value="0">ซอย 0 (ถนนสายหลัก)</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" text="กำลังประมวลผลข้อมูลสถิติ..." />

    <template v-else>
      <!-- Key Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="แปลงที่ดินทั้งหมด"
          :value="dashboardData.summary.totalLands"
          subtitle="แปลงในระบบ"
          type="emerald"
          icon="land"
        />
        <StatCard
          title="เนื้อที่รวมทั้งหมด"
          :value="formattedTotalRai"
          subtitle="ไร่ (ส.ป.ก.)"
          type="amber"
          icon="area"
        />
        <StatCard
          title="ราษฎรผู้ได้รับสิทธิ์"
          :value="dashboardData.summary.totalCitizens"
          subtitle="คน (เจ้าของสิทธิ์)"
          type="blue"
          icon="users"
        />
        <StatCard
          title="ทายาทที่ลงทะเบียน"
          :value="dashboardData.summary.totalHeirs"
          subtitle="คน (ผู้มีสิทธิ์สืบทอด)"
          type="purple"
          icon="users"
        />
      </div>

      <!-- Charts Section (2 Columns) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LandUseChart :data="dashboardData.landUseBreakdown" />
        <SoiDistributionChart :data="dashboardData.soiDistribution" />
      </div>

      <!-- Land Status Summary Table -->
      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <h3 class="text-base font-bold text-slate-800 mb-4">สรุปสถานะเอกสารสิทธิ์ที่ดิน</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div
            v-for="status in dashboardData.statusDistribution"
            :key="status.land_status_name"
            class="p-4 rounded-xl bg-slate-50 border border-slate-100"
          >
            <p class="text-xs text-slate-500 font-medium truncate">{{ status.land_status_name }}</p>
            <p class="text-xl font-bold text-slate-800 mt-1">{{ status.count }} <span class="text-xs font-normal text-slate-400">แปลง</span></p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { dashboardApi } from '@/api/dashboardApi';
import StatCard from '@/components/dashboard/StatCard.vue';
import LandUseChart from '@/components/dashboard/LandUseChart.vue';
import SoiDistributionChart from '@/components/dashboard/SoiDistributionChart.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const selectedSoi = ref(null);
const loading = ref(true);

const dashboardData = ref({
  summary: { totalLands: 0, totalRai: 0, totalCitizens: 0, totalHeirs: 0 },
  landUseBreakdown: [],
  soiDistribution: [],
  statusDistribution: []
});

const formattedTotalRai = computed(() => {
  const rai = Number(dashboardData.value.summary.totalRai) || 0;
  return rai.toFixed(1);
});

const loadDashboard = async () => {
  loading.value = true;
  try {
    const res = await dashboardApi.getDashboardData(selectedSoi.value);
    dashboardData.value = res.data;
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadDashboard();
});
</script>
