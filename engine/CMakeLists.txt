cmake_minimum_required(VERSION 3.16)
project(screenindex_engine LANGUAGES C CXX)

# ---- Language (C++20) ----
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# ---- Dependencies (third party) ----

# SQLite amalgamation (vendored, no brew/system dependency)
set(SQLITE_AMALG_DIR ${CMAKE_CURRENT_SOURCE_DIR}/third_party/sqlite)
add_library(sqlite3_amalg STATIC ${SQLITE_AMALG_DIR}/sqlite3.c)
target_include_directories(sqlite3_amalg PUBLIC ${SQLITE_AMALG_DIR})

# ---- Engine library ----
add_library(screenindex_engine STATIC
    src/sqlite_connection.cpp
    src/migrations.cpp
)
target_include_directories(screenindex_engine PUBLIC include)
target_link_libraries(screenindex_engine PUBLIC sqlite3_amalg)
target_compile_features(screenindex_engine PUBLIC cxx_std_20)

# ---- Tests ----
if(BUILD_TESTING)
    include(FetchContent)
    FetchContent_Declare(
        googletest
        GIT_REPOSITORY https://github.com/google/googletest.git
        GIT_TAG        v1.14.0
    )
    set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
    FetchContent_MakeAvailable(googletest)
    enable_testing()
    include(GoogleTest)

    add_executable(engine_tests
        test/smoke_test.cpp
        test/sqlite_connection_test.cpp
        test/migrations_test.cpp
    )
    target_link_libraries(engine_tests PRIVATE GTest::gtest_main)
    target_link_libraries(engine_tests PRIVATE screenindex_engine)
    gtest_discover_tests(engine_tests)
endif()