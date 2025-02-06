// store.js
import { reactive } from 'vue'

// state of page
export const store = reactive({
  state: {
    status_path_change: false,
    userRole: null
  }
})

