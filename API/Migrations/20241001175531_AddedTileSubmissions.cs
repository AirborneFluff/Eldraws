using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddedTileSubmissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TileSubmissions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    AppUserId = table.Column<string>(type: "TEXT", nullable: false),
                    BingoBoardTileId = table.Column<string>(type: "TEXT", nullable: false),
                    SubmissionDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    JudgeId = table.Column<string>(type: "TEXT", nullable: true),
                    Accepted = table.Column<bool>(type: "INTEGER", nullable: false),
                    Notes = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TileSubmissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TileSubmissions_AspNetUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TileSubmissions_AspNetUsers_JudgeId",
                        column: x => x.JudgeId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TileSubmissions_BingoBoardTiles_BingoBoardTileId",
                        column: x => x.BingoBoardTileId,
                        principalTable: "BingoBoardTiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TileSubmissions_AppUserId",
                table: "TileSubmissions",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_TileSubmissions_BingoBoardTileId",
                table: "TileSubmissions",
                column: "BingoBoardTileId");

            migrationBuilder.CreateIndex(
                name: "IX_TileSubmissions_JudgeId",
                table: "TileSubmissions",
                column: "JudgeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TileSubmissions");
        }
    }
}
