const citizenRepository = require('../repositories/citizenRepository');
const heirRepository = require('../repositories/heirRepository');
const { query } = require('../config/database');

const citizenService = {
  async getCitizens(filters) {
    return await citizenRepository.findAll(filters);
  },

  async getCitizenDetail(idCard) {
    const citizen = await citizenRepository.findByIdCard(idCard);
    if (!citizen) {
      const error = new Error('ไม่พบข้อมูลราษฎร');
      error.statusCode = 404;
      error.isOperational = true;
      throw error;
    }

    // Get linked lands
    const lands = await query('SELECT * FROM lands WHERE id_card = ? AND active = 1', [idCard]);

    // Get linked heirs
    const heirs = await heirRepository.findByCitizenId(idCard);

    return {
      citizen,
      lands,
      heirs
    };
  },

  async searchCitizens(keyword) {
    if (!keyword || keyword.trim().length === 0) {
      return [];
    }
    return await citizenRepository.searchAutocomplete(keyword.trim());
  },

  async createCitizen(data) {
    const existing = await citizenRepository.findByIdCard(data.id_card);
    if (existing) {
      const error = new Error(`เลขบัตรประชาชน "${data.id_card}" มีอยู่ในระบบแล้ว`);
      error.statusCode = 409;
      error.isOperational = true;
      throw error;
    }

    await citizenRepository.create(data);
    return await citizenRepository.findByIdCard(data.id_card);
  },

  async updateCitizen(idCard, data) {
    const existing = await citizenRepository.findByIdCard(idCard);
    if (!existing) {
      const error = new Error('ไม่พบข้อมูลราษฎรที่ต้องการแก้ไข');
      error.statusCode = 404;
      error.isOperational = true;
      throw error;
    }

    await citizenRepository.update(idCard, data);
    return await citizenRepository.findByIdCard(idCard);
  },

  async deleteCitizen(idCard) {
    const existing = await citizenRepository.findByIdCard(idCard);
    if (!existing) {
      const error = new Error('ไม่พบข้อมูลราษฎรที่ต้องการลบ');
      error.statusCode = 404;
      error.isOperational = true;
      throw error;
    }

    return await citizenRepository.delete(idCard);
  }
};

module.exports = citizenService;
