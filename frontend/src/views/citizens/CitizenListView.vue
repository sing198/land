<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">ทะเบียนข้อมูลราษฎร ส.ป.ก.</h2>
        <p class="text-sm text-slate-500">รายชื่อเกษตรกรและราษฎรผู้ได้รับสิทธิ์ถือครองที่ดินในเขตปฏิรูป</p>
      </div>

      <router-link
        v-if="authStore.isLandOfficer"
        to="/citizens/create"
        class="inline-flex items-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-xs transition shrink-0"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        เพิ่มข้อมูลราษฎรใหม่
      </router-link>
    </div>

    <!-- Search Bar -->
    <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex gap-3">
      <div class="relative flex-1">
        <input
          v-model="filters.search"
          @input="debounceSearch"
          type="text"
          placeholder="ค้นหาชื่อจริง, นามสกุล, เลขบัตรประชาชน 13 หลัก, เบอร์โทร..."
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <LoadingSpinner v-if="loading" text="กำลังโหลดรายชื่อราษฎร..." />

      <div v-else-if="citizens.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-100 text-slate-600 font-semibold text-xs uppercase tracking-wider">
              <th class="py-3.5 px-4">เลขประจำตัวประชาชน</th>
              <th class="py-3.5 px-4">ชื่อ - นามสกุล</th>
              <th class="py-3.5 px-4">เพศ</th>
              <th class="py-3.5 px-4">ที่อยู่ (ซอย)</th>
              <th class="py-3.5 px-4">เบอร์โทรศัพท์</th>
              <th class="py-3.5 px-4 text-center">แปลงถือครอง</th>
              <th class="py-3.5 px-4 text-center">ทายาท</th>
              <th class="py-3.5 px-4 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="c in citizens"
              :key="c.id_card"
              class="hover:bg-slate-50/80 transition group"
            >
              <td class="py-3.5 px-4 font-mono font-bold text-slate-800">
                <router-link :to="`/citizens/${c.id_card}`" class="text-blue-600 hover:underline">
                  {{ c.id_card }}
                </router-link>
              </td>
              <td class="py-3.5 px-4 font-semibold text-slate-800">
                {{ c.prefix_name || '' }} {{ c.first_name }} {{ c.last_name }}
              </td>
              <td class="py-3.5 px-4 text-slate-600">
                <span :class="c.gender === 'male' ? 'text-blue-600' : 'text-rose-600'">
                  {{ c.gender === 'male' ? 'ชาย' : (c.gender === 'female' ? 'หญิง' : 'อื่นๆ') }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-slate-600">
                ซอย {{ c.soi || 0 }} ({{ c.district || 'นบพิตำ' }})
              </td>
              <td class="py-3.5 px-4 font-mono text-slate-700">
                {{ c.phone_number || '-' }}
              </td>
              <td class="py-3.5 px-4 text-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {{ c.total_lands || 0 }} แปลง
                </span>
              </td>
              <td class="py-3.5 px-4 text-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                  {{ c.total_heirs || 0 }} คน
                </span>
              </td>
              <td class="py-3.5 px-4 text-center">
                <div class="flex items-center justify-center space-x-1.5">
                  <router-link
                    :to="`/citizens/${c.id_card}`"
                    class="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="ดูประวัติราษฎร"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </router-link>

                  <router-link
                    v-if="authStore.isLandOfficer"
                    :to="`/citizens/${c.id_card}/edit`"
                    class="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                    title="แก้ไขข้อมูล"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </router-link>

                  <button
                    v-if="authStore.isAdmin"
                    @click="handleDelete(c)"
                    class="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="ลบข้อมูล"
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
        <p class="text-slate-500 font-medium">ไม่พบข้อมูลราษฎรตามเงื่อนไขที่ค้นหา</p>
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
import { citizenApi } from '@/api/citizenApi';
import { useAuthStore } from '@/stores/authStore';
import Pagination from '@/components/common/Pagination.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const citizens = ref([]);
const loading = ref(true);

const filters = ref({
  search: '',
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
    loadCitizens();
  }, 350);
};

const loadCitizens = async () => {
  loading.value = true;
  try {
    const res = await citizenApi.getCitizens(filters.value);
    citizens.value = res.data;
    pagination.value = res.pagination;
  } catch (error) {
    console.error('Failed to load citizens:', error);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (newPage) => {
  filters.value.page = newPage;
  loadCitizens();
};

const handleDelete = async (c) => {
  const confirm = await Swal.fire({
    title: `ลบราษฎร ${c.first_name} ${c.last_name}?`,
    text: 'การลบข้อมูลราษฎรอาจส่งผลต่อการผูกสิทธิ์ที่ดินและทายาท',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'ยืนยันการลบ',
    cancelButtonText: 'ยกเลิก'
  });

  if (confirm.isConfirmed) {
    try {
      await citizenApi.deleteCitizen(c.id_card);
      Swal.fire({ icon: 'success', title: 'ลบข้อมูลสำเร็จ', timer: 1500, showConfirmButton: false });
      loadCitizens();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: err.message });
    }
  }
};

onMounted(() => {
  loadCitizens();
});
</script>
