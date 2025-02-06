<template>
    <div v-if="isVisible" class="notification-message" :class="type">
      <p class="message-text">{{ message }}</p>
      <button class="close-button" @click="$emit('close')">&times;</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotificationMessage',
    props: {
      isVisible: {
        type: Boolean,
        default: false,
      },
      message: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: 'info',
        validator: (value) => ['info', 'success', 'warning', 'error'].includes(value),
      },
    },
    emits: ['close'],
  };
  </script>
  
  <style scoped>
  .notification-message {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f8f9fa; /* Default background */
    border: 1px solid #ced4da; /* Default border */
  }
  
  .notification-message.success {
    background-color: #d4edda;
    border-color: #c3e6cb;
    color: #155724;
  }
  
  .notification-message.error {
    background-color: #f8d7da;
    border-color: #f5c6cb;
    color: #721c24;
  }
  
  .notification-message.warning {
    background-color: #fff3cd;
    border-color: #ffeeba;
    color: #85640a;
  }
  
  .notification-message.info {
    background-color: #cce5ff;
    border-color: #b8daff;
    color: #004085;
  }
  
  
  .message-text {
    margin: 0;
    flex-grow: 1;
  }
  
  .close-button {
    background: none;
    border: none;
    color: #555;
    font-size: 1.2em;
    cursor: pointer;
    margin-left: 15px;
    opacity: 0.7;
  }
  
  .close-button:hover {
    opacity: 1;
  }
  </style>