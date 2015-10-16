# imports
import serial
import sys


# global variables
try:
    arduino = serial.Serial( '/dev/ttyACM1', 9600, timeout = 0.1 )
    serialData = sys.argv[ 1 ]
except:
    print( 'Could Not Connect To Arduino. Maybe The Serial Port Has Changed?' )
    exit()

if serialData:
    arduino.open()
    arduino.write( serialData.encode() );
    arduino.close()
