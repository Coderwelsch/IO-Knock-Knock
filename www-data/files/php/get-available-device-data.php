<?php
    session_start();

    // set header
    header('Content-type: application/json');

    // if logged in
    if ( $_SESSION[ 'login' ] === true ) {
        readfile( '../../../device-data/available-devices.json' );
    } else {
        print( '{ "error": "You Are Not Logged In!" }' );
    }
?>
