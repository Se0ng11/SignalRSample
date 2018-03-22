using SignalRInstantDbChangesDemo.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using SignalRInstantDbChangesDemo.Function;

namespace SignalRInstantDbChangesDemo.DataAccess
{
    public class PercentageDataRepository
    {
        static PercentageDataRepository _instance = null;
        NewMessageNotifier _newMessageNotifier;
        Action<string> _dispatcher;
        private string _selectQuery = @"SELECT [Line],[H00],[H01],[H02],[H03],[H04],[H05],[H06],[H07],[H08],[H09],[H10],[H11],[H12],[H13],[H14],[H15],[H16],[H17],[H18],[H19],[H20],[H21],[H22],[H23],[Plant] FROM [dbo].[TV_QAIPercentageData] ORDER BY [Line]";

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
            _newMessageNotifier = new NewMessageNotifier(Common.ConnectionString(), _selectQuery);
            _newMessageNotifier.NewMessage += NewMessageRecieved;
        }

        internal void NewMessageRecieved(object sender, SqlNotificationEventArgs e)
        {
            _dispatcher(e.Info.ToString());
        }

        public List<TV_QAIPercentageData> GetDataResultRecords()
        {
            var lst = new List<TV_QAIPercentageData>();

            try
            {
                using (var connection = new SqlConnection(Common.ConnectionString()))
                {
                    using (SqlCommand command = new SqlCommand(_selectQuery, connection))
                    {
                        if (connection.State == ConnectionState.Closed)
                            connection.Open();
                        var Reader = command.ExecuteReader();

                        var query = from dt in Reader.Cast<DbDataRecord>()
                                    select new TV_QAIPercentageData
                                    {
                                        Plant = Common.NullableToString(dt["Plant"]),
                                        Line = (string)dt["Line"],
                                        H00 = Common.NullableToDecimal(dt["H00"]),
                                        H01 = Common.NullableToDecimal(dt["H01"]),
                                        H02 = Common.NullableToDecimal(dt["H02"]),
                                        H03 = Common.NullableToDecimal(dt["H03"]),
                                        H04 = Common.NullableToDecimal(dt["H04"]),
                                        H05 = Common.NullableToDecimal(dt["H05"]),
                                        H06 = Common.NullableToDecimal(dt["H06"]),
                                        H07 = Common.NullableToDecimal(dt["H07"]),
                                        H08 = Common.NullableToDecimal(dt["H08"]),
                                        H09 = Common.NullableToDecimal(dt["H09"]),
                                        H10 = Common.NullableToDecimal(dt["H10"]),
                                        H11 = Common.NullableToDecimal(dt["H11"]),
                                        H12 = Common.NullableToDecimal(dt["H12"]),
                                        H13 = Common.NullableToDecimal(dt["H13"]),
                                        H14 = Common.NullableToDecimal(dt["H14"]),
                                        H15 = Common.NullableToDecimal(dt["H15"]),
                                        H16 = Common.NullableToDecimal(dt["H16"]),
                                        H17 = Common.NullableToDecimal(dt["H17"]),
                                        H18 = Common.NullableToDecimal(dt["H18"]),
                                        H19 = Common.NullableToDecimal(dt["H19"]),
                                        H20 = Common.NullableToDecimal(dt["H20"]),
                                        H21 = Common.NullableToDecimal(dt["H21"]),
                                        H22 = Common.NullableToDecimal(dt["H22"]),
                                        H23 = Common.NullableToDecimal(dt["H23"])

                                    };
                        lst = query.ToList();
                    }
                }
            }
            catch (Exception ex)
            {
            }
          

            return lst;
        }
    }
}