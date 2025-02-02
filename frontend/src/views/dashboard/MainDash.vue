<template>
    <div class="content py-5 themeColor">
        <!-- Header Section -->
        <div class="is-primary container has-background-white">
            <div class="columns is-centered is-mobile">
                <div class="column is-narrow has-text-centered">
                    <div class="has-background-white card mt-2 p-2">
                        <h2 class="title is-3 has-text-dark">สรุปผลการใช้ประโยชน์ที่ดิน</h2>
                    </div>
                    <!-- filter sois -->
                    <div v-if="roles" class="select is-rounded">
                        <select>
                            <option>ซอยทั้งหมด</option>
                            <option>ซอย 0</option>
                            <option>ซอย 1</option>
                            <option>ซอย 2</option>
                            <option>ซอย 3</option>
                            <option>ซอย 4</option>
                            <option>ซอย 5</option>
                            <option>ซอย 6</option>
                            <option>ซอย 7</option>
                            <option>ซอย 8</option>
                            <option>ซอย 9</option>
                            <option>ซอย 10</option>
                            <option>ซอย 11</option>
                            <option>ซอย 12</option>
                            <option>ซอย 13</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Dashboard Layer 1 -->
            <div class="px-2 columns is-variable is-4  is-multiline">
                <!-- Card Section -->
                <div class="column is-6-tablet is-3-desktop is-mobile is-mx-3">
                    <div class="card has-background-white-ter">
                        <div class="card-content">
                            <h4 class="title is-4 has-text-centered has-text-dark">ยางพารา</h4>
                            <h4 class="title is-4 has-text-centered has-text-dark">4</h4>
                        </div>
                    </div>
                </div>

                <div class="column is-6-tablet is-3-desktop is-mobile is-mx-3">
                    <div class="card has-background-white-ter">
                        <div class="card-content">
                            <h2 class="title is-4 has-text-centered has-text-dark">สวนผลไม้</h2>
                            <h4 class="title is-4 has-text-centered has-text-dark">25</h4>
                        </div>
                    </div>
                </div>

                <div class="column is-6-tablet is-3-desktop is-mobile is-mx-3">
                    <div class="card has-background-white-ter">
                        <div class="card-content">
                            <h2 class="title is-4 has-text-centered has-text-dark">ปศุสัตว์</h2>
                            <h4 class="title is-4 has-text-centered has-text-dark">18</h4>
                        </div>
                    </div>
                </div>

                <div class="column is-6-tablet is-3-desktop is-mobile is-mx-3">
                    <div class="card has-background-white-ter">
                        <div class="card-content">
                            <h2 class="title is-4 has-text-centered has-text-dark">อื่นๆ</h2>
                            <h4 class="title is-4 has-text-centered has-text-dark">30</h4>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dashboard Layer 2 -->
            <div class="px-2 columns is-variable is-4 is-multiline">
                <!-- Pie Chart Column -->
                <div class="column is-12-tablet is-6-desktop">
                    <div class="card">
                        <div class="card-content">
                            <div class="content chart-container">
                                <Pie :data="chartDataPie" :options="chartOptionsPie" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bar Chart Column -->
                <div class="column is-12-tablet is-6-desktop">
                    <div class="card">
                        <div class="card-content">
                            <div class="content chart-container">
                                <div class="is-mx-3">
                                    <Bar :data="chartData2" :options="chartOptions2" class="chart-card" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import roles from '@/role_config';
import { defineComponent } from 'vue'
import { Bar, Pie } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

export default defineComponent({
    components: { Bar, Pie },
    data() {
        return {
            isActive: false,

            chartData2: {
                labels: ['ยางพารา', 'สวนผลไม้', 'ปศุสัตว์', 'อื่นๆ'],
                datasets: [
                    {
                        label: 'จำนวน',
                        data: [4, 25, 18, 30],
                        backgroundColor: ['#41B883', '#FFA500', '#00D8FF', '#FF6347']
                    }
                ]
            },
            chartOptions2: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        beginAtZero: true
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                },
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                },
                plugins: {
                    legend: {
                        display: false // ปิดการแสดงผล Legend
                    }
                }
            },
            // pie data
            chartDataPie: {
                labels: ['ยางพารา', 'สวนผลไม้', 'ปศุสัตว์', 'อื่นๆ'],
                datasets: [
                    {
                        backgroundColor: ['#41B883', '#FFA500', '#00D8FF', '#FF6347'],
                        data: [4, 25, 18, 30],
                    }
                ]
            },
            chartOptionsPie: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        enabled: true // Disable tooltip if you don't need it
                    }
                },
                // Ref to labels
                onClick: (event, elements) => {
                    // const chart = elements[0]._chart;
                    // const x = event.clientX;
                    // const y = event.clientY;

                    // Check if a label was clicked
                    // const labelClicked = chart.scales['x-axis-0'].getLabelForValue(x);

                    // If a label was clicked, log "hello world"
                    console.log(`hello world`)
                }
            }
        }
    },
    methods: {
        toggleDropdown() {
            this.isActive = !this.isActive
        },
        selectOption(option) {
            console.log(`Selected: ${option}`)
            this.isActive = false
        }
    },
    mounted() {

        // Custom Plugin to display value and percentage
        ChartJS.defaults.plugins.tooltip.enabled = true // Ensure tooltips are disabled
        ChartJS.register({
            id: 'show-percentages',
            afterDatasetsDraw(chart) {
                // Filter
                if (chart.config.type === 'pie' || chart.config.type === 'doughnut') {
                    const ctx = chart.ctx
                    chart.data.datasets.forEach((dataset, i) => {
                        const meta = chart.getDatasetMeta(i)

                        // Calculate the total only for visible slices
                        const visibleData = dataset.data.filter((value, index) => !meta.data[index].hidden)
                        const total = visibleData.reduce((acc, val) => acc + val, 0)

                        meta.data.forEach((element, index) => {
                            if (!element.hidden) {
                                const dataValue = dataset.data[index]
                                const percentage = ((dataValue / total) * 100).toFixed(2) + '%'

                                const position = element.tooltipPosition()
                                ctx.fillStyle = '#000' // Set font color to black
                                ctx.font = 'bold 12px Arial'

                                // Only display percentage
                                const text = `${percentage}`
                                const textX = position.x
                                const textY = position.y

                                ctx.fillText(text, textX, textY)
                            }
                        })
                    })
                }
            }
        })
    }
})
</script>

<style scoped>
/* Add margin for mobile screens */
@media screen and (max-width: 768px) {
    .is-mx-3 {
        margin-left: 1rem;
        margin-right: 1rem;
    }
}

.card {
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
}

.card-content {
    padding: 1.5rem;
}

.chart-card {
    width: 100%;
    height: 100%;
}

.chart-container {
    display: flex;
    justify-content: center;
    /* width: 100%; */
    height: 400px;
    /* Fixed height to make charts same size */
    background-color: #fff;

}

#scope-chart {
    background-color: rebeccapurple;
}

@media (max-width: 768px) {
    .columns.is-variable.is-4 .column {
        padding: 0.5rem;
    }

    .column.is-12-tablet {
        max-width: 100%;
    }
}

.themeColor { /* หรือ .container ถ้าคุณต้องการปรับ container ด้านใน */
  margin-left: 70px; /* ค่า margin-left เริ่มต้น: เท่ากับความกว้าง Sidebar ตอนย่อ */
  transition: margin-left 0.3s ease; /* เพิ่ม transition เพื่อความสวยงาม */
  /* padding: 20px;  อาจเพิ่ม padding เพื่อให้เนื้อหาไม่ชิดขอบซ้ายเกินไป ถ้าจำเป็น */
}

.sidebar.expanded + .themeColor { /* ปรับแก้ selector ให้ตรงกับโครงสร้าง HTML จริงของคุณ */
  margin-left: 15%; /* ค่า margin-left เมื่อ Sidebar ขยาย: เท่ากับความกว้าง Sidebar ตอนขยาย */
}

</style>