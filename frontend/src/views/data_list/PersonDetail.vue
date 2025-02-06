<template>
    <div class="formColor">
        <div class="container">
            <section class="section">
                <div class="container">
                    <!-- Header Section -->
                    <div v-if="!error_fetch" class="box">
                        <!-- title -->
                        <div class="columns is-vcentered" style="font-size: 22px;">
                            <div class="column">
                                <h2 class="title is-4">Code • {{ $route.params.id }}</h2>
                                <p>ซอยปัจจุบัน : <strong>{{ landSoi || '---' }}</strong></p>
                                <p>ผู้ได้รับสิทธิ์ : <strong>{{ person_name || '---' }}</strong></p>
                                <p>วันที่บันทึก : <strong>{{ formatDate(create_at) || '---' }}</strong></p>
                            </div>
                            <div class="column has-text-right">
                                <RouterLink to="/land_data">
                                    <!-- <span class="status-badge">Draft</span> -->
                                    <span class="icon" style="font-size: 24px;color: #333;">
                                        <i class="fa fa-arrow-circle-left"></i>
                                    </span>
                                </RouterLink>
                            </div>
                        </div>

                        <!-- Land data -->
                        <div class="columns">
                            <div class="column">
                                <p class="block box-style pl-3 py-2 section-title has-text-light has-background-black-ter"
                                    @click="toggleLandInfo">ข้อมูลที่ดิน
                                    <span>
                                        <i class="fas fa-arrow-alt-circle-down"
                                            :class="{ 'fas fa-arrow-alt-circle-right': isLandVisible == false }"></i>
                                    </span>
                                </p>
                            </div>
                            <div class="column is-1">
                                <div class="is-flex is-justify-content-flex-end">
                                    <!-- Edit land -->
                                    <button class="button is-normal is-warning mx-1">
                                        <span class="icon">
                                            <i class="fas fa-edit"></i>
                                        </span>
                                    </button>
                                    <!-- Remove land -->
                                    <button class="button is-normal is-danger">
                                        <span class="icon">
                                            <i class="fas fa-trash-alt"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <!-- display land data -->
                        <div v-if="isLandVisible">
                            <!-- first line -->
                            <div v-if="land_information.length != 0">
                                <div class="is-tablet" style="font-size: 18px;">
                                    <div class="columns">
                                        <div class="column">
                                            <p><strong>คำนำหน้าชื่อ</strong></p>
                                            <p>{{ person_information[0]?.prefix_name || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>ชื่อจริง</strong></p>
                                            <p>{{ person_information[0]?.first_name || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>นามสกุล</strong></p>
                                            <p>{{ person_information[0]?.last_name || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong></strong></p>
                                            <p></p>
                                        </div>
                                    </div>
                                    <div class="columns">
                                        <div class="column">
                                            <p><strong>เลขที่</strong></p>
                                            <p>{{ land_information[0]?.number || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>เล่มที่</strong></p>
                                            <p>{{ land_information[0]?.volume || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>แปลงเลขที่</strong></p>
                                            <p>{{ land_information[0]?.tf_number || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>ระวาง ส.ป.ก ที่ </strong></p>
                                            <p>{{ land_information[0]?.spk_area || '-' }}</p>
                                            <!-- tf_number -->
                                        </div>
                                    </div>
                                    <!-- address -->
                                    <div class="columns">
                                        <div class="column">
                                            <p><strong>บ้านเลขที่</strong></p>
                                            <p>{{ land_information[0]?.l_house_number || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>หมู่บ้าน</strong></p>
                                            <p>{{ land_information[0]?.l_village_number || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>ซอย</strong></p>
                                            <p>{{ land_information[0]?.l_soi || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>ถนน</strong></p>
                                            <p>{{ land_information[0]?.l_road || '-' }}</p>
                                            <!-- tf_number -->
                                        </div>
                                    </div>
                                    <!-- address 2 -->
                                    <div class="columns">
                                        <div class="column">
                                            <p><strong>ตำบล</strong></p>
                                            <p>{{ land_information[0]?.l_district || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>อำเภอ</strong></p>
                                            <p>{{ land_information[0]?.l_amphoe || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>จังหวัด</strong></p>
                                            <p>{{ land_information[0]?.l_province || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong></strong></p>
                                            <p></p>
                                        </div>
                                    </div>
                                    <!-- amount -->
                                    <div class="columns">
                                        <div class="column">
                                            <p><strong>จำนวนไร่</strong></p>
                                            <p>{{ land_information[0]?.rai || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>จำนวนงาน</strong></p>
                                            <p>{{ land_information[0]?.ngan || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>จำนวนตารางวา</strong></p>
                                            <p>{{ land_information[0]?.square_wa || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong></strong></p>
                                            <p></p>
                                        </div>
                                    </div>
                                    <div class="columns">
                                        <div class="column">
                                            <p><strong>Lat</strong></p>
                                            <p>{{ land_information[0]?.lat || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>Long</strong></p>
                                            <p>{{ land_information[0]?.long || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>สถานะที่ดิน</strong></p>
                                            <p>{{ land_information[0]?.land_status_name || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong></strong></p>
                                            <p></p>
                                            <!-- tf_number -->
                                        </div>
                                    </div>
                                    <!-- notation -->
                                    <div class="columns">
                                        <div class="column">
                                            <p><strong><span class="has-text-danger">*</span> หมายเหตุ</strong></p>
                                            <p>{{ land_information[0]?.notation || `
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae vero
                                                alias explicabo ab tenetur fugiat fuga nesciunt facere qui deleniti
                                                saepe, earum
                                                repellendus numquam, nihil voluptatibus sit minus rem dicta!
                                                ` }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                กำลังโหลดข้อมูล
                            </div>
                        </div>

                        <!-- การใช้ประโยชน์ที่ดิน -->
                        <hr class="style1">
                        <p class="block box-style pl-3 py-2 ps-3 section-title has-text-light has-background-black-ter"
                            @click="toggleLandUse">
                            การใช้ประโยชน์ที่ดิน
                            <span>
                                <i class="fas fa-arrow-alt-circle-down"
                                    :class="{ 'fas fa-arrow-alt-circle-right': isLandUseVisible == false }"></i>
                            </span>
                        </p>
                        <!-- การใช้ประโยชน์ที่ดิน values -->
                        <div v-if="isLandUseVisible">
                            <div class="checkboxes">
                                <label class="checkbox">
                                    <input type="checkbox" />
                                    สวนผัก
                                </label>

                                <label class="checkbox">
                                    <input type="checkbox" />
                                    สวนผลไม้
                                </label>

                                <label class="checkbox">
                                    <input type="checkbox" />
                                    ปศุสัตว์
                                </label>

                                <label class="checkbox">
                                    <input type="checkbox" checked />
                                    อื่นๆ
                                </label>
                            </div>
                            <div class="my-2">
                                <p><strong><span class="has-text-danger">*</span> อื่นๆ</strong></p>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae vero
                                    alias explicabo ab tenetur fugiat fuga nesciunt facere qui deleniti
                                    saepe, earum
                                    repellendus numquam, nihil voluptatibus sit minus rem dicta!
                                    ` </p>
                            </div>
                        </div>

                        <!-- Person information -->
                        <hr class="style1">
                        <div class="columns">
                            <div class="column">
                                <p class="block box-style pl-3 py-2 ps-3 section-title has-text-light has-background-black-ter"
                                    @click="togglePersonInfo">ข้อมูลราษฎร
                                    <span>
                                        <i class="fas fa-arrow-alt-circle-down"
                                            :class="{ 'fas fa-arrow-alt-circle-right': isPersonVisible == false }"></i>
                                    </span>
                                </p>
                            </div>
                            <div class="column is-1">
                                <div class="is-flex is-justify-content-flex-end">
                                    <!-- Edit people-->
                                    <button v-if="person_information && person_information.length !== 0"
                                        class="button is-normal is-warning mx-1">
                                        <span class="icon">
                                            <i class="fas fa-edit"></i>
                                        </span>
                                    </button>
                                    <button v-else class="button is-normal is-success mx-1">
                                        <span class="icon">
                                            <i class="fas fa-plus"></i>
                                        </span>
                                    </button>

                                    <!-- remove people-->
                                    <button class="button is-normal is-danger">
                                        <span class="icon">
                                            <i class="fas fa-trash-alt"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div v-if="isPersonVisible">
                            <!-- first line -->
                            <div v-if="person_information.length != 0">
                                <div class="is-tablet">
                                    <div class="columns">
                                        <div class="column">
                                            <p><strong>เลขบัตรประชาชน</strong></p>
                                            <p>{{ person_information[0]?.ID_CARD || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>ชื่อจริง-นามสกุล</strong></p>
                                            <p>{{ person_information[0]?.prefix_name + ' ' +
                                                person_information[0]?.first_name + ' ' +
                                                person_information[0]?.last_name
                                                || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>วันเกิด</strong></p>
                                            <p>{{ person_information[0]?.birthday || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>โทรศัพท์</strong></p>
                                            <p>{{ person_information[0]?.status || '-' }}</p>
                                        </div>
                                    </div>
                                    <!-- people address -->
                                    <div class="columns">
                                        <div class="column">
                                            <p><strong>บ้านเลขที่</strong></p>
                                            <p>{{ person_information[0]?.house_number || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>หมู่ที่</strong></p>
                                            <p>{{ person_information[0]?.village_number || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>ซอย</strong></p>
                                            <p>{{ person_information[0]?.soi || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>ถนน</strong></p>
                                            <p>{{ person_information[0]?.road || '-' }}</p>
                                        </div>
                                    </div>
                                    <!-- people address2 -->
                                    <div class="columns">
                                        <div class="column">
                                            <p><strong>ตำบล</strong></p>
                                            <p>{{ person_information[0]?.subdistrict || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>อำเภอ</strong></p>
                                            <p>{{ person_information[0]?.district || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>จังหวัด</strong></p>
                                            <p>{{ person_information[0]?.province || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>รหัสไปรษณีย์</strong></p>
                                            <p>{{ person_information[0]?.postal_code || '-' }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                ที่ดินนี้ไม่มีราษฎรครอบครอง
                            </div>
                        </div>

                        <!-- ทายาท -->
                        <hr class="style1">
                        <div class="columns">
                            <div class="column">
                                <p class="block box-style pl-3 py-2 ps-3 section-title has-text-light has-background-black-ter"
                                    @click="toggleHeirInfo">ทายาท
                                    <span>
                                        <i class="fas fa-arrow-alt-circle-down"
                                            :class="{ 'fas fa-arrow-alt-circle-right': isHeirVisible == false }"></i>
                                    </span>
                                </p>
                            </div>
                            <div class="column is-1">
                                <div class="is-flex is-justify-content-flex-end">
                                    <!-- add ทายาท -->
                                    <button class="button is-normal is-success mb-3">
                                        <span class="icon">
                                            <i class="fas fa-plus"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div v-if="isHeirVisible">
                            <!-- first line -->
                            <div v-if="heir_information.length != 0">
                                <div class="is-tablet">
                                    <div class="columns" v-for="(heir, index) in heir_information">
                                        <div class="column">
                                            <p><strong>คนที่</strong></p>
                                            <p>{{ index + 1 }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>คำนำหน้าชื่อ</strong></p>
                                            <p>{{ heir.prefix_name || '-'
                                                }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>ชื่อจริง</strong></p>
                                            <p>{{ heir.first_name || '-'
                                                }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>นามสกุล</strong></p>
                                            <p>{{ heir.last_name || '-'
                                                }}</p>
                                        </div>
                                        <div
                                            class="column is-inline-block is-flex is-justify-content-center is-align-items-center">
                                            <div class="is-flex is-justify-content-flex-end">
                                                <!-- Edit heir -->
                                                <button class="button is-normal is-warning mx-1 my-1">
                                                    <span class="icon">
                                                        <i class="fas fa-edit"></i>
                                                    </span>
                                                </button>
                                                <!-- Remove heir -->
                                                <button class="button is-normal is-danger mx-1 my-1">
                                                    <span class="icon">
                                                        <i class="fas fa-trash-alt"></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <p>ยังไม่มีข้อมูลทายาท</p>
                            </div>
                        </div>

                        <!-- Document selection -->
                        <hr class="style1">
                        <p class="block box-style pl-3 py-2 ps-3 section-title has-text-light has-background-black-ter">
                            เอกสาร
                        </p>
                        <!-- Add job details content here -->
                        <div v-if="land_information.length != 0">
                            <div class="is-tablet">
                                <div class="columns">
                                    <!-- Button 1 -->
                                    <div class="column is-one-third">
                                        <button @click="goToDetail(land_information[0].id_land)"
                                            class="button is-primary is-fullwidth">
                                            เอกสารที่ดิน
                                        </button>
                                    </div>
                                    <!-- Button 2 -->
                                    <div class="column is-one-third">
                                        <RouterLink to="/" class="has-text-black">
                                            <button class="button is-success is-fullwidth">
                                                ราษฎร
                                            </button>
                                        </RouterLink>
                                    </div>
                                    <!-- Button 3 -->
                                    <div class="column is-one-third">
                                        <RouterLink to="/" class="has-text-black">
                                            <button class="button is-warning is-fullwidth">
                                                ภาพที่อยู่อาศัย
                                            </button>
                                        </RouterLink>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div v-else>
                        โหลดข้อมูลไม่สำเร็จ
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            isLandVisible: true, // Track visibility of the Contract Time section
            isPersonVisible: true, // Track visibility of the Contract Time section
            isLocationVisible: true,
            isHeirVisible: true,
            isLandUseVisible: true,
            land_information: [],
            person_information: [],
            heir_information: [],
            person_name: "",
            create_at: null,
            landSoi: null,
            error_fetch: false
        };
    },
    async mounted() {
        setTimeout(async () => {
            try {
                // Send GET request to the endpoint /land/complete_land
                const response = await axios.get(`http://localhost:3000/land/complete_land/${this.$route.params.id}`);
                console.log('id:', this.$route.params.id)
                // Handle the response data
                const { landInformation, peopleInformation, heirInformation } = response.data[0]
                // console.log('Data:', response.data);
                console.log("landInformation:", landInformation[0].id_land)
                console.log("landInformation-arr:", landInformation[0])
                console.log("peopleInformation:", peopleInformation)
                console.log("heir_information:", heirInformation)
                // Not found People
                if (peopleInformation.length != 0) {
                    this.person_name = (peopleInformation[0].first_name || '-') + " " + (peopleInformation[0].last_name || '-')
                    this.person_information = [peopleInformation[0]]
                } else {
                    this.person_information = []
                }

                // Not found heir
                if (heirInformation.length != 0) {
                    this.heir_information = heirInformation
                }

                this.land_information = [landInformation[0]]
                this.landSoi = landInformation[0].current_soi
                this.create_at = landInformation[0].created_at
                // console.log("heir_information2:", this.heir_information[1].first_name)
            } catch (error) {
                // Handle errors
                if (error.response) {
                    // The request was made and the server responded with a status code outside the range of 2xx
                    console.error('Response error:', error.response.data);
                    console.error('Status:', error.response.status);
                    console.error('Headers:', error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error('Request error:', error.request);
                } else {
                    // Something else went wrong while setting up the request
                    console.error('General error:', error.message);
                }
                // this.error_fetch = true
            }
        }, 1000)
    },
    methods: {
        formatDate(dateString) {
            const date = new Date(dateString); // สร้างออบเจกต์ Date จากวันที่
            const buddhistEraYear = date.getFullYear() + 543; // เพิ่ม 543 เพื่อให้ได้ปีพุทธศักราช
            const month = date.getMonth() + 1; // เดือน (เพิ่ม 1 เพราะเดือนเริ่มจาก 0)
            const day = date.getDate(); // วัน

            // ใช้ Intl.DateTimeFormat เพื่อจัดรูปแบบวันที่เป็น DD/MM/YYYY
            const formattedDate = new Intl.DateTimeFormat('en-GB').format(date);

            // คืนค่าผลลัพธ์ในรูปแบบ พ.ศ.
            return `${buddhistEraYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        },
        toggleLandInfo() {
            this.isLandVisible = !this.isLandVisible;
        },
        togglePersonInfo() {
            this.isPersonVisible = !this.isPersonVisible;
        },
        toggleLocationInfo() {
            this.isLocationVisible = !this.isLocationVisible;
        },
        toggleHeirInfo() {
            this.isHeirVisible = !this.isHeirVisible;
        },
        goToDetail(id) {
            this.$router.push({ name: 'LandTitle', params: { id } });
        },
        toggleLandUse() {
            this.isLandUseVisible = !this.isLandUseVisible
        },
    },
};
</script>

<style scoped>
.box-style {
    cursor: pointer;
}

hr.style1 {
    border-top: 1px solid #8c8b8b;
}
</style>