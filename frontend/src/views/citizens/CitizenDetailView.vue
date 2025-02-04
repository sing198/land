<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <!-- Top Back Bar -->
    <div class="flex items-center justify-between">
      <router-link
        to="/citizens"
        class="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-emerald-700 transition"
      >
        <svg class="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        กลับหน้ารายชื่อราษฎร
      </router-link>

      <router-link
        v-if="citizen && authStore.isLandOfficer"
        :to="`/citizens/${citizen.id_card}/edit`"
        class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition"
      >
        แก้ไขข้อมูลราษฎร
      </router-link>
    </div>

    <LoadingSpinner v-if="loading" text="กำลังโหลดประวัติราษฎร..." />

    <template v-else-if="citizen">
      <!-- Profile Card -->
      <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-2xl shrink-0">
              {{ citizen.first_name.charAt(0) }}
            </div>
            <div>
              <h2 class="text-2xl font-bold text-slate-900">
                {{ citizen.prefix_name || '' }} {{ citizen.first_name }} {{ citizen.last_name }}
              </h2>
              <p class="text-xs text-slate-500 font-mono">เลขบัตรประชาชน: {{ citizen.id_card }}</p>
            </div>
          </div>

          <div class="flex space-x-2">
            <span class="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100">
              {{ lands.length }} แปลงถือครอง
            </span>
            <span class="px-3.5 py-1.5 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold border border-purple-100">
              {{ heirs.length }} ทายาท
            </span>
          </div>
        </div>

        <!-- Personal Info Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div class="p-4 bg-slate-50 rounded-2xl">
            <span class="text-xs text-slate-400 font-medium">เพศ</span>
            <p class="font-bold text-slate-800 mt-1">
              {{ citizen.gender === 'male' ? 'ชาย' : (citizen.gender === 'female' ? 'หญิง' : 'อื่นๆ') }}
            </p>
          </div>
          <div class="p-4 bg-slate-50 rounded-2xl">
            <span class="text-xs text-slate-400 font-medium">วันเกิด</span>
            <p class="font-bold text-slate-800 mt-1">{{ citizen.birthday || '-' }}</p>
          </div>
          <div class="p-4 bg-slate-50 rounded-2xl">
            <span class="text-xs text-slate-400 font-medium">เบอร์โทรศัพท์</span>
            <p class="font-mono font-bold text-slate-800 mt-1">{{ citizen.phone_number || '-' }}</p>
          </div>
          <div class="p-4 bg-slate-50 rounded-2xl">
            <span class="text-xs text-slate-400 font-medium">ที่อยู่ (ซอย)</span>
            <p class="font-bold text-slate-800 mt-1">ซอย {{ citizen.soi || 0 }}</p>
          </div>
        </div>

        <!-- Address -->
        <div class="p-4 bg-slate-50 rounded-2xl text-sm">
          <span class="text-xs text-slate-400 font-medium">ที่อยู่ตามทะเบียนราษฎร์</span>
          <p class="font-medium text-slate-800 mt-1">
            บ้านเลขที่ {{ citizen.house_number || '-' }} หมู่ {{ citizen.village_number || '-' }} 
            ตำบล{{ citizen.subdistrict || 'กรุงชิง' }} อำเภอ{{ citizen.district || 'นบพิตำ' }} จังหวัด{{ citizen.province || 'นครศรีธรรมราช' }}
          </p>
        </div>

        <!-- Linked Lands List -->
        <div class="pt-6 border-t border-slate-100">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-slate-800 flex items-center">
              <span class="w-2 h-5 bg-emerald-600 rounded-full mr-2"></span>
              แปลงที่ดินที่ถือครอง ({{ lands.length }})
            </h3>
            <router-link
              v-if="authStore.isLandOfficer"
              to="/lands/create"
              class="text-xs font-semibold text-emerald-600 hover:underline"
            >
              + เพิ่มแปลงที่ดิน
            </router-link>
          </div>

          <div v-if="lands.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="l in lands"
              :key="l.id_land"
              class="p-5 bg-emerald-50/30 border border-emerald-100 rounded-2xl space-y-2 hover:shadow-xs transition"
            >
              <div class="flex items-center justify-between">
                <span class="text-base font-bold text-slate-900">แปลงเลขที่ {{ l.tf_number }}</span>
                <span class="text-xs px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                  {{ l.land_use_type || 'ส.ป.ก.' }}
                </span>
              </div>
              <p class="text-xs text-slate-500">ระวาง ส.ป.ก.: <span class="font-semibold text-slate-700">{{ l.spk_area }}</span> (ซอย {{ l.current_soi }})</p>
              <p class="text-xs text-slate-500">เนื้อที่: <span class="font-bold text-emerald-700">{{ l.rai }} ไร่ {{ l.ngan }} งาน {{ l.square_wa }} วา</span></p>
              <router-link
                :to="`/lands/${l.id_land}`"
                class="inline-block pt-1 text-xs font-semibold text-emerald-600 hover:underline"
              >
                ดูรายละเอียดแปลง &rarr;
              </router-link>
            </div>
          </div>

          <p v-else class="text-xs text-slate-400 italic">ไม่มีข้อมูลแปลงที่ดินที่ผูกกับราษฎรท่านนี้</p>
        </div>

        <!-- Heirs Section -->
        <div class="pt-6 border-t border-slate-100">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-slate-800 flex items-center">
              <span class="w-2 h-5 bg-purple-600 rounded-full mr-2"></span>
              ทายาทผู้มีสิทธิ์ ({{ heirs.length }})
            </h3>
            <router-link
              v-if="authStore.isLandOfficer"
              :to="`/heirs/create?citizen_id=${citizen.id_card}`"
              class="text-xs font-semibold text-purple-600 hover:underline"
            >
              + เพิ่มทายาท
            </router-link>
          </div>

          <div v-if="heirs.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="h in heirs"
              :key="h.heir_id"
              class="p-4 bg-purple-50/30 border border-purple-100 rounded-2xl flex items-center justify-between text-xs"
            >
              <div>
                <span class="font-bold text-slate-800 text-sm">{{ h.prefix_name || '' }} {{ h.first_name }} {{ h.last_name }}</span>
                <p class="text-slate-500">เบอร์โทรศัพท์: <span class="font-mono text-slate-700">{{ h.phone_number || '-' }}</span></p>
              </div>
              <span class="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg font-bold">
                {{ h.relation_name }}
              </span>
            </div>
          </div>
          <p v-else class="text-xs text-slate-400 italic">ไม่มีข้อมูลทายาทที่ลงทะเบียน</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { citizenApi } from '@/api/citizenApi';
import { useAuthStore } from '@/stores/authStore';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const route = useRoute();
const authStore = useAuthStore();

const citizen = ref(null);
const lands = ref([]);
const heirs = ref([]);
const loading = ref(true);

const loadDetail = async () => {
  loading.value = true;
  try {
    const res = await citizenApi.getCitizenDetail(route.params.id_card);
    citizen.value = res.data.citizen;
    lands.value = res.data.lands || [];
    heirs.value = res.data.heirs || [];
  } catch (error) {
    console.error('Failed to load citizen detail:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadDetail();
});
</script>
