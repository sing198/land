const landRepository = require('../repositories/landRepository');
const commonRepository = require('../repositories/commonRepository');
const heirRepository = require('../repositories/heirRepository');
const { maskPhoneNumber, maskCitizenId } = require('../utils/formatters');

const landService = {
  async getLands(filters) {
    return await landRepository.findAll(filters);
  },

  async getLandDetail(id) {
    const land = await landRepository.findById(id);
    if (!land) {
      const error = new Error('ไม่พบข้อมูลแปลงที่ดินที่ระบุ');
      error.statusCode = 404;
      error.isOperational = true;
      throw error;
    }

    // Fetch related heirs if citizen exists
    let heirs = [];
    if (land.id_card) {
      heirs = await heirRepository.findByCitizenId(land.id_card);
    }

    // Fetch related documents
    const documents = await commonRepository.getFilesByLandId(id);

    return {
      land,
      heirs,
      documents
    };
  },

  async searchPublicLand(tfNumber) {
    const land = await landRepository.findByTfNumber(tfNumber);
    if (!land) {
      const error = new Error(`ไม่พบข้อมูลแปลงที่ดินเลขที่ "${tfNumber}"`);
      error.statusCode = 404;
      error.isOperational = true;
      throw error;
    }

    // Mask sensitive citizen information for public search
    return {
      id_land: land.id_land,
      tf_number: land.tf_number,
      spk_area: land.spk_area,
      number: land.number,
      volume: land.volume,
      current_soi: land.current_soi,
      rai: land.rai,
      ngan: land.ngan,
      square_wa: land.square_wa,
      total_rai: land.total_rai,
      l_district: land.l_district,
      l_subdistrict: land.l_subdistrict,
      land_use_type: land.land_use_type,
      land_status_name: land.land_status_name,
      lat: land.lat,
      lng: land.lng,
      owner_masked_name: land.first_name ? `${land.first_name.slice(0, 3)}*** ${land.last_name ? land.last_name.slice(0, 2) + '***' : ''}` : null,
      owner_masked_phone: maskPhoneNumber(land.phone_number),
      owner_masked_id: maskCitizenId(land.id_card)
    };
  },

  async createLand(data) {
    // Check if tf_number already exists
    const existing = await landRepository.findByTfNumber(data.tf_number);
    if (existing) {
      const error = new Error(`แปลงเลขที่ "${data.tf_number}" มีอยู่ในระบบแล้ว`);
      error.statusCode = 409;
      error.isOperational = true;
      throw error;
    }

    const newId = await landRepository.create(data);
    return await landRepository.findById(newId);
  },

  async updateLand(id, data) {
    const existing = await landRepository.findById(id);
    if (!existing) {
      const error = new Error('ไม่พบข้อมูลแปลงที่ดินที่ต้องการแก้ไข');
      error.statusCode = 404;
      error.isOperational = true;
      throw error;
    }

    if (data.tf_number && data.tf_number !== existing.tf_number) {
      const duplicate = await landRepository.findByTfNumber(data.tf_number);
      if (duplicate) {
        const error = new Error(`แปลงเลขที่ "${data.tf_number}" มีอยู่ในระบบแล้ว`);
        error.statusCode = 409;
        error.isOperational = true;
        throw error;
      }
    }

    await landRepository.update(id, data);
    return await landRepository.findById(id);
  },

  async deleteLand(id) {
    const existing = await landRepository.findById(id);
    if (!existing) {
      const error = new Error('ไม่พบข้อมูลแปลงที่ดินที่ต้องการลบ');
      error.statusCode = 404;
      error.isOperational = true;
      throw error;
    }

    return await landRepository.delete(id);
  },

  async getMapLayers() {
    return await landRepository.getMapPolygons();
  }
};

module.exports = landService;
