<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">เพิ่มและผูกสิทธิ์ทายาท</h2>
        <p class="text-sm text-slate-500">บันทึกข้อมูลทายาทและผูกความสัมพันธ์กับราษฎรเจ้าของสิทธิ์ที่ดิน ส.ป.ก.</p>
      </div>

      <router-link
        to="/citizens"
        class="text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
      >
        ยกเลิก
      </router-link>
    </div>

    <!-- Form Card -->
    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 1. Citizen Selection (The Land Owner) -->
        <div>
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
            <span class="w-2 h-4 bg-purple-600 rounded-full mr-2"></span>
            1. ราษฎรเจ้าของสิทธิ์ที่ดิน (ผู้ส่งมอบมรดก)
          </h3>

          <div class="relative">
            <label class="block text-xs font-bold text-slate-700 mb-1.5">
              ค้นหาและเลือกราษฎร <span class="text-red-500">*</span>
            </label>
            <input
              v-model="citizenSearchText"
              @input="handleCitizenSearch"
              type="text"
              placeholder="พิมพ์ชื่อ นามสกุล หรือเลขบัตรประชาชนราษฎร..."
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-purple-500 focus:outline-hidden transition"
            />

            <!-- Autocomplete Results -->
            <div
              v-if="citizenSuggestions.length > 0"
              class="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 max-h-48 overflow-y-auto z-20"
            >
              <div
                v-for="c in citizenSuggestions"
                :key="c.id_card"
                @click="selectCitizen(c)"
                class="p-3 hover:bg-purple-50 cursor-pointer border-b border-slate-100 last:border-0 text-xs"
              >
                <span class="font-bold text-slate-800">{{ c.prefix_name }} {{ c.first_name }} {{ c.last_name }}</span>
                <span class="text-slate-400 ml-2 font-mono">({{ c.id_card }})</span>
              </div>
            </div>

            <!-- Selected Citizen Display -->
            <div v-if="form.citizen_id" class="mt-2 p-3 bg-purple-50 border border-purple-100 rounded-xl text-xs font-semibold text-purple-800 flex items-center justify-between">
              <div>
                <span class="text-slate-500">ราษฎรที่เลือก: </span>
                <span class="font-bold text-slate-900">{{ selectedCitizenName }}</span> ({{ form.citizen_id }})
              </div>
              <button @click="clearCitizen" type="button" class="text-red-500 hover:underline">เปลี่ยน</button>
            </div>
          </div>
        </div>

        <!-- 2. Heir Personal Info -->
        <div class="pt-6 border-t border-slate-100">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
            <span class="w-2 h-4 bg-purple-600 rounded-full mr-2"></span>
            2. ข้อมูลทายาทผู้มีสิทธิ์
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                คำนำหน้าชื่อ <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.prefix_id"
                required
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-purple-500 focus:outline-hidden transition"
              >
                <option value="">เลือกคำนำหน้า</option>
                <option v-for="p in commonStore.prefixes" :key="p.value" :value="p.value">
                  {{ p.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                ชื่อจริงทายาท <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.first_name"
                type="text"
                required
                placeholder="กรอกชื่อจริงทายาท"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-purple-500 focus:outline-hidden transition"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                นามสกุลทายาท <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.last_name"
                type="text"
                required
                placeholder="กรอกนามสกุลทายาท"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-purple-500 focus:outline-hidden transition"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                ความสัมพันธ์กับราษฎร <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.relationship_id"
                required
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-purple-500 focus:outline-hidden transition"
              >
                <option value="">เลือกความสัมพันธ์</option>
                <option v-for="r in commonStore.relationships" :key="r.value" :value="r.value">
                  {{ r.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">เบอร์โทรศัพท์ติดต่อ</label>
              <input
                v-model="form.phone_number"
                type="tel"
                placeholder="เช่น 0851122334"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:border-purple-500 focus:outline-hidden transition"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">เลขบัตรประชาชนทายาท</label>
              <input
                v-model="form.id_card"
                type="text"
                maxlength="13"
                placeholder="เลข 13 หลัก (ถ้ามี)"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:border-purple-500 focus:outline-hidden transition"
              />
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-6 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            type="submit"
            :disabled="submitting || !form.citizen_id"
            class="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-md shadow-purple-600/20 transition flex items-center space-x-2"
          >
            <span>บันทึกข้อมูลทายาท</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { heirApi } from '@/api/heirApi';
import { citizenApi } from '@/api/citizenApi';
import { useCommonStore } from '@/stores/commonStore';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const commonStore = useCommonStore();

const submitting = ref(false);
const citizenSearchText = ref('');
const citizenSuggestions = ref([]);
const selectedCitizenName = ref('');

const form = ref({
  citizen_id: '',
  prefix_id: '',
  first_name: '',
  last_name: '',
  relationship_id: '',
  phone_number: '',
  id_card: ''
});

let searchTimeout = null;
const handleCitizenSearch = () => {
  clearTimeout(searchTimeout);
  if (!citizenSearchText.value.trim()) {
    citizenSuggestions.value = [];
    return;
  }
  searchTimeout = setTimeout(async () => {
    try {
      const res = await citizenApi.autocomplete(citizenSearchText.value.trim());
      citizenSuggestions.value = res.data || [];
    } catch (e) {
      citizenSuggestions.value = [];
    }
  }, 250);
};

const selectCitizen = (c) => {
  form.value.citizen_id = c.id_card;
  selectedCitizenName.value = `${c.prefix_name || ''} ${c.first_name} ${c.last_name}`;
  citizenSuggestions.value = [];
  citizenSearchText.value = '';
};

const clearCitizen = () => {
  form.value.citizen_id = '';
  selectedCitizenName.value = '';
};

const checkQueryCitizen = async () => {
  if (route.query.citizen_id) {
    try {
      const res = await citizenApi.getCitizenDetail(route.query.citizen_id);
      const c = res.data.citizen;
      selectCitizen(c);
    } catch (e) {}
  }
};

const handleSubmit = async () => {
  if (!form.value.citizen_id) {
    Swal.fire({ icon: 'warning', title: 'ข้อมูลไม่ครบ', text: 'กรุณาเลือกราษฎรเจ้าของสิทธิ์ก่อน' });
    return;
  }

  submitting.value = true;
  try {
    await heirApi.createHeir(form.value);
    Swal.fire({ icon: 'success', title: 'บันทึกทายาทสำเร็จ', timer: 1500, showConfirmButton: false });
    router.push(`/citizens/${form.value.citizen_id}`);
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: error.message });
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  commonStore.fetchMasterData();
  checkQueryCitizen();
});
</script>
