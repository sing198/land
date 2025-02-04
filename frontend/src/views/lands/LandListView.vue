<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">จัดการข้อมูลแปลงที่ดิน ส.ป.ก.</h2>
        <p class="text-sm text-slate-500">รายการแปลงที่ดิน ส.ป.ก. 4-01 ทั้งหมดในระบบ</p>
      </div>

      <router-link
        v-if="authStore.isLandOfficer"
        to="/lands/create"
        class="inline-flex items-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-xs transition shrink-0"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        เพิ่มแปลงที่ดินใหม่
      </router-link>
    </div>

    <!-- Filters & Search Bar -->
    <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row gap-3">
      <!-- Search Input -->
      <div class="relative flex-1">
        <input
          v-model="filters.search"
          @input="debounceSearch"
          type="text"
          placeholder="ค้นหาแปลงเลขที่, ระวาง, ชื่อ-นามสกุล, เลขบัตร..."
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Soi Filter -->
      <select
        v-model="filters.soi"
        @change="loadLands"
        class="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden"
      >
        <option :value="''">ซอยทั้งหมด</option>
        <option v-for="soi in 13" :key="soi" :value="soi">ซอย {{ soi }}</option>
        <option :value="0">ซอย 0</option>
      </select>

      <!-- Status Filter -->
      <select
        v-model="filters.status"
        @change="loadLands"
        class="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden"
      >
        <option :value="''">สถานะทั้งหมด</option>
        <option v-for="s in commonStore.landStatuses" :key="s.value" :value="s.value">
          {{ s.label }}
        </option>
      </select>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <LoadingSpinner v-if="loading" text="กำลังโหลดรายการแปลงที่ดิน..." />

      <div v-else-if="lands.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-100 text-slate-600 font-semibold text-xs uppercase tracking-wider">
              <th class="py-3.5 px-4">แปลงเลขที่</th>
              <th class="py-3.5 px-4">ระวาง ส.ป.ก.</th>
              <th class="py-3.5 px-4">ซอย</th>
              <th class="py-3.5 px-4">ผู้ถือครองสิทธิ์</th>
              <th class="py-3.5 px-4">เนื้อที่ (ไร่)</th>
              <th class="py-3.5 px-4">การใช้ประโยชน์</th>
              <th class="py-3.5 px-4">สถานะ</th>
              <th class="py-3.5 px-4 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="land in lands"
              :key="land.id_land"
              class="hover:bg-slate-50/80 transition group"
            >
              <td class="py-3.5 px-4 font-bold text-slate-800">
                <router-link :to="`/lands/${land.id_land}`" class="text-emerald-700 hover:underline">
                  {{ land.tf_number }}
                </router-link>
              </td>
              <td class="py-3.5 px-4 text-slate-600">{{ land.spk_area || '-' }}</td>
              <td class="py-3.5 px-4 font-medium text-slate-700">ซอย {{ land.current_soi }}</td>
              <td class="py-3.5 px-4">
                <div v-if="land.first_name" class="font-medium text-slate-800">
                  {{ land.prefix_name || '' }} {{ land.first_name }} {{ land.last_name }}
                </div>
                <span v-else class="text-slate-400 italic">ยังไม่ระบุผู้ถือครอง</span>
              </td>
              <td class="py-3.5 px-4 font-semibold text-emerald-600">
                {{ land.total_rai ? Number(land.total_rai).toFixed(2) : '0.00' }}
              </td>
              <td class="py-3.5 px-4 text-slate-600">{{ land.land_use_type || '-' }}</td>
              <td class="py-3.5 px-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {{ land.land_status_name || 'ส.ป.ก. 4-01' }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-center">
                <div class="flex items-center justify-center space-x-1.5">
                  <router-link
                    :to="`/lands/${land.id_land}`"
                    class="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                    title="ดูรายละเอียด"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </router-link>

                  <router-link
                    v-if="authStore.isLandOfficer"
                    :to="`/lands/${land.id_land}/edit`"
                    class="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                    title="แก้ไขแปลงที่ดิน"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </router-link>

                  <button
                    v-if="authStore.isAdmin"
                    @click="handleDelete(land)"
                    class="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="ลบแปลงที่ดิน"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-slate-500 font-medium">ไม่พบข้อมูลแปลงที่ดินตามเงื่อนไขที่ค้นหา</p>
      </div>

      <!-- Pagination -->
      <Pagination
        :current-page="pagination.page"
        :total-pages="pagination.totalPages"
        :total="pagination.total"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { landApi } from '@/api/landApi';
import { useAuthStore } from '@/stores/authStore';
import { useCommonStore } from '@/stores/commonStore';
import Pagination from '@/components/common/Pagination.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const commonStore = useCommonStore();

const lands = ref([]);
const loading = ref(true);

const filters = ref({
  search: '',
  soi: '',
  status: '',
  page: 1,
  limit: 10
});

const pagination = ref({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1
});

let searchTimeout = null;
const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filters.value.page = 1;
    loadLands();
  }, 350);
};

const loadLands = async () => {
  loading.value = true;
  try {
    const res = await landApi.getLands(filters.value);
    lands.value = res.data;
    pagination.value = res.pagination;
  } catch (error) {
    console.error('Failed to load lands:', error);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (newPage) => {
  filters.value.page = newPage;
  loadLands();
};

const handleDelete = async (land) => {
  const confirm = await Swal.fire({
    title: `ลบแปลงที่ดิน ${land.tf_number}?`,
    text: 'คุณต้องการลบข้อมูลแปลงที่ดินนี้ออกจากระบบหรือไม่',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'ยืนยันการลบ',
    cancelButtonText: 'ยกเลิก'
  });

  if (confirm.isConfirmed) {
    try {
      await landApi.deleteLand(land.id_land);
      Swal.fire({
        icon: 'success',
        title: 'ลบแปลงที่ดินสำเร็จ',
        timer: 1500,
        showConfirmButton: false
      });
      loadLands();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถลบข้อมูลได้',
        text: err.message
      });
    }
  }
};

onMounted(() => {
  commonStore.fetchMasterData();
  loadLands();
});
</script>
