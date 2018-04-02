using Microsoft.AspNet.SignalR;
using PQIChart.DataAccess;
using System;

namespace PQIChart.Hubs
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