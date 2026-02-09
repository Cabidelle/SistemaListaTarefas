using Microsoft.EntityFrameworkCore;
using TarefasAPI.Models;

namespace TarefasAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Tarefa> Tarefas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tarefa>()
                .HasIndex(t => t.Nome)
                .IsUnique();
        }
    }
}