#include "api/api_server.hpp"
#include <iostream>
#include "httplib.h"

namespace screenindex {

int run_api_server(const ApiServerConfig& config) {
    httplib::Server server;

    server.Get("/health", [](const httplib::Request& req, httplib::Response& res) {

    });

    server.Get("/search", [](const httplib::Request& req, httplib::Response& res) {

    });

    server.Post("/capture", [](const httplib::Request& req, httplib::Response& res) {

    });

    std::cout << "Listening on http://127.0.0.1:8080\n";
    server.listen("127.0.0.1", config.port);

    return 0;
}


} // namespace screenindex