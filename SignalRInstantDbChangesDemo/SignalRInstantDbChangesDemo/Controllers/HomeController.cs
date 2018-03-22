using Newtonsoft.Json;
using SignalRInstantDbChangesDemo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace SignalRInstantDbChangesDemo.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetDetailsReport()
        {
            IQaiService dataResultService = new QaiService();
            var data1 = dataResultService.GetMonitoringReportDetails();
            var data2 = dataResultService.GetPercentageDataDetails();
            var data3 = dataResultService.GetProductionLineDetails();
            var data4 = dataResultService.GetDefectDetails();

            var result = new { mr = data1, pd = data2, pl= data3, dd = data4, serverDate = DateTime.Now };

            return ReturnJSON(result);
        }

        public JsonResult GetMonitoringReport()
        {
            IQaiService dataResultService = new QaiService();
            var data1 = dataResultService.GetMonitoringReportDetails();

            var result = new { mr = data1 };

            return ReturnJSON(result);
        }

        public JsonResult GetPercentageData()
        {
            IQaiService dataResultService = new QaiService();
            var data1 = dataResultService.GetPercentageDataDetails();
            var data2 = dataResultService.GetDefectDetails();

            var result = new { pd = data1, dd = data2 };

            return ReturnJSON(result);
        }

        public JsonResult GetProductionLine()
        {
            IQaiService dataResultService = new QaiService();
            var data1 = dataResultService.GetProductionLineDetails();

            var result = new { pl = data1 };

            return ReturnJSON(result);
        }

        private JsonResult ReturnJSON(object result)
        {
            //return Content(JsonConvert.SerializeObject(result, Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }), "application/json");
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}