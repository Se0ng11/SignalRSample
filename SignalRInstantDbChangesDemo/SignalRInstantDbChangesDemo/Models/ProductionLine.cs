using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace PQIChart.Models
{
    public class ProductionLine
    {
        public int ProductionLineId { get; set; }
        public string LineId{ get; set; }
        //public string OperatorId{ get; set; }
        //public string BatchFrequency{ get; set; }
        public string LTGloveType{ get; set; }
        public string LTGloveSize{ get; set; }
        //public string LTAltGlove{ get; set; }
        public string LBGloveType{ get; set; }
        public string LBGloveSize{ get; set; }
        //public string LBAltGlove{ get; set; }
        public string RTGloveType{ get; set; }
        public string RTGloveSize{ get; set; }
        //public string RTAltGlove{ get; set; }
        public string RBGloveType{ get; set; }
        public string RBGloveSize{ get; set; }
        //public string RBAltGlove{ get; set; }
        //public bool? IsOnline{ get; set; }
        //public bool? IsDoubleFormer{ get; set; }
        //public bool? IsPrintByFormer { get; set; }
        public int LocationId{ get; set; }
        //public bool? StartPrint { get; set; }
        //public DateTime? LineStartDateTime{ get; set; }
        //public bool? IsDeleted { get; set; }
        //public DateTime? PrintDateTime{ get; set; }
        //public DateTime? ProdLoggingStartDateTime{ get; set; }
        public int? Formers{ get; set; }
        public int? Speed{ get; set; }
        public decimal Cycle{ get; set; }
        //public int WorkStationId{ get; set; }
        //public DateTime? lastmodifiedon { get; set; }
    }
}