<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">
          {{ isEdit ? 'แก้ไขข้อมูลราษฎร' : 'บันทึกข้อมูลราษฎรใหม่' }}
        </h2>
        <p class="text-sm text-slate-500">กรอกข้อมูลส่วนบุคคลและที่อยู่ตามทะเบียนราษฎร์</p>
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
        <!-- 1. Identity & Name -->
        <div>
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
            <span class="w-2 h-4 bg-emerald-600 rounded-full mr-2"></span>
            ข้อมูลส่วนบุคคล
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                คำนำหน้าชื่อ <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.prefix_id"
                required
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              >
                <option value="">เลือกคำนำหน้า</option>
                <option v-for="p in commonStore.prefixes" :key="p.value" :value="p.value">
                  {{ p.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                ชื่อจริง <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.first_name"
                type="text"
                required
                placeholder="เช่น สมมุติ"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                นามสกุล <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.last_name"
                type="text"
                required
                placeholder="เช่น รักเกษตร"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                เลขประจำตัวประชาชน 13 หลัก <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.id_card"
                :disabled="isEdit"
                type="text"
                required
                maxlength="13"
                placeholder="เช่น 1100000000011"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:border-emerald-500 focus:outline-hidden transition disabled:bg-slate-100"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">วันเดือนปีเกิด</label>
              <input
                v-model="form.birthday"
                type="date"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">เพศ</label>
              <div class="flex items-center space-x-4 pt-2">
                <label class="flex items-center text-sm text-slate-700 cursor-pointer">
                  <input type="radio" v-model="form.gender" value="male" class="text-emerald-600 focus:ring-emerald-500 mr-2" />
                  ชาย
                </label>
                <label class="flex items-center text-sm text-slate-700 cursor-pointer">
                  <input type="radio" v-model="form.gender" value="female" class="text-emerald-600 focus:ring-emerald-500 mr-2" />
                  หญิง
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Contact & Address -->
        <div class="pt-6 border-t border-slate-100">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
            <span class="w-2 h-4 bg-emerald-600 rounded-full mr-2"></span>
            ที่อยู่และข้อมูลติดต่อ
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">เบอร์โทรศัพท์</label>
              <input
                v-model="form.phone_number"
                type="tel"
                placeholder="เช่น 0832489748"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">ที่ตั้ง (ซอย)</label>
              <select
                v-model="form.soi"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              >
                <option v-for="soi in 13" :key="soi" :value="soi">ซอย {{ soi }}</option>
                <option :value="0">ซอย 0</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">บ้านเลขที่</label>
              <input
                v-model="form.house_number"
                type="text"
                placeholder="เช่น 12/4"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">หมู่ที่</label>
              <input
                v-model="form.village_number"
                type="text"
                placeholder="เช่น 3"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">ตำบล</label>
              <input
                v-model="form.subdistrict"
                type="text"
                placeholder="กรุงชิง"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">อำเภอ</label>
              <input
                v-model="form.district"
                type="text"
                placeholder="นบพิตำ"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">จังหวัด</label>
              <input
                v-model="form.province"
                type="text"
                placeholder="นครศรีธรรมราช"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
              />
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-6 border-t border-slate-100 flex items-center justify-end space-x-3">
          <router-link
            to="/citizens"
            class="px-6 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold rounded-xl transition"
          >
            ยกเลิก
          </router-link>

          <button
            type="submit"
            :disabled="submitting"
            class="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center space-x-2"
          >
            <span>{{ isEdit ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูลราษฎร' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { citizenApi } from '@/api/citizenApi';
import { useCommonStore } from '@/stores/commonStore';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const commonStore = useCommonStore();

const isEdit = computed(() => !!route.params.id_card);
const submitting = ref(false);

const form = ref({
  id_card: '',
  prefix_id: '',
  first_name: '',
  last_name: '',
  birthday: '',
  gender: 'male',
  house_number: '',
  village_number: '',
  subdistrict: 'กรุงชิง',
  district: 'นบพิตำ',
  province: 'นครศรีธรรมราช',
  soi: 0,
  phone_number: ''
});

const loadInitial = async () => {
  if (isEdit.value) {
    try {
      const res = await citizenApi.getCitizenDetail(route.params.id_card);
      const c = res.data.citizen;
      form.value = {
        id_card: c.id_card,
        prefix_id: c.prefix_id || '',
        first_name: c.first_name,
        last_name: c.last_name,
        birthday: c.birthday ? c.birthday.split('T')[0] : '',
        gender: c.gender || 'male',
        house_number: c.house_number || '',
        village_number: c.village_number || '',
        subdistrict: c.subdistrict || 'กรุงชิง',
        district: c.district || 'นบพิตำ',
        province: c.province || 'นครศรีธรรมราช',
        soi: c.soi || 0,
        phone_number: c.phone_number || ''
      };
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'ไม่พบข้อมูล', text: err.message });
      router.push('/citizens');
    }
  }
};

const handleSubmit = async () => {
  if (form.value.id_card.length !== 13) {
    Swal.fire({ icon: 'warning', title: 'ข้อมูลไม่ถูกต้อง', text: 'เลขประจำตัวประชาชนต้องมี 13 หลัก' });
    return;
  }

  submitting.value = true;
  try {
    if (isEdit.value) {
      await citizenApi.updateCitizen(route.params.id_card, form.value);
      Swal.fire({ icon: 'success', title: 'บันทึกการแก้ไขสำเร็จ', timer: 1500, showConfirmButton: false });
    } else {
      await citizenApi.createCitizen(form.value);
      Swal.fire({ icon: 'success', title: 'เพิ่มข้อมูลราษฎรสำเร็จ', timer: 1500, showConfirmButton: false });
    }
    router.push('/citizens');
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: error.message });
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  commonStore.fetchMasterData();
  loadInitial();
});
</script>
