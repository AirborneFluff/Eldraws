using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddedParticipantsRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GuildId",
                table: "EventParticipants",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_EventParticipants_GuildId",
                table: "EventParticipants",
                column: "GuildId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventParticipants_Guilds_GuildId",
                table: "EventParticipants",
                column: "GuildId",
                principalTable: "Guilds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventParticipants_Guilds_GuildId",
                table: "EventParticipants");

            migrationBuilder.DropIndex(
                name: "IX_EventParticipants_GuildId",
                table: "EventParticipants");

            migrationBuilder.DropColumn(
                name: "GuildId",
                table: "EventParticipants");
        }
    }
}
