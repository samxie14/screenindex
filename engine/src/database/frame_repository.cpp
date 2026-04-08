#include "database/frame_repository.hpp"
#include "database/sqlite_connection.hpp"
#include <optional>

namespace screenindex {

FrameRepository::FrameRepository(screenindex::SqliteConnection& db) : db_(db) {
    
}

std::int64_t FrameRepository::insert_frame(const FrameInsert& req) {
    return 0;
}

std::optional<FrameRecord> FrameRepository::get_frames(std::int64_t id){
    return std::nullopt;
}

std::vector<FrameRecord> FrameRepository::list_frames_in_time_range(
    std::chrono::system_clock::time_point start, 
    std::chrono::system_clock::time_point end
){
    return {};

}


}