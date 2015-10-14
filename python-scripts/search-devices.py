# imports
import bluetooth
import json
import threading
import time
import subprocess
import re
import os
import datetime
import urllib2
from urllib2 import URLError


# global variables
serverUrl = 'http://knock-knock-pi.local:8080/newDevicesFound'

currentDir = str( os.path.dirname(__file__) )
currentAbsolutePath = currentDir
if currentDir:
    currentAbsolutePath += '/'

jsonExportPath = os.path.join( currentAbsolutePath, '../device-data/searched-devices.json' )

foundDevices = {}
hciCommand = 'sudo hcitool scan'.split()
hciHeadOutput = 'Scanning'
hciMACPattern = re.compile( ur'(([0-9a-f]{1,2}[\.:-]){5}([0-9a-f]{1,2}))\W+(.+)', re.IGNORECASE )


def runCommand( command ):
    p = subprocess.Popen( command, stdout = subprocess.PIPE, stderr = subprocess.STDOUT )
    return iter( p.stdout.readline, b'' )

def searchForDevices():
    exportDevices = []
    foundSomething = False

    for line in runCommand( hciCommand ):
        line = removeNewLineChar( line )

        if not hciHeadOutput in line and bool( line.strip() ):
            foundSomething = True

            match = re.findall( hciMACPattern, line )[ 0 ]
            timestamp = str( datetime.datetime.now() )
            macAddr = match[ 0 ]
            deviceName = match[ len( match ) - 1 ]
            deviceData = { 'address': macAddr, 'name': deviceName, 'status': '-1', 'time': timestamp }

            # check if device already found and send a "callback" to the node server
            # if macAddr in foundDevices:
            #     try:
            #         urllib2.urlopen( serverUrl )
            #     except URLError as error:
	        #         print( "Node Server Is Not Reachable" )

            # save found device data to object
            foundDevices[ macAddr ] = deviceData
            exportDevices.append( deviceData )
            print( 'Found Device: ' + macAddr + ' - ' + deviceName )

    # save new device data to json
    with open( jsonExportPath, 'w+' ) as outfile:
        json.dump( exportDevices, outfile, indent = 4, sort_keys = True )

    # TODO: remove devices with a timestamp 1-5 minutes ago
    #
    #
    #

    if not foundSomething:
        print( 'No Device Found!' )

    # after search is done wait 4 seconds and do a function recall
    time.sleep( 4 )
    searchForDevices()

def removeNewLineChar ( string ):
    return string.replace( '\n', '' ).replace( '\r', '' )


# initial call
searchForDevices()
