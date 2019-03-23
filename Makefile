#
# This is a project Makefile. It is assumed the directory this Makefile resides in is a
# project subdirectory.
#

PROJECT_NAME := file_server
PROJECT_VER = "2.1.0.1"
CPPFLAGS += -D_GLIBCXX_USE_C99
include $(IDF_PATH)/make/project.mk

