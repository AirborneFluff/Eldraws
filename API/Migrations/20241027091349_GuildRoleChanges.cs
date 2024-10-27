using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class GuildRoleChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Guilds_AspNetUsers_OwnerId",
                table: "Guilds");

            migrationBuilder.RenameColumn(
                name: "OwnerId",
                table: "Guilds",
                newName: "CreatorId");

            migrationBuilder.RenameIndex(
                name: "IX_Guilds_OwnerId",
                table: "Guilds",
                newName: "IX_Guilds_CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Guilds_AspNetUsers_CreatorId",
                table: "Guilds",
                column: "CreatorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Guilds_AspNetUsers_CreatorId",
                table: "Guilds");

            migrationBuilder.RenameColumn(
                name: "CreatorId",
                table: "Guilds",
                newName: "OwnerId");

            migrationBuilder.RenameIndex(
                name: "IX_Guilds_CreatorId",
                table: "Guilds",
                newName: "IX_Guilds_OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Guilds_AspNetUsers_OwnerId",
                table: "Guilds",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
