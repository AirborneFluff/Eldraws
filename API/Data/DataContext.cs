using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions<DataContext> options) : IdentityDbContext<AppUser>(options)
{
    public required DbSet<Guild> Guilds { get; set; }
    public required DbSet<GuildMembership> GuildMemberships { get; set; }

    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Guild>()
            .HasOne(g => g.Owner)
            .WithMany(user => user.OwnedGuilds)
            .HasForeignKey(g => g.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);
        
        SetGuildMembershipRelations(modelBuilder);
    }

    private static void SetGuildMembershipRelations(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<GuildMembership>()
            .HasKey(gm => new { gm.GuidId, gm.AppUserId });
        modelBuilder.Entity<GuildMembership>()
            .HasOne(gm => gm.AppUser)
            .WithMany(user => user.Memberships);
        modelBuilder.Entity<GuildMembership>()
            .HasOne(gm => gm.Guild)
            .WithMany(guild => guild.Memberships);
        modelBuilder.Entity<GuildMembership>()
            .HasOne(guild => guild.AppUser)
            .WithMany(user => user.Memberships)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<GuildMembership>()
            .HasOne(guild => guild.Guild)
            .WithMany(user => user.Memberships)
            .OnDelete(DeleteBehavior.Cascade);
    }
}