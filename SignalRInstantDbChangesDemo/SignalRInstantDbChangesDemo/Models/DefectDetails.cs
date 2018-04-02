
using Newtonsoft.Json;
namespace PQIChart.Models
{
    public class DefectDetails
    {
        public string Line { get; set; }

        [JsonProperty(PropertyName = "Serial No")]
        public decimal? SerialNumber { get; set; }

        [JsonProperty(PropertyName = "Batch No")]
        public string BatchNumber { get; set; }

        [JsonProperty(PropertyName = "Glove Type")]
        public string GloveType { get; set; }
        
        public int Slot { get; set; }
        
        public string Plant { get; set; }

        [JsonProperty(PropertyName = "QC Type")]
        public string QCType { get; set; }

        [JsonProperty(PropertyName = "Tier Side")]
        public string TierSide { get; set; }

        //[JsonProperty(PropertyName = "Batch Weight")]
        //public decimal? BatchWeight { get; set; }

        //[JsonProperty(PropertyName = "Ten Packs Weight")]
        //public decimal? TenPCsWeight { get; set; }

        [JsonProperty(PropertyName = "Description")]
        public string DefectDescription { get; set; }

        //[JsonProperty(PropertyName = "QAI Defect")]
        //public int? QAIDefectQuantity { get; set; }

        //[JsonProperty(PropertyName = "PN Defect")]
        //public int? PNDefectQuantity { get; set; }



    }
}