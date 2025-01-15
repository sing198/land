const Joi = require('joi');

const loginSchema = Joi.object({
  username: Joi.string().trim().required().messages({
    'string.empty': 'กรุณากรอกชื่อผู้ใช้งาน (Username)',
    'any.required': 'กรุณากรอกชื่อผู้ใช้งาน (Username)'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'กรุณากรอกรหัสผ่าน (Password)',
    'any.required': 'กรุณากรอกรหัสผ่าน (Password)'
  })
});

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).trim().required().messages({
    'string.alphanum': 'ชื่อผู้ใช้ต้องเป็นตัวอักษรภาษาอังกฤษหรือตัวเลขเท่านั้น',
    'string.min': 'ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร',
    'string.max': 'ชื่อผู้ใช้ต้องมีความยาวไม่เกิน 30 ตัวอักษร',
    'any.required': 'กรุณากรอกชื่อผู้ใช้งาน'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร',
    'any.required': 'กรุณากรอกรหัสผ่าน'
  }),
  full_name: Joi.string().trim().required().messages({
    'any.required': 'กรุณากรอกชื่อ-นามสกุล'
  }),
  email: Joi.string().email().allow('', null),
  role_id: Joi.number().integer().min(0).max(3).default(0)
});

module.exports = {
  loginSchema,
  registerSchema
};
