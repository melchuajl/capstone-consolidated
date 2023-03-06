using Microsoft.EntityFrameworkCore;

namespace UserV2API.Models
{
    public class DataContext: DbContext
    {
        public DataContext(DbContextOptions options): base(options)
        {
            Database.EnsureCreated();
        }
        public DbSet<User> Users { get; set; }
    }
}
