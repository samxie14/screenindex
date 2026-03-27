#ifndef SCREENINDEX_OCR_REPOSITORY_HPP
#define SCREENINDEX_OCR_REPOSITORY_HPP

#include "sqlite_connection.hpp"
#include <cstddef>
#include <cstdint>
#include <string>
#include <vector>

namespace screenindex{
    struct OcrRecord {
        std::int64_t ocr_id;
        std::int64_t frame_id;
        std::string extracted_text;
    };

    struct OcrInsert {
        std::int64_t frame_id;
        std::string extracted_text;
    };

    class OcrRepository{
    public:
        explicit OcrRepository(screenindex::SqliteConnection& db);

        std::int64_t insert_ocr(const OcrInsert& req);
        std::optional<OcrRecord> get_ocr_by_id(std::int64_t ocr_id);
        std::optional<OcrRecord> get_ocr_by_frame_id(std::int64_t frame_id);

        std::vector<OcrRecord> list_ocr_in_time_range(
            std::chrono::system_clock::time_point start,
            std::chrono::system_clock::time_point end,
            std::size_t limit,
            std::size_t offset);
        
        std::vector<OcrRecord> keyword_search(
            const std::string& query,
            std::chrono::system_clock::time_point start,
            std::chrono::system_clock::time_point end,
            std::size_t limit,
            std::size_t offset);


    private:
        SqliteConnection& db_;
    };
    
}

#endif