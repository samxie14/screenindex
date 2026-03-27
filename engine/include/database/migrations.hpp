#ifndef SCREENINDEX_MIGRATIONS_HPP
#define SCREENINDEX_MIGRATIONS_HPP


#include "sqlite_connection.hpp"
#include <filesystem>

namespace screenindex {

void run_migrations(SqliteConnection& db, const std::filesystem::path& migrations_dir);

}  // namespace screenindex

#endif