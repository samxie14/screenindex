#ifndef SCREENINDEX_API_SERVER_HPP
#define SCREENINDEX_API_SERVER_HPP

#include <cstdint>
#include <httplib.h>
#include <nlohmann/json.hpp>


namespace screenindex {

struct ApiServerConfig{
    std::uint16_t port{3030};
};

int run_api_server(const ApiServerConfig& config);

}


#endif