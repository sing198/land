<template>
  <div class="admin-panel-container">
    <AdminNavbar />

    <div class="admin-profile-section">
      <div class="section-header">
        <h2>Admin Profile</h2>
        <button class="add-admin-button" @click="openAddAdminModal">
          Add Admin Profile
        </button>
      </div>

      <div class="search-container">
        <input
          type="text"
          placeholder="Search Username or Email..."
          v-model="searchQuery"
          @input="handleSearch"
        />
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <sortable-table-header
                tag="th"
                header-text="ID"
                sort-key="id"
                :current-sort-column="sortColumn"
                :current-sort-order="sortOrder"
                @sort-changed="handleSortChange"
              />
              <sortable-table-header
                tag="th"
                header-text="Username"
                sort-key="username"
                :current-sort-column="sortColumn"
                :current-sort-order="sortOrder"
                @sort-changed="handleSortChange"
              />
              <sortable-table-header
                tag="th"
                header-text="Email"
                sort-key="email"
                :current-sort-column="sortColumn"
                :current-sort-order="sortOrder"
                @sort-changed="handleSortChange"
              />
              <th>EDIT</th>
              <th>DELETE</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="admin in paginatedAdminList" :key="admin.id">
              <td class="irowcolor">{{ admin.id }}</td>
              <td class="urowcolor">{{ admin.username }}</td>
              <td class="erowcolor">{{ admin.email }}</td>
              <td class="edrowcolor">
                <button class="edit-button" @click="handleEditAdmin(admin)">
                  EDIT
                </button>
              </td>
              <td class="drowcolor">
                <button
                  class="delete-button"
                  @click="handleDeleteAdmin(admin.id)"
                >
                  DELETE
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <PaginationControls
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />
    </div>

    <!-- Modal สำหรับ Add / Edit Admin -->
    <AdminProfileModal
      v-if="isModalVisible"
      :isVisible="isModalVisible"
      :mode="modalMode"
      :adminData="selectedAdmin"
      @close="closeAdminModal"
      @submit="handleAdminSubmit"
    />

    <!-- Confirmation Dialog สำหรับ Delete -->
    <ConfirmationDialog
      v-if="isConfirmationDialogVisible"
      :isVisible="isConfirmationDialogVisible"
      title="Confirm Delete"
      message="Are you sure you want to delete this admin profile?"
      @confirm="confirmDeleteAdmin"
      @cancel="cancelDeleteAdmin"
    />

    <!-- Notification Message -->
    <NotificationMessage
      v-if="notification.isVisible"
      :isVisible="notification.isVisible"
      :message="notification.message"
      :type="notification.type"
      @close="closeNotification"
    />

    <div class="footer">
      <p>© 2025 </p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import PaginationControls from '../components/PaginationControls.vue';
import AdminNavbar from '../components/AdminNavbar.vue';
import SortableTableHeader from '../components/SortableTableHeader.vue';
import AdminProfileModal from '../components/AdminProfileModal.vue';
import ConfirmationDialog from '../components/ConfirmationDialog.vue';
import NotificationMessage from '../components/NotificationMessage.vue';

export default {
  name: 'AdminPage',
  components: {
    AdminNavbar,
    PaginationControls,
    SortableTableHeader,
    AdminProfileModal,
    ConfirmationDialog,
    NotificationMessage,
  },
  setup() {
    console.log("AdminPage setup function START");

    // Mock Data
    const adminList = ref([
      { id: 1, username: 'ved', email: 'ved@gmail.com' },
      { id: 2, username: 'funda', email: 'funda@gmail.com' },
      { id: 3, username: 'Funda2', email: 'g@g.c' },
      { id: 4, username: 'Ved 2', email: 'ved2@gmail.com' },
      { id: 5, username: 'Admin 5', email: 'admin5@gmail.com' },
      { id: 6, username: 'Admin 6', email: 'admin6@gmail.com' },
      { id: 7, username: 'Admin 7', email: 'admin7@gmail.com' },
      { id: 8, username: 'Admin 8', email: 'admin8@gmail.com' },
      { id: 9, username: 'Admin 9', email: 'admin9@gmail.com' },
      { id: 10, username: 'Admin 10', email: 'admin10@gmail.com' },
    ]);
    console.log("adminList initialized:", adminList.value);

    const searchQuery = ref('');
    const perPage = 5;
    const currentPage = ref(1);
    const sortColumn = ref('id'); // Default sort column
    const sortOrder = ref('asc');

    // Modal, Confirmation Dialog และ Notification
    const isModalVisible = ref(false);
    const modalMode = ref('add');
    const selectedAdmin = ref(null);

    const isConfirmationDialogVisible = ref(false);
    const adminIdToDelete = ref(null);

    const notification = ref({
      isVisible: false,
      message: '',
      type: 'info',
    });

    const showNotification = (message, type = 'info') => {
      notification.value = { isVisible: true, message, type };
    };

    const closeNotification = () => {
      notification.value.isVisible = false;
    };

    // Modal Functions
    const openAddAdminModal = () => {
      console.log('openAddAdminModal function called!');
      modalMode.value = 'add';
      selectedAdmin.value = null;
      isModalVisible.value = true;
    };

    const openEditAdminModal = (admin) => {
      modalMode.value = 'edit';
      selectedAdmin.value = { ...admin };
      isModalVisible.value = true;
    };

    const closeAdminModal = () => {
      isModalVisible.value = false;
      selectedAdmin.value = null;
    };

    const handleAdminSubmit = (formData) => {
      console.log('Admin Form Submitted in AdminPage:', formData);
      if (modalMode.value === 'add') {
        // Simulate Add Admin (replace with API call)
        const newAdmin = {
          id: adminList.value.length + 1,
          ...formData
        };
        adminList.value.push(newAdmin);
        showNotification('Admin profile added successfully!', 'success');
      } else if (modalMode.value === 'edit') {
        // Simulate Edit Admin (replace with API call)
        const index = adminList.value.findIndex(
          admin => admin.id === selectedAdmin.value.id
        );
        if (index !== -1) {
          adminList.value[index] = { ...adminList.value[index], ...formData };
        }
        showNotification('Admin profile updated successfully!', 'success');
      }
      closeAdminModal();
    };

    // Filtering and Sorting
    const filteredAdminList = computed(() => {
      const query = searchQuery.value.toLowerCase();
      let filteredList = adminList.value.filter(admin => {
        return (
          admin.username.toLowerCase().includes(query) ||
          admin.email.toLowerCase().includes(query)
        );
      });

      // Sort Data
      if (sortColumn.value) {
        filteredList.sort((a, b) => {
          const order = sortOrder.value === 'asc' ? 1 : -1;
          let columnA = a[sortColumn.value];
          let columnB = b[sortColumn.value];

          if (typeof columnA === 'string') columnA = columnA.toLowerCase();
          if (typeof columnB === 'string') columnB = columnB.toLowerCase();

          if (columnA < columnB) return -1 * order;
          if (columnA > columnB) return 1 * order;
          return 0;
        });
      }
      return filteredList;
    });

    // Pagination
    const totalPages = computed(() =>
      Math.ceil(filteredAdminList.value.length / perPage)
    );

    const paginatedAdminList = computed(() => {
      const startIndex = (currentPage.value - 1) * perPage;
      const endIndex = startIndex + perPage;
      return filteredAdminList.value.slice(startIndex, endIndex);
    });

    const handlePageChange = (newPage) => {
      currentPage.value = newPage;
    };

    // Sorting
    const handleSortChange = (sortInfo) => {
      sortColumn.value = sortInfo.column;
      sortOrder.value = sortInfo.order;
    };

    // Search
    const handleSearch = () => {
      console.log('Search Query:', searchQuery.value);
      // filteredAdminList จะ re-calc โดยอัตโนมัติ
    };

    // Actions from Table
    const handleAddAdmin = () => {
      openAddAdminModal();
    };

    const handleEditAdmin = (admin) => {
      openEditAdminModal(admin);
    };

    const handleDeleteAdmin = (adminId) => {
      console.log('handleDeleteAdmin function triggered for ID:', adminId);
      adminIdToDelete.value = adminId;
      isConfirmationDialogVisible.value = true;
    };

    const confirmDeleteAdmin = () => {
      const adminId = adminIdToDelete.value;
      if (!adminId) return;
      adminList.value = adminList.value.filter(
        admin => admin.id !== adminId
      );
      isConfirmationDialogVisible.value = false;
      adminIdToDelete.value = null;
      showNotification('Admin profile deleted successfully!', 'success');
      // Optionally reset sorting:
      sortColumn.value = 'id';
      sortOrder.value = 'asc';
    };

    const cancelDeleteAdmin = () => {
      isConfirmationDialogVisible.value = false;
      adminIdToDelete.value = null;
    };

    console.log("AdminPage setup function END - returning values");
    return {
      paginatedAdminList,
      totalPages,
      currentPage,
      handlePageChange,
      searchQuery,
      handleSearch,
      handleAddAdmin,
      handleEditAdmin,
      handleDeleteAdmin,
      sortColumn,
      sortOrder,
      handleSortChange,
      isModalVisible,
      modalMode,
      selectedAdmin,
      openAddAdminModal,
      openEditAdminModal,
      closeAdminModal,
      handleAdminSubmit,
      isConfirmationDialogVisible,
      confirmDeleteAdmin,
      cancelDeleteAdmin,
      notification,
      showNotification,
      closeNotification,
    };
  },
};
</script>

<style scoped>
.admin-panel-container {
  font-family: sans-serif;
  color: #333;
  margin-left: 70px;
  transition: margin-left 0.3s ease;
  background-color: #f0f2f5;
  padding: 20px;
}

.admin-profile-section {
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  font-size: 1.8em;
  color: #333;
}

.add-admin-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

.search-container {
  margin-bottom: 20px;
}

.search-container input {
  width: 300px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  color: #333;
}

.table-container {
  overflow-x: auto;
  color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border: 1px solid #ddd;
}

thead {
  background-color: #f8f9fa;
  color: #333;
  border-bottom: 2px solid #ddd;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
}

th {
  font-weight: bold;
  background-color: #9e0b0b;
}

.sortable-header:hover { /* หรืออาจจะเป็น .sortable-header:hover, .th-sortable:hover */
  background-color: #430707;
  cursor: pointer;
}

tbody tr:nth-child(even) {
  background-color: #ffffff;
}

.edit-button,
.delete-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px;
  font-size: 0.9em;
}

.delete-button {
  background-color: #dc3545;
}

.footer {
  text-align: center;
  padding: 15px;
  margin-top: 20px;
  color: #777;
  border-top: 1px solid #eee;
}

/* สีพื้นหลังของเซลล์ในตาราง */
.irowcolor,
.urowcolor,
.erowcolor,
.edrowcolor,
.drowcolor {
  background-color: #ffffff;
}
</style>
