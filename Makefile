ENGINE_SRC=engine
ENGINE_BUILD=build/engine

.PHONY: engine-configure engine-build engine-test engine-clean

engine-configure:
	cmake -S $(ENGINE_SRC) -B $(ENGINE_BUILD) -DBUILD_TESTING=ON

engine-build:
	cmake --build $(ENGINE_BUILD)

engine-test:
	ctest --test-dir $(ENGINE_BUILD) --output-on-failure

engine-clean:
	rm -rf $(ENGINE_BUILD)