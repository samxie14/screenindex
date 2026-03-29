#ifndef SEARCH_SERVICE_HPP
#define SEARCH_SERVICE_HPP

#include <vector>


namespace screenindex {
    struct SearchRequest {

        // query_text (optional)
        // query_vector (optional)
        // start_time, end_time (required)
        // limit, offset
        // mode (keyword, semantic, hybrid)
    };

    struct SearchHit {
        // (frame_id, captured_at, score, snippet/source)
    };

    //For Debugging
    struct SearchResponse {
        //  (hits, total, maybe timings/debug)

    };

    std::vector<SearchHit> merge_and_rank(const std::vector<SearchHit>& keyword_hits, const std::vector<SearchHit>& semantic_hits, const SearchRequest& req);

    std::vector<SearchHit> hybrid_search (const SearchRequest& req);



}

#endif