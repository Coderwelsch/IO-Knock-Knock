#define LED_PIN 5


void setup() {
    pinMode( LED_PIN, OUTPUT );

    Serial.begin( 9600 );
}

void loop() {
    String message;

    if ( Serial.available() > 0 ) {
        message = Serial.readStringUntil( '\n' );
    }

    if ( message.equals( "ON" ) ) {

        Serial.println( "OPEN THE DOOR" );
        digitalWrite( LED_PIN, HIGH );

    } else if ( message.equals( "OFF" ) ) {

        Serial.println("CLOSE THE DOOR");
        digitalWrite( LED_PIN, LOW );

    } else if ( !message.equals( "" ) ) {

        Serial.println( "Unknown Command:" + message );
        
    }
}
