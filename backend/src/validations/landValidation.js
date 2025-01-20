const Joi = require('joi');

const createLandSchema = Joi.object({
  tf_number: Joi.string().trim().max(50).required().messages({
    'string.empty': 'กรุณากรอกแปลงเลขที่',
    'any.required': 'กรุณากรอกแปลงเลขที่'
  }),
  spk_area: Joi.string().trim().max(50).required().messages({
    'string.empty': 'กรุณากรอกระวาง ส.ป.ก.',
    'any.required': 'กรุณากรอกระวาง ส.ป.ก.'
  }),
  number: Joi.string().trim().max(50).allow('', null),
  volume: Joi.string().trim().max(50).allow('', null),
  l_house_number: Joi.string().trim().max(50).allow('', null),
  current_soi: Joi.number().integer().min(0).max(50).default(0),
  rai: Joi.number().min(0).max(9999).default(0),
  ngan: Joi.number().min(0).max(3.99).default(0),
  square_wa: Joi.number().min(0).max(99.99).default(0),
  l_subdistrict: Joi.string().trim().max(100).allow('', null),
  l_district: Joi.string().trim().max(100).allow('', null),
  l_village_number: Joi.string().trim().max(50).allow('', null),
  land_use_type: Joi.string().trim().max(100).default('ยางพารา'),
  notation: Joi.string().allow('', null),
  current_land_status: Joi.number().integer().min(1).required().messages({
    'any.required': 'กรุณาเลือกสถานะที่ดิน'
  }),
  id_card: Joi.string().length(13).pattern(/^\d{13}$/).allow('', null).messages({
    'string.pattern.base': 'เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก',
    'string.length': 'เลขบัตรประชาชนต้องมี 13 หลัก'
  }),
  lat: Joi.number().min(-90).max(90).allow(null),
  lng: Joi.number().min(-180).max(180).allow(null),
  coordinates_polygon: Joi.string().allow('', null),
  active: Joi.number().integer().min(0).max(1).default(1)
});

const updateLandSchema = createLandSchema.fork(['tf_number', 'spk_area', 'current_land_status'], (schema) => schema.optional());

module.exports = {
  createLandSchema,
  updateLandSchema
};
