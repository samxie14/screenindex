#include <optional>
#include <screen/capture_service.hpp>
#include <filesystem>


namespace screenindex {

    CaptureService::CaptureService(std::unique_ptr<ICaptureBackend> backend, std::filesystem::path snapshot_root, int jpeg_quality_1_to_100) : backend_(std::move(backend)), snapshot_root_(std::move(snapshot_root)), jpeg_quality_(std::clamp(jpeg_quality_1_to_100, 1, 100)) {}

    // For debugging
    std::optional<std::string> capture_once(MonitorId monitor_id, CaptureResult& out) {
        return std::nullopt;
    }

    std::optional<std::filesystem::path> capture_and_save_jpeg(MonitorId monitor_id, std::string& error) {
        return std::nullopt;
    }




}