using Microsoft.AspNet.SignalR;
using PQIChart.DataAccess;
using System;

namespace PQIChart.Hubs
{
    public class MonitoringReportHub : Hub
    {
        public void SendMonitoringReport(string messages)
        {
            Clients.All.updateMonitoringReport(messages);
        }
        
        public MonitoringReportHub()
        {
            Action<string> dispatcher = (messages) => { SendMonitoringReport(messages); };

            MonitoringReportRepository.GetInstance(dispatcher);
        }
    }

}
    