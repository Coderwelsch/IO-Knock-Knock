// includes
#include <RFduinoBLE.h>


// defines
#define LED_PIN 6
#define DEVICE_NAME "Knock-Knock-Inner"
#define UUID "1ca7b518-8ea8-11e5-8994-feff819cdc9f";


// global variables
int currentTime = millis();
int interval = 1000;
int intervalPeriod = 0;

// main functions
void setup () {
    pinMode( LED_PIN, OUTPUT );

    RFduinoBLE.advertisementData = "RSSI";
    RFduinoBLE.deviceName = DEVICE_NAME;
    // RFduinoBLE.customUUID = UUID;
    RFduinoBLE.begin();
}

void loop () {
    if ( millis() > currentTime + interval ) {
        currentTime = millis();

        // RFduinoBLE.advertisementData = "RSSI-";
    }
}


// RFduino events
void RFduinoBLE_onReceive (char *data, int len ) {
    if ( data[ 0 ] == '1' ) {

    } else {

    }
}

void RFduinoBLE_onAdvertisement ( bool start ) {
    if ( start ) {

    } else {

    }
}

void RFduinoBLE_onConnect () {

}
