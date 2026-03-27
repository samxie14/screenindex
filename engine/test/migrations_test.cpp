#include <gtest/gtest.h>

#include <filesystem>
#include <stdexcept>
#include <string>

#include <migrations.hpp>
#include <sqlite_connection.hpp>

namespace fs = std::filesystem;

namespace {
/// Resolves `screenindex/engine/migrations` from this test source file location.
fs::path engine_migrations_dir() {
    const fs::path test_cpp = fs::path(__FILE__).lexically_normal();
    const fs::path engine_dir = test_cpp.parent_path().parent_path();
    return engine_dir / "migrations";
}

}  // namespace 

TEST(MigrationsTest, RunMigrations_CreatesTablesAndRecordsVersion) {
    screenindex::SqliteConnection db;
    ASSERT_TRUE(db.open(":memory:"));

    const fs::path mig_dir = engine_migrations_dir();
    ASSERT_TRUE(fs::exists(mig_dir)) << "expected: " << mig_dir;

    EXPECT_NO_THROW(screenindex::run_migrations(db, mig_dir));

    EXPECT_TRUE(db.migration_applied(1));
    EXPECT_TRUE(db.migration_applied(2));

    // Proves 001_init.sql ran: application tables exist. captured_at is INTEGER (epoch seconds).
    EXPECT_TRUE(
        db.exec("INSERT INTO frames (captured_at, device_name) VALUES (1704067200, 'test');"));
    EXPECT_EQ(db.last_insert_rowid(), 1);
}

TEST(MigrationsTest, RunMigrations_SecondRunIsIdempotent) {
    screenindex::SqliteConnection db;
    ASSERT_TRUE(db.open(":memory:"));

    const fs::path mig_dir = engine_migrations_dir();
    ASSERT_TRUE(fs::exists(mig_dir));

    screenindex::run_migrations(db, mig_dir);
    EXPECT_NO_THROW(screenindex::run_migrations(db, mig_dir));

    EXPECT_TRUE(db.migration_applied(1));
    EXPECT_TRUE(db.migration_applied(2));

    // DB should still be usable; first row in `frames` is id 1.
    ASSERT_TRUE(
        db.exec("INSERT INTO frames (captured_at, device_name) VALUES (1704153600, 'test');"));
    EXPECT_EQ(db.last_insert_rowid(), 1);

    ASSERT_TRUE(
        db.exec("INSERT INTO frames (captured_at, device_name) VALUES (1704240000, 'test');"));
    EXPECT_EQ(db.last_insert_rowid(), 2);
}

TEST(MigrationsTest, RunMigrations_ThrowsWhenDirectoryMissing) {
    screenindex::SqliteConnection db;
    ASSERT_TRUE(db.open(":memory:"));

    EXPECT_THROW(screenindex::run_migrations(db, "/nonexistent/migrations/dir"),
                 std::runtime_error);
}

TEST(MigrationsTest, InsertSchemaMigrationRow_BindsFilenameWithSingleQuote) {
    screenindex::SqliteConnection db;
    ASSERT_TRUE(db.open(":memory:"));

    ASSERT_TRUE(db.exec(R"(
        CREATE TABLE IF NOT EXISTS schema_migrations (
            version INTEGER PRIMARY KEY,
            filename TEXT NOT NULL,
            applied_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
    )"));

    const std::string tricky_name = "001_O'Brien_init.sql";
    EXPECT_TRUE(db.insert_schema_migration_row(1, tricky_name));
    EXPECT_TRUE(db.migration_applied(1));
}
