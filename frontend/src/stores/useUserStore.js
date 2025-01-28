import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    userRole: null
  }),
  actions: {
    setDefaultRole() {
      this.userRole = null
    },
    setUserRole(role) {
      this.userRole = role // new role
    },
    async fetchUserRole() {
      try {
        // ส่งคำขอไปยัง backend พร้อมกับ cookie (`connect.sid`) อัตโนมัติ
        const response = await  axios.get('http://localhost:3000/api/getUserRole', {
          withCredentials: true // ส่ง cookie พร้อมคำขอ
        })

        console.log(':::', response.data)
        console.log(':::', response.status)
        this.userRole = response.data.role // กำหนดค่า role ที่ได้รับจาก API
      } catch (error) {
        this.userRole = null
      }
    },
    async out_of_system() {
      try {
        // ส่งคำขอแบบ POST ไปยัง backend พร้อมกับ cookie (`connect.sid`) อัตโนมัติ
        const response = await axios.post(
          'http://localhost:3000/login/clear-user',
          {},
          {
            withCredentials: true // ส่ง cookie พร้อมคำขอ
          }
        )
        console.log('message:', response.data)
        this.userRole = null
      } catch (error) {
        this.userRole = null
      }
    }
  },
  getters: {
    isUser: (state) => state.userRole === 'User',
    isAdmin: (state) => state.userRole === 'Admin',
    isOfficer: (state) => state.userRole === 'Officer'
  }
})
