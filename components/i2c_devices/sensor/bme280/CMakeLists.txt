
# componet standalone mode

set(COMPONENT_SRCS "bme280.c" "bme280_obj.cpp")
set(COMPONENT_ADD_INCLUDEDIRS ". include")

# requirements can't depend on config
set(COMPONENT_REQUIRES i2c_bus)

register_component()
