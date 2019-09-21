set(COMPONENT_SRCS "ADS1115.cpp")
set(COMPONENT_ADD_INCLUDEDIRS . include)
set(COMPONENT_REQUIRES I2Cdev log)

register_component()
