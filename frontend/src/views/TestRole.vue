<template>
    <div>
      <p>สวัสดี, {{ user.name }}</p>
      <div v-if="user.role === 'admin'">
        <p>ยินดีต้อนรับแอดมิน!</p>
      </div>
      <div v-else-if="user.role === 'officer'">
        <p>ยินดีต้อนรับเจ้าหน้าที่!</p>
      </div>
      <div v-else>
        <p>สวัสดีผู้ใช้ทั่วไป!</p>
      </div>
    </div>
  </template>
  
  <script>
  import roles from '@/role_config';
  export default {
    computed: {
      user() {
        return {
          name: 'ผู้ใช้',
          role: sessionStorage.getItem('role'), // หรือ Vuex
        };
      },
    },
  };
  </script>
  