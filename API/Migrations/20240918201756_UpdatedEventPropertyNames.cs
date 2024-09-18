using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedEventPropertyNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EntryStartDate",
                table: "Events",
                newName: "EntryOpenDate");

            migrationBuilder.RenameColumn(
                name: "EntryFinishDate",
                table: "Events",
                newName: "EntryCloseDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EntryOpenDate",
                table: "Events",
                newName: "EntryStartDate");

            migrationBuilder.RenameColumn(
                name: "EntryCloseDate",
                table: "Events",
                newName: "EntryFinishDate");
        }
    }
}
