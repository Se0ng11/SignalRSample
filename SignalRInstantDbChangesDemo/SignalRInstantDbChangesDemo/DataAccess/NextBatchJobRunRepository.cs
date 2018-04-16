using PQIChart.Function;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace PQIChart.DataAccess
{
    public class NextBatchJobRunRepository
    {
        string _selectQuery = "USP_GET_NextTVBatchJobRunTime";
        
        public async Task<DateTime?> GetDataResultRecords()
        {
            try
            {
                using (var connection = new SqlConnection(Common.ConnectionString()))
                {
                    using (SqlCommand command = new SqlCommand(_selectQuery, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.CommandTimeout = Common.SPTimeOut();

                        if (connection.State == ConnectionState.Closed)
                            connection.Open();
                        var Reader = await command.ExecuteReaderAsync().ConfigureAwait(false);

                        var query = from dt in Reader.Cast<DbDataRecord>()
                                    select dt;

                    }

                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return DateTime.Now;
        }
    }
}