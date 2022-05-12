# The following lines of boilerplate have to be in your project's CMakeLists
# in this exact order for cmake to work correctly
cmake_minimum_required(VERSION 3.5)
# set(PROJECT_VER 0.0.1")

set(EXTRA_COMPONENT_DIRS ./components
                         ./components/general
                         ./components/network
                         ./components/hmi
                         ./components/spi_devices
                         ./components/i2c_devices
                         ./components/i2c_devices/sensor
                         ./components/i2c_devices/others
                         ./components/onewire_devices
                         ./components/other_devices)

include($ENV{IDF_PATH}/tools/cmake/project.cmake)
project(file_server)
spiffs_create_partition_image(storage data FLASH_IN_PROJECT)

partition_table_get_partition_info(ota_partition_offset "--partition-type app --partition-subtype ota_1" "offset")
set(ota_init_data_bin "${build_dir}/../esp32_minimal_ota.bin")
esptool_py_flash_project_args(ota_1 ${ota_partition_offset} ${ota_init_data_bin} FLASH_IN_PROJECT)
