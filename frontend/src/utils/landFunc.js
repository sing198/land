// src/utils.js
export function nganToRai(ngan) {
  return ngan / 4
}

function squareWaToNgan(squareWa) {
  return squareWa / 100
}

function parseFloatFormInput(value) {
  let num = parseFloat(value)
  return isNaN(num) || num <= 0 ? 0 : num // Return number (not string) and default to 0 for invalid values
}

export function calculateLandArea(raiV, nganV, squareWaV) {
  // ตรวจสอบค่าให้เป็นตัวเลข และแทนที่ "" หรือค่า null ด้วย 0
  let rai = raiV ? parseFloat(raiV) : 0 // Parse as float, handle decimals if needed
  let ngan = parseFloatFormInput(nganV)
  let squareWa = parseFloatFormInput(squareWaV)

  console.log('rai:', rai)
  console.log('ngan:', ngan)
  console.log('squareWa:', squareWa)

  // แปลงตารางวาเป็นงาน (100 ตารางวา = 1 งาน)
  if (squareWa >= 100) {
    ngan += Math.floor(squareWa / 100) // Increase ngan based on squareWa
    console.log('ngan-floor:',ngan)
    squareWa = squareWa % 100 // Remaining squareWa
  }

  // แปลงงานเป็นไร่ (4 งาน = 1 ไร่)
  if (ngan >= 4) {
    rai += Math.floor(ngan / 4) // Increase rai based on ngan
    console.log('ngan-floor:', Math.floor(ngan / 4))
    ngan = ngan % 4 // Remaining ngan
  }

  if (rai > 5) {
    return false
  }

  // แปลงทั้งหมดเป็นไร่
  // let totalRai = rai + nganV / 4 + squareWa / 400 // Calculate total area in rai
  // console.log('TotalRai:', totalRai)
  // console.log('Rai-result:', rai)

  // // ถ้าเกิน 5 ไร่ ให้ return false และแจ้งเตือน
  // if (totalRai > 5) {
  //   return false // If total area exceeds 5 rai, return false
  // }

  // Return calculated values
  return { rai, ngan, squareWa }
}
