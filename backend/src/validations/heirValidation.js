const Joi = require('joi');

const createHeirSchema = Joi.object({
  citizen_id: Joi.string().length(13).pattern(/^\d{13}$/).required().messages({
    'any.required': 'กรุณาระบุเลขบัตรประชาชนของราษฎรเจ้าของสิทธิ์'
  }),
  prefix_id: Joi.number().integer().min(1).required().messages({
    'any.required': 'กรุณาเลือกคำนำหน้าชื่อทายาท'
  }),
  first_name: Joi.string().trim().max(100).required().messages({
    'string.empty': 'กรุณากรอกชื่อจริงทายาท',
    'any.required': 'กรุณากรอกชื่อจริงทายาท'
  }),
  last_name: Joi.string().trim().max(100).required().messages({
    'string.empty': 'กรุณากรอกนามสกุลทายาท',
    'any.required': 'กรุณากรอกนามสกุลทายาท'
  }),
  relationship_id: Joi.number().integer().min(1).required().messages({
    'any.required': 'กรุณาเลือกประเภทความสัมพันธ์'
  }),
  phone_number: Joi.string().trim().max(20).allow('', null),
  id_card: Joi.string().length(13).pattern(/^\d{13}$/).allow('', null)
});

module.exports = {
  createHeirSchema
};
