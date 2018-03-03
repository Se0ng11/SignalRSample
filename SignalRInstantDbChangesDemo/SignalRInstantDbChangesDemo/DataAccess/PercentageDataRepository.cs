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
    public class PercentageDataRepository
    {
        private bool isSubscribe = false;
        private string dbConnectionSettings = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;

        public List<TV_QAIPercentageData> GetPercentageData()
        {
            var lst = new List<TV_QAIPercentageData>();

            using (var dbConnection = new SqlConnection(dbConnectionSettings))
            {
                dbConnection.Open();

                var sqlCommandText = @"SELECT [Line],[H00],[H01],[H02],[H03],[H04],[H05],[H06],[H07],[H08],[H09],[H10],[H11],[H12],[H13],[H14],[H15],[H16],[H17],[H18],[H19],[H20],[H21],[H22],[H23],[Plant] FROM [dbo].[TV_QAIPercentageData]";

                using (var sqlCommand = new SqlCommand(sqlCommandText, dbConnection))
                {
                    AddSQLDependency(sqlCommand);                   

                    if (dbConnection.State == ConnectionState.Closed)
                        dbConnection.Open();

                    var reader = sqlCommand.ExecuteReader();
                    lst = GetDataResultRecords(reader);
                }
            }
            return lst ; 
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
                PercentageDataHub.SendPercentageData(e.Info.ToString());
            }

            SqlDependency dependency = sender as SqlDependency;
            dependency.OnChange -= dependency_OnChange;
            isSubscribe = false;
        }

        private List<TV_QAIPercentageData> GetDataResultRecords(SqlDataReader reader)
        {
            var lst = new List<TV_QAIPercentageData>();
            try
            {
                var query = from dt in reader.Cast<DbDataRecord>()
                            select new TV_QAIPercentageData
                            {
                                Plant = (dt["Plant"] == DBNull.Value) ? "" : ((string)dt["Plant"]),
                                Line = (string)dt["Line"],
                                H00 = (dt["H00"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H00"]),
                                H01 = (dt["H01"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H01"]),
                                H02 = (dt["H02"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H02"]),
                                H03 = (dt["H03"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H03"]),
                                H04 = (dt["H04"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H04"]),
                                H05 = (dt["H05"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H05"]),
                                H06 = (dt["H06"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H06"]),
                                H07 = (dt["H07"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H07"]),
                                H08 = (dt["H08"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H08"]),
                                H09 = (dt["H09"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H09"]),
                                H10 = (dt["H10"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H10"]),
                                H11 = (dt["H11"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H11"]),
                                H12 = (dt["H12"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H12"]),
                                H13 = (dt["H13"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H13"]),
                                H14 = (dt["H14"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H14"]),
                                H15 = (dt["H15"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H15"]),
                                H16 = (dt["H16"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H16"]),
                                H17 = (dt["H17"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H17"]),
                                H18 = (dt["H18"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H18"]),
                                H19 = (dt["H19"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H19"]),
                                H20 = (dt["H20"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H20"]),
                                H21 = (dt["H21"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H21"]),
                                H22 = (dt["H22"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H22"]),
                                H23 = (dt["H23"] == DBNull.Value) ? decimal.Zero : ((decimal)dt["H23"])

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