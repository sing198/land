<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">
          {{ isEdit ? `แก้ไขข้อมูลแปลงที่ดิน (แปลงเลขที่ ${form.tf_number})` : 'บันทึกข้อมูลแปลงที่ดินใหม่' }}
        </h2>
        <p class="text-sm text-slate-500">กรอกข้อมูลรายละเอียดแปลงที่ดิน ส.ป.ก. 4-01 ให้ครบถ้วน</p>
      </div>

      <router-link
        to="/lands"
        class="text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
      >
        ยกเลิก
      </router-link>
    </div>

    <!-- Form Card -->
    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 1. General Plot Info -->
        <div>
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
            <span class="w-2 h-4 bg-emerald-600 rounded-full mr-2"></span>
            ข้อมูลเลขที่แปลงและระวาง
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                แปลงเลขที่ <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.tf_number"
                type="text"
                required
                placeholder="เช่น SPK-001"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                ระวาง ส.ป.ก. <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.spk_area"
                type="text"
                required
                placeholder="เช่น 4925-TEST-01"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">เลขที่</label>
              <input
                v-model="form.number"
                type="text"
                placeholder="เช่น 2345"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">เล่มที่</label>
              <input
                v-model="form.volume"
                type="text"
                placeholder="เช่น 12"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>
          </div>
        </div>

        <!-- 2. Location & Status -->
        <div class="pt-6 border-t border-slate-100">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
            <span class="w-2 h-4 bg-emerald-600 rounded-full mr-2"></span>
            ที่ตั้งและสถานะที่ดิน
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                ที่ตั้ง (ซอย) <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.current_soi"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              >
                <option v-for="soi in 13" :key="soi" :value="soi">ซอย {{ soi }}</option>
                <option :value="0">ซอย 0 (ถนนสายหลัก)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                สถานะที่ดิน <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.current_land_status"
                required
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              >
                <option v-for="st in commonStore.landStatuses" :key="st.value" :value="st.value">
                  {{ st.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">ประเภทการใช้ประโยชน์</label>
              <select
                v-model="form.land_use_type"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              >
                <option value="ยางพารา">ยางพารา</option>
                <option value="สวนผลไม้">สวนผลไม้</option>
                <option value="ปศุสัตว์">ปศุสัตว์</option>
                <option value="พืชไร่">พืชไร่</option>
                <option value="ที่อยู่อาศัย">ที่อยู่อาศัย</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">บ้านเลขที่</label>
              <input
                v-model="form.l_house_number"
                type="text"
                placeholder="เช่น 12/4"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">หมู่ที่</label>
              <input
                v-model="form.l_village_number"
                type="text"
                placeholder="เช่น 3"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">ตำบล</label>
              <input
                v-model="form.l_subdistrict"
                type="text"
                placeholder="กรุงชิง"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">อำเภอ</label>
              <input
                v-model="form.l_district"
                type="text"
                placeholder="นบพิตำ"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>
          </div>
        </div>

        <!-- 3. Land Area (Rai, Ngan, Wa) -->
        <div class="pt-6 border-t border-slate-100">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
            <span class="w-2 h-4 bg-emerald-600 rounded-full mr-2"></span>
            ขนาดเนื้อที่
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">ไร่</label>
              <input
                v-model.number="form.rai"
                type="number"
                min="0"
                step="1"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">งาน</label>
              <input
                v-model.number="form.ngan"
                type="number"
                min="0"
                max="3"
                step="1"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">ตารางวา</label>
              <input
                v-model.number="form.square_wa"
                type="number"
                min="0"
                max="99.99"
                step="0.01"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>
            <div class="p-3 bg-emerald-50 rounded-xl text-center">
              <span class="text-xs text-slate-500 font-medium">รวมเนื้อที่คำนวณ</span>
              <p class="text-base font-bold text-emerald-700">{{ calculatedTotalRai }} ไร่</p>
            </div>
          </div>
        </div>

        <!-- 4. Citizen Owner Autocomplete -->
        <div class="pt-6 border-t border-slate-100">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
            <span class="w-2 h-4 bg-emerald-600 rounded-full mr-2"></span>
            ราษฎรผู้ได้รับสิทธิ์
          </h3>

          <div class="relative">
            <label class="block text-xs font-bold text-slate-700 mb-1.5">
              ค้นหาและเลือกราษฎร (พิมพ์ชื่อ, นามสกุล หรือเลขบัตรประชาชน)
            </label>
            <input
              v-model="citizenSearchText"
              @input="handleCitizenSearch"
              type="text"
              placeholder="พิมพ์ชื่อราษฎรเพื่อค้นหา..."
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
            />

            <!-- Autocomplete Dropdown -->
            <div
              v-if="citizenSuggestions.length > 0"
              class="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 max-h-48 overflow-y-auto z-20"
            >
              <div
                v-for="c in citizenSuggestions"
                :key="c.id_card"
                @click="selectCitizen(c)"
                class="p-3 hover:bg-emerald-50 cursor-pointer border-b border-slate-100 last:border-0 text-xs"
              >
                <span class="font-bold text-slate-800">{{ c.prefix_name }} {{ c.first_name }} {{ c.last_name }}</span>
                <span class="text-slate-400 ml-2 font-mono">({{ c.id_card }})</span>
              </div>
            </div>

            <!-- Selected Citizen Indicator -->
            <div v-if="form.id_card" class="mt-2 text-xs font-semibold text-emerald-700 flex items-center">
              <svg class="w-4 h-4 mr-1 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              ราษฎรที่ผูกสิทธิ์: {{ selectedCitizenName }} ({{ form.id_card }})
              <button @click="clearCitizen" type="button" class="ml-3 text-red-500 hover:underline">ยกเลิก</button>
            </div>
          </div>
        </div>

        <!-- 5. Coordinates & Map Picker -->
        <div class="pt-6 border-t border-slate-100">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center">
              <span class="w-2 h-4 bg-emerald-600 rounded-full mr-2"></span>
              พิกัดแผนที่ (Latitude & Longitude)
            </h3>
            <button
              @click="isPickerOpen = true"
              type="button"
              class="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition shadow-xs flex items-center space-x-1"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>เลือกพิกัดจากแผนที่</span>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">ละติจูด (Latitude)</label>
              <input
                v-model.number="form.lat"
                type="number"
                step="any"
                placeholder="เช่น 8.662307"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">ลองจิจูด (Longitude)</label>
              <input
                v-model.number="form.lng"
                type="number"
                step="any"
                placeholder="เช่น 99.851099"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>
          </div>
        </div>

        <!-- 6. Additional Notes -->
        <div class="pt-6 border-t border-slate-100">
          <label class="block text-xs font-bold text-slate-700 mb-1.5">บันทึกข้อความ / หมายเหตุเพิ่มเติม</label>
          <textarea
            v-model="form.notation"
            rows="3"
            placeholder="ระบุข้อความหรือหมายเหตุ..."
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div class="pt-6 border-t border-slate-100 flex items-center justify-end space-x-3">
          <router-link
            to="/lands"
            class="px-6 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold rounded-xl transition"
          >
            ยกเลิก
          </router-link>

          <button
            type="submit"
            :disabled="submitting"
            class="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center space-x-2"
          >
            <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isEdit ? 'บันทึกการแก้ไข' : 'บันทึกแปลงที่ดิน' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Map Picker Modal -->
    <CoordinatePickerModal
      :is-open="isPickerOpen"
      :initial-lat="form.lat"
      :initial-lng="form.lng"
      @close="isPickerOpen = false"
      @select="handleCoordinateSelect"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { landApi } from '@/api/landApi';
import { citizenApi } from '@/api/citizenApi';
import { useCommonStore } from '@/stores/commonStore';
import CoordinatePickerModal from '@/components/map/CoordinatePickerModal.vue';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const commonStore = useCommonStore();

const isEdit = computed(() => !!route.params.id);
const submitting = ref(false);
const isPickerOpen = ref(false);

const citizenSearchText = ref('');
const citizenSuggestions = ref([]);
const selectedCitizenName = ref('');

const form = ref({
  tf_number: '',
  spk_area: '',
  number: '',
  volume: '',
  l_house_number: '',
  current_soi: 0,
  rai: 0,
  ngan: 0,
  square_wa: 0,
  l_subdistrict: 'กรุงชิง',
  l_district: 'นบพิตำ',
  l_village_number: '',
  land_use_type: 'ยางพารา',
  notation: '',
  current_land_status: 1,
  id_card: '',
  lat: null,
  lng: null,
});

const calculatedTotalRai = computed(() => {
  const r = Number(form.value.rai) || 0;
  const n = Number(form.value.ngan) || 0;
  const w = Number(form.value.square_wa) || 0;
  return (r + (n / 4) + (w / 400)).toFixed(2);
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
  form.value.id_card = c.id_card;
  selectedCitizenName.value = `${c.prefix_name || ''} ${c.first_name} ${c.last_name}`;
  citizenSuggestions.value = [];
  citizenSearchText.value = '';
};

const clearCitizen = () => {
  form.value.id_card = '';
  selectedCitizenName.value = '';
};

const handleCoordinateSelect = ({ lat, lng }) => {
  form.value.lat = lat;
  form.value.lng = lng;
};

const loadInitialData = async () => {
  if (isEdit.value) {
    try {
      const res = await landApi.getLandDetail(route.params.id);
      const l = res.data.land;
      form.value = {
        tf_number: l.tf_number,
        spk_area: l.spk_area,
        number: l.number || '',
        volume: l.volume || '',
        l_house_number: l.l_house_number || '',
        current_soi: l.current_soi || 0,
        rai: Number(l.rai) || 0,
        ngan: Number(l.ngan) || 0,
        square_wa: Number(l.square_wa) || 0,
        l_subdistrict: l.l_subdistrict || 'กรุงชิง',
        l_district: l.l_district || 'นบพิตำ',
        l_village_number: l.l_village_number || '',
        land_use_type: l.land_use_type || 'ยางพารา',
        notation: l.notation || '',
        current_land_status: l.current_land_status || 1,
        id_card: l.id_card || '',
        lat: l.lat,
        lng: l.lng,
      };
      if (l.first_name) {
        selectedCitizenName.value = `${l.prefix_name || ''} ${l.first_name} ${l.last_name}`;
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'ไม่พบข้อมูล', text: error.message });
      router.push('/lands');
    }
  }
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    if (isEdit.value) {
      await landApi.updateLand(route.params.id, form.value);
      Swal.fire({ icon: 'success', title: 'บันทึกการแก้ไขสำเร็จ', timer: 1500, showConfirmButton: false });
    } else {
      await landApi.createLand(form.value);
      Swal.fire({ icon: 'success', title: 'เพิ่มแปลงที่ดินสำเร็จ', timer: 1500, showConfirmButton: false });
    }
    router.push('/lands');
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'บันทึกข้อมูลไม่สำเร็จ',
      text: error.message || 'กรุณาตรวจสอบความถูกต้องของข้อมูล'
    });
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  commonStore.fetchMasterData();
  loadInitialData();
});
</script>
