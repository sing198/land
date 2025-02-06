<template>
    <th @click="handleSort" class="sortable-header" :class="{ 'sorted': isSorted }">
      <span>{{ headerText }}</span>
      <span v-if="isSorted" class="sort-icon">
        <template v-if="sortOrder === 'asc'">&#9650;</template>  <template v-else>&#9660;</template> </span>
    </th>
  </template>
  
  <script>
  export default {
    name: 'SortableTableHeader',
    props: {
      headerText: {
        type: String,
        required: true,
      },
      sortKey: {
        type: String,
        required: true,
      },
      currentSortColumn: {
        type: String,
        default: null,
      },
      currentSortOrder: {
        type: String,
        default: 'asc', // หรือ 'desc' แล้วแต่เริ่มต้นอยากให้เรียงแบบไหน
        validator: (value) => ['asc', 'desc'].includes(value),
      },
    },
    emits: ['sort-changed'], // *** Define emits options ในรูปแบบ Array ของ String (Options API) ***
    computed: {
      isSorted() {
        return this.currentSortColumn === this.sortKey;
      },
      sortOrder() {
        if (this.isSorted) {
          return this.currentSortOrder;
        }
        return 'asc'; // Default order if not sorted on this column
      },
    },
    methods: {
      handleSort() {
        let newSortOrder = 'asc'; // Default to ascending order
        if (this.isSorted) {
          // If already sorted on this column, toggle order
          newSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
        }
        this.$emit('sort-changed', { column: this.sortKey, order: newSortOrder });
      },
    },
  };
  </script>
  
  <style scoped>
  .sortable-header {
    cursor: pointer;
    user-select: none; /* Prevent text selection when clicking */
    padding-right: 20px; /* Space for the sort icon */
    position: relative; /* For positioning the sort icon */
  }
  
  .sortable-header:hover {
    background-color: #f0f0f0; /* Light background on hover */
  }
  
  .sortable-header.sorted {
    font-weight: bold; /* Make the header bold when sorted */
  }
  
  .sort-icon {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    display: inline-block;
    width: 0;
    height: 0;
    font-size: 0.8em;
    color: #555;
    margin-left: 5px;
  }
  </style>