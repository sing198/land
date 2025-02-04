<template>
  <div class="max-w-4xl mx-auto space-y-8 py-4">
    <!-- Header Banner -->
    <div class="text-center space-y-3">
      <div class="inline-flex items-center justify-center p-3 bg-emerald-100 text-emerald-700 rounded-2xl mb-2 shadow-xs">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h2 class="text-3xl font-bold text-slate-900">ระบบสืบค้นข้อมูลแปลงที่ดิน ส.ป.ก. 4-01</h2>
      <p class="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
        บริการสืบค้นข้อมูลแปลงที่ดินในเขตปฏิรูปที่ดินเพื่อเกษตรกรรม สำหรับประชาชนทั่วไป
      </p>
    </div>

    <!-- Search Box -->
    <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-slate-100">
      <form @submit.prevent="executeSearch" class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="กรอกแปลงเลขที่ (เช่น SPK-001, SPK-002)..."
            class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
          />
          <svg class="w-5 h-5 text-slate-400 absolute left-3.5 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-sm transition flex items-center justify-center space-x-2 shrink-0"
        >
          <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ loading ? 'กำลังค้นหา...' : 'ค้นหาข้อมูล' }}</span>
        </button>
      </form>

      <!-- Search Suggestions -->
      <div class="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span class="font-medium">ตัวอย่างแปลงเลขที่สำหรับทดสอบ (Mock-up):</span>
        <button
          v-for="sample in ['SPK-001', 'SPK-002', 'SPK-003', 'SPK-004', 'SPK-005', 'SPK-006']"
          :key="sample"
          @click="selectSample(sample)"
          type="button"
          class="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-md font-mono transition"
        >
          {{ sample }}
        </button>
      </div>
    </div>

    <!-- Search Result Card -->
    <div v-if="result" class="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
      <div class="bg-gradient-to-r from-emerald-700 to-teal-800 p-6 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span class="text-xs font-semibold uppercase tracking-wider text-emerald-200">ผลการสืบค้นแปลงที่ดิน</span>
          <h3 class="text-2xl font-bold mt-0.5">แปลงเลขที่ {{ result.tf_number }}</h3>
        </div>
        <span class="self-start sm:self-auto px-3.5 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium border border-white/30">
          {{ result.land_status_name }}
        </span>
      </div>

      <div class="p-6 space-y-6">
        <!-- Details Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div class="space-y-1">
            <span class="text-xs text-slate-400 font-medium">ระวาง ส.ป.ก. ที่</span>
            <p class="text-base font-semibold text-slate-800">{{ result.spk_area || '-' }}</p>
          </div>

          <div class="space-y-1">
            <span class="text-xs text-slate-400 font-medium">เลขที่ / เล่มที่</span>
            <p class="text-base font-semibold text-slate-800">{{ result.number || '-' }} / {{ result.volume || '-' }}</p>
          </div>

          <div class="space-y-1">
            <span class="text-xs text-slate-400 font-medium">ที่ตั้งแปลงที่ดิน (ซอย)</span>
            <p class="text-base font-semibold text-slate-800">ซอย {{ result.current_soi }}</p>
          </div>

          <div class="space-y-1">
            <span class="text-xs text-slate-400 font-medium">เนื้อที่คำนวณ</span>
            <p class="text-base font-semibold text-emerald-600">
              {{ result.rai || 0 }} ไร่ {{ result.ngan || 0 }} งาน {{ result.square_wa || 0 }} วา 
              <span class="text-xs text-slate-400 font-normal">({{ result.total_rai ? Number(result.total_rai).toFixed(2) : 0 }} ไร่)</span>
            </p>
          </div>

          <div class="space-y-1">
            <span class="text-xs text-slate-400 font-medium">ประเภทการใช้ประโยชน์</span>
            <p class="text-base font-semibold text-slate-800">{{ result.land_use_type || '-' }}</p>
          </div>

          <div class="space-y-1">
            <span class="text-xs text-slate-400 font-medium">ตำบล / อำเภอ</span>
            <p class="text-base font-semibold text-slate-800">{{ result.l_subdistrict || 'กรุงชิง' }}, {{ result.l_district || 'นบพิตำ' }}</p>
          </div>
        </div>

        <!-- Masked Owner Information (Privacy Protected) -->
        <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium">ผู้ได้รับสิทธิ์ถือครอง (คุ้มครองข้อมูลส่วนบุคคล)</p>
              <p class="text-sm font-bold text-slate-800">{{ result.owner_masked_name || 'ไม่ระบุชื่อ' }}</p>
            </div>
          </div>

          <div class="text-xs text-slate-500 sm:text-right">
            <p>เบอร์ติดต่อ: <span class="font-mono font-medium text-slate-700">{{ result.owner_masked_phone || '-' }}</span></p>
            <p>เลขบัตรประชาชน: <span class="font-mono font-medium text-slate-700">{{ result.owner_masked_id || '-' }}</span></p>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else-if="searched && !loading" class="bg-white p-12 rounded-2xl text-center shadow-sm border border-slate-100 max-w-lg mx-auto">
      <div class="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-slate-800 mb-1">ไม่พบข้อมูลแปลงที่ดิน</h3>
      <p class="text-sm text-slate-500">
        ไม่พบแปลงที่ดินเลขที่ "<span class="font-semibold text-rose-600">{{ searchQuery }}</span>" ในระบบ กรุณาตรวจสอบหมายเลขแปลงอีกครั้ง
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { landApi } from '@/api/landApi';

const route = useRoute();
const router = useRouter();

const searchQuery = ref('');
const result = ref(null);
const loading = ref(false);
const searched = ref(false);

const selectSample = (sample) => {
  searchQuery.value = sample;
  executeSearch();
};

const executeSearch = async () => {
  if (!searchQuery.value.trim()) return;

  loading.value = true;
  searched.value = true;
  result.value = null;

  try {
    router.replace({ query: { q: searchQuery.value.trim() } });
    const res = await landApi.publicSearch(searchQuery.value.trim());
    result.value = res.data;
  } catch (error) {
    result.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q;
    executeSearch();
  }
});
</script>
