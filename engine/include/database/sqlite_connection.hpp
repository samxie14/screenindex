#ifndef SCREENINDEX_SQLITE_CONNECTION_HPP
#define SCREENINDEX_SQLITE_CONNECTION_HPP

#include <sqlite3.h>
#include <string>
#include <string_view>
namespace screenindex {

class SqliteConnection {
public: 
    SqliteConnection() = default;
    ~SqliteConnection();
    
    SqliteConnection(const SqliteConnection&) = delete;
    SqliteConnection& operator=(const SqliteConnection&) = delete;

    SqliteConnection(SqliteConnection&&) noexcept;
    SqliteConnection& operator=(SqliteConnection&&) noexcept;

    [[nodiscard("You must check if the database actually opened")]] bool open(const std::string& path);
    void close();

    [[nodiscard]] bool exec(const std::string& sql);

    [[nodiscard]] long long last_insert_rowid() const;

    [[nodiscard]] bool is_open() const noexcept {return db_ != nullptr; }

    [[nodiscard]] bool migration_applied(int version) const;

    /// Record that migration `version` was applied (uses bound parameters; safe for any filename).
    [[nodiscard]] bool insert_schema_migration_row(int version, std::string_view filename);

    [[nodiscard]] std::string errorMessage() const;

private:
    sqlite3* db_{nullptr};

};
}


#endif  // SCREENINDEX_SQLITE_CONNECTION_HPP