using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(PQIChart.Startup))]
namespace PQIChart
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}
