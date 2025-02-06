<template>
  <div class="modal" v-show="isVisible">
      <div class="modal-content">
        <span class="close-button" @click="closeModal">&times;</span>
        <h2>{{ modalTitle }} Admin Profile</h2>
  
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="formData.username" required>
          </div>
  
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="formData.email" required>
          </div>
  
          <div class="form-group" v-if="isAddMode">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="formData.password" required>
            <small class="form-text text-muted">Password is required for new admin.</small>
          </div>
          <div class="form-group" v-else>
            <label for="password">New Password (Optional):</label>
            <input type="password" id="password" v-model="formData.password" placeholder="Leave blank to keep current password">
            <small class="form-text text-muted">Leave blank if you don't want to change password.</small>
          </div>
  
          <div class="form-actions">
            <button type="submit" class="submit-button">{{ submitButtonText }}</button>
            <button type="button" class="cancel-button" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch, computed } from 'vue'; // เพิ่ม computed เข้าไป
  
  export default {
    name: 'AdminProfileModal',
    props: {
      isVisible: {
        type: Boolean,
        default: false,
      },
      mode: {
        type: String, // 'add' หรือ 'edit'
        default: 'add',
        validator: (value) => ['add', 'edit'].includes(value),
      },
      adminData: {
        type: Object, // ข้อมูล Admin สำหรับ Edit Mode, null สำหรับ Add Mode
        default: null,
      },
    },
    emits: ['close', 'submit'],
    setup(props, { emit }) {
      const formData = ref({
        username: '',
        email: '',
        password: '',
      });
  
      // เมื่อ adminData เปลี่ยนแปลง (หรือ Component mount) ให้เติมข้อมูลลง formData
      watch(
        () => props.adminData,
        (newAdminData) => {
          if (newAdminData && props.mode === 'edit') {
            formData.value = { ...newAdminData, password: '' };
          } else {
            formData.value = { username: '', email: '', password: '' };
          }
        },
        { immediate: true }
      );
  
      // ใช้ computed เพื่อกำหนดค่าแบบ reactive
      const isAddMode = computed(() => props.mode === 'add');
      const modalTitle = computed(() => (props.mode === 'add' ? 'Add New' : 'Edit'));
      const submitButtonText = computed(() => (props.mode === 'add' ? 'Add Admin' : 'Save Changes'));
  
      const submitForm = () => {
        console.log('Submitting Form Data:', formData.value);
        emit('submit', formData.value);
        // Parent component จะทำการปิด modal เมื่อได้รับผลลัพธ์
      };
  
      const closeModal = () => {
        emit('close');
        formData.value = { username: '', email: '', password: '' };
      };
  
      return {
        formData,
        isAddMode,
        modalTitle,
        submitButtonText,
        submitForm,
        closeModal,
      };
    },
  };
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    width: 90%;
    max-width: 500px;
    position: relative;
  }
  
  .close-button {
    position: absolute;
    right: 15px;
    top: 10px;
    font-size: 1.5em;
    cursor: pointer;
  }
  
  /* Style ของ Form */
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
  }
  
  .form-group input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .submit-button,
  .cancel-button {
    padding: 10px 20px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  
  .submit-button {
    background-color: #007bff;
    color: #fff;
  }
  
  .cancel-button {
    background-color: #dc3545;
    color: #fff;
  }
  </style>
  