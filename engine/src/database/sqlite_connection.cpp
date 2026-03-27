#include "database/sqlite_connection.hpp"
#include <sqlite3.h>

namespace screenindex {

SqliteConnection::~SqliteConnection(){
    close();
}

SqliteConnection::SqliteConnection(SqliteConnection&& other) noexcept : db_{other.db_} {
    other.db_ = nullptr;
}

SqliteConnection& SqliteConnection::operator=(SqliteConnection&& other) noexcept {
    if (this != &other){
        close();
        db_ = other.db_;
        other.db_ = nullptr;
    }
    return *this;
}

void SqliteConnection::close() {
    if (db_) {
        sqlite3_close(db_);
        db_ = nullptr;
    }
}

bool SqliteConnection::open(const std::string& path) {
    close();
    return sqlite3_open(path.c_str(), &db_) == SQLITE_OK;
}

bool SqliteConnection::exec(const std::string& sql) {
    if (!db_) {
        return false;
    }
    char* err = nullptr;
    const int rc = sqlite3_exec(db_, sql.c_str(), nullptr, nullptr, &err);
    if (err != nullptr) {
        sqlite3_free(err);
    }
    return rc == SQLITE_OK;
}

long long SqliteConnection::last_insert_rowid() const{
    if(!db_){
        return 0;
    }

    return static_cast<long long> (sqlite3_last_insert_rowid(db_));
}

bool SqliteConnection::migration_applied(int version) const {
    if (!db_) return false;
    sqlite3_stmt* stmt = nullptr;
    const char* sql =
        "SELECT 1 FROM schema_migrations WHERE version = ? LIMIT 1;";
    if (sqlite3_prepare_v2(db_, sql, -1, &stmt, nullptr) != SQLITE_OK) {
        return false; // or log sqlite3_errmsg(db_)
    }
    sqlite3_bind_int(stmt, 1, version);
    const int step_rc = sqlite3_step(stmt);
    sqlite3_finalize(stmt);
    return step_rc == SQLITE_ROW;  // row exists → already applied
}

bool SqliteConnection::insert_schema_migration_row(int version, std::string_view filename) {
    if (!db_) {
        return false;
    }
    sqlite3_stmt* stmt = nullptr;
    const char* sql =
        "INSERT INTO schema_migrations (version, filename) VALUES (?, ?);";
    if (sqlite3_prepare_v2(db_, sql, -1, &stmt, nullptr) != SQLITE_OK) {
        return false;
    }
    sqlite3_bind_int(stmt, 1, version);
    sqlite3_bind_text(stmt, 2, filename.data(), static_cast<int>(filename.size()),
                      SQLITE_TRANSIENT);
    const int step_rc = sqlite3_step(stmt);
    sqlite3_finalize(stmt);
    return step_rc == SQLITE_DONE;
}

std::string SqliteConnection::errorMessage() const {
    if (!db_) return "Database Not Open";
    return sqlite3_errmsg(db_) ? sqlite3_errmsg(db_) : "No Error Message";
}
}  // namespace screenindex