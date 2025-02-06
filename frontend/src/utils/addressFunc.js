// src/utils.js
export function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('th-TH', options)
}

export function updateVillageOptions(form_village) {
  const villages = {
    หัวตะพาน: [
      { value: '1', label: 'หมู่ที่ 1 บ้านคลองดิน' },
      { value: '2', label: 'หมู่ที่ 2 บ้านฉิมพลี' },
      { value: '3', label: 'หมู่ที่ 3 บ้านคลองขุด' },
      { value: '4', label: 'หมู่ที่ 4 บ้านทุ่งตก' },
      { value: '5', label: 'หมู่ที่ 5 บ้านดอนยาง' },
      { value: '6', label: 'หมู่ที่ 6 บ้านทุ่งชน' },
      { value: '7', label: 'หมู่ที่ 7 บ้านวัดประดู่' },
      { value: '8', label: 'หมู่ที่ 8 บ้านสวนหมาก' },
      { value: '9', label: 'หมู่ที่ 9 บ้านคลองเกียบ' }
    ],
    ไทรบุรี: [
      { value: '1', label: 'หมู่ที่ 1 บ้านโพธิ์' },
      { value: '2', label: 'หมู่ที่ 2 บ้านคูเถร' },
      { value: '3', label: 'หมู่ที่ 3 บ้านประตูช้างออก' },
      { value: '4', label: 'หมู่ที่ 4 บ้านในหัน' },
      { value: '5', label: 'หมู่ที่ 5 บ้านไม้มูก' },
      { value: '6', label: 'หมู่ที่ 6 บ้านปลักจอก' },
      { value: '7', label: 'หมู่ที่ 7 บ้านศาลาต้นท้อน' },
      { value: '8', label: 'หมู่ที่ 8 บ้านลุ่มนา' },
      { value: '9', label: 'หมู่ที่ 9 บ้านโคกเหล็ก' },
      { value: '10', label: 'หมู่ที่ 10 บ้านประตูช้างตก' }
    ]
  }
  if (form_village === 'หัวตะพาน' || form_village === 'ไทรบุรี') {
    return villages[form_village]
  } else {
    return []
  }
}

export function getRai() {
  return [
    { value: 1, label: '1 ไร่' },
    { value: 2, label: '2 ไร่' },
    { value: 3, label: '3 ไร่' },
    { value: 4, label: '4 ไร่' },
    { value: 5, label: '5 ไร่' }
  ]
}
