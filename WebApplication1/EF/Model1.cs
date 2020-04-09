namespace WebApplication1.EF
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class Model1 : DbContext
    {
        public Model1()
            : base("name=classRoom1")
        {
        }

        public virtual DbSet<exercise> exercises { get; set; }
        public virtual DbSet<user> users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<exercise>()
                .Property(e => e.name)
                .IsUnicode(false);

            modelBuilder.Entity<user>()
                .Property(e => e.name)
                .IsUnicode(false);

            modelBuilder.Entity<user>()
                .Property(e => e.username)
                .IsUnicode(false);

            modelBuilder.Entity<user>()
                .Property(e => e.password)
                .IsUnicode(false);
        }
    }
}
