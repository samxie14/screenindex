cmake_minimum_required(VERSION 3.16)

project(screenindex_engine LANGUAGES C CXX)

include(FetchContent)

# ---- Language (C++20) ----
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

if(APPLE)
    enable_language(OBJCXX)
    # SCScreenshotManager requires macOS 14+
    if(NOT CMAKE_OSX_DEPLOYMENT_TARGET OR CMAKE_OSX_DEPLOYMENT_TARGET VERSION_LESS "14.0")
        set(CMAKE_OSX_DEPLOYMENT_TARGET "14.0" CACHE STRING "Minimum macOS version" FORCE)
    endif()
endif()

# ---- Dependencies (third party) ----

FetchContent_Declare(
    cpp_httplib
    GIT_REPOSITORY https://github.com/yhirose/cpp-httplib.git
    GIT_TAG        v0.16.3
)
FetchContent_MakeAvailable(cpp_httplib)

FetchContent_Declare(
    nlohmann_json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG        v3.11.3
)
FetchContent_MakeAvailable(nlohmann_json)

set(SQLITE_AMALG_DIR ${CMAKE_CURRENT_SOURCE_DIR}/third_party/sqlite)
add_library(sqlite3_amalg STATIC ${SQLITE_AMALG_DIR}/sqlite3.c)
target_include_directories(sqlite3_amalg PUBLIC ${SQLITE_AMALG_DIR})

# ---- Engine library ----
set(ENGINE_SOURCES
    src/database/sqlite_connection.cpp
    src/database/migrations.cpp
    src/database/frame_repository.cpp
    src/database/ocr_repository.cpp
    src/database/embedding_repository.cpp
    src/screen/capture_service.cpp
)

if(APPLE)
    list(APPEND ENGINE_SOURCES src/screen/capture_backend_macos.mm)
else()
    list(APPEND ENGINE_SOURCES src/screen/capture_backend_stub.cpp)
endif()

add_library(screenindex_engine STATIC ${ENGINE_SOURCES})

target_include_directories(screenindex_engine PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

target_link_libraries(screenindex_engine PUBLIC sqlite3_amalg)
target_compile_features(screenindex_engine PUBLIC cxx_std_20)

add_library(screenindex_api STATIC
    src/api/api_server.cpp
)
target_include_directories(screenindex_api PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)
target_link_libraries(screenindex_api PUBLIC
    httplib::httplib
    nlohmann_json::nlohmann_json
)
target_compile_features(screenindex_api PUBLIC cxx_std_20)

if(APPLE)
    target_link_libraries(screenindex_engine PUBLIC
        "-framework ScreenCaptureKit"
        "-framework Foundation"
        "-framework CoreGraphics"
        "-framework ImageIO"
        "-framework UniformTypeIdentifiers"
    )
endif()

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
        test/frame_repository_test.cpp
    )
    target_link_libraries(engine_tests PRIVATE GTest::gtest_main)
    target_link_libraries(engine_tests PRIVATE screenindex_engine)
    gtest_discover_tests(engine_tests)
endif()
