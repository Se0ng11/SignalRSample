using SignalRInstantDbChangesDemo.DataAccess;
using System.Collections.Generic;

namespace SignalRInstantDbChangesDemo.Models
{
    public class DataResultService : IDateResultService
    {        

        public List<DataResult> GetDataResultDetails()
        {
            return DataResultRepository.GetDataResultRecords();
        }
    }
}