<template>
    <div class="confirmation-dialog-modal" v-if="isVisible">
      <div class="confirmation-dialog-content">
        <h2 class="confirmation-dialog-title">{{ title }}</h2>
        <p class="confirmation-dialog-message">{{ message }}</p>
        <div class="confirmation-dialog-buttons">
          <button class="confirm-button" @click="$emit('confirm')">Confirm</button>
          <button class="cancel-button" @click="$emit('cancel')">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ConfirmationDialog',
    props: {
      isVisible: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: 'Confirmation',
      },
      message: {
        type: String,
        default: 'Are you sure?',
      },
    },
    emits: ['confirm', 'cancel'],
  };
  </script>
  
  <style scoped>
  .confirmation-dialog-modal {
    position: fixed; /* Stay in place */
    z-index: 1000; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .confirmation-dialog-content {
    background-color: #fefefe;
    margin: 15% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 50%; /* Could be more or less, depending on screen size */
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    text-align: center;
  }
  
  .confirmation-dialog-title {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1.5em;
    color: #333;
  }
  
  .confirmation-dialog-message {
    margin-bottom: 20px;
    color: #555;
  }
  
  .confirmation-dialog-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
  }
  
  .confirm-button, .cancel-button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
  }
  
  .confirm-button {
    background-color: #007bff;
    color: white;
  }
  
  .confirm-button:hover {
    background-color: #0056b3;
  }
  
  .cancel-button {
    background-color: #ddd;
    color: #333;
  }
  
  .cancel-button:hover {
    background-color: #ccc;
  }
  </style>