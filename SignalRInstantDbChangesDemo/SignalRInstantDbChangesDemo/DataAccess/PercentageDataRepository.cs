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
        static PercentageDataRepository _instance = null;
        //NewMessageNotifier _newMessageNotifier;
        Action<string> _dispatcher;
        private string _connString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
        private string _selectQuery = @"SELECT [Line],[H00],[H01],[H02],[H03],[H04],[H05],[H06],[H07],[H08],[H09],[H10],[H11],[H12],[H13],[H14],[H15],[H16],[H17],[H18],[H19],[H20],[H21],[H22],[H23],[Plant] FROM [dbo].[TV_QAIPercentageData]";

        public static PercentageDataRepository GetInstance(Action<string> dispatcher)
        {
            if (_instance == null)
                _instance = new PercentageDataRepository(dispatcher);

            return _instance;
        }

        public PercentageDataRepository()
        {
        }

        public PercentageDataRepository(Action<string> dispatcher)
        {
            _dispatcher = dispatcher;
            //_newMessageNotifier = new NewMessageNotifier(_connString, _selectQuery);
            //_newMessageNotifier.NewMessage += NewMessageRecieved;
        }

        internal void NewMessageRecieved(object sender, SqlNotificationEventArgs e)
        {
            _dispatcher(e.Info.ToString());
        }

        public List<TV_QAIPercentageData> GetDataResultRecords()
        {
            var lst = new List<TV_QAIPercentageData>();

            using (var connection = new SqlConnection(_connString))
            {
                using (SqlCommand command = new SqlCommand(_selectQuery, connection))
                {
                    if (connection.State == ConnectionState.Closed)
                        connection.Open();
                    var Reader = command.ExecuteReader();

                    var query = from dt in Reader.Cast<DbDataRecord>()
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
            }

            return lst;
        }
    }
}