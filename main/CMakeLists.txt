#set(COMPONENT_SRCS "main.cpp")
set(COMPONENT_SRCDIRS "." "./plugins" "./lib")
set(COMPONENT_ADD_INCLUDEDIRS "." "./plugins" "./lib")
set(EXCLUDE_SRCS "./plugins/c009_bluetooth.cpp" "./plugins/p024_miflora.cpp")


register_component()
