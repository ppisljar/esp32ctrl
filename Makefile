#
# This is a project Makefile. It is assumed the directory this Makefile resides in is a
# project subdirectory.
#

IOT_COMPONENT_DIRS = ./components
IOT_COMPONENT_DIRS += ./components/general
IOT_COMPONENT_DIRS += ./components/network
IOT_COMPONENT_DIRS += ./components/hmi
IOT_COMPONENT_DIRS += ./components/spi_devices
IOT_COMPONENT_DIRS += ./components/i2c_devices
IOT_COMPONENT_DIRS += ./components/i2c_devices/sensor
IOT_COMPONENT_DIRS += ./components/i2c_devices/others
IOT_COMPONENT_DIRS += ./components/onewire_devices
IOT_COMPONENT_DIRS += ./components/other_devices

EXTRA_COMPONENT_DIRS += $(IOT_COMPONENT_DIRS)

PROJECT_NAME := file_server
PROJECT_VER = "2.1.0.2"
CPPFLAGS += -D_GLIBCXX_USE_C99
include $(IDF_PATH)/make/project.mk
$(eval $(call spiffs_create_partition_image,storage,data,FLASH_IN_PROJECT))
