<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
      <!-- Logo and Header -->
      <div class="text-center space-y-2">
        <div class="w-16 h-16 bg-emerald-600 text-white font-bold text-2xl rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
          ส
        </div>
        <h2 class="text-2xl font-bold text-slate-900 pt-2">เข้าสู่ระบบเจ้าหน้าที่</h2>
        <p class="text-xs text-slate-500">ระบบบริหารจัดการข้อมูลที่ดินและราษฎร ส.ป.ก. 4-01</p>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-700 flex items-center space-x-2">
        <svg class="w-4 h-4 shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            ชื่อผู้ใช้งาน (Username)
          </label>
          <div class="relative">
            <input
              v-model="form.username"
              type="text"
              required
              placeholder="กรอกชื่อผู้ใช้..."
              class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
            />
            <svg class="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            รหัสผ่าน (Password)
          </label>
          <div class="relative">
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="กรอกรหัสผ่าน..."
              class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
            />
            <svg class="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center space-x-2"
        >
          <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ' }}</span>
        </button>
      </form>

      <!-- Quick Demo Login Buttons -->
      <div class="pt-4 border-t border-slate-100">
        <p class="text-xs text-center text-slate-400 font-medium mb-3">บัญชีทดสอบด่วน (Quick Demo Login):</p>
        <div class="grid grid-cols-3 gap-2">
          <button
            @click="fillDemo('admin', 'Admin@123456')"
            class="p-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition text-center"
          >
            Admin
          </button>
          <button
            @click="fillDemo('officer_land', 'Admin@123456')"
            class="p-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition text-center"
          >
            เจ้าหน้าที่ ส.ป.ก.
          </button>
          <button
            @click="fillDemo('officer_legal', 'Admin@123456')"
            class="p-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition text-center"
          >
            นิติกร
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  username: '',
  password: ''
});

const loading = ref(false);
const errorMessage = ref('');

const fillDemo = (u, p) => {
  form.value.username = u;
  form.value.password = p;
  handleLogin();
};

const handleLogin = async () => {
  if (!form.value.username || !form.value.password) return;

  loading.value = true;
  errorMessage.value = '';

  try {
    await authStore.login(form.value.username, form.value.password);
    router.push('/');
  } catch (error) {
    errorMessage.value = error.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
  } finally {
    loading.value = false;
  }
};
</script>
