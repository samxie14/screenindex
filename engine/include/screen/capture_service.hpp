#ifndef SCREENINDEX_CAPTURE_SERVICE_HPP
#define SCREENINDEX_CAPTURE_SERVICE_HPP

#include <chrono>
#include <cstdint>
#include <filesystem>
#include <memory>
#include <optional>
#include <string>
#include <vector>

namespace screenindex {

using MonitorId = std::uint32_t;

struct MonitorInfo {
    MonitorId id{};              // engine-local id (stable for session)
    std::string stable_label;    // e.g. display id string for logs / settings
    std::uint32_t width_px{};
    std::uint32_t height_px{};
    bool is_primary{false};
};

struct CaptureResult {
    MonitorId monitor_id{};
    std::chrono::system_clock::time_point captured_at{};
    std::uint32_t width_px{};
    std::uint32_t height_px{};
    /// Encoded image (e.g. JPEG). Keeps Obj-C / CGImage out of headers.
    std::vector<std::byte> image_bytes;
    /// Optional hint for OCR layer: "image/jpeg", "image/png"
    std::string mime_type{"image/jpeg"};
};

/// Platform-specific capture (implemented in `.mm` on macOS, stub elsewhere, fake in tests).
class ICaptureBackend {
public:
    virtual ~ICaptureBackend() = default;

    /// macOS: maps to `CGPreflightScreenCaptureAccess()`. Other platforms: override as needed.
    virtual bool screen_capture_access_granted() const { return true; }

    /// macOS: `CGRequestScreenCaptureAccess()` then re-check. Call from UI after user taps Allow.
    virtual bool request_screen_capture_access() { return true; }

    virtual std::vector<MonitorInfo> list_monitors() = 0;

    /// `nullopt` => success and `out` is filled. Non-empty string => error message.
    virtual std::optional<std::string> capture_frame(MonitorId monitor_id, CaptureResult& out) = 0;
};

/// Build the platform backend (macOS: ScreenCaptureKit; others: stub until implemented).
[[nodiscard]] std::unique_ptr<ICaptureBackend> make_capture_backend();

class CaptureService {
public:
    explicit CaptureService(std::unique_ptr<ICaptureBackend> backend,
                            std::filesystem::path snapshot_root,
                            int jpeg_quality_1_to_100 = 82);

    bool screen_capture_access_granted() const {
        return backend_->screen_capture_access_granted();
    }

    bool request_screen_capture_access() { return backend_->request_screen_capture_access(); }

    std::vector<MonitorInfo> list_monitors() { return backend_->list_monitors(); }

    /// Grab one frame. Fails fast if screen recording is not granted.
    std::optional<std::string> capture_once(MonitorId monitor_id, CaptureResult& out);

    /// Capture, then write under `snapshot_root` (date subdirs). Sets `error` on failure.
    std::optional<std::filesystem::path> capture_and_save_jpeg(MonitorId monitor_id,
                                                                 std::string& error);

private:
    std::unique_ptr<ICaptureBackend> backend_;
    std::filesystem::path snapshot_root_;
    int jpeg_quality_;
};

} // namespace screenindex

#endif
