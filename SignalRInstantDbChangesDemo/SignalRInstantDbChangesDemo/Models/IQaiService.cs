using System;
using System.Collections.Generic;

namespace SignalRInstantDbChangesDemo.Models
{
    public interface IQaiService
    {
        List<TV_QAIMonitoringReport> GetMonitoringReportDetails();

        List<TV_QAIPercentageData> GetPercentageDataDetails();

        List<ProductionLine> GetProductionLineDetails();

        List<DefectDetails> GetDefectDetails();

    }
}
