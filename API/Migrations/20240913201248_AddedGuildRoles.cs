using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddedGuildRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DefaultGuildMemberRoleId",
                table: "Guilds",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RoleId",
                table: "GuildMemberships",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "GuildRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    GuildId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildRoles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuildRoles_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GuildMemberships_RoleId",
                table: "GuildMemberships",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildRoles_GuildId",
                table: "GuildRoles",
                column: "GuildId");

            migrationBuilder.AddForeignKey(
                name: "FK_GuildMemberships_GuildRoles_RoleId",
                table: "GuildMemberships",
                column: "RoleId",
                principalTable: "GuildRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GuildMemberships_GuildRoles_RoleId",
                table: "GuildMemberships");

            migrationBuilder.DropTable(
                name: "GuildRoles");

            migrationBuilder.DropIndex(
                name: "IX_GuildMemberships_RoleId",
                table: "GuildMemberships");

            migrationBuilder.DropColumn(
                name: "DefaultGuildMemberRoleId",
                table: "Guilds");

            migrationBuilder.DropColumn(
                name: "RoleId",
                table: "GuildMemberships");
        }
    }
}
