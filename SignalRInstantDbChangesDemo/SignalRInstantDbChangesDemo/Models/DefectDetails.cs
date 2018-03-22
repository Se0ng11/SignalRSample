
using Newtonsoft.Json;
namespace SignalRInstantDbChangesDemo.Models
{
    public class DefectDetails
    {
        public string Line { get; set; }

        [JsonProperty(PropertyName = "Serial Number")]
        public decimal? SerialNumber { get; set; }

        [JsonProperty(PropertyName = "Batch Number")]
        public string BatchNumber { get; set; }

        [JsonProperty(PropertyName = "Glove Type")]
        public string GloveType { get; set; }
        
        public int Slot { get; set; }
        
        public string Plant { get; set; }

        [JsonProperty(PropertyName = "Tier Side")]
        public string TierSide { get; set; }

        [JsonProperty(PropertyName = "Description")]
        public string DefectDescription { get; set; }

        [JsonProperty(PropertyName = "QAI Defect")]
        public int? QAIDefectQuantity { get; set; }

        [JsonProperty(PropertyName = "PN Defect")]
        public int? PNDefectQuantity { get; set; }



    }
}