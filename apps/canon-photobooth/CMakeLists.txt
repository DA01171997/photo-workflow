cmake_minimum_required(VERSION 3.25)

project(canon_photobooth
    VERSION 0.1.0
    LANGUAGES CXX
)

add_executable(canon_photobooth
    src/main.cpp
)

target_compile_features(canon_photobooth
    PRIVATE cxx_std_20
)

set_target_properties(canon_photobooth PROPERTIES
    CXX_EXTENSIONS OFF
)

# Canon EDSDK directory
set(CANON_EDSDK_DIR
    "${CMAKE_CURRENT_SOURCE_DIR}/third_party/canon-edsdk"
)

add_library(canon_edsdk SHARED IMPORTED)

set_target_properties(canon_edsdk PROPERTIES
    IMPORTED_IMPLIB
        "${CANON_EDSDK_DIR}/EDSDK_64/Library/EDSDK.lib"

    IMPORTED_LOCATION
        "${CANON_EDSDK_DIR}/EDSDK_64/Dll/EDSDK.dll"

    INTERFACE_INCLUDE_DIRECTORIES
        "${CANON_EDSDK_DIR}/EDSDK/Header"
)

# Link Canon EDSDK to our executable
target_link_libraries(canon_photobooth
    PRIVATE canon_edsdk
)


# Copy Canon EDSDK runtime DLLs beside our executable
add_custom_command(
    TARGET canon_photobooth
    POST_BUILD

    COMMAND ${CMAKE_COMMAND} -E copy_directory
        "${CANON_EDSDK_DIR}/EDSDK_64/Dll"
        "$<TARGET_FILE_DIR:canon_photobooth>"

    COMMENT "Copying Canon EDSDK DLLs"
)
