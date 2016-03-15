<?php
    session_start();

    // set header
    header('Content-type: application/json');

    $jsonUrl = '../../../device-data/available-devices.json';

    // if logged in
    if ( $_SESSION[ 'login' ] == true ) {
        $data = file_get_contents( $jsonUrl );
        $jsonData = json_decode( $data );

        $macAddress = $_POST[ 'address' ];

        $deviceFound = false;

        foreach ($jsonData as $item) {
            if ( strcmp( $item->address, $macAddress ) ) {
                $deviceFound = true;

                unset( $jsonData[ $item ] );
            }
        }

        if ( $deviceFound ) {
            $encodedData = json_encode( $jsonData, JSON_PRETTY_PRINT );

            file_put_contents( $jsonUrl, $encodedData );
            print( '{ "success": true }' );
        } else {
            print( '{ "error": "No Device Found With Address: ' . $macAddress . '" }' );
        }
    } else {
        print( '{ "error": "You Are Not Logged In!" }' );
    }
?>
