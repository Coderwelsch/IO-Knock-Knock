# start up ble dongle and set it up
sudo hciconfig hci0 up &
echo "HCICONFIG PID: $!"

# wait some time
sleep 5

# search for devices
sudo python scripts/python-scripts/search-devices.py &
echo "SEARCH DEVICES PID: $!"

sudo python scripts/python-scripts/available-devices.py &
echo "AVAILABLE DEVICES PID: $!"

# wait some time
sleep 5

# run python bluetooth script
sudo node scripts/node-server/node-server.js &
echo "NODE SERVER PID: $!"
