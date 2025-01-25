const heirRepository = require('../repositories/heirRepository');
const citizenRepository = require('../repositories/citizenRepository');

const heirService = {
  async getHeirsByCitizen(citizenId) {
    const citizen = await citizenRepository.findByIdCard(citizenId);
    if (!citizen) {
      const error = new Error('ไม่พบข้อมูลราษฎรเจ้าของสิทธิ์');
      error.statusCode = 404;
      error.isOperational = true;
      throw error;
    }

    return await heirRepository.findByCitizenId(citizenId);
  },

  async createHeir(data) {
    const citizen = await citizenRepository.findByIdCard(data.citizen_id);
    if (!citizen) {
      const error = new Error(`ไม่พบข้อมูลราษฎรเลขบัตรประชาชน "${data.citizen_id}"`);
      error.statusCode = 404;
      error.isOperational = true;
      throw error;
    }

    return await heirRepository.createHeirWithRelationship(data);
  },

  async removeRelationship(citizenId, heirId) {
    const removed = await heirRepository.removeRelationship(citizenId, heirId);
    if (!removed) {
      const error = new Error('ไม่พบความสัมพันธ์ที่ต้องการลบ');
      error.statusCode = 404;
      error.isOperational = true;
      throw error;
    }
    return true;
  }
};

module.exports = heirService;
