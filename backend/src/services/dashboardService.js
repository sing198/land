const dashboardRepository = require('../repositories/dashboardRepository');

const dashboardService = {
  async getDashboardData(soi = null) {
    const summary = await dashboardRepository.getSummaryStats(soi);
    const landUseBreakdown = await dashboardRepository.getLandUseBreakdown(soi);
    const soiDistribution = await dashboardRepository.getSoiDistribution();
    const statusDistribution = await dashboardRepository.getStatusDistribution();

    return {
      summary,
      landUseBreakdown,
      soiDistribution,
      statusDistribution
    };
  }
};

module.exports = dashboardService;
