/**
 * Standard API Response Utilities
 */

function successResponse(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

function paginatedResponse(res, items = [], pagination = {}, message = 'Success') {
  return res.status(200).json({
    success: true,
    message,
    data: items,
    pagination: {
      total: pagination.total || 0,
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      totalPages: Math.ceil((pagination.total || 0) / (pagination.limit || 10))
    }
  });
}

function errorResponse(res, message = 'Internal Server Error', statusCode = 500, errors = null) {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
}

module.exports = {
  successResponse,
  paginatedResponse,
  errorResponse
};
