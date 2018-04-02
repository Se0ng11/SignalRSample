using Microsoft.AspNet.SignalR;
using PQIChart.DataAccess;
using System;

namespace PQIChart.Hubs
{
    public class PercentageDataHub : Hub
    {
         public void SendPercentageData(string messages)
        {
            Clients.All.updatePercentageData(messages);
        }

         public PercentageDataHub()
        {
            Action<string> dispatcher = (messages) => { SendPercentageData(messages); };

            PercentageDataRepository.GetInstance(dispatcher);
        }
    }
}