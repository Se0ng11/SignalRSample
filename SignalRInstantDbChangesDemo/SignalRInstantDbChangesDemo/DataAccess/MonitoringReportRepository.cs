using PQIChart.Function;
using PQIChart.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Data.Entity;

namespace PQIChart.DataAccess
{
    public class MonitoringReportRepository
    {
        static MonitoringReportRepository _instance = null;
        NewMessageNotifier _newMessageNotifier;
        Action<string> _dispatcher;
        private string _selectQuery = @"SELECT [Line],[H00],[H01],[H02],[H03],[H04],[H05],[H06],[H07],[H08],[H09],[H10],[H11],[H12],[H13],[H14],[H15],[H16],[H17],[H18],[H19],[H20],[H21],[H22],[H23],[Plant] FROM [dbo].[TV_QAIMonitoringReport] ORDER BY [Line]";

        public static MonitoringReportRepository GetInstance(Action<string> dispatcher)
        {
            if (_instance == null)
                _instance = new MonitoringReportRepository(dispatcher);

            return _instance;
        }

        public MonitoringReportRepository()
        {
        }

        public MonitoringReportRepository(Action<string> dispatcher)
        {
            _dispatcher = dispatcher;
            _newMessageNotifier = new NewMessageNotifier(Common.ConnectionString(), _selectQuery);
            _newMessageNotifier.NewMessage += NewMessageRecieved;

        }

        internal void NewMessageRecieved(object sender, SqlNotificationEventArgs e)
        {
            _dispatcher(e.Info.ToString());
        }

        public async Task<List<TV_QAIMonitoringReport>> GetDataResultRecords()
        {
            var lst = new List<TV_QAIMonitoringReport>();

            try
            {
                using (var connection = new SqlConnection(Common.ConnectionString()))
                {
                    using (SqlCommand command = new SqlCommand(_selectQuery, connection))
                    {
                        if (connection.State == ConnectionState.Closed)
                            connection.Open();
                        var Reader = await command.ExecuteReaderAsync().ConfigureAwait(false);

                        var query = from dt in Reader.Cast<DbDataRecord>()
                                    select new TV_QAIMonitoringReport
                                    {
                                        Plant = (string)dt["Plant"],
                                        Line = (string)dt["Line"],
                                        H00 = (string)dt["H00"],
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
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
           

            return lst;
        }
    }
}