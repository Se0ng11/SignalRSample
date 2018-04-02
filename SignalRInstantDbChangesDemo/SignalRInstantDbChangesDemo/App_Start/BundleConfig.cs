using System.Web;
using System.Web.Optimization;

namespace PQIChart
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                     "~/Scripts/jquery-{version}",
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js",
                      "~/Scripts/moment.js",
                      "~/Scripts/jquery.webui-popover.js",
                      "~/Scripts/bootstrap-notify.js",
                      "~/Scripts/DataTables/jquery.dataTables.js",
                      "~/Scripts/DataTables/dataTables.bootstrap4.js",
                      "~/Scripts/jquery.signalR-{version}.js",
                      "~/Scripts/app/pqi.table.js",
                      "~/Scripts/app/pqi.popover.js",
                      "~/Scripts/app/pqi.colorblink.js",
                      "~/Scripts/app/main.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/jquery.webui-popover.css",
                      "~/Content/DataTables/css/dataTables.bootstrap.css",
                      "~/Content/fa-regular.css",
                      "~/Content/fa-solid.css",
                      "~/Content/fontawesome-all.css",
                      "~/Content/site.css"));

        }
    }
}
