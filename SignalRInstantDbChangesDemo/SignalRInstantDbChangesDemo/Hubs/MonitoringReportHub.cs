using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace SignalRInstantDbChangesDemo.Hubs
{
    public class MonitoringReportHub : Hub
    {
        [HubMethodName("sendMonitoringReport")]
        public static void SendMonitoringReport(string action)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MonitoringReportHub>();

            context.Clients.All.updateMonitoringReport(action);

        }

    }
}