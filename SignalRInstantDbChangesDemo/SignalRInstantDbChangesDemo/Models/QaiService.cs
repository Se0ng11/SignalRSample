using SignalRInstantDbChangesDemo.DataAccess;
using System;
using System.Collections.Generic;

namespace SignalRInstantDbChangesDemo.Models
{
    public class QaiService : IQaiService
    {

        public List<TV_QAIMonitoringReport> GetMonitoringReportDetails()
        {
            MonitoringReportRepository obj = new MonitoringReportRepository();
            return obj.GetMonitoringReport();
        }

        public List<TV_QAIPercentageData> GetPercentageDataDetails()
        {
            PercentageDataRepository obj = new PercentageDataRepository();
            return obj.GetPercentageData();
        }
    }
}