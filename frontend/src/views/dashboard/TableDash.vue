<template>
    <div class="p-1">
        <p class="py-1 is-size-4 is-size-6-mobile has-text-centered titleBgColor mt-1"> ผลการจัดพื้นที่ในเขตปฏิรูปที่ดิน ชุมชนสาธิตวลัยลักษณ์พัฒนา จำนวนทั้งหมด</p> <div class="p-3"></div>
      <div class="table-container">
        <table class="table is-striped is-bordered is-hoverable is-fullwidth">
          <thead class="table-header">
            <tr>
              <!-- Select All Checkbox -->
              <th><input type="checkbox" :checked="isAllSelected" @click="toggleSelectAll"></th> 
              <th>ซอย</th>
              <th>ที่ดิน</th>
              <th>สปก</th>
              <th>โฉนดเพื่อการเกษตร</th>
              <th>พื้นที่บุกรุก.</th>
              <th>พื้นที่ไม่มีผู้ถือครอง.</th>
              <th>จำนวนราษฎร</th>
              <th>จำนวนไร่</th>
            </tr>
          </thead>
          <tbody>
            <!-- Rows (including result row) -->
            <tr v-for="(row, index) in rows" :key="row.id" v-show="!selectedRows.includes(row.id)">
              <td>
                <input type="checkbox" v-model="selectedRows" :value="row.id" @change="calculateResults">
              </td>
              <td>{{ row.soi }}</td>
              <td>{{ row.land }}</td>
              <td>{{ row.spaok }}</td>
              <td>{{ row.agriculture_title }}</td>
              <td>{{ row.occupied_area }}</td>
              <td>{{ row.unclaimed_area }}</td>
              <td>{{ row.population }}</td>
              <td>{{ row.rai }}</td>
            </tr>
            <!-- Result Row (Total) -->
            <tr v-if="!selectedRows.includes(13)">
              <td></td>
              <td>ผลลัพธ์</td>
              <td>{{ totalLand }}</td>
              <td>{{ totalSpaok }}</td>
              <td>{{ totalAgricultureTitle }}</td>
              <td>{{ totalOccupiedArea }}</td>
              <td>{{ totalUnclaimedArea }}</td>
              <td>{{ totalPopulation }}</td>
              <td>{{ totalRai }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Displaying Calculated Results -->
      <!-- <div class="results mt-3">
        <h4>Results:</h4>
        <p>ที่ดิน (Land): {{ totalLand }}</p>
        <p>สปก (Spaok): {{ totalSpaok }}</p>
        <p>โฉนดเพื่อการเกษตร (Agriculture Title): {{ totalAgricultureTitle }}</p>
        <p>พื้นที่บุกรุก (Occupied Area): {{ totalOccupiedArea }}</p>
        <p>พื้นที่ไม่มีผู้ถือครอง (Unclaimed Area): {{ totalUnclaimedArea }}</p>
        <p>จำนวนราษฎร (Population): {{ totalPopulation }}</p>
        <p>จำนวนไร่ (Rai): {{ totalRai }}</p>
      </div> -->
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        // Updated rows data from id 1 to id 13
        rows: [
          { id: 1, soi: '0', land: 50, spaok: 20, agriculture_title: 10, occupied_area: 5, unclaimed_area: 10, population: 200, rai: 176 },
          { id: 2, soi: '1', land: 60, spaok: 25, agriculture_title: 15, occupied_area: 7, unclaimed_area: 12, population: 180, rai: 211 },
          { id: 3, soi: '2', land: 70, spaok: 30, agriculture_title: 18, occupied_area: 8, unclaimed_area: 14, population: 220, rai: 225 },
          { id: 4, soi: '3', land: 80, spaok: 35, agriculture_title: 20, occupied_area: 10, unclaimed_area: 16, population: 240, rai: 250 },
          { id: 5, soi: '4', land: 90, spaok: 40, agriculture_title: 25, occupied_area: 12, unclaimed_area: 18, population: 260, rai: 275 },
          { id: 6, soi: '5', land: 100, spaok: 45, agriculture_title: 30, occupied_area: 14, unclaimed_area: 20, population: 280, rai: 300 },
          { id: 7, soi: '6', land: 110, spaok: 50, agriculture_title: 35, occupied_area: 16, unclaimed_area: 22, population: 300, rai: 325 },
          { id: 8, soi: '7', land: 120, spaok: 55, agriculture_title: 40, occupied_area: 18, unclaimed_area: 24, population: 320, rai: 350 },
          { id: 9, soi: '8', land: 130, spaok: 60, agriculture_title: 45, occupied_area: 20, unclaimed_area: 26, population: 340, rai: 375 },
          { id: 10, soi: '9', land: 140, spaok: 65, agriculture_title: 50, occupied_area: 22, unclaimed_area: 28, population: 360, rai: 400 },
          { id: 11, soi: '10', land: 150, spaok: 70, agriculture_title: 55, occupied_area: 24, unclaimed_area: 30, population: 380, rai: 425 },
          { id: 12, soi: '11', land: 160, spaok: 75, agriculture_title: 60, occupied_area: 26, unclaimed_area: 32, population: 400, rai: 450 },
          { id: 13, soi: '12', land: 170, spaok: 80, agriculture_title: 65, occupied_area: 28, unclaimed_area: 34, population: 420, rai: 475 },
          { id: 14, soi: '13', land: 10, spaok: 10, agriculture_title: 0, occupied_area: 0, unclaimed_area: 0, population: 20, rai: 42 }
        ],
        selectedRows: [], // Holds selected rows' ids
        totalLand: 0,
        totalSpaok: 0,
        totalAgricultureTitle: 0,
        totalOccupiedArea: 0,
        totalUnclaimedArea: 0,
        totalPopulation: 0,
        totalRai: 0,
      };
    },
    computed: {
      // Check if all rows are selected (except the result row)
      isAllSelected() {
        return this.selectedRows.length === this.rows.length - 1; // Exclude the 'result' row
      }
    },
    methods: {
      // Toggle Select All functionality
      toggleSelectAll() {
        if (this.isAllSelected) {
          this.selectedRows = []; // Unselect all if all are selected
        } else {
          this.selectedRows = this.rows.slice(0, -1).map(row => row.id); // Select all rows except the 'result' row
        }
        this.calculateResults(); // Recalculate results when select all is clicked
      },
  
      // Recalculate total results for visible rows
      calculateResults() {
        this.totalLand = 0;
        this.totalSpaok = 0;
        this.totalAgricultureTitle = 0;
        this.totalOccupiedArea = 0;
        this.totalUnclaimedArea = 0;
        this.totalPopulation = 0;
        this.totalRai = 0;
  
        // Loop through each row and add up the values for rows that are not selected (i.e., visible)
        this.rows.forEach(row => {
          if (!this.selectedRows.includes(row.id)) {
            this.totalLand += row.land;
            this.totalSpaok += row.spaok;
            this.totalAgricultureTitle += row.agriculture_title;
            this.totalOccupiedArea += row.occupied_area;
            this.totalUnclaimedArea += row.unclaimed_area;
            this.totalPopulation += row.population;
            this.totalRai += row.rai;
          }
        });
      }
    },
    watch: {
      // Whenever the selectedRows array changes, recalculate the results
      selectedRows: 'calculateResults'
    },
    created() {
      // Initial calculation of results
      this.calculateResults();
    }
  };
  </script>
  
  <style scoped>
  /* Optional: Styling checkboxes */
  input[type="checkbox"] {
    margin: 0;
    padding: 0;
    cursor: pointer;
  }


.p-1 { /* หรือ selector อื่นๆ ที่ระบุ Container หลักของหน้า */
  margin-left: 70px; /* ค่า margin-left เริ่มต้น: เท่ากับความกว้าง Sidebar ตอนย่อ */
  transition: margin-left 0.3s ease; /* เพิ่ม transition เพื่อความสวยงาม */
  padding: 1rem; /* เพิ่ม padding รอบๆ เนื้อหา (เทียบเท่า class p-1 เดิม แต่ระบุใน style scoped เพื่อให้เห็นชัดเจน) */
}

.sidebar.expanded + .p-1 { /* ปรับแก้ selector ให้ตรงกับโครงสร้าง HTML จริงของคุณ */
  margin-left: 15%; /* ค่า margin-left เมื่อ Sidebar ขยาย: เท่ากับความกว้าง Sidebar ตอนขยาย */
}


  </style>
  