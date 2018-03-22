using SignalRInstantDbChangesDemo.DataAccess;
using System.Collections.Generic;

namespace SignalRInstantDbChangesDemo.Models
{
    public class QaiService : IQaiService
    {

        public List<TV_QAIMonitoringReport> GetMonitoringReportDetails()
        {
            MonitoringReportRepository obj = new MonitoringReportRepository();
            return obj.GetDataResultRecords();
        }

        public List<TV_QAIPercentageData> GetPercentageDataDetails()
        {
            PercentageDataRepository obj = new PercentageDataRepository();
            return obj.GetDataResultRecords();
        }

        public List<ProductionLine> GetProductionLineDetails()
        {
            ProductionLineRepository obj = new ProductionLineRepository();
            return obj.GetDataResultRecords();
        }

        public List<DefectDetails> GetDefectDetails()
        {
            DefectDetailsRepository obj = new DefectDetailsRepository();

            return obj.GetDataResultRecords();
        }
    }
}