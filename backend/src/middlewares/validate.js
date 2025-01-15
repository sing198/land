const { errorResponse } = require('../utils/apiResponse');

/**
 * Joi Schema Validation Middleware
 * @param {import('joi').ObjectSchema} schema
 * @param {'body'|'query'|'params'} source
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const dataToValidate = req[source];
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
      errors: {
        wrap: {
          label: ''
        }
      }
    });

    if (error) {
      const formattedErrors = error.details.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return errorResponse(res, 'ข้อมูลที่ส่งมาไม่ถูกต้องตามเงื่อนไข (Validation Error)', 422, formattedErrors);
    }

    // Replace request data with sanitized validated data
    req[source] = value;
    next();
  };
}

module.exports = validate;
