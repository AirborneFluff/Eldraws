using System.Linq.Expressions;
using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions<DataContext> options) : IdentityDbContext<AppUser>(options)
{
    public required DbSet<Guild> Guilds { get; set; }
    public required DbSet<GuildMembership> GuildMemberships { get; set; }
    public required DbSet<GuildApplication> GuildApplications { get; set; }
    public required DbSet<GuildBlacklist> GuildBlacklists { get; set; }
    public required DbSet<GuildRole> GuildRoles { get; set; }
    public required DbSet<Event> Events { get; set; }
    public required DbSet<TileRaceEvent> TileRaceEvents { get; set; }
    public required DbSet<Tile> Tiles { get; set; }
    public required DbSet<BingoBoardTile> BingoBoardTiles { get; set; }
    public required DbSet<BingoEvent> BingoEvents { get; set; }
    public required DbSet<TileSubmission> TileSubmissions { get; set; }
    public required DbSet<EventParticipant> EventParticipants { get; set; }
    public required DbSet<RaffleEntry> RaffleEntries { get; set; }
    public required DbSet<RaffleEvent> RaffleEvents { get; set; }
    public required DbSet<RafflePrize> RafflePrizes { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Guild>()
            .HasOne(g => g.Creator)
            .WithMany(user => user.OwnedGuilds)
            .HasForeignKey(g => g.CreatorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Guild>()
            .Property(g => g.Archived)
            .HasDefaultValue(false);

        modelBuilder.Entity<GuildRole>()
            .HasOne(gr => gr.Guild)
            .WithMany(g => g.Roles);

        modelBuilder.Entity<Tile>()
            .HasOne(t => t.Guild)
            .WithMany(g => g.CustomTiles);

        modelBuilder.Entity<BingoBoardTile>()
            .OwnsOne(tile => tile.Position);
        
        SetSoftDeleteQueryFilters(modelBuilder);
        SetGuildMembershipRelations(modelBuilder);
        SetGuildApplicationRelations(modelBuilder);
        SetGuildApplicationBlacklistRelations(modelBuilder);
    }

    private static void SetGuildMembershipRelations(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<GuildMembership>()
            .Property(gm => gm.Active)
            .HasDefaultValue(true);

        modelBuilder.Entity<GuildMembership>()
            .HasOne(gm => gm.Role);
        modelBuilder.Entity<GuildMembership>()
            .HasKey(gm => new { gm.GuildId, gm.AppUserId });
        modelBuilder.Entity<GuildMembership>()
            .HasOne(gm => gm.AppUser)
            .WithMany(user => user.Memberships);
        modelBuilder.Entity<GuildMembership>()
            .HasOne(gm => gm.Guild)
            .WithMany(guild => guild.Memberships);
        modelBuilder.Entity<GuildMembership>()
            .HasOne(guild => guild.AppUser)
            .WithMany(user => user.Memberships)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<GuildMembership>()
            .HasOne(guild => guild.Guild)
            .WithMany(user => user.Memberships)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static void SetGuildApplicationRelations(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<GuildApplication>()
            .HasOne(ga => ga.AppUser)
            .WithMany(user => user.Applications);
        modelBuilder.Entity<GuildApplication>()
            .HasOne(ga => ga.Guild)
            .WithMany(guild => guild.Applications);
        modelBuilder.Entity<GuildApplication>()
            .HasOne(guild => guild.AppUser)
            .WithMany(user => user.Applications)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<GuildApplication>()
            .HasOne(guild => guild.Guild)
            .WithMany(user => user.Applications)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<GuildApplication>()
            .HasOne(guild => guild.Reviewer)
            .WithMany(user => user.ReviewedApplications)
            .OnDelete(DeleteBehavior.SetNull);
    }

    private static void SetGuildApplicationBlacklistRelations(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<GuildBlacklist>()
            .HasKey(ga => new { ga.GuildId, ga.UserName });
        modelBuilder.Entity<GuildBlacklist>()
            .HasOne(ga => ga.Guild)
            .WithMany(guild => guild.Blacklist);
        modelBuilder.Entity<GuildBlacklist>()
            .HasOne(blacklist => blacklist.Guild)
            .WithMany(guild => guild.Blacklist)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private static void SetSoftDeleteQueryFilters(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (!typeof(DeletableEntity).IsAssignableFrom(entityType.ClrType)) continue;
            
            var parameter = Expression.Parameter(entityType.ClrType, "e");
            var filter = Expression.Lambda(
                Expression.Equal(
                    Expression.Property(parameter, nameof(DeletableEntity.IsDeleted)),
                    Expression.Constant(false)),
                parameter);
            entityType.SetQueryFilter(filter);
        }
    }
}