using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddedBingoEvent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BingoEvents",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    EventId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BingoEvents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BingoEvents_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BingoBoardTiles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    EventId = table.Column<string>(type: "TEXT", nullable: false),
                    TileId = table.Column<string>(type: "TEXT", nullable: false),
                    Position_Row = table.Column<int>(type: "INTEGER", nullable: false),
                    Position_Column = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BingoBoardTiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BingoBoardTiles_BingoEvents_EventId",
                        column: x => x.EventId,
                        principalTable: "BingoEvents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BingoBoardTiles_Tiles_TileId",
                        column: x => x.TileId,
                        principalTable: "Tiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BingoBoardTiles_EventId",
                table: "BingoBoardTiles",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_BingoBoardTiles_TileId",
                table: "BingoBoardTiles",
                column: "TileId");

            migrationBuilder.CreateIndex(
                name: "IX_BingoEvents_EventId",
                table: "BingoEvents",
                column: "EventId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BingoBoardTiles");

            migrationBuilder.DropTable(
                name: "BingoEvents");
        }
    }
}
