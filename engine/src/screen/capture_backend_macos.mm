#import <CoreGraphics/CoreGraphics.h>
#include <memory>
#import <Foundation/Foundation.h>
#import <ScreenCaptureKit/ScreenCaptureKit.h>
#import <ImageIO/ImageIO.h>
#import <UniformTypeIdentifiers/UniformTypeIdentifiers.h>

#include "screen/capture_service.hpp"

#include <cstddef>
#include <optional>
#include <string>
#include <vector>


namespace screenindex {
    namespace{

    }

    class CaptureBackendMacos final : public ICaptureBackend {
    public:
        bool screen_capture_access_granted() const override {
            return CGPreflightScreenCaptureAccess();
        }

        bool request_screen_capture_access () override {
            if (CGPreflightScreenCaptureAccess()) {
                return true;
            }
            if (!CGRequestScreenCaptureAccess()){
                return false;
            }

            return CGPreflightScreenCaptureAccess();
        }

        std::vector<MonitorInfo> list_monitors() {
            if (!CGPreflightScreenCaptureAccess()) {
                return {};
            }

            __block std::vector<MonitorInfo> monitors;
            dispatch_semaphore_t sem = dispatch_semaphore_create(0);
            [SCShareableContent getShareableContentWithCompletionHandler:^(SCShareableContent * _Nullable shareableContent, NSError * _Nullable error) {
                @autoreleasepool{
                    if (error != nil || shareableContent == nil){
                        dispatch_semaphore_signal(sem);
                        return;
                    }
                    NSArray <SCDisplay *> *displays = shareableContent.displays;
                    MonitorId id = 0;
                    for (SCDisplay *d in displays) {
                        CGDirectDisplayID did = d.displayID;
                        MonitorInfo m;
                        m.id = id++;
                        m.stable_label = std::to_string(static_cast<unsigned long long>(did));
                        m.width_px = static_cast <std::uint32_t> (CGDisplayPixelsWide(did));
                        m.height_px = static_cast <std::uint32_t> (CGDisplayPixelsHigh(did));
                        m.is_primary = (did == CGMainDisplayID());
                        monitors.push_back(std::move(m));
                    }
                }
                dispatch_semaphore_signal(sem); 
            }];
            dispatch_semaphore_wait(sem, DISPATCH_TIME_FOREVER);
            return monitors;
        }

         std::optional<std::string> capture_frame(MonitorId monitor_id, CaptureResult& out) override {
            if (!CGPreflightScreenCaptureAccess()) {
                return std::string{
                    "Screen recording not permitted: enable Screenindex in System Settings → "
                "Privacy & Security → Screen Recording, then try again."
                };
            }

            if (!@available(macOS 14.0, *)){
                // TODO Check how version compatibility matters and see if it works for older computers.
                return std::string{"Screen capture requires macOS 14 or later (SCScreenshotManager)."};
            }

            __block SCShareableContent *shareable = nil;
            __block NSError *share_err = nil;
            dispatch_semaphore_t sem = dispatch_semaphore_create(0);
            [SCShareableContent getShareableContentWithCompletionHandler:^(SCShareableContent * _Nullable shareableContent, NSError * _Nullable error) {
                shareable = shareableContent;
                share_err = error;
                dispatch_semaphore_signal(sem);
            }];
            dispatch_semaphore_wait(sem, DISPATCH_TIME_FOREVER);

            if (share_err != nil) {
                return std::string{[[share_err localizedDescription] UTF8String] ?: "SCShareableContent failed"};
            }
            if (shareable == nil || monitor_id >= shareable.displays.count) {
                return std::string{"Invalid monitor id or no displays."};
            }

            SCDisplay *display = shareable.displays[monitor_id];

            SCContentFilter *filter =
                [[SCContentFilter alloc] initWithDisplay:display excludingWindows:@[]];

            SCStreamConfiguration *cfg = [[SCStreamConfiguration alloc] init];
            cfg.width = static_cast<int>(display.width);
            cfg.height = static_cast<int>(display.height);
            cfg.pixelFormat = kCVPixelFormatType_32BGRA;
            cfg.showsCursor = NO;

            __block CGImageRef captured = nullptr;
            __block NSError *cap_err = nil;
            dispatch_semaphore_t sem2 = dispatch_semaphore_create(0);
            [SCScreenshotManager captureImageWithFilter:filter configuration:cfg completionHandler:^(CGImageRef img, NSError *error) {
                if (error != nil) {
                    cap_err = error;
                } else if (img != nullptr) {
                    captured = CGImageRetain(img);
                }
                dispatch_semaphore_signal(sem2);
            }];
            dispatch_semaphore_wait(sem2, DISPATCH_TIME_FOREVER);

            if (cap_err != nil) {
                return std::string{[[cap_err localizedDescription] UTF8String] ?: "Screenshot failed"};
            }
            if (captured == nullptr) {
                return std::string{"Screenshot returned no image."};
            }

            NSData *jpeg = cgimage_to_jpeg_data(captured, 0.82);
            CGImageRelease(captured);
            if (jpeg == nil) {
                return std::string{"Failed to encode JPEG."};
            }

            out.monitor_id = monitor_id;
            out.captured_at = std::chrono::system_clock::now();
            out.width_px = static_cast<std::uint32_t>(display.width);
            out.height_px = static_cast<std::uint32_t>(display.height);
            out.mime_type = "image/jpeg";
            out.image_bytes = nsdata_to_bytes(jpeg);

            return std::nullopt;

         }
    };

    std::unique_ptr<ICaptureBackend> make_capture_backend() {
        return std::make_unique<CaptureBackendMacos>();
    }

}