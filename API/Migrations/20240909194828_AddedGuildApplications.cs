using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddedGuildApplications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GuildMemberships_AspNetUsers_AppUserId",
                table: "GuildMemberships");

            migrationBuilder.DropForeignKey(
                name: "FK_GuildMemberships_Guilds_GuildId",
                table: "GuildMemberships");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GuildMemberships",
                table: "GuildMemberships");

            migrationBuilder.DropIndex(
                name: "IX_GuildMemberships_GuildId",
                table: "GuildMemberships");

            migrationBuilder.DropColumn(
                name: "GuidId",
                table: "GuildMemberships");

            migrationBuilder.AlterColumn<string>(
                name: "GuildId",
                table: "GuildMemberships",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_GuildMemberships",
                table: "GuildMemberships",
                columns: new[] { "GuildId", "AppUserId" });

            migrationBuilder.CreateTable(
                name: "GuildApplications",
                columns: table => new
                {
                    GuildId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AppUserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ReviewerId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ApplicationDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuildApplications", x => new { x.GuildId, x.AppUserId });
                    table.ForeignKey(
                        name: "FK_GuildApplications_AspNetUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GuildApplications_AspNetUsers_ReviewerId",
                        column: x => x.ReviewerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_GuildApplications_Guilds_GuildId",
                        column: x => x.GuildId,
                        principalTable: "Guilds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GuildApplications_AppUserId",
                table: "GuildApplications",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_GuildApplications_ReviewerId",
                table: "GuildApplications",
                column: "ReviewerId");

            migrationBuilder.AddForeignKey(
                name: "FK_GuildMemberships_AspNetUsers_AppUserId",
                table: "GuildMemberships",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_GuildMemberships_Guilds_GuildId",
                table: "GuildMemberships",
                column: "GuildId",
                principalTable: "Guilds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GuildMemberships_AspNetUsers_AppUserId",
                table: "GuildMemberships");

            migrationBuilder.DropForeignKey(
                name: "FK_GuildMemberships_Guilds_GuildId",
                table: "GuildMemberships");

            migrationBuilder.DropTable(
                name: "GuildApplications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GuildMemberships",
                table: "GuildMemberships");

            migrationBuilder.AlterColumn<string>(
                name: "GuildId",
                table: "GuildMemberships",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "GuidId",
                table: "GuildMemberships",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GuildMemberships",
                table: "GuildMemberships",
                columns: new[] { "GuidId", "AppUserId" });

            migrationBuilder.CreateIndex(
                name: "IX_GuildMemberships_GuildId",
                table: "GuildMemberships",
                column: "GuildId");

            migrationBuilder.AddForeignKey(
                name: "FK_GuildMemberships_AspNetUsers_AppUserId",
                table: "GuildMemberships",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GuildMemberships_Guilds_GuildId",
                table: "GuildMemberships",
                column: "GuildId",
                principalTable: "Guilds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
