void setup() {
    Bean.enableConfigSave( false );
    Bean.setBeaconParameters( 0xDEAD, 0xBEEF, 0xCAFE );
    Bean.setBeaconEnable( true );
}

void loop() {
    Bean.sleep( 0xFFFFFFFF );
}
