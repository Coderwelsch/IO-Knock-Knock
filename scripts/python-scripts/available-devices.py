# imports
import bluetooth
import time
import json
import datetime
import os


# global variables
currentAbsolutePath = str( os.path.dirname(__file__) );
if currentAbsolutePath:
    currentAbsolutePath += '/'
arduinoCommScriptPath = os.path.join( currentAbsolutePath, 'arduino-communication.py' )
jsonPathToAuthedDevices = os.path.join( currentAbsolutePath, '../../device-data/authorized-devices.json' )
jsonPathToAvailableDevices = os.path.join( currentAbsolutePath, '../../device-data/available-devices.json' )

# check devices for availabillity
while True:
    deviceStatusData = []
    deviceFound = False

    # load json data of authorized devices / users
    with open( jsonPathToAuthedDevices ) as jsonFile:
        deviceData = json.load( jsonFile )

    # ble sniffing
    for item in deviceData:
        result = bluetooth.lookup_name( item[ 'address' ], timeout = 5 )

        if ( result != None ):
            item[ 'status' ] = '1'
            # print( item[ 'name' ] + ' is available' )

            deviceFound = True

            # get time of last status update
            item[ 'time' ] = str( datetime.datetime.now() )
        else:
            item[ 'status' ] = '0'
            # print( item[ 'name' ] + ' is not available' )

        # add to export json file object
        deviceStatusData.append( item )

    # if a device is available open or close the door
    if deviceFound:
        os.system( 'sudo python ' + arduinoCommScriptPath + ' ON' )
    else:
        os.system( 'sudo python ' + arduinoCommScriptPath + ' OFF' )

    # write / update available data file
    with open( jsonPathToAvailableDevices, 'w+' ) as writeFile:
        json.dump( deviceStatusData, writeFile, indent = 4, sort_keys = True )

    # wait some time
    time.sleep( 2 )
