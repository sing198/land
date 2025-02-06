import * as yup from 'yup'

export const getLandModel = {
  full_name: '',
  id_card: '',
  selectedSoi: '',
  selectedStatus: '',
  tf_number: '',
  spk_area: '',
  number: '',
  volume: '',
  address_house: '',
  group_number: '',
  soi: '',
  rai: '', // จำนวนไร่
  ngan: '', // จำนวนงาน
  square_wa: '', // จำนวนตาราง
  district: '',
  village: '',
  long: '',
  lat: '',
  notation: ''
}

export const LandValidSchema = {
  full_name: yup
    .string()
    .required('กรุณากรอกชื่อ-นามสกุล')
    .max(60, 'ชื่อ-นามสกุลต้องไม่เกิน 100 ตัวอักษร'),
  id_card: yup
    .string()
    .required('กรุณากรอกเลขบัตรประชาชน')
    .matches(/^\d{13}$/, 'เลขบัตรประชาชนต้องมี 13 หลักและเป็นตัวเลขเท่านั้น'),

  selectedSoi: yup.string().required('กรุณาเลือกซอย'),
  selectedStatus: yup.string().required('กรุณาเลือกสถานะ'),
  tf_number: yup.string().required('กรุณากรอกเลขที่แปลงที่ดิน'),

  spk_area: yup.string().required('กรุณากรอกระวาง ส.ป.ก.'),

  number: yup.string().required('กรุณากรอกเลขที่ดิน'),
  volume: yup.string().required('กรุณากรอกเลขเล่มที่ดิน'),

  address_house: yup.string()
  .matches(/^\d+$/, 'บ้านเลขที่ต้องเป็นตัวเลขเท่านั้น')
  .max(4, 'บ้านเลขที่ต้องไม่เกิน 4 ตัวอักษร'),
  rai: yup
    .string()
    .nullable()
    .test('is-valid-number', 'จำนวนไร่ต้องน้อยกว่า 5 ไร่', (value) => {
      // If value is empty, it's considered valid
      if (value === '') return true

      // Check if the value is a valid number
      const numberValue = parseFloat(value)
      return !isNaN(numberValue) && numberValue >= 0 && numberValue <= 5
    }),

  ngan: yup.number()
  .nullable()  // Allows null value
  .transform((value, originalValue) => (originalValue === "" ? 0 : value)) // Convert empty string to 0
  .typeError('จำนวนต้องเป็นตัวเลข')
  .min(0, 'งานต้องไม่เป็นค่าติดลบ')
  .max(4, 'จำนวนนางต้องไม่เกิน 4'),
  square_wa: yup.number()
    .nullable()  // Allows null value
    .transform((value, originalValue) => (originalValue === "" ? 0 : value)) // Convert empty string to 0
    .typeError('จำนวนตารางวาต้องเป็นตัวเลข')
    .min(0, 'ตารางวาต้องไม่เป็นค่าติดลบ')
    .max(100, 'จำนวนตารางวาต้องไม่เกิน 100'),

  district: yup.string().required('กรุณากรอกอำเภอ'),
  village: yup.string().required('กรุณากรอกหมู่บ้าน'),

  long: yup.number()
  .nullable()
  .transform((value, originalValue) => (originalValue === "" ? 0 : value)) // Convert empty string to 0
  .typeError('ค่าลองจิจูดต้องเป็นตัวเลข')
  .min(-179.999999 , 'จำนวน lat น้อยกว่า 179.999999 ')
  .max(179.999999 , 'จำนวน lat ต้องไม่เกิน 179.999999 '),

  lat: yup.number()
  .nullable()
  .transform((value, originalValue) => (originalValue === "" ? 0 : value)) // Convert empty string to 0
  .typeError('ค่าลองจิจูดต้องเป็นตัวเลข')
  .min(-89.999999, 'จำนวน lat น้อยกว่า -89.999999')
  .max(89.999999, 'จำนวน lat ต้องไม่เกิน 89.999999'),

  notation: yup.string()
  .nullable() // หมายเหตุอาจจะเป็น null ได้
  .min(0, 'จำนวนตารางวาต้องไม่เป็นค่าติดลบ')
  .max(5, 'จำนวนตารางวาต้องไม่เกิน 5')
}
