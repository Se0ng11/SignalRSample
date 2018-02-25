using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace SignalRInstantDbChangesDemo.Hubs
{
    public class DataResultHub : Hub
    {
        [HubMethodName("sendUptodateInformation")]
        public static void SendUptodateInformation(string action)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<DataResultHub>();

            context.Clients.All.updateDataResultInformation(action);

        }
    }
}