namespace WebApplication1.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("exercise")]
    public partial class exercise
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long id { get; set; }

        [StringLength(50)]
        public string name { get; set; }

        public long? user_id { get; set; }
    }
}
