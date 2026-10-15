
#include <iostream>
#include <EDSDK.h>

int main() {
    std::cout << "Initializing Canon EDSDK...\n";

    const EdsError error = EdsInitializeSDK();

    if (error != EDS_ERR_OK) {
        std::cerr << "Failed to initialize EDSDK. Error: "
                  << error << '\n';
        return 1;
    }

    std::cout << "Canon EDSDK initialized successfully!\n";

    const EdsError terminateError = EdsTerminateSDK();

    if (terminateError != EDS_ERR_OK) {
        std::cerr << "Failed to terminate EDSDK. Error: "
                  << terminateError << '\n';
        return 1;
    }

    return 0;
}