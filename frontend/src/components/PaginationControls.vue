<template>
    <div class="pagination-controls">
      <button
        class="pagination-button"
        :disabled="currentPage === 1"
        @click="goToPreviousPage"
      >
        Previous
      </button>
  
      <template v-for="page in pages" :key="page">
        <button
          v-if="typeof page === 'number'"
          class="pagination-button page-number"
          :class="{ 'current-page': page === currentPage }"
          @click="emitPageChange(page)"
        >
          {{ page }}
        </button>
        <span v-else class="pagination-ellipsis">...</span>
      </template>
  
      <button
        class="pagination-button"
        :disabled="currentPage === totalPages"
        @click="goToNextPage"
      >
        Next
      </button>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  
  export default {
    name: 'PaginationControls',
    props: {
      currentPage: {
        type: Number,
        required: true,
        default: 1,
      },
      totalPages: {
        type: Number,
        required: true,
        default: 1,
      },
      maxVisiblePages: {
        type: Number,
        default: 5, // จำนวนหน้าสูงสุดที่แสดงผล
      },
    },
    emits: ['page-change'],
    setup(props, { emit }) {
      const pages = computed(() => {
        const pagesArray = [];
        if (props.totalPages <= props.maxVisiblePages) {
          // ถ้าจำนวนหน้าทั้งหมดไม่เกิน maxVisiblePages แสดงทุกหน้า
          for (let i = 1; i <= props.totalPages; i++) {
            pagesArray.push(i);
          }
        } else {
          // กรณีจำนวนหน้าทั้งหมดเกิน maxVisiblePages
          const startPage = Math.max(1, props.currentPage - Math.floor(props.maxVisiblePages / 2));
          const endPage = Math.min(props.totalPages, startPage + props.maxVisiblePages - 1);
  
          if (startPage > 1) {
            pagesArray.push(1); // หน้าแรกเสมอ
            if (startPage > 2) {
              pagesArray.push('...'); // Ellipsis หากมีหน้าก่อนหน้าซ่อนอยู่
            }
          }
  
          for (let i = startPage; i <= endPage; i++) {
            pagesArray.push(i); // หน้าช่วงกลาง
          }
  
          if (endPage < props.totalPages) {
            if (endPage < props.totalPages - 1) {
              pagesArray.push('...'); // Ellipsis หากมีหน้าถัดไปซ่อนอยู่
            }
            pagesArray.push(props.totalPages); // หน้าสุดท้ายเสมอ
          }
        }
        return pagesArray;
      });
  
      const emitPageChange = (page) => {
        emit('page-change', page);
      };
  
      const goToPreviousPage = () => {
        if (props.currentPage > 1) {
          emitPageChange(props.currentPage - 1);
        }
      };
  
      const goToNextPage = () => {
        if (props.currentPage < props.totalPages) {
          emitPageChange(props.currentPage + 1);
        }
      };
  
      return {
        pages,
        emitPageChange,
        goToPreviousPage,
        goToNextPage,
      };
    },
  };
  </script>
  
  <style scoped>
  .pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  
  .pagination-button {
    padding: 8px 12px;
    margin: 0 4px;
    border: 1px solid #ccc;
    background-color: white;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .pagination-button:hover:not(:disabled) {
    background-color: #f0f0f0;
  }
  
  .pagination-button:disabled {
    opacity: 0.5;
    cursor: default;
  }
  
  .page-number.current-page {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }
  
  .pagination-ellipsis {
    margin: 0 8px;
    color: #777;
  }
  </style>