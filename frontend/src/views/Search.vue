<template>
  <div class="themeColor py-4">
    <div v-if="results.length > 0" class="card"
      style="background-color: #4b3f18; color: white; border-radius: 8px; padding: 16px; max-width: 600px; margin: auto;">
      <header class="card-header" style="background-color: #a0752d; border-radius: 8px;">
        <p class="card-header-title has-text-centered"
          style="width: 100%; color: white; font-weight: bold; font-size: 26px;">
          ข้อมูลที่ดิน
        </p>
      </header>
      <div class="card-content">
        <div class="content">
          <SearchDetail v-for="(item, index) in results" :key="index" :label="item.label" :value="item.value"
            backgroundColor="#5a4518" textColor="white" />
          <footer class="card-footer" v-if="results.length > 0 && (results[0].lat && results[0].long)">
            <a href="#" class="card-footer-item has-text-link" style="color: #a0752d;">ที่ตั้งตำแหน่ง</a>
          </footer>
        </div>
      </div>
    </div>
    <div class="not-found-container" v-else>
      <div class="not-found-content">
        <h1 class="not-found-title">ขออภัย!</h1>
        <p class="not-found-message">ไม่พบแปลงที่ดินนี้ "<span class="search-query">{{ keyword }}</span>"</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SearchDetail from '@/components/SearchDetail.vue';

export default {
  components: {
    SearchDetail
  },
  data() {
    return {
      keyword: '',
      results: [] // Initialize as an empty array
    };
  },
  methods: {
    updateTitle(query) {
      document.title = `ผลการค้นหาสำหรับ: ${query || 'ไม่มีคำค้น'}`;
    },
    async search() {
      try {
        // ใช้ axios เรียก API ที่มี URL ตามที่กำหนด
        const response = await axios.get(`http://localhost:3000/land/search?q=${this.keyword}`);
        console.log('res-data:', response.data.results[0])
        console.log('res-length:', response.data.results.length)
        // เก็บผลลัพธ์ที่ได้รับจาก API ลงใน results
        // this.results = response.data.results; // ปรับตามรูปแบบของข้อมูล API
        this.results = [
          { value: response.data.results[0].tf_number, label: "แปลงเลขที่" },
          { value: response.data.results[0].spk_area, label: "ระวาง ส.ป.ก" },
          { value: response.data.results[0].phone_number, label: "เบอร์โทรศัพท์" },
          { value: response.data.results[0].l_district, label: "ตำบล" },
          { value: response.data.results[0].total_rai, label: "ไร่" },
        ]
        // ถ้าไม่พบข้อมูลใน API, สามารถใช้ mock data แทน
        if (this.results.length === 0) {
          this.results = [];
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // ในกรณีที่เกิดข้อผิดพลาด สามารถใช้ mock data แทน
        this.results = [];
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    // Set title when the route is first entered
    next(vm => {
      vm.updateTitle(to.query.q);
    });
  },
  beforeRouteUpdate(to, from, next) {
    // Update title when the route query changes
    this.updateTitle(to.query.q);
    next();
  },
  watch: {
    '$route.query.q'(newQuery) {
      this.keyword = newQuery || '';
      this.updateTitle(newQuery);
      console.log('new-query:', newQuery)
      if (newQuery == '' || newQuery == null || newQuery == undefined) {
        this.results = []
      } else {
        this.search()
      }
    },
  },
  async mounted() {
    // Initialize keyword from the query parameter if available
    this.keyword = this.$route.query.q || '';
    if (this.keyword === null || this.keyword === '' ||
      this.keyword === undefined || this.keyword.length == 0) {
      return
    } else {
      await this.search()
    }
  },
};
</script>

<style scoped>
.land-info {
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.land-info-container {
  background: #37474F;
  width: 100%;
  padding: 15px 28px 3px;
  color: #fff;
}

.land-details {
  border-radius: 15px;
  background: #F5F1F1;
  width: 100%;
  padding-bottom: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.land-title {
  border-radius: 15px 15px 0 0;
  background: #4C3902;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  width: 100%;
  z-index: 10;
  color: #FDFEFF;
  padding: 22px 70px;
  margin: 0;
}

.info-row {
  border-radius: 5px;
  background: #4C3902;
  display: flex;
  width: 100%;
  max-width: 1198px;
  gap: 20px;
  justify-content: space-between;
  padding: 14px 32px;
  margin-top: 15px;
}

.location-btn {
  color: #4F70DB;
  background: none;
  border: none;
  cursor: pointer;
  margin-top: 14px;
  font: inherit;
  padding: 10px;
}

.location-btn:hover,
.location-btn:focus {
  text-decoration: underline;
  outline: none;
}

.not-found-container {
  display: flex;
  justify-content: center;

  height: 90vh;
  background-color: #f2f2f2;
}

.not-found-content {
  text-align: center;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 500px;
}

.not-found-title {
  font-size: 36px;
  color: #f44336;
  margin-bottom: 20px;
}

.not-found-message {
  font-size: 18px;
  color: #555;
  margin-bottom: 15px;
}

.search-query {
  font-weight: bold;
  color: #2196f3;
}

.not-found-suggestion {
  font-size: 14px;
  color: #777;
  margin-bottom: 25px;
}

.back-button {
  padding: 10px 20px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

@media (max-width: 991px) {
  .land-info-container {
    max-width: 100%;
    font-size: 40px;
    padding: 0 20px;
  }

  .land-details {
    max-width: 100%;
    font-size: 40px;
  }

  .land-title {
    font-size: 26px;
    max-width: 100%;
    padding: 0 20px;
  }

  .info-row {
    max-width: 50%;
    padding: 0 20px;
  }

  .location-btn {
    font-size: 40px;
  }
}
</style>