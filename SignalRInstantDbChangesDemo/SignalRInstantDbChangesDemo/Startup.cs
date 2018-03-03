using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SignalRInstantDbChangesDemo.Startup))]
namespace SignalRInstantDbChangesDemo
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}
