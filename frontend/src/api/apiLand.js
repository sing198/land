import axios from 'axios'

export const fetchSois = async () => {
  try {
    const response = await axios.get('http://localhost:3000/land/sois')
    // console.log('res:', response.data)
    const sois = []
    for (let i = 0; i < response.data.length; i++) {
      let soi = response.data[i].id_alley
      sois.push({ value: soi, label: `ซอย ${soi}` })
    }
    // throw new Error("ค่าที่ส่งมาไม่ถูกต้อง");
    return sois
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const fetchLandStatus = async () => {
  try {
    const response = await axios.get('http://localhost:3000/land/land_status')
    // console.log('res-land:', response.data)
    const status_land = []
    for (let ls of response.data) {
        status_land.push({ value: ls.ID_land_status, label: `${ls.land_status_name}` })
      }
    // throw new Error("ค่าที่ส่งมาไม่ถูกต้อง");
    return status_land
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}
