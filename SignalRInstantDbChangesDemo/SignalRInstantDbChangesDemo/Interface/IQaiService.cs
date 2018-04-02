using PQIChart.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PQIChart.Interface
{
    public interface IQaiService
    {
        Task<List<TV_QAIMonitoringReport>> GetMonitoringReportDetails();

        Task<List<TV_QAIPercentageData>> GetPercentageDataDetails();

        Task<List<ProductionLine>> GetProductionLineDetails();

        Task<List<DefectDetails>> GetDefectDetails();

    }
}
