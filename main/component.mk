#
# "main" pseudo-component makefile.
#
# (Uses default behaviour of compiling all source files in directory, adding 'include' to include path.) 

#COMPONENT_PRIV_INCLUDEDIRS := ../../flatcc/include/
COMPONENT_SRCDIRS := . plugins lib

$(call compile_only_if,$(CONFIG_BT_ENABLED),./plugins/c009_bluetooth.o ./plugins/p024_miflora.o)