using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class RemovedEmails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Email",
                table: "GuildBlacklists",
                newName: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildBlacklists_AppUserId",
                table: "GuildBlacklists",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_GuildBlacklists_AspNetUsers_AppUserId",
                table: "GuildBlacklists",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GuildBlacklists_AspNetUsers_AppUserId",
                table: "GuildBlacklists");

            migrationBuilder.DropIndex(
                name: "IX_GuildBlacklists_AppUserId",
                table: "GuildBlacklists");

            migrationBuilder.RenameColumn(
                name: "AppUserId",
                table: "GuildBlacklists",
                newName: "Email");
        }
    }
}
