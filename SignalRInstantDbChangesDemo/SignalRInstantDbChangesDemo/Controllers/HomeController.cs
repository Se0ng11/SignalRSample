using SignalRInstantDbChangesDemo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
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

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }


        public JsonResult SendPQINotification()
        {
            IDateResultService dataResultService = new DataResultService();
            return Json(dataResultService.GetDataResultDetails(), JsonRequestBehavior.AllowGet);
        }
    }
}