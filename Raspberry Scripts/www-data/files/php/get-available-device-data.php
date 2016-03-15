<?php
    session_start();

    // set header
    header('Content-type: application/json');

    // if logged in
    readfile( '../../../device-data/available-devices.json' );
?>
