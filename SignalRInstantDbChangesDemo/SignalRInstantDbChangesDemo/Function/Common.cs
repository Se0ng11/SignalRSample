using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using Hartalega.FloorSystem.Framework.Common;

namespace PQIChart.Function
{
    public class Common
    {
        public static string NullableToString(object record) {
             return record == DBNull.Value ? "" : (string)record;
        }

        public static decimal NullableToDecimal(object record)
        {
            decimal val = decimal.Zero;
            try 
            {
                val = record == DBNull.Value ? decimal.Zero : (decimal)record;
            }
            catch (Exception ex)
            {
                val = 0;
            }
            return val;
        }

        public static int NullabelToInt(object record)
        {
            int val = 0;

            try
            {
                val = record == DBNull.Value ? 0 : (int)record;
            }
            catch (Exception ex)
            {
                val = 0;
            }

            return val;
        }

        public static string ConnectionString()
        {
            //var s  = EncryptDecrypt.GetDecryptedString(ConfigurationManager.ConnectionStrings["FSDB"].ToString(), "hidden");    
            return ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
        }


        public static int SPTimeOut()
        {
            return Convert.ToInt32(ConfigurationManager.AppSettings["SPTimeOut"]);
        }
    }
}