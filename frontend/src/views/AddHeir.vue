<template>
    <div class="primary_content">
        <div class="mx-5 py-5" id="heir-box">
            <div class="box">
                <h1 class="title has-text-centered">รายละเอียดของทายาท</h1>
                <div class="container is-max-widescreen custom-container">
                    <!-- People's name -->
                    <div class="columns pt-5">

                        <div class="column is-2">
                            <div class="field">
                                <label class="label"><strong class="has-text-danger">*</strong> คำนำหน้าชื่อ</label>
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select v-model="formHeirData.prefix">
                                            <option value="">เลือกคำนำหน้า</option>
                                            <option v-for="pfl in prefixList" :key="pfl.value" :value="pfl.value">
                                                {{ pfl.label }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="column is-4">
                            <div class="field">
                                <label class="label">ทายาท-ชื่อจริง</label>
                                <div class="control">
                                    <input class="input is-normal" v-model="formHeirData.heir_fname" type="text"
                                        placeholder="กรุณากรอกชื่อจริงทายาท" />
                                </div>
                            </div>
                        </div>

                        <div class="column is-4">
                            <div class="field">
                                <label class="label">ทายาท-นามสกุล</label>
                                <div class="control">
                                    <input class="input is-normal" v-model="formHeirData.heir_lname" type="text"
                                        placeholder="กรุณากรอกนามสกุลทายาท" />
                                </div>
                            </div>
                        </div>

                        <div class="column is-2">
                            <div class="field">
                                <label class="label">ความสัมพันธ์</label>
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select v-model="formHeirData.relation">
                                            <option value="">เลือกความสัมพันธ์</option>
                                            <option v-for="pfl in relationList" :key="pfl.value" :value="pfl.value">
                                                {{ pfl.label }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="columns pt-1">

                        <div class="column">
                            <div class="field">
                                <label class="label">ราษฎร-ชื่อจริง นามสกุล</label>
                                <div class="control">
                                    <input class="input is-normal" v-model="formPeople.fullname" type="text"
                                        placeholder="กรุณากรอกชื่อราษฎร" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- submit -->

                    <div class="field is-grouped is-grouped-centered mt-4">
                        <p class="control">
                            <button class="button-41 is-fullwidth clear-btn" type="button"
                                @click="resetForm">ล้างข้อมูล</button>
                        </p>
                        <p class="control">
                            <button class="button-41 is-fullwidth" id="submitPeople" @click="creationHeir"
                                :disabled="btnLoad">
                                {{ btnLoad ? 'กำลังตรวจสอบ' : 'เพิ่มทายาท' }}
                            </button>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { store } from '@/store'
import { fetchPrefix } from '@/api/apiPeople';
import { fetchRelation } from '@/api/apiHeir';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getHeirModel, getHeirPeopleModel } from '@/model/heirModel';
import { showSuccessAlert, showErrorAlert } from '@/utils/alertFunc';

export default {
    data() {
        return {
            formHeirData: getHeirModel,
            formPeople: getHeirPeopleModel,
            btnLoad: false,
            prefixList: [
                { value: null, label: 'ไม่พบข้อมูล' },
            ],
            relationList: [
                { value: "ไม่พบข้อมูล", label: "ไม่พบข้อมูล" },
            ],
        }
    },
    methods: {
        SuccessAlert(){
            showSuccessAlert()
        },
        ErrorAlert() {
            showErrorAlert()
        },
        async creationHeir() {
            this.btnLoad = true
            store.status_path_change = true
            const form_data = {
                // relation_select: this.
                prefix: this.formHeirData.prefix || null,
                fname_heir: this.formHeirData.heir_fname || null,
                lname_heir: this.formHeirData.heir_lname || null,
                relation: this.formHeirData.relation,
                citizen_id: '1900132387564'
            };

            console.log("Heir:", form_data)

            try {
                const response = await axios.post('http://localhost:3000/heir', form_data);
                console.log('Response:', response.data);
                this.SuccessAlert()
            } catch (error) {
                console.error('Error:', error);
                this.ErrorAlert()
            } finally {
                this.btnLoad = false
                store.status_path_change = false
            }

        },
    },
    async mounted() {
        this.prefixList = await fetchPrefix()
        this.relationList = await fetchRelation()
    }
}

</script>

<style scoped>
.date-picker-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-family: Arial, sans-serif;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.date-label {
    font-size: 16px;
    color: #333;
    margin-bottom: 8px;
}

.date-input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.3s ease;
}


/* input{
    border-color: red;
} */

.date-input:focus {
    border-color: #007bff;
}

.date-display {
    margin-top: 15px;
    font-size: 18px;
    color: #555;
}

.date-display span {
    font-weight: bold;
    color: #007bff;
}

.option {
    border-color: red;
}

#submitPeople {
    background-color: #4e4b32;
}
</style>