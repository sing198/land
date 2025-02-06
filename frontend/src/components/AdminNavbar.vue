<template>
  <div class="header">
    <div class="user-profile">
      <img src="@/assets/icons/profile.png" alt="Valerie Luna" />
      <span>Profile</span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'AdminNavbar',
  setup() {
    const searchQuery = ref(''); // ตัวแปรเก็บคำค้นหา

    const handleSearch = () => {
      console.log('Search function triggered from Navbar Component:', searchQuery.value);
      // TODO: Implement search logic ใน Navbar Component นี้
      // เช่น Filter adminList ที่รับมาจาก Props หรือเรียก API ค้นหา
    };

    return {
      searchQuery,
      handleSearch
    };
  }
};
</script>

<style scoped>
.header {
  background-color: #b81c1c;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  display: flex;
  flex-grow: 1;
  margin-left: 20px;
}

.search-bar input[type="text"] {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px 0 0 5px;
    border-right: none;
    width: 50%;
  }

.search-bar button {
  background-color: #007bff; /* สีปุ่มค้นหา */
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
}

.user-profile {
  display: flex;
  align-items: center;
  margin-left: 1190px;
}

.user-profile img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}


</style>