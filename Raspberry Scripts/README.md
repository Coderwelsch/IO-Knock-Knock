# Knock Knock - Where You Are?
![Cover](https://raw.githubusercontent.com/Coderwelsch/IO-Knock-Knock/master/assets/cover.jpg "Cover")

Every door needs a suitable key. But what happens if you lost your key or you are too conftable to search for it in your pocket? Use your phone instead!
Here you can find a more or less simple solution.

## System Structure
![Structure](https://raw.githubusercontent.com/Coderwelsch/IO-Knock-Knock/master/assets/structure.jpg "Structure")
In our university we use a very cool digital "key <-> lock" system. Each of the student got a small dongle with different permissions to open (or not open) a specific door.

We built a authentification system for smartphones with the help of its Bluetooth functionality on top of it for a specific room. We prepared a Raspberry Pi and plugged a small BLuetooth Low Energy dongle. With the help of a small database for authentificated devices and their unique Bluetooth MAC Address we can check the availability of each device. If one or more registered devices found the Raspberry send an "open" - command to a small Arduino board. The Arduino is connected to a small key dongle and hotwire it when the "open" command is receiving - and the dongle unlocks the door.

## Device Authentification
We installed a simple Apache Server on the Raspberry Pi to handle the device management. To remove or delete a device you have to bee logged in:
![Cover](https://raw.githubusercontent.com/Coderwelsch/IO-Knock-Knock/master/assets/ui-login.jpg "Cover")

The main view:
![Cover](https://raw.githubusercontent.com/Coderwelsch/IO-Knock-Knock/master/assets/ui-main.jpg "Cover")

The delete view:
![Cover](https://raw.githubusercontent.com/Coderwelsch/IO-Knock-Knock/master/assets/ui-remove.jpg "Cover")

The add view:
![Cover](https://raw.githubusercontent.com/Coderwelsch/IO-Knock-Knock/master/assets/ui-add.jpg "Cover")

## Thanks to following tutorials...
http://joshondesign.com/2013/10/23/noderpixxxx

http://www.instructables.com/id/Raspberry-Pi-Bluetooth-InOut-Board-or-Whos-Hom/?ALLSTEPS

http://www.elinux.org/RPi_Bluetooth_LE
