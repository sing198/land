<template>
    <div>
      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label class="label">ชื่อ</label>
          <div class="control">
            <input
              type="text"
              class="input"
              v-model="formData.name"
              @input="validateName"
            />
            <p v-if="nameError" class="help is-danger">{{ nameError }}</p>
          </div>
        </div>
  
        <div class="field">
          <label class="label">อีเมล</label>
          <div class="control">
            <input
              type="email"
              class="input"
              v-model="formData.email"
              @input="validateEmail"
            />
            <p v-if="emailError" class="help is-danger">{{ emailError }}</p>
          </div>
        </div>
  
        <div class="field">
          <button type="submit" class="button is-primary" :disabled="isFormInvalid">
            ส่ง
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        formData: {
          name: '',
          email: '',
        },
        nameError: '',
        emailError: '',
      };
    },
    computed: {
      isFormInvalid() {
        return this.nameError || this.emailError || !this.formData.name || !this.formData.email;
      },
    },
    methods: {
      validateName() {
        this.nameError = this.formData.name.length < 3 ? 'ชื่ออย่างน้อย 3 ตัวอักษร' : '';
      },
      validateEmail() {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.emailError = !emailPattern.test(this.formData.email) ? 'อีเมลไม่ถูกต้อง' : '';
      },
      handleSubmit() {
        alert('ส่งข้อมูล: ' + JSON.stringify(this.formData));
        // You can also send the data to your API here
      },
    },
  };
  </script>
  
  <style>
  .help {
    color: #ff3860;
  }
  </style>
  