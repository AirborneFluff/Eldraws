using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class RenamedColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BingoBoardTiles_BingoEvents_EventId",
                table: "BingoBoardTiles");

            migrationBuilder.RenameColumn(
                name: "EventId",
                table: "BingoBoardTiles",
                newName: "BingoEventId");

            migrationBuilder.RenameIndex(
                name: "IX_BingoBoardTiles_EventId",
                table: "BingoBoardTiles",
                newName: "IX_BingoBoardTiles_BingoEventId");

            migrationBuilder.AddForeignKey(
                name: "FK_BingoBoardTiles_BingoEvents_BingoEventId",
                table: "BingoBoardTiles",
                column: "BingoEventId",
                principalTable: "BingoEvents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BingoBoardTiles_BingoEvents_BingoEventId",
                table: "BingoBoardTiles");

            migrationBuilder.RenameColumn(
                name: "BingoEventId",
                table: "BingoBoardTiles",
                newName: "EventId");

            migrationBuilder.RenameIndex(
                name: "IX_BingoBoardTiles_BingoEventId",
                table: "BingoBoardTiles",
                newName: "IX_BingoBoardTiles_EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_BingoBoardTiles_BingoEvents_EventId",
                table: "BingoBoardTiles",
                column: "EventId",
                principalTable: "BingoEvents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
