<template>
  <div class="primary_content">
    <div class="mx-5 py-5">
      <div class="box">
        <h1 class="title has-text-centered">รายละเอียดที่ดิน</h1>
        <div class="py-3 m-5-mobile">
          <form @submit.prevent="creationLand">
            <!-- ซอย -->
            <div class="columns">
              <div class="column">
                <div class="field">
                  <label class="label"><strong class="has-text-danger">*</strong> ที่ตั้งของที่ดิน</label>
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select v-model="formLand.selectedSoi" @change="validateField('selectedSoi')">
                        <option value="" selected>เลือกซอย</option>
                        <option v-for="soi in sois" :key="soi.value" :value="soi.value">
                          {{ soi.label }}
                        </option>
                      </select>
                      <DisplayError v-if="errors.selectedSoi" :err_text="errors.selectedSoi" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- เลือกซอยสถานะที่ดิน -->
              <div class="column">
                <div class="field">
                  <label class="label"><strong class="has-text-danger">*</strong> สถานะที่ดิน</label>
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select v-model="formLand.selectedStatus" @change="validateField('selectedStatus')">
                        <option value="" selected>เลือกซอยสถานะที่ดิน</option>
                        <option v-for="land_status in land_status" :key="land_status.value" :value="land_status.value">
                          {{ land_status.label }}
                        </option>
                      </select>
                      <DisplayError v-if="errors.selectedStatus" :err_text="errors.selectedStatus" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="columns">
              <div class="column is-full">
                <div class="field">
                  <label class="label"><strong class="has-text-danger">*</strong> ชื่อจริง-นามสกุล</label>
                  <div class="control">
                    <input class="input is-normal custom-select" v-model="formLand.full_name" type="text"
                      placeholder="กรุณากรอกชื่อจริง - นามสกุล" @input="searchNames" @change="checkSelectedName" />
                    <DisplayError v-if="errors.full_name" :err_text="errors.full_name" />
                  </div>
                  <!-- แสดงข้อความข้อผิดพลาด -->
                  <div v-if="formLand.full_name && filteredNames.length == 0 && !isNameSelected" class="error-message">
                    ไม่มีชื่อที่ตรงกับการค้นหา
                  </div>
                  <!-- แสดงรายการแนะนำ -->
                  <div v-if="filteredNames.length > 0" class="suggestions mt-1">
                    <ul>
                      <li v-for="name in filteredNames" :key="name.label" @click="selectName(name.label, name.value)">
                        <span class="icon">
                          <i class="fas fa-search"></i>
                        </span> {{ name.label }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- โฉนดที่ดิน -->
            <div class="columns">
              <div class="column is-3">
                <div class="field">
                  <label class="label"><strong class="has-text-danger">*</strong> แปลงเลขที่</label>
                  <div class="control">
                    <input class="input is-normal custom-select" v-model="formLand.tf_number" type="text"
                      @input="validateField('tf_number')" :class="{ 'is-danger': errors.tf_number }"
                      placeholder="กรุณากรอกแปลงเลขที่" />
                    <DisplayError v-if="errors.tf_number" :err_text="errors.tf_number" />
                  </div>
                </div>
              </div>

              <div class="column is-3">
                <div class="field">
                  <label class="label"><strong class="has-text-danger">*</strong> ระวาง ส.ป.ก ที่</label>
                  <div class="control">
                    <input class="input is-normal" :class="{ 'is-danger': errors.spk_area }"
                      @input="validateField('spk_area')" v-model="formLand.spk_area" type="text"
                      placeholder="กรุณากรอกกระวาง ส.ป.ก" />
                    <DisplayError v-if="errors.spk_area" :err_text="errors.spk_area" />
                  </div>
                </div>
              </div>

              <div class="column is-3">
                <div class="field">
                  <label class="label"><strong class="has-text-danger">*</strong> เลขที่</label>
                  <div class="control">
                    <input class="input is-normal custom-select" :class="{ 'is-danger': errors.number }"
                      @input="validateField('number')" v-model="formLand.number" type="text"
                      placeholder="กรุณากรอกเลขที่" />
                    <DisplayError v-if="errors.number" :err_text="errors.number" />
                  </div>
                </div>
              </div>

              <div class="column is-3">
                <div class="field">
                  <label class="label"><strong class="has-text-danger">*</strong> เล่ม</label>
                  <div class="control">
                    <input class="input is-normal custom-select" :class="{ 'is-danger': errors.volume }"
                      @input="validateField('volume')" v-model="formLand.volume" type="text"
                      placeholder="กรุณากรอกเล่มที่" />
                    <DisplayError v-if="errors.volume" :err_text="errors.volume" />
                  </div>
                </div>
              </div>
            </div>

            <!-- อยู่บ้านเลขที่ -->
            <div class="columns">
              <div class="column is-4">
                <div class="field">
                  <label class="label">อยู่บ้านเลขที่</label>
                  <div class="control">
                    <input class="input is-normal" :class="{ 'is-danger': errors.address_house }"
                      @input="validateField('address_house')" v-model="formLand.address_house" type="text"
                      placeholder="กรุณากรอกกอยู่บ้านเลขที่" />
                    <DisplayError v-if="errors.address_house" :err_text="errors.address_house" />
                  </div>
                </div>
              </div>

              <div class="column is-4">
                <div class="field">
                  <label class="label">ตำบล</label>
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select v-model="this.formLand.district" @change="updateVillage">
                        <option value="" selected>เลือกตำบล</option>
                        <option value="หัวตะพาน">หัวตะพาน</option>
                        <option value="ไทรบุรี">ไทรบุรี</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div class="column is-4">
                <div class="field">
                  <label class="label">หมู่ที่</label>
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select v-model="formLand.village">
                        <option value="" selected>เลือกหมู่</option>
                        <option v-for="pfl in village" :key="pfl.value" :value="pfl.value">
                          {{ pfl.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Amount land -->
            <div class="columns">
              <div class="column is-4">
                <div class="field">
                  <label class="label">จำนวนไร่</label>
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select v-model="formLand.rai" :class="{ 'is-danger': errors.rai }"
                        @change="validateField('rai')">
                        <option value="" selected>เลือกจำนวนไร่</option>
                        <option v-for="pfl in rais" :key="pfl.value" :value="pfl.value">
                          {{ pfl.label }}
                        </option>
                      </select>
                      <DisplayError v-if="errors.rai" :err_text="errors.rai" />
                    </div>
                  </div>
                </div>
              </div>
              <!-- งาน -->
              <div class="column is-4">
                <div class="field">
                  <label class="label">จำนวนงาน</label>
                  <div class="control">
                    <input class="input is-normal" v-model="formLand.ngan" @input="validateField('ngan')"
                      :class="{ 'is-danger': errors.ngan }" step="0.01" max="4" type="number"
                      placeholder="กรุณากรอกจำนวนงาน" />
                    <DisplayError v-if="errors.ngan" :err_text="errors.ngan" />
                  </div>
                </div>
              </div>
              <!-- ตารางวา -->
              <div class="column is-4">
                <div class="field">
                  <label class="label">จำนวนตารางวา</label>
                  <div class="control">
                    <input class="input is-normal" @input="validateField('square_wa')" step="0.01"
                      :class="{ 'is-danger': errors.square_wa }" v-model="formLand.square_wa" type="number"
                      placeholder="กรุณากรอกจำนวนตารางวา" max="100" />
                    <DisplayError v-if="errors.square_wa" :err_text="errors.square_wa" />
                  </div>
                </div>
              </div>
            </div>

            <!-- GIS location -->
            <div class="columns">
              <div class="column is-6">
                <div class="field">
                  <label class="label">Lat</label>
                  <div class="control">
                    <input class="input is-normal" @input="validateField('lat')" step="0.000000001"
                      :class="{ 'is-danger': errors.lat }" v-model="formLand.lat" type="number"
                      placeholder="กรุณากรอกรัตติจูด" />
                    <DisplayError v-if="errors.lat" :err_text="errors.lat" />
                  </div>
                </div>
              </div>

              <div class="column is-6">
                <div class="field">
                  <label class="label">Long</label>
                  <div class="control">
                    <input class="input is-normal" @input="validateField('long')" step="0.000000001"
                      :class="{ 'is-danger': errors.long }" v-model="formLand.long" type="number"
                      placeholder="กรุณากรอกลองติจูด" />
                    <DisplayError v-if="errors.long" :err_text="errors.long" />
                  </div>
                </div>
              </div>
            </div>

            <!-- more detail -->
            <div class="columns">
              <div class="column">
                <label class="label">หมายเหตุ</label>
                <div class="control">
                  <textarea class="textarea" @input="validateField('notation')"
                    :class="{ 'is-danger': errors.notation }" v-model="formLand.notation"
                    placeholder="ระบุหมายเหตุ"></textarea>
                  <DisplayError v-if="errors.notation" :err_text="errors.notation" />
                </div>
              </div>
            </div>

            <!-- -------------------------------------------- End โฉนด ------------------------------------------ -->
            <!-- submit to create land -->
            <div class="field is-grouped is-grouped-centered mt-4">
              <p class="control">
                <button class="button-41 is-danger is-light is-rounded is-large clear-btn" id="submitLand2"
                  type="button" @click="resetForm">ล้างข้อมูล</button>
              </p>
              <p class="control">
                <button class="button is-fullwidth has-text-white " id="submitLand" :disabled="btnLoad">
                  {{ btnLoad ? 'กำลังตรวจสอบ' : 'สร้างที่ดิน' }}
                </button>
              </p>
            </div>
            <!-- @click="creationLand"  -->
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '@/store';
import * as yup from "yup";
import { getRai, updateVillageOptions } from '@/utils/addressFunc';
import axios from 'axios';
import { fetchSois, fetchLandStatus } from '@/api/apiLand';
import { fetchPeopleName } from '@/api/apiPeople';
import Swal from 'sweetalert2';
import DisplayError from '@/components/form_valid/DisplayError.vue';
import { getLandModel, LandValidSchema } from '@/model/landModel';
import { calculateLandArea } from '@/utils/landFunc';
import { showErrorAlert } from '@/utils/alertFunc';

export default {
  components: {
    DisplayError
  },
  data() {
    return {
      formLand: {
        ...getLandModel
      },
      errors: {}, // Stores validation errors
      rais: getRai(),
      sois: [
        { value: null, label: 'ไม่พบข้อมูล' },
      ],
      land_status: [
        { value: null, label: 'ไม่พบข้อมูล' }
      ],
      prefixListLand: [
        { value: null, label: 'ไม่พบข้อมูล' },
      ],
      village: [],
      isNameSelected: false, // ใช้เพื่อตรวจสอบว่าเลือกชื่อจากแนะนำหรือยัง
      filteredNames: [], // รายชื่อที่กรองแล้ว
      prefix_name: null,
      btnLoad: false
    }
  },
  methods: {
    checkSelectedName() {
      if (this.formLand.full_name.length < 3) {
        this.filteredNames = this.namesList.filter(name =>
          name.toLowerCase().includes(this.formLand.full_name.toLowerCase())
        );
        this.isNameSelected = false
        this.filteredNames = []
      }
    },
    async searchNames() {
      if (this.formLand.full_name.length > 3) {
        this.filteredNames = await fetchPeopleName(this.formLand.full_name)
      } else {
        this.filteredNames = [];
      }
    },
    // เลือกชื่อที่แนะนำ
    selectName(name, id_card) {
      if (this.errors.full_name) {
        this.errors.full_name = name;
      }
      this.formLand.full_name = name;
      this.formLand.id_card = id_card;
      this.filteredNames = []; // ล้างแนะนำเมื่อเลือกชื่อ
      this.isNameSelected = true;
    },
    updateVillage() {
      console.log('village:', this.formLand.district)
      this.village = updateVillageOptions(this.formLand.district)
      // console.log('result-village:', this.village)
      this.formLand.village = ""
    },
    showSuccessAlert() {
      Swal.fire({
        title: 'เพิ่มข้อมูลสำเร็จ!',
        text: 'ข้อมูลของคุณได้ถูกบันทึกเรียบร้อยแล้ว',
        icon: 'success', // ใช้ 'success' เพื่อแสดงไอคอนสีเขียว
        confirmButtonText: 'ตกลง'
      });
    },
    showErrorAlert() {
      Swal.fire({
        title: 'เพิ่มข้อมูลไม่สำเร็จ!',
        text: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง',
        icon: 'error', // ใช้ 'error' เพื่อแสดงไอคอนสีแดง
        confirmButtonText: 'ตกลง'
      });
    },
    async creationLand() {
      // ตรวจสอบข้อมูลที่กรอก
      const isValid = await this.validateForm();
      if (!isValid) {
        this.showErrorAlert();
        return;
      };
      console.log(":::", this.formLand.ngan)
      const cal_result = calculateLandArea(
        this.formLand.rai,
        this.formLand.ngan,
        this.formLand.square_wa);
      console.log('cal-re:', cal_result);
      if (cal_result === false) {
        console.error("❌ จำนวนไร่ต้องไม่เกิน 5");
        await showErrorAlert("จำนวนเกิน 5 ไร่", "พื้นที่รวมเกิน 5 ไร่! โปรดตรวจสอบข้อมูลอีกครั้ง")
        return;
      } else {
        console.log("✅ พื้นที่ที่คำนวณได้:", cal_result);
      }
      // return;

      this.btnLoad = true
      store.status_path_change = true
      const form_data = {
        soi: this.formLand.selectedSoi,
        land_status: this.formLand.selectedStatus,
        id_card: this.formLand.id_card,
        // fullname: this.formLand.full_name,
        tf_number: this.formLand.tf_number,
        spk_area: this.formLand.spk_area,
        volume: this.formLand.volume,
        address: this.formLand.address_house,
        village: this.formLand.village,
        district: this.formLand.district,
        long: this.formLand.long || null,
        lat: this.formLand.lat || null,
        notation: this.formLand.notation,
        rai: cal_result.rai,
        ngan: cal_result.ngan,
        square_wa: cal_result.squareWa,
        number: this.formLand.number
      };

      console.log('Form submitted:', form_data);
      // this.resetForm();
      try {
        const response = await axios.post('http://localhost:3000/land', form_data);
        console.log('Response:', response.data);
        this.resetForm()
        this.showSuccessAlert()
      } catch (error) {
        console.error('Error:', error);
        this.showErrorAlert()
      }

      setTimeout(() => {
        this.btnLoad = false
        store.status_path_change = false
        // Reset form fields if needed
      }, 2000)
    },
    resetForm() {
      // reset formLand
      this.formLand = { ...getLandModel };
    },
    async validateField(field) {
      try {
        const schema = this.getValidationSchema();
        await schema.validateAt(field, this.formLand);
        console.log('field:', field)
        this.errors[field] = ""; // Clear error if valid
      } catch (err) {
        this.errors[field] = err.message; // Set error message
      }
    },
    // Validate the whole form
    async validateForm() {
      try {
        const schema = this.getValidationSchema();
        await schema.validate(this.formLand, { abortEarly: false });
        this.errors = {}; // Clear all errors
        return true;
      } catch (err) {
        this.errors = err.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          console.log('check-error:', curr.message)
          return acc;
        }, {});
        return false;
      }
    },
    async validateField(field) {
      try {
        const schema = this.getValidationSchema();
        await schema.validateAt(field, this.formLand);
        this.errors[field] = ""; // Clear error if valid
      } catch (err) {
        this.errors[field] = err.message; // Set error message
      }
    },
    getValidationSchema() {
      return yup.object().shape({ ...LandValidSchema });
    }
  },
  watch: {
    // Watch for changes to square_wa
    'formLand.square_wa'(newValue) {
      if (newValue > 100) {
        this.formLand.square_wa = 100;
      }
    },
    // Watch for changes to ngan
    'formLand.ngan'(newValue) {
      if (newValue > 4) {
        this.formLand.ngan = 4;
      }
    },
    'formLand.long'(newValue) {
      if (newValue > 179.999999) {
        this.formLand.long = 179.999999;
      }
    },
    'formLand.lat'(newValue) {
      if (newValue > 89.999999) {
        this.formLand.lat = 89.999999;
      }
    }
  }
  ,
  async mounted() {
    this.sois = await fetchSois()
    this.land_status = await fetchLandStatus()

    try {
      // console.log('soi:', this.sois.length)
      // const landStatus = await axios.get('http://localhost:3000/land/land_status');

      // // console.log(landStatus.data)
      // this.land_status = [];
      // if (landStatus.data.length > 0) {
      //   // landStatus.data
      //   for (let ls of landStatus.data) {
      //     // console.log(ls)
      //     this.land_status.push({ value: ls.ID_land_status, label: `${ls.land_status_name}` })
      //   }
      // }

      // console.log(landStatus.data)
      // console.log(sois.data)
      const prefix = await axios.get(`http://localhost:3000/people/prefix`);
      const data = prefix.data; // Handle the response data

      this.prefixListLand = []
      if (data.length > 0) {
        for (let d of data) {
          // console.log(d)
          this.prefixListLand.push({
            value: d.prefix_id,
            label: d.prefix_name
          },)
        }
      }
    } catch (err) {
      this.error = 'Error fetching sois: ' + err.message;
    }
  }
}
</script>

<style scoped>
@media (max-width: 768px) {
  .m-5-mobile {
    padding: 5px;
    /* Adjust as needed */
  }
}

/* Hide the default number input arrows in WebKit browsers */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Hide the default number input arrows in Firefox */
input[type='number'] {
  -moz-appearance: textfield;
  /* Firefox */
}

#submitLand {
  background-color: #4e4b32;
}

#submitLand2 {
  background-color: #4e4b32;
}

.suggestions {
  border: 1px solid #ccc;
  /* margin-top: 10px; */
  max-height: 150px;
  overflow-y: auto;
  position: absolute;
  background-color: white;
  width: 50%;
  z-index: 5;
}

.suggestions ul {
  list-style-type: none;
  padding: 0;
}

.suggestions li {
  padding: 8px;
  cursor: pointer;
}

.suggestions li:hover {
  background-color: #f0f0f0;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>
