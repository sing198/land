<template>
    <div class="formColor">
        <div class="container is-fullhd custom-container">
            <!-- content people's data -->
            <div class="full-screen-card mx-5 py-5">
                <div class="card">
                    <div class="card-content">
                        <div class="content">
                            <!-- f1 -->
                            <div class="is-flex is-justify-content-space-between my-2">
                                <div class="field has-addons full-screen-card">
                                    <div class="field">
                                        <div class="control" id="mySelect">
                                            <div class="select is-fullwidth">
                                                <select>
                                                    <option selected>รหัสของราษฎร</option>
                                                    <option>แปลงเลขที่</option>
                                                    <option>สถานะ</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="control">
                                        <input class="input" type="text" placeholder="ค้นหา...">
                                    </div>
                                    <div class="control">
                                        <button class="button ">
                                            ค้นหา
                                        </button>
                                    </div>
                                </div>                               
                            </div>
                            <!-- f2 -->
                            <div class="table-container">
                                <!-- load first data -->
                                <div class="">
                                    <hr class="navbar-divider" />
                                    <!-- <p v-if="server_failed">โหลดข้อมูลล้มเหลว</p>
                                    <p v-else="server_failed">กำลังโหลดข้อมูล...</p> -->
                                    <table class="table is-striped is-bordered is-hoverable is-fullwidth">
                                        <thead class="table-header">
                                            <tr class="is-warning">
                                                <th>ลำดับ</th>
                                                <th>รหัสแก้ไข</th>
                                                <th>รหัสของราษฎร</th>
                                                <th>เวลาที่แก้ไข</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>1</td>
                                                <td>PP0001</td>
                                                <td>2025-01-01 04:40:56</td>
                                                <td>
                                                    <div class="button-group">
                                                        <button class="button is-normal is-primary"
                                                            @click="goToDetail(land.id_land)">
                                                            <span class="icon">
                                                                <i class="fas fa-eye"></i>
                                                            </span>
                                                            <span>ดู</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>2</td>
                                                <td>PP0010</td>
                                                <td>2023-11-27 04:40:10</td>
                                                <td>
                                                    <div class="button-group">
                                                        <button class="button is-normal is-primary"
                                                            @click="goToDetail(land.id_land)">
                                                            <span class="icon">
                                                                <i class="fas fa-eye"></i>
                                                            </span>
                                                            <span>ดู</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                            <!-- f3 -->
                            <!-- <nav class="pagination" role="navigation" aria-label="pagination">
                                <a href="#" class="pagination-previous">Previous</a>
                                <a href="#" class="pagination-next">Next page</a>
                                <ul class="pagination-list">
                                    <li>
                                        <a href="#" class="pagination-link" aria-label="Goto page 1">1</a>
                                    </li>
                                    <li>
                                        <span class="pagination-ellipsis">&hellip;</span>
                                    </li>
                                    <li>
                                        <a href="#" class="pagination-link" aria-label="Goto page 45">45</a>
                                    </li>
                                    <li>
                                        <a class="pagination-link is-current" aria-label="Page 46"
                                            aria-current="page">46</a>
                                    </li>
                                    <li>
                                        <a href="#" class="pagination-link" aria-label="Goto page 47">47</a>
                                    </li>
                                    <li>
                                        <span class="pagination-ellipsis">&hellip;</span>
                                    </li>
                                    <li>
                                        <a href="#" class="pagination-link" aria-label="Goto page 86">86</a>
                                    </li>
                                </ul>
                            </nav> -->
                            <nav class="pagination" role="navigation" aria-label="pagination">
                                <ul class="pagination-list">
                                    <li>
                                        <a class="pagination-link is-current" aria-label="Page 1"
                                            aria-current="page">1</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {

}
</script>
<style scoped>
.header-size-1 {
    width: auto;
    /* 25% width for Header 1 */
}

.table-header {
    background-color: #3273dc;
}

#mySelect select {
    border-radius: 0;
}

.hoverable-row {
    transition: background-color 0.3s;
}

.hoverable-row:hover {
    cursor: pointer;
    /* Change this color for the hover effect */
    background-color: #333;
    color: #fff;
}

/* The icon should be hidden by default */
.copy-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

/* Make the td element clickable and show the icon on hover */
td.hoverable-row {
    position: relative;
}

td.hoverable-row:hover .copy-icon {
    opacity: 1;
}

.pagination-link.is-current {
    border-color: none;
    background-color: #ffdd57;
    /* Bulma's warning color */
    color: white;
    /* Make the text color white for contrast */
}

.pagination-link {
    border: none;
    /* Remove border */
}

.pagination-link.is-current:hover {
    background-color: #ffca28;
    /* Darker yellow/orange on hover */
}
</style>