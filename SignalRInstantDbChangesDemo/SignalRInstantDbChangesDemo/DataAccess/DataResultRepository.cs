using SignalRInstantDbChangesDemo.Hubs;
using SignalRInstantDbChangesDemo.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace SignalRInstantDbChangesDemo.DataAccess
{
    public static class DataResultRepository
    {
        private static bool isSubscribe = false;
        public static List<DataResult> GetDataResultRecords()
        {
            var lstDataResultRecords = new List<DataResult>();
            string dbConnectionSettings = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;

            using (var dbConnection = new SqlConnection(dbConnectionSettings))
            {
                dbConnection.Open();

                var sqlCommandText = @"SELECT [id],[status],[message] FROM [dbo].[DataResult]";

                using (var sqlCommand = new SqlCommand(sqlCommandText, dbConnection))
                {
                    AddSQLDependency(sqlCommand);                   

                    if (dbConnection.State == ConnectionState.Closed)
                        dbConnection.Open();

                    var reader = sqlCommand.ExecuteReader();
                    lstDataResultRecords = GetDataResultRecords(reader);
                }
            }
            return lstDataResultRecords; 
        }

        /// <summary>
        /// Adds SQLDependency for change notification and passes the information to Student Hub for broadcasting
        /// </summary>
        /// <param name="sqlCommand"></param>
        private static void AddSQLDependency(SqlCommand sqlCommand)
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


            //dependency.OnChange += (sender, sqlNotificationEvents) =>
            //{
            //    if (sqlNotificationEvents.Type == SqlNotificationType.Change)
            //    {
            //        DataResultHub.SendUptodateInformation(sqlNotificationEvents.Info.ToString());
            //    }
            //};
        }

        private static void dependency_OnChange(object sender, SqlNotificationEventArgs e)
        {
            if (e.Type == SqlNotificationType.Change)
            {
                DataResultHub.SendUptodateInformation(e.Info.ToString());
            }

            //remove event handler
            SqlDependency dependency = sender as SqlDependency;
            dependency.OnChange -= dependency_OnChange;
            isSubscribe = false;
        }

        /// <summary>
        /// Fills the Student Records
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static List<DataResult> GetDataResultRecords(SqlDataReader reader)
        {
            var lstDataResultRecords = new List<DataResult>();
            var dt = new DataTable();
            dt.Load(reader);
            dt
                .AsEnumerable()
                .ToList()
                .ForEach
                (
                    i => lstDataResultRecords.Add(new DataResult()
                    {
                        Id = (string)i["id"]
                            , Status = (string)i["Status"]
                            , Message = (string)i["message"]

                    })
                );
            return lstDataResultRecords;
        }       
    }
}