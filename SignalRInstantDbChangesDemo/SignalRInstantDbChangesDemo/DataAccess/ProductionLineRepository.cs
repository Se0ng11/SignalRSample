using SignalRInstantDbChangesDemo.Function;
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
    public class ProductionLineRepository
    {
         static MonitoringReportRepository _instance = null;
        NewMessageNotifier _newMessageNotifier;
        Action<string> _dispatcher;
        private string _selectQuery = @"SELECT [LineId],[OperatorId],[BatchFrequency],[LTGloveType],[LTGloveSize],[LTAltGlove],[LBGloveType],[LBGloveSize],[LBAltGlove],[RTGloveType],[RTGloveSize],[RTAltGlove],[RBGloveType],[RBGloveSize],[RBAltGlove],[IsOnline],[IsDoubleFormer],[IsPrintByFormer],[Formers],[Speed],[Cycle] FROM [dbo].[ProductionLine]";

        public static MonitoringReportRepository GetInstance(Action<string> dispatcher)
        {
            if (_instance == null)
                _instance = new MonitoringReportRepository(dispatcher);

            return _instance;
        }

        public ProductionLineRepository()
        {
        }

        public ProductionLineRepository(Action<string> dispatcher)
        {
            _dispatcher = dispatcher;
            _newMessageNotifier = new NewMessageNotifier(Common.ConnectionString(), _selectQuery);
            _newMessageNotifier.NewMessage += NewMessageRecieved;

        }

        internal void NewMessageRecieved(object sender, SqlNotificationEventArgs e)
        {
            _dispatcher(e.Info.ToString());
        }

        public List<ProductionLine> GetDataResultRecords()
        {
            var lst = new List<ProductionLine>();

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
                                    select new ProductionLine
                                    {
                                        LineId = Common.NullableToString(dt["LineId"]),
                                        OperatorId = Common.NullableToString(dt["OperatorId"]),
                                        BatchFrequency = Common.NullableToString(dt["BatchFrequency"]),
                                        LTGloveType = Common.NullableToString(dt["LTGloveType"]),
                                        LTGloveSize = Common.NullableToString(dt["LTGloveSize"]),
                                        LTAltGlove = Common.NullableToString(dt["LTAltGlove"]),
                                        LBGloveType = Common.NullableToString(dt["LBGloveType"]),
                                        LBGloveSize = Common.NullableToString(dt["LBGloveSize"]),
                                        LBAltGlove = Common.NullableToString(dt["LBAltGlove"]),
                                        RTGloveType = Common.NullableToString(dt["RTGloveType"]),
                                        RTGloveSize = Common.NullableToString(dt["RTGloveSize"]),
                                        RTAltGlove = Common.NullableToString(dt["RTAltGlove"]),
                                        RBGloveType = Common.NullableToString(dt["RBGloveType"]),
                                        RBGloveSize = Common.NullableToString(dt["RBGloveSize"]),
                                        RBAltGlove = Common.NullableToString(dt["RBAltGlove"]),
                                        IsOnline = (bool?)dt["IsOnline"],
                                        IsDoubleFormer = (bool?)dt["IsDoubleFormer"],
                                        IsPrintByFormer = (bool?)dt["IsPrintByFormer"],
                                        Formers = (int?)dt["Formers"],
                                        Speed = (int?)dt["Speed"],
                                        Cycle = Common.NullableToDecimal(dt["Cycle"])
                                    };
                        lst = query.OrderBy(x=> x.LineId).ToList();
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