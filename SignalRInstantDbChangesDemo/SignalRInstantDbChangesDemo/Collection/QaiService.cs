using PQIChart.DataAccess;
using PQIChart.Interface;
using PQIChart.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PQIChart.Collection
{
    public class QaiService : IQaiService
    {

        public Task<List<TV_QAIMonitoringReport>> GetMonitoringReportDetails()
        {
            MonitoringReportRepository obj = new MonitoringReportRepository();
            return obj.GetDataResultRecords();
        }

        public Task<List<TV_QAIPercentageData>> GetPercentageDataDetails()
        {
            PercentageDataRepository obj = new PercentageDataRepository();
            return obj.GetDataResultRecords();
        }

        public Task<List<ProductionLine>> GetProductionLineDetails()
        {
            ProductionLineRepository obj = new ProductionLineRepository();
            return obj.GetDataResultRecords();
        }

        public Task<List<DefectDetails>> GetDefectDetails()
        {
            DefectDetailsRepository obj = new DefectDetailsRepository();

            return obj.GetDataResultRecords();
        }

    }
}