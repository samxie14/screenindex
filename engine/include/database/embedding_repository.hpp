#ifndef SCREENINDEX_EMBEDDING_REPOSITORY_HPP
#define SCREENINDEX_EMBEDDING_REPOSITORY_HPP

#include <cstddef>
#include <cstdint>
#include <vector>
#include <string>
#include <sqlite_connection.hpp>

namespace screenindex {
    struct EmbeddingRecord {
        std::int64_t embedding_id;
        std::int64_t frame_id;
        std::string model_id;
        std::int32_t dim{};
        std::vector<float> vector;
        std::string created_a;
    };

    struct EmbeddingInsert {
        std::int64_t frame_id;
        std::string model_id;
        std::int32_t dim{};
        std::vector<float> vector;
        std::string created_a;
    };

    class EmbeddingRepository {
    public:
        explicit EmbeddingRepository(screenindex::SqliteConnection& db);

        std::int64_t insert_embed(const EmbeddingInsert& req);
        std::optional<EmbeddingRecord> get_embed_by_id(std::int64_t ocr_id);
        std::optional<EmbeddingRecord> get_embed_by_frame_id(std::int64_t frame_id);

        std::vector<EmbeddingRecord> list_embed_in_time_range(
            std::chrono::system_clock::time_point start,
            std::chrono::system_clock::time_point end,
            std::size_t limit,
            std::size_t offset);

        std::vector<EmbeddingRecord> semantic_search(
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