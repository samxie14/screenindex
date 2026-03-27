#include <gtest/gtest.h>
#include <sqlite_connection.hpp>

TEST(SqliteConnectionTest, OpenExecAndLastInsertRowid) {
    screenindex::SqliteConnection db;
    ASSERT_TRUE(db.open(":memory:"));
    
    ASSERT_TRUE(db.exec("CREATE TABLE t (id INTEGER PRIMARY KEY AUTOINCREMENT, val TEXT);"));
    ASSERT_TRUE(db.exec("INSERT INTO t (val) VALUES ('hello');"));

    EXPECT_EQ(db.last_insert_rowid(), 1);
}
