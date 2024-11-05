using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddedRaffleEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EventParticipants",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Gamertag = table.Column<string>(type: "TEXT", nullable: false),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventParticipants", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RaffleEvents",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    EventId = table.Column<string>(type: "TEXT", nullable: false),
                    PrizeDrawDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    TotalTickets = table.Column<int>(type: "INTEGER", nullable: false),
                    TotalDonations = table.Column<int>(type: "INTEGER", nullable: false),
                    EntryCost = table.Column<int>(type: "INTEGER", nullable: false),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RaffleEvents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RaffleEvents_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RaffleEntries",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    RaffleEventId = table.Column<string>(type: "TEXT", nullable: false),
                    ParticipantId = table.Column<string>(type: "TEXT", nullable: false),
                    Donation = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LowTicket = table.Column<int>(type: "INTEGER", nullable: false),
                    HighTicket = table.Column<int>(type: "INTEGER", nullable: false),
                    Complimentary = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RaffleEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RaffleEntries_EventParticipants_ParticipantId",
                        column: x => x.ParticipantId,
                        principalTable: "EventParticipants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RaffleEntries_RaffleEvents_RaffleEventId",
                        column: x => x.RaffleEventId,
                        principalTable: "RaffleEvents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RafflePrizes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    RaffleEventId = table.Column<string>(type: "TEXT", nullable: false),
                    WinnerId = table.Column<string>(type: "TEXT", nullable: true),
                    Position = table.Column<int>(type: "INTEGER", nullable: false),
                    DonationPercentage = table.Column<float>(type: "REAL", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    WinningTicketNumber = table.Column<int>(type: "INTEGER", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RafflePrizes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RafflePrizes_EventParticipants_WinnerId",
                        column: x => x.WinnerId,
                        principalTable: "EventParticipants",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RafflePrizes_RaffleEvents_RaffleEventId",
                        column: x => x.RaffleEventId,
                        principalTable: "RaffleEvents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RaffleEntries_ParticipantId",
                table: "RaffleEntries",
                column: "ParticipantId");

            migrationBuilder.CreateIndex(
                name: "IX_RaffleEntries_RaffleEventId",
                table: "RaffleEntries",
                column: "RaffleEventId");

            migrationBuilder.CreateIndex(
                name: "IX_RaffleEvents_EventId",
                table: "RaffleEvents",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_RafflePrizes_RaffleEventId",
                table: "RafflePrizes",
                column: "RaffleEventId");

            migrationBuilder.CreateIndex(
                name: "IX_RafflePrizes_WinnerId",
                table: "RafflePrizes",
                column: "WinnerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RaffleEntries");

            migrationBuilder.DropTable(
                name: "RafflePrizes");

            migrationBuilder.DropTable(
                name: "EventParticipants");

            migrationBuilder.DropTable(
                name: "RaffleEvents");
        }
    }
}
