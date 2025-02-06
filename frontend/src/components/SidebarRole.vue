<template>
  <div class="sidebar navigator-color is-flex is-flex-direction-column" :class="{ expanded: isExpanded }">
    <div class="center-container py-3" @click="toggleSidebar">
      <div class="sidebar-item">
        <img src="@/assets/icons/menu-white.png" width="24" height="24" alt="Menu Icon" />
        <span class="ml-2 has-text-white sidebar-text">logo</span>
      </div>
    </div>

    <div class="image-container">
      <RouterLink to="/" class="sidebar-item has-text-white" active-class="is-active" exact-active-class="is-active">
        <img src="@/assets/icons/home-white.png" width="34" height="34" alt="Home Icon" />
        <span class="ml-2 sidebar-text">หน้าแรก</span>
        <div class="underline"></div>
      </RouterLink>

      <div class="image-container">
      <RouterLink to="/admin" class="sidebar-item has-text-white" active-class="is-active" exact-active-class="is-active">
        <img src="@/assets/icons/admin.png" width="34" height="34" alt="Home Icon" />
        <span class="ml-2 sidebar-text">ผู้ดุแลระบบ</span>
        <div class="underline"></div>
      </RouterLink>

      <RouterLink to="/search" class="sidebar-item has-text-white" active-class="is-active" exact-active-class="is-active">
        <img src="@/assets/icons/search.png" width="34" height="34" alt="Search Icon" />
        <span class="ml-2 sidebar-text">ค้นหา</span>
        <div class="underline"></div>
      </RouterLink>

      <Accordion>
        <AccordionItem ref="dashboardItem">
          <template #accordion-trigger>
            <div class="sidebar-item" @click="handleAccordionItemClick('dashboardItem')" :class="{'is-active': currentRoute.startsWith('/dashboard')}">
              <img class="img" src="@/assets/icons/dashboard-white.png" width="34" height="34" alt="Dashboard Icon" />
              <span class="ml-2 sidebar-text has-text-white">แดชบอร์ด</span>
              <div class="underline"></div>
            </div>
          </template>
          <template #accordion-content>
            <RouterLink to="/dashboard" class="menu-link menu-item">สรุปการใช้ประโยชน์ที่ดิน</RouterLink>
            <div class="menu-item">สรุปผลการจัดสรรที่ดิน</div>
          </template>
        </AccordionItem>

        <AccordionItem ref="dataItem">
          <template #accordion-trigger>
            <div class="sidebar-item" @click="handleAccordionItemClick('dataItem')" :class="{'is-active': currentRoute.startsWith('/land_data')}">
              <img class="img" src="@/assets/icons/data-group-white.png" width="34" height="34" alt="Data Group Icon" />
              <span class="ml-2 sidebar-text has-text-white">ข้อมูล สปก.</span>
              <div class="underline"></div>
            </div>
          </template>
          <template #accordion-content>
            <RouterLink to="/land_data" class="menu-link menu-item">รายละเอียดสิทธิการใช้ที่ดิน</RouterLink>
            <RouterLink to="/dashboard" class="menu-link menu-item">ข้อมูลราษฎร</RouterLink>  <RouterLink to="/dashboard" class="menu-link menu-item">ข้อมูลทายาท</RouterLink>  </template>
        </AccordionItem>
      </Accordion>

      <RouterLink to="/history" class="sidebar-item has-text-white" active-class="is-active" exact-active-class="is-active">
        <img src="@/assets/icons/history-white.png" width="34" height="34" alt="History Icon" />
        <span class="ml-2 sidebar-text">ประวัติข้อมูล</span>
        <div class="underline"></div>
      </RouterLink>

      <RouterLink to="/upload_files" class="sidebar-item has-text-white" active-class="is-active" exact-active-class="is-active">
        <img src="@/assets/icons/addfile-white.png" width="34" height="34" alt="Add File Icon" />
        <span class="ml-2 sidebar-text">เพิ่มข้อมูล</span>
        <div class="underline"></div>
      </RouterLink>
    </div>

    <div class="center-container py-3" v-if="!isLogOut" @click="outOfSystem" style="cursor: pointer;">
      <div class="sidebar-item">
        <img src="@/assets/icons/logout-white.png" width="24" height="24" alt="Logout Icon" />
        <span class="ml-2 sidebar-text">ออกจากระบบ</span>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import Accordion from './accordion.vue';
import AccordionItem from './accordion-item.vue';
import { useUserStore } from '@/stores/useUserStore';
import {useRoute} from 'vue-router'; // import

export default {
  name: 'Sidebar',
  components: {
    Accordion,
    AccordionItem
  },
  data() {
    return {
      isExpanded: false,
      isLogOut: false,
      currentRoute: "", // เพิ่ม currentRoute
    };
  },
  methods: {
    toggleSidebar() {
      this.isExpanded = !this.isExpanded;
      // Always close accordions when clicking the logo
      if (this.$refs.dashboardItem) {
        this.$refs.dashboardItem.close();
      }
      if (this.$refs.dataItem) {
        this.$refs.dataItem.close();
      }
    },
    handleAccordionItemClick(itemRef) {
      // Expand the sidebar if it's not already expanded
      if (!this.isExpanded) {
        this.isExpanded = true;
      }
      // *Don't* call toggle here.  Let the @click on sidebar-item handle it.
    },
    async outOfSystem() {
      const userStore = useUserStore();
      await userStore.out_of_system();
      this.isLogOut = true;
    },
  },
    watch: { // เพิ่ม watcher
    '$route'(to, from) {
      this.currentRoute = to.path; // อัปเดต currentRoute เมื่อ route เปลี่ยน
    }
  },
  mounted() { // เพิ่ม mounted hook
    this.currentRoute = useRoute().path; // กำหนดค่าเริ่มต้น currentRoute
  }
};
</script>

<style scoped>
/* styles remain the same (styles เหมือนเดิม) */
.sidebar {
  position: fixed;
  flex-direction: column;
  flex-wrap: nowrap;
  top: 0;
  left: 0;
  width: 70px; /* เพิ่ม width เริ่มต้นให้ sidebar */
  height: 100%;
  overflow: visible;
  z-index: 10000;
  transition: width 0.3s ease;
   background-color:#b81c1c;
}

.sidebar.expanded {
  width: 15%;
    .menu-item{
      font-size: 1rem;
    }
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  cursor: pointer;
  justify-content: center; /* จัดให้อยู่ตรงกลางเมื่อ sidebar ถูกย่อ */
  position: relative; /* เพิ่ม position relative */
}

/* จัดให้ item ชิดซ้ายเมื่อ sidebar ขยาย */
.sidebar.expanded .sidebar-item {
  justify-content: flex-start;
}

.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-item.is-active .underline{
  display: block;
}

.sidebar-item img {
  max-width: 100%;
  height: auto;
  display: flex;
}

.image-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center; /* จัดให้อยู่ตรงกลางเมื่อ sidebar ถูกย่อ */
}

/* จัดให้ items ชิดซ้ายเมื่อ sidebar ขยาย */
.sidebar.expanded .image-container{
    align-items: flex-start;
}

.menu-link,
.menu-item {
  padding: 5px 10px;
  cursor: pointer;
  color: #ffffff;
    white-space: nowrap; /* ป้องกันการขึ้นบรรทัดใหม่ */
    overflow: hidden;    /* ซ่อนข้อความส่วนที่เกิน */
    text-overflow: ellipsis; /* แสดง ... เมื่อข้อความเกิน */
    display: block; /* ทำให้ RouterLink เป็น block-level */
    font-size: 0.875rem;
}

.menu-link:hover,
.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ซ่อนข้อความเมื่อ sidebar ถูกย่อ */
.sidebar:not(.expanded) .sidebar-text {
    display: none;
}

/* แสดงข้อความเมื่อ sidebar ขยาย */
.sidebar.expanded .sidebar-text {
    display: inline; /* หรือ display: block; ขึ้นอยู่กับ layout ที่ต้องการ */
}

/* ลด padding-left ของ accordion__item เมื่อ sidebar ถูกย่อ*/
.sidebar:not(.expanded) .accordion__item {
  padding-left: 10px; /* ลด padding-left ลง */
  
}

.sidebar:not(.expanded) .sidebar-item img {
  max-width: none !important; /* ยกเลิก max-width */
}

.underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: white;
  display: none; /* ซ่อนไว้เริ่มต้น */
}

</style>