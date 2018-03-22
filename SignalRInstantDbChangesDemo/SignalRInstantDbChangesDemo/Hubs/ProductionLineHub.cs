using Microsoft.AspNet.SignalR;
using SignalRInstantDbChangesDemo.DataAccess;
using System;

namespace SignalRInstantDbChangesDemo.Hubs
{
    public class ProductionLineHub: Hub
    {
        public void SendProductionLine(string messages)
        {
            Clients.All.updateProductionLine(messages);
        }

        public ProductionLineHub()
        {
            Action<string> dispatcher = (messages) => { SendProductionLine(messages); };

            ProductionLineRepository.GetInstance(dispatcher);
        }
    }
}