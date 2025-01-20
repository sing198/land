const Joi = require('joi');

const createCitizenSchema = Joi.object({
  id_card: Joi.string().length(13).pattern(/^\d{13}$/).required().messages({
    'string.pattern.base': 'เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก',
    'string.length': 'เลขบัตรประชาชนต้องมี 13 หลัก',
    'any.required': 'กรุณากรอกเลขบัตรประชาชน'
  }),
  prefix_id: Joi.number().integer().min(1).required().messages({
    'any.required': 'กรุณาเลือกคำนำหน้าชื่อ'
  }),
  first_name: Joi.string().trim().max(100).required().messages({
    'string.empty': 'กรุณากรอกชื่อจริง',
    'any.required': 'กรุณากรอกชื่อจริง'
  }),
  last_name: Joi.string().trim().max(100).required().messages({
    'string.empty': 'กรุณากรอกนามสกุล',
    'any.required': 'กรุณากรอกนามสกุล'
  }),
  birthday: Joi.string().isoDate().allow('', null),
  gender: Joi.string().valid('male', 'female', 'other').default('male'),
  house_number: Joi.string().trim().max(50).allow('', null),
  village_number: Joi.string().trim().max(50).allow('', null),
  subdistrict: Joi.string().trim().max(100).allow('', null),
  district: Joi.string().trim().max(100).allow('', null),
  province: Joi.string().trim().max(100).default('นครศรีธรรมราช'),
  soi: Joi.number().integer().min(0).max(50).default(0),
  phone_number: Joi.string().trim().max(20).pattern(/^[0-9\-+ ]*$/).allow('', null).messages({
    'string.pattern.base': 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง'
  })
});

const updateCitizenSchema = createCitizenSchema.fork(['id_card', 'prefix_id', 'first_name', 'last_name'], (schema) => schema.optional());

module.exports = {
  createCitizenSchema,
  updateCitizenSchema
};
