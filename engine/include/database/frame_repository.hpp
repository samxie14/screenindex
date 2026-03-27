#ifndef SCREENINDEX_FRAME_REPOSITORY_HPP
#define SCREENINDEX_FRAME_REPOSITORY_HPP

#include <cstddef>
#include <chrono>
#include <optional>

#include <sqlite_connection.hpp>
#include <vector>





namespace screenindex {
    struct FrameRecord{
        std::int64_t frame_id;
        std::chrono::system_clock::time_point captured_at{};
        std::string snapshot_path;
        std::string app_name;
        std::string window_name;
        std::string device_name;
        std::string storage_kind;
        std::int64_t delta_base_frame_id;
        std::string delta_patch_path;
        std::int64_t duplicate_of_frame_id;
    };

    struct FrameInsert{
        std::chrono::system_clock::time_point captured_at;
        std::optional<std::string> snapshot_path;
        std::optional<std::string> app_name;
        std::optional<std::string> window_name;
        std::optional<std::string> device_name;
    };
    
    class FrameRepository {
    public:
        explicit FrameRepository(screenindex::SqliteConnection& db);

        std::int64_t insert_frame(const FrameInsert& req);
        std::optional<FrameRecord> get_frames(std::int64_t id);
        std::vector<FrameRecord> list_frames_in_time_range(
            std::chrono::system_clock::time_point start, 
            std::chrono::system_clock::time_point end
        );

    private:
        SqliteConnection& db_;
    };
}


#endif