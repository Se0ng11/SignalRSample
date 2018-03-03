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

        public ContentResult SendDetailsReport()
        {
            IQaiService dataResultService = new QaiService();
            var data1 = dataResultService.GetMonitoringReportDetails();
            var data2 = dataResultService.GetPercentageDataDetails();

            var result = new { x = data1, y = data2 };

            return Content(JsonConvert.SerializeObject(result, Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }), "application/json"); 
        }

        public ContentResult SendPercentageData()
        {
            IQaiService dataResultService = new QaiService();

            var obj = dataResultService.GetPercentageDataDetails();

            return Content(JsonConvert.SerializeObject(obj, Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }), "application/json"); 
        }

        public JsonResult GetServerTime()
        {
            return Json(DateTime.Now, JsonRequestBehavior.AllowGet);
        }

    }
}