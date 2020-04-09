namespace WebApplication1.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("user")]
    public partial class user
    {
        public long id { get; set; }

        [StringLength(50)]
        public string name { get; set; }

        public int? gender { get; set; }

        [StringLength(50)]
        public string username { get; set; }

        [StringLength(50)]
        public string password { get; set; }
    }
}
