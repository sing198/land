<template>
  <div class="min-h-[70vh] flex items-center justify-center py-12 px-4 text-center">
    <div class="max-w-md space-y-4">
      <div class="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto text-3xl font-extrabold shadow-sm">
        404
      </div>
      <h2 class="text-2xl font-bold text-slate-800">ไม่พบหน้าที่คุณต้องการ</h2>
      <p class="text-sm text-slate-500">
        หน้าที่คุณกำลังเรียกหาอาจถูกลบ ย้าย หรือไม่มีอยู่ในระบบ ส.ป.ก.
      </p>
      <div class="pt-4">
        <router-link
          to="/"
          class="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-xs transition"
        >
          กลับหน้าหลัก
        </router-link>
      </div>
    </div>
  </div>
</template>
