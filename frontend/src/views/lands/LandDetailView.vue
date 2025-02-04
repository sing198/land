<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <!-- Top Back and Actions Bar -->
    <div class="flex items-center justify-between">
      <router-link
        to="/lands"
        class="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-emerald-700 transition"
      >
        <svg class="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        กลับหน้ารายการแปลงที่ดิน
      </router-link>

      <div class="flex items-center space-x-2" v-if="land && authStore.isLandOfficer">
        <router-link
          :to="`/lands/${land.id_land}/edit`"
          class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          แก้ไขข้อมูลแปลง
        </router-link>
      </div>
    </div>

    <LoadingSpinner v-if="loading" text="กำลังโหลดรายละเอียดแปลงที่ดิน..." />

    <template v-else-if="land">
      <!-- Land Title Banner Card -->
      <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
                แปลง ส.ป.ก. 4-01
              </span>
              <span class="text-xs text-slate-400 font-mono">ID: #{{ land.id_land }}</span>
            </div>
            <h2 class="text-3xl font-extrabold text-slate-900">แปลงเลขที่ {{ land.tf_number }}</h2>
            <p class="text-sm text-slate-500">ระวาง ส.ป.ก.: <span class="font-semibold text-slate-700">{{ land.spk_area }}</span></p>
          </div>

          <div class="sm:text-right">
            <span class="inline-block px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl text-sm font-bold shadow-2xs">
              {{ land.land_status_name }}
            </span>
          </div>
        </div>

        <!-- 1. Land Details Grid -->
        <div>
          <h3 class="text-base font-bold text-slate-800 mb-4 flex items-center">
            <span class="w-2 h-5 bg-emerald-600 rounded-full mr-2"></span>
            รายละเอียดที่ดินและที่ตั้ง
          </h3>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div class="p-4 bg-slate-50 rounded-2xl">
              <span class="text-xs text-slate-400 font-medium">ที่ตั้ง (ซอย)</span>
              <p class="font-bold text-slate-800 mt-1">ซอย {{ land.current_soi }}</p>
            </div>
            <div class="p-4 bg-slate-50 rounded-2xl">
              <span class="text-xs text-slate-400 font-medium">เลขที่ / เล่มที่</span>
              <p class="font-bold text-slate-800 mt-1">{{ land.number || '-' }} / {{ land.volume || '-' }}</p>
            </div>
            <div class="p-4 bg-slate-50 rounded-2xl">
              <span class="text-xs text-slate-400 font-medium">เนื้อที่คำนวณ</span>
              <p class="font-bold text-emerald-600 mt-1">
                {{ land.rai }} ไร่ {{ land.ngan }} งาน {{ land.square_wa }} วา
              </p>
            </div>
            <div class="p-4 bg-slate-50 rounded-2xl">
              <span class="text-xs text-slate-400 font-medium">การใช้ประโยชน์</span>
              <p class="font-bold text-slate-800 mt-1">{{ land.land_use_type || '-' }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
            <div class="p-4 bg-slate-50 rounded-2xl">
              <span class="text-xs text-slate-400 font-medium">ที่อยู่แปลงที่ดิน</span>
              <p class="font-medium text-slate-800 mt-1">
                บ้านเลขที่ {{ land.l_house_number || '-' }} หมู่ที่ {{ land.l_village_number || '-' }} 
                ตำบล{{ land.l_subdistrict || 'กรุงชิง' }} อำเภอ{{ land.l_district || 'นบพิตำ' }}
              </p>
            </div>
            <div class="p-4 bg-slate-50 rounded-2xl">
              <span class="text-xs text-slate-400 font-medium">พิกัดภูมิศาสตร์ (Lat, Lng)</span>
              <p class="font-mono font-medium text-slate-800 mt-1">
                {{ land.lat && land.lng ? `${land.lat}, ${land.lng}` : 'ยังไม่ระบุพิกัด' }}
              </p>
            </div>
          </div>

          <div v-if="land.notation" class="p-4 bg-amber-50/60 border border-amber-100 rounded-2xl mt-4 text-sm">
            <span class="text-xs font-bold text-amber-800">บันทึกเพิ่มเติม / หมายเหตุ:</span>
            <p class="text-slate-700 mt-1">{{ land.notation }}</p>
          </div>
        </div>

        <!-- 2. Citizen Owner Information -->
        <div class="pt-6 border-t border-slate-100">
          <h3 class="text-base font-bold text-slate-800 mb-4 flex items-center">
            <span class="w-2 h-5 bg-blue-600 rounded-full mr-2"></span>
            ข้อมูลราษฎรผู้ได้รับสิทธิ์
          </h3>

          <div v-if="land.id_card" class="p-6 bg-blue-50/40 border border-blue-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="text-lg font-bold text-slate-900">
                {{ land.prefix_name || '' }} {{ land.first_name }} {{ land.last_name }}
              </div>
              <p class="text-xs text-slate-600">
                เลขประจำตัวประชาชน: <span class="font-mono font-bold text-slate-800">{{ land.id_card }}</span>
              </p>
              <p class="text-xs text-slate-600">
                เบอร์โทรศัพท์: <span class="font-mono font-medium text-slate-800">{{ land.phone_number || '-' }}</span>
              </p>
            </div>

            <router-link
              :to="`/citizens/${land.id_card}`"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition shrink-0 text-center"
            >
              ดูประวัติราษฎร
            </router-link>
          </div>

          <div v-else class="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-sm">
            ยังไม่มีข้อมูลราษฎรผู้ถือครองแปลงนี้
          </div>
        </div>

        <!-- 3. Heirs Information -->
        <div class="pt-6 border-t border-slate-100">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-slate-800 flex items-center">
              <span class="w-2 h-5 bg-purple-600 rounded-full mr-2"></span>
              ทายาทผู้มีสิทธิ์สืบทอด ({{ heirs.length }})
            </h3>

            <router-link
              v-if="land.id_card && authStore.isLandOfficer"
              :to="`/heirs/create?citizen_id=${land.id_card}`"
              class="text-xs font-semibold text-purple-600 hover:underline"
            >
              + เพิ่มทายาท
            </router-link>
          </div>

          <div v-if="heirs.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="heir in heirs"
              :key="heir.heir_id"
              class="p-4 bg-purple-50/30 border border-purple-100 rounded-2xl space-y-1 text-xs"
            >
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-800 text-sm">{{ heir.prefix_name || '' }} {{ heir.first_name }} {{ heir.last_name }}</span>
                <span class="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md font-semibold text-2xs">{{ heir.relation_name }}</span>
              </div>
              <p class="text-slate-500">เบอร์โทรศัพท์: <span class="font-mono text-slate-700">{{ heir.phone_number || '-' }}</span></p>
            </div>
          </div>

          <p v-else class="text-xs text-slate-400 italic">ยังไม่มีข้อมูลทายาทในระบบ</p>
        </div>

        <!-- 4. Document Attachments -->
        <div class="pt-6 border-t border-slate-100">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-slate-800 flex items-center">
              <span class="w-2 h-5 bg-amber-600 rounded-full mr-2"></span>
              เอกสารและรูปภาพแนบ ({{ documents.length }})
            </h3>

            <label
              v-if="authStore.isLandOfficer"
              class="cursor-pointer px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
            >
              <input type="file" @change="handleFileUpload" class="hidden" accept="image/*,.pdf" />
              + แนบไฟล์เอกสาร
            </label>
          </div>

          <div v-if="documents.length > 0" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              v-for="doc in documents"
              :key="doc.id"
              class="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-3"
            >
              <div class="space-y-1">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p class="text-xs font-bold text-slate-800 truncate" :title="doc.original_name">{{ doc.original_name }}</p>
                </div>
                <p class="text-2xs text-slate-400">{{ (doc.file_size / 1024).toFixed(1) }} KB</p>
              </div>

              <div class="flex space-x-2 pt-2 border-t border-slate-200">
                <a
                  :href="`http://localhost:3000/${doc.file_path}`"
                  target="_blank"
                  class="flex-1 py-1 text-center bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  เปิดดูไฟล์
                </a>
                <button
                  v-if="authStore.isAdmin"
                  @click="deleteFile(doc.id)"
                  class="p-1 text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="ลบไฟล์"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <p v-else class="text-xs text-slate-400 italic">ไม่มีเอกสารแนบในแปลงที่ดินนี้</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { landApi } from '@/api/landApi';
import { useAuthStore } from '@/stores/authStore';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Swal from 'sweetalert2';

const route = useRoute();
const authStore = useAuthStore();

const land = ref(null);
const heirs = ref([]);
const documents = ref([]);
const loading = ref(true);

const loadDetail = async () => {
  loading.value = true;
  try {
    const res = await landApi.getLandDetail(route.params.id);
    land.value = res.data.land;
    heirs.value = res.data.heirs;
    documents.value = res.data.documents;
  } catch (error) {
    console.error('Failed to load land detail:', error);
  } finally {
    loading.value = false;
  }
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('id_land', route.params.id);
  formData.append('category', 'land_title');

  try {
    await landApi.uploadDocument(formData);
    Swal.fire({
      icon: 'success',
      title: 'อัปโหลดเอกสารสำเร็จ',
      timer: 1500,
      showConfirmButton: false
    });
    loadDetail();
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'อัปโหลดไม่สำเร็จ',
      text: err.message
    });
  }
};

const deleteFile = async (fileId) => {
  const confirm = await Swal.fire({
    title: 'ลบเอกสารนี้?',
    text: 'คุณต้องการลบเอกสารนี้ออกจากระบบหรือไม่',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก'
  });

  if (confirm.isConfirmed) {
    try {
      await landApi.deleteDocument(fileId);
      loadDetail();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: err.message });
    }
  }
};

onMounted(() => {
  loadDetail();
});
</script>
