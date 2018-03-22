using SignalRInstantDbChangesDemo.Function;
using SignalRInstantDbChangesDemo.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;

namespace SignalRInstantDbChangesDemo.DataAccess
{
    public class DefectDetailsRepository
    {
        string _selectQuery = "GetDefectDetails";

        public List<DefectDetails> GetDataResultRecords()
        {
            var lst = new List<DefectDetails>();

            try
            {
                using (var connection = new SqlConnection(Common.ConnectionString()))
                {
                    using (SqlCommand command = new SqlCommand(_selectQuery, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        if (connection.State == ConnectionState.Closed)
                            connection.Open();
                        var Reader = command.ExecuteReader();

                        var query = from dt in Reader.Cast<DbDataRecord>()
                                    select new DefectDetails
                                    {
                                        Line = Common.NullableToString(dt["Line"]),
                                        SerialNumber = Common.NullableToDecimal(dt["SerialNumber"]),
                                        BatchNumber = Common.NullableToString(dt["BatchNumber"]),
                                        GloveType = Common.NullableToString(dt["GloveType"]),
                                        Slot = Common.NullabelToInt(dt["Slot"]),
                                        Plant = Common.NullableToString(dt["Plant"]),
                                        DefectDescription = Common.NullableToString(dt["DefectDescription"]),
                                        QAIDefectQuantity = Common.NullabelToInt(dt["QAIDefectQuantity"]),
                                        PNDefectQuantity = Common.NullabelToInt(dt["PNDefectQuantity"]),
                                        TierSide = Common.NullableToString(dt["TierSide"])
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