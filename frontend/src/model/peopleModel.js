// validationSchema.js
import * as yup from 'yup'

export const getPeopleModel = {
  prefix: '',
  firstName: '',
  lastName: '',
  birthDate: '',
  phone: '',
  citizenId: '',
  gender: '',
  selectedSoi: '',
  prefix: '',
  subdistrict: '',
  village: ''
}

export const CitizenValidSchema = {
  prefix: yup.string().required('กรุณาเลือกคำนำหน้าชื่อ'),
  firstName: yup
    .string()
    .required('กรุณากรอกชื่อจริง')
    .min(3, 'ชื่อจริงต้องมีอย่างน้อย 3 ตัวอักษร')
    .max(30, 'ชื่อจริงต้องไม่เกิน 30 ตัวอักษร'),
  lastName: yup
    .string()
    .required('กรุณากรอกนามสกุล')
    .min(3, 'นามสกุลต้องมีอย่างน้อย 3 ตัวอักษร')
    .max(30, 'นามสกุลต้องไม่เกิน 30 ตัวอักษร'),
  birthDate: yup
    .date()
    .nullable() // Allow null values
    .required('กรุณาเลือกวัน/เดือน/ปี')
    .transform(
      (value, originalValue) => (originalValue === '' ? null : value) // Convert empty string to null
    ),
  gender: yup.string().required('กรุณาเลือกเพศ'),
  phone: yup
    .string()
    .matches(/^\d{10}$/, 'กรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก')
    .required('กรุณากรอกเบอร์โทรศัพท์'),
  citizenId: yup
    .string()
    .required('กรุณากรอกเลขบัตรประชาชน')
    .test('is-numeric', 'ต้องเป็นตัวเลขเท่านั้น', (value) => /^\d*$/.test(value)) // Check if input is only numbers
    .matches(/^\d{13}$/, 'กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก'),
  subdistrict: yup.string().required('กรุณาเลือกตำบล'),
  village: yup.string().required('กรุณาเลือกหมู่'),
  selectedSoi: yup.string().required('กรุณาเลือกซอย')
}
