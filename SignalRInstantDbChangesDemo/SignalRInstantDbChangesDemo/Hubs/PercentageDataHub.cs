using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace SignalRInstantDbChangesDemo.Hubs
{
    public class PercentageDataHub : Hub
    {
        [HubMethodName("sendPercentageData")]
        public static void SendPercentageData(string action)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<PercentageDataHub>();

            context.Clients.All.updatePercentageData(action);

        }
    }
}