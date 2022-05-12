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
PROJECT_VER = "0.0.1"
CPPFLAGS += -D_GLIBCXX_USE_C99
include $(IDF_PATH)/make/project.mk
SPIFFS_IMAGE_FLASH_IN_PROJECT := 1
# $(eval $(call spiffs_create_partition_image,storage,data,FLASH_IN_PROJECT))
$(eval $(call spiffs_create_partition_image,storage,data))


$(eval OTA1_DATA_OFFSET:=$(shell $(GET_PART_INFO) --partition-table-file $(PARTITION_TABLE_BIN) \
							--partition-table-offset $(PARTITION_TABLE_OFFSET) \
							get_partition_info --partition-type app --partition-subtype ota_1 --info offset))

OTA_BIN = $(BUILD_DIR_BASE)/../esp32_minimal_ota.bin

# Command to flash PHY init data partition
PHY_INIT_DATA_FLASH_CMD = $(ESPTOOLPY_SERIAL) write_flash $(OTA1_DATA_OFFSET) $(OTA_BIN)
ESPTOOL_ALL_FLASH_ARGS += $(OTA1_DATA_OFFSET) $(OTA_BIN)

ota: $(OTA_BIN)

ota-flash: $(BUILD_DIR_BASE)/../esp32_minimal_ota.bin
	@echo "Flashing OTA partition at " + ${OTA1_DATA_OFFSET}
	$(PHY_INIT_DATA_FLASH_CMD)
all: ota
flash: ota-flash
app-flash: ota
