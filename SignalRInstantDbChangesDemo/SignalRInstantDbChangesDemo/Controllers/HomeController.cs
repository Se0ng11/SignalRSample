using Newtonsoft.Json;
using PQIChart.Collection;
using PQIChart.Interface;
using PQIChart.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace PQIChart.Controllers
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
            var data3 = dataResultService.GetLastBatchJobRun();
            var data4 = dataResultService.GetNextBatchJobRun();

            Task.WaitAll(data1, data2, data3, data4);

            var result = new { mr = data1.Result, pd = data2.Result, serverDate = DateTime.Now, lastRun = data3.Result, nextRun = data4.Result };

            return ReturnJSON(result);
        }

        public JsonResult GetMonitoringReport()
        {
            IQaiService dataResultService = new QaiService();
            var data1 = dataResultService.GetMonitoringReportDetails();

            Task.WaitAll(data1);
            var result = new { mr = data1.Result };

            return ReturnJSON(result);
        }

        public JsonResult GetPercentageData()
        {
            IQaiService dataResultService = new QaiService();
            var data1 = dataResultService.GetPercentageDataDetails();
            var data2 = dataResultService.GetLastBatchJobRun();
            var data3 = dataResultService.GetNextBatchJobRun();

            Task.WaitAll(data1, data2, data3);

            var result = new { pd = data1.Result, lastRun = data2.Result, nextRun = data3.Result };

            return ReturnJSON(result);
        }

        public JsonResult GetProductionLine()
        {
            IQaiService dataResultService = new QaiService();
            var data1 = dataResultService.GetProductionLineDetails();

            Task.WaitAll(data1);

            var result = new { pl = data1.Result };
           
            return ReturnJSON(result);
        }

        public JsonResult GetDefectDetails()
        {
            IQaiService dataResultService = new QaiService();
            var data1 = dataResultService.GetDefectDetails();

            Task.WaitAll(data1);

            var result = new { dd = data1.Result };

            return ReturnJSON(result);
        }

        private JsonResult ReturnJSON(object result)
        {
            return Json(JsonConvert.SerializeObject(result, Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }), JsonRequestBehavior.AllowGet);
        }
    }
}