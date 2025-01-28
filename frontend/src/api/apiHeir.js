import axios from 'axios'

// URL to fetch
const relation_url = 'http://localhost:3000/heir/relation'

export const fetchRelation = async () => {
  try {
    const response = await axios.get(relation_url)
    // console.log('res-relation:', response.data)
    const relationList = []
    for (let d of response.data) {
      relationList.push({
        value: d.id,
        label: d.label
      })
    }
    return relationList
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}
