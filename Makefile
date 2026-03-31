ENGINE_SRC=screenindex/engine
ENGINE_BUILD=build/engine
configure:
	cmake -S $(ENGINE_SRC) -B $(ENGINE_BUILD) -DBUILD_TESTING=ON
build:
	cmake --build $(ENGINE_BUILD)
test:
	ctest --test-dir $(ENGINE_BUILD) --output-on-failure
clean:
	rm -rf $(ENGINE_BUILD)