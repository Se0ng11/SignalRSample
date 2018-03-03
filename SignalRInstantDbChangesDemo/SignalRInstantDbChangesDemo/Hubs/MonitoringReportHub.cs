using Microsoft.AspNet.SignalR;
using SignalRInstantDbChangesDemo.DataAccess;
using SignalRInstantDbChangesDemo.Models;
using System.Collections.Generic;

namespace SignalRInstantDbChangesDemo.Hubs
{
    public class MonitoringReportHub : Hub
    {
        public void SendMonitoringReport(string messages)
        {
            Clients.All.updateMonitoringReport(messages);
        }
        public MonitoringReportHub()
        {
            void dispatcher(string messages)
            { SendMonitoringReport(messages); }
            MonitoringReportRepository.GetInstance(dispatcher);
        }

    }

}
