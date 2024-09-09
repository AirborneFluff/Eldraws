using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class ChangedApplicationId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_GuildApplications",
                table: "GuildApplications");

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "GuildApplications",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GuildApplications",
                table: "GuildApplications",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_GuildApplications_GuildId",
                table: "GuildApplications",
                column: "GuildId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_GuildApplications",
                table: "GuildApplications");

            migrationBuilder.DropIndex(
                name: "IX_GuildApplications_GuildId",
                table: "GuildApplications");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "GuildApplications");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GuildApplications",
                table: "GuildApplications",
                columns: new[] { "GuildId", "AppUserId" });
        }
    }
}
