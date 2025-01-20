/**
 * Data Formatting & Privacy Utilities
 */

/**
 * Mask phone number for public privacy (e.g. 0812345678 -> 081-xxx-5678)
 */
function maskPhoneNumber(phone) {
  if (!phone) return null;
  const clean = String(phone).replace(/\D/g, '');
  if (clean.length === 10) {
    return `${clean.slice(0, 3)}-xxx-${clean.slice(6)}`;
  }
  return phone;
}

/**
 * Mask National ID for public privacy (e.g. 1809900123451 -> 1-8099-xxxx3-45-1)
 */
function maskCitizenId(idCard) {
  if (!idCard) return null;
  const clean = String(idCard).replace(/\D/g, '');
  if (clean.length === 13) {
    return `${clean.slice(0, 1)}-${clean.slice(1, 5)}-xxxx${clean.slice(9, 10)}-${clean.slice(10, 12)}-${clean.slice(12)}`;
  }
  return idCard;
}

/**
 * Calculate total Rai from Rai, Ngan, Square Wa
 */
function calculateTotalRai(rai = 0, ngan = 0, squareWa = 0) {
  const r = parseFloat(rai) || 0;
  const n = parseFloat(ngan) || 0;
  const w = parseFloat(squareWa) || 0;
  return Number((r + (n / 4) + (w / 400)).toFixed(4));
}

module.exports = {
  maskPhoneNumber,
  maskCitizenId,
  calculateTotalRai
};
