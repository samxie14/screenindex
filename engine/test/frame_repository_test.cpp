#include "sqlite_connection.hpp"
#include <gtest/gtest.h>
#include <frame_repository.hpp>
#include <migrations.hpp>
#include <filesystem>
#include <chrono>



namespace {
    namespace fs = std::filesystem;
    /// Resolves `screenindex/engine/migrations` from this test source file location.
    fs::path engine_migrations_dir() {
        const fs::path test_cpp = fs::path(__FILE__).lexically_normal();
        const fs::path engine_dir = test_cpp.parent_path().parent_path();
        return engine_dir / "migrations";
    }
    
}  

class FrameRepositoryTest : public ::testing::Test{

protected:
    screenindex::SqliteConnection db_;
    std::unique_ptr<screenindex::FrameRepository> repo_;

    void SetUp() override {
        ASSERT_TRUE(db_.open(":memory:"));

        const fs::path mig_dir = engine_migrations_dir();
        ASSERT_TRUE(fs::exists(mig_dir));
        ASSERT_NO_THROW(screenindex::run_migrations(db_, mig_dir));

        repo_ = std::make_unique<screenindex::FrameRepository>(db_);
    }

    void TearDown() override {
        repo_.reset();
        db_.close();
    }
};

TEST_F (FrameRepositoryTest, InsertMinimal_AssignsSequentialID) {
    screenindex::FrameInsert frame1 = {std::chrono::system_clock::now()};
    screenindex::FrameInsert frame2 = {std::chrono::system_clock::now()};

    EXPECT_EQ(repo_->insert_frame(frame1),  1);
    EXPECT_EQ(repo_->insert_frame(frame2),  2);
}

TEST_F (FrameRepositoryTest, InsertFullMetadata_GetFrame_RoundTripsAllFields) {
    screenindex::FrameInsert frame1 = {
        std::chrono::system_clock::now(), 
        "/data/frame1", 
        "Slack",
        "Desktop 1",
        "MacBook-Air"
    };    
    EXPECT_EQ(repo_->insert_frame(frame1),  1);

    const auto got = repo_->get_frames(1);
    ASSERT_TRUE(got.has_value());

    EXPECT_EQ(got->frame_id, 1);
    EXPECT_EQ(got->snapshot_path, "/data/frame1" );
    EXPECT_EQ(got->app_name, "Slack" );
    EXPECT_EQ(got->window_name, "Desktop 1" );
    EXPECT_EQ(got->device_name, "MacBook-Air" );
    EXPECT_EQ(got->storage_kind, "full");
    EXPECT_EQ(got->delta_base_frame_id, NULL);
    EXPECT_EQ(got->delta_patch_path, NULL);
    EXPECT_EQ(got->duplicate_of_frame_id, NULL);
}

TEST_F (FrameRepositoryTest, GetFrame_UnknownId_ReturnsNullopt) {
    const auto got = repo_->get_frames(1);

    EXPECT_FALSE(got.has_value());
}

TEST_F (FrameRepositoryTest, ListInTimeRange_NoRows_ReturnsEmpty) {
    const auto t = std::chrono::system_clock::now();
    auto results = repo_->list_frames_in_time_range(t, t);
    EXPECT_TRUE(results.empty());
}

TEST_F(FrameRepositoryTest, ListInTimeRange_EndExclusive_ReturnsMatchingFrames) {   

    using namespace std::chrono;
    const auto t1 = system_clock::time_point{seconds{1000}};
    const auto t2 = system_clock::time_point{seconds{2000}};
    const auto t3 = system_clock::time_point{seconds{3000}};
    
    EXPECT_EQ(repo_->insert_frame({t1}),  1);
    EXPECT_EQ(repo_->insert_frame({t2}),  2);
    EXPECT_EQ(repo_->insert_frame({t3}),  3);

    auto frames_list = repo_->list_frames_in_time_range(t1, t3);
    ASSERT_EQ(frames_list.size(), 2u);
    EXPECT_EQ(frames_list[0].captured_at, t1);
    EXPECT_EQ(frames_list[1].captured_at, t2);

    for (const auto& r : frames_list) {
        EXPECT_NE(r.captured_at, t3);
    }
}

TEST_F(FrameRepositoryTest, ListInTimeRange_ResultsOrderedByCapturedAt) {
    using namespace std::chrono;
    const auto t1 = system_clock::time_point{seconds{1000}};
    const auto t2 = system_clock::time_point{seconds{2000}};
    const auto t3 = system_clock::time_point{seconds{3000}};
    
    EXPECT_EQ(repo_->insert_frame({t2}),  2);
    EXPECT_EQ(repo_->insert_frame({t3}),  3);
    EXPECT_EQ(repo_->insert_frame({t1}),  1);


    auto frames_list = repo_->list_frames_in_time_range(t1, t3);
    ASSERT_EQ(frames_list.size(), 3u);
    EXPECT_EQ(frames_list[0].captured_at, t1);
    EXPECT_EQ(frames_list[1].captured_at, t2);
    EXPECT_EQ(frames_list[2].captured_at, t3);
    
}

TEST_F (FrameRepositoryTest, InsertMany_IdsIncreaseMonotonically) {
    constexpr int N = 10;
    using namespace std::chrono;

    std::vector<std::int64_t> ids;
    ids.reserve(static_cast<std::size_t>(N));

    const auto base = system_clock::time_point{seconds{1}};

    for(int i = 0; i < N; ++i){
        const auto t = base + seconds{i};
        screenindex::FrameInsert frame{t};
        ids.push_back(repo_->insert_frame(frame));
    }

    ASSERT_EQ(ids.size(), static_cast<std::size_t>(N));
    EXPECT_EQ(ids.front(), 1);

    for (std::size_t i = 1; i < ids.size(); ++i) {
        EXPECT_LT(ids[i], ids[i - 1] + 1);
    }
}





