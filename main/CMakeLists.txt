set(COMPONENT_SRCS "main.cpp" "wifi.c")
set(COMPONENT_ADD_INCLUDEDIRS "." "./plugins" "./lib")

set_source_files_properties(p001_switch.cpp
    PROPERTIES COMPILE_FLAGS
    -std=c++17
)

//component_compile_options()
register_component()
