#include "screen/capture_service.hpp"

namespace screenindex {

namespace {

class CaptureBackendStub final : public ICaptureBackend {
public:
    bool screen_capture_access_granted() const override { return false; }

    bool request_screen_capture_access() override { return false; }

    std::vector<MonitorInfo> list_monitors() override { return {}; }

    std::optional<std::string> capture_frame(MonitorId /*monitor_id*/, CaptureResult& /*out*/) override {
        return std::string{"Screen capture is not implemented on this platform."};
    }
};

} // namespace

std::unique_ptr<ICaptureBackend> make_capture_backend() {
    return std::make_unique<CaptureBackendStub>();
}

} // namespace screenindex
