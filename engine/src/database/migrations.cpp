#include "database/migrations.hpp"

#include <algorithm>
#include <cctype>

#include <filesystem>
#include <fstream>

#include <sstream>
#include <stdexcept>
#include <sqlite_connection.hpp>

#include <vector>


namespace screenindex {
    namespace fs = std::filesystem;

    // Returns -1 if no leading diigts (skip)
    int parse_version_from_filename(const fs::path& p){
        std::string stem = p.stem().string();
        int v = 0;
        size_t i = 0;
        while(i < stem.size() && std::isdigit(static_cast<unsigned char>(stem[i]))) {
            v = v * 10 + (stem[i] - '0');
            ++i;
        }
        if (i == 0) return -1;
        return v;

    }

    std::string read_whole_file(const fs::path& p){
        std::ifstream in(p, std::ios::binary);
        if(!in) throw std::runtime_error("cannot open: " + p.string());
        std::ostringstream ss;
        ss << in.rdbuf();
        return ss.str();
    }

    void run_migrations(SqliteConnection& db, const std::filesystem::path& migrations_dir) {
        std::vector<fs::path> sql_files;
        for (const auto& entry : fs::directory_iterator(migrations_dir)){
            if (!entry.is_regular_file()){
                continue;
            }

            const auto& p = entry.path();
            const auto name = p.filename().string();

            if (!name.empty() && name[0] == '.') continue;
            if (p.extension() == ".sql") sql_files.push_back(p);

        }

        struct MigrationFile {
            int version;
            fs::path path;
        };

        std::vector<MigrationFile> migrations;
        for (const auto& p : sql_files) {
            int v = parse_version_from_filename(p);
            if (v < 0) continue;
            migrations.push_back({v, p});
        }

        std::sort(migrations.begin(), migrations.end(), [](const MigrationFile& a, const MigrationFile& b) {
            return a.version < b.version;
        });

        if(!db.exec(R"(
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version INTEGER PRIMARY KEY,
                filename TEXT NOT NULL,
                applied_at TEXT NOT NULL DEFAULT (datetime('now'))
            );
        )")) {
            throw std::runtime_error("failed to create schema_migrations");
        }

        for (const auto& m : migrations) {
            if (db.migration_applied(m.version)){
                continue;
            }

            if(!db.exec("BEGIN IMMEDIATE")) throw std::runtime_error("Failed to start transaction: " + db.errorMessage());

    
            std::string sql = read_whole_file(m.path);
            if (!db.exec(sql)) {
                (void)db.exec("ROLLBACK");
                throw std::runtime_error("migration failed: " + m.path.string());
            }

            const std::string filename = m.path.filename().string();
            if (!db.insert_schema_migration_row(m.version, filename)) {
                (void)db.exec("ROLLBACK");
                throw std::runtime_error("failed to record migration in schema_migrations: " +
                                         m.path.string() + " — " + db.errorMessage());
            }

            if (!db.exec("COMMIT")) {
                (void)db.exec("ROLLBACK");
                throw std::runtime_error("COMMIT failed: " + db.errorMessage());
            }
        }


    }




}  // namespace screenindex