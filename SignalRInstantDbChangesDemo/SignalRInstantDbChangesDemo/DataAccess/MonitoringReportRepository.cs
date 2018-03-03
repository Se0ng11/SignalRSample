using SignalRInstantDbChangesDemo.Hubs;
using SignalRInstantDbChangesDemo.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;

namespace SignalRInstantDbChangesDemo.DataAccess
{
    public class MonitoringReportRepository
    {
        private bool isSubscribe = false;
        private string dbConnectionSettings = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;

        public List<TV_QAIMonitoringReport> GetMonitoringReport()
        {
            var lst = new List<TV_QAIMonitoringReport>();


            using (var dbConnection = new SqlConnection(dbConnectionSettings))
            {
                dbConnection.Open();

                var sqlCommandText = @"SELECT [Line],[H00],[H01],[H02],[H03],[H04],[H05],[H06],[H07],[H08],[H09],[H10],[H11],[H12],[H13],[H14],[H15],[H16],[H17],[H18],[H19],[H20],[H21],[H22],[H23],[Plant] FROM [dbo].[TV_QAIMonitoringReport]";

                using (var sqlCommand = new SqlCommand(sqlCommandText, dbConnection))
                {
                    AddSQLDependency(sqlCommand);                   

                    if (dbConnection.State == ConnectionState.Closed)
                        dbConnection.Open();

                    var reader = sqlCommand.ExecuteReader();
                    lst = GetDataResultRecords(reader);
                }
            }
            return lst; 
        }

        private void AddSQLDependency(SqlCommand sqlCommand)
        {
            sqlCommand.Notification = null;

            var dependency = new SqlDependency(sqlCommand);

            if (isSubscribe == false)
            {
                var onChange = new OnChangeEventHandler(dependency_OnChange);
                dependency.OnChange -= onChange;
                dependency.OnChange += onChange;
                isSubscribe = true;
            }

        }

        private void dependency_OnChange(object sender, SqlNotificationEventArgs e)
        {
            if (e.Type == SqlNotificationType.Change)
            {
                MonitoringReportHub.SendMonitoringReport(e.Info.ToString());
            }

            SqlDependency dependency = sender as SqlDependency;
            dependency.OnChange -= dependency_OnChange;
            isSubscribe = false;
        }

        private List<TV_QAIMonitoringReport> GetDataResultRecords(SqlDataReader reader)
        {
            var lst = new List<TV_QAIMonitoringReport>();
            try
            {
                var query = from dt in reader.Cast<DbDataRecord>()
                            select new TV_QAIMonitoringReport
                            {
                                Plant = (string)dt["Plant"],
                                Line = (string)dt["Line"],
                                H00 = (string)dt["H01"],
                                H01 = (string)dt["H01"],
                                H02 = (string)dt["H02"],
                                H03 = (string)dt["H03"],
                                H04 = (string)dt["H04"],
                                H05 = (string)dt["H05"],
                                H06 = (string)dt["H06"],
                                H07 = (string)dt["H07"],
                                H08 = (string)dt["H08"],
                                H09 = (string)dt["H09"],
                                H10 = (string)dt["H10"],
                                H11 = (string)dt["H11"],
                                H12 = (string)dt["H12"],
                                H13 = (string)dt["H13"],
                                H14 = (string)dt["H14"],
                                H15 = (string)dt["H15"],
                                H16 = (string)dt["H16"],
                                H17 = (string)dt["H17"],
                                H18 = (string)dt["H18"],
                                H19 = (string)dt["H19"],
                                H20 = (string)dt["H20"],
                                H21 = (string)dt["H21"],
                                H22 = (string)dt["H22"],
                                H23 = (string)dt["H23"]

                            };
                lst = query.ToList();

            }
            catch (Exception ex)
            {

            }
               
            return lst;
        }
    }
}