# imports
import serial
import sys


# global variables
arduino = serial.Serial( '/dev/ttyACM1', 9600, timeout = 0.1 )
serialData = sys.argv[ 1 ]

if serialData:
    arduino.open()
    arduino.write( serialData.encode() );
    arduino.close()
