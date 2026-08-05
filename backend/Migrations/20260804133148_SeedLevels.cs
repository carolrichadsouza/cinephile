using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedLevels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Genres",
                table: "Movies",
                type: "text",
                nullable: true);

            migrationBuilder.InsertData(
                table: "Achievements",
                columns: new[] { "AchievementId", "Code", "Details", "Name", "Points" },
                values: new object[,]
                {
                    { 1, "FIRST_LOG", "Log your very first film.", "First Reel", 10 },
                    { 2, "MARATHONER", "Watch 5 movies in a single week.", "Marathoner", 25 },
                    { 3, "CENTURION", "Log 100 films watched.", "Centurion", 150 },
                    { 4, "CRITIC_10", "Write 10 reviews.", "The Critic", 40 },
                    { 5, "EXPLORER_8", "Watch a film from 8 different genres.", "Explorer", 35 },
                    { 6, "DEVOTED_30", "Maintain a 30-day viewing streak.", "Devoted", 100 },
                    { 7, "PROCRASTINATOR_20", "Keep 20 movies in your watchlist.", "Procrastinator", 20 },
                    { 8, "TRUE_CINEPHILE_LVL20", "Reach Level 20.", "True Cinephile", 200 }
                });

            migrationBuilder.InsertData(
                table: "Levels",
                columns: new[] { "LevelId", "LevelName", "PointsRequired" },
                values: new object[,]
                {
                    { 2, "Popcorn Enthusiast", 50 },
                    { 3, "Casual Viewer", 120 },
                    { 4, "Weekend Watcher", 220 },
                    { 5, "Movie Night Regular", 350 },
                    { 6, "Screen Devotee", 520 },
                    { 7, "Genre Explorer", 730 },
                    { 8, "Film Aficionado", 990 },
                    { 9, "Reel Enthusiast", 1300 },
                    { 10, "Cinephile in Training", 1690 },
                    { 11, "Seasoned Viewer", 2150 },
                    { 12, "Seasoned Cinephile", 2690 },
                    { 13, "Film Scholar", 3320 },
                    { 14, "Cinema Connoisseur", 4050 },
                    { 15, "Master Cinephile", 4890 },
                    { 16, "Archive Keeper", 5850 },
                    { 17, "Legendary Viewer", 6940 },
                    { 18, "Cinema Sage", 8170 },
                    { 19, "Grand Cinephile", 9550 },
                    { 20, "True Cinephile", 11090 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Achievements",
                keyColumn: "AchievementId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Achievements",
                keyColumn: "AchievementId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Achievements",
                keyColumn: "AchievementId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Achievements",
                keyColumn: "AchievementId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Achievements",
                keyColumn: "AchievementId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Achievements",
                keyColumn: "AchievementId",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Achievements",
                keyColumn: "AchievementId",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Achievements",
                keyColumn: "AchievementId",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "LevelId",
                keyValue: 20);

            migrationBuilder.DropColumn(
                name: "Genres",
                table: "Movies");
        }
    }
}
