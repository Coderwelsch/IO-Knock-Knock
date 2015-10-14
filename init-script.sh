# start up ble dongle and set it up
sudo hciconfig hci0 up &

sleep 5

# search for devices
sudo python python-scripts/search-devices.py &
sudo python python-scripts/available-devices.py &

sleep 5

# run python bluetooth script
cd node-server/
sudo node node-server.js &
