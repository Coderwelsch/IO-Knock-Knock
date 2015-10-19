// global variables
var sys = require("util"),
    http = require("http"),
    path = require("path"),
    url = require("url"),
    filesys = require("fs"),
    ws = require("nodejs-websocket"),
    childProcess = require('child_process'),

    mimeTypes = require('./mime-types'),

    httpServer,
    wsServer,
    webSocketConnection,
    webSocketData = '',

    requestCallbackForSearchedDevices = '/newDevicesFound'

    rootDir = process.cwd() + '/',
    wwwDir = rootDir + 'www-data/',
    dataDir = rootDir + "../../device-data/",
    availableDevicesJson = dataDir + "available-devices.json",
    authorizedDevicesJson = dataDir + "authorized-devices.json",
    searchedDevicesJson = dataDir + "searched-devices.json",
    indexLocation = "index.html";


// helper functions
function getJSON ( url, callback ) {
    if ( !url || !callback ) {
        console.log( 'Url Or Callback Not Set: ', url, callback );

        return false;
    }

    filesys.readFile( url, 'utf8', function ( err, data ) {
        if ( data ) {
            callback( JSON.parse( data ) );
        }
    } );
}

function writeJSON ( path, data, callback ) {
    filesys.writeFile( path, JSON.stringify( data, null, 4 ), function ( error ) {
        callback( error );
    });
}

function fileExists ( path, callback ) {
    filesys.exists( fullPath, function( exists ) {
        callback( exists );
    } );
}

httpServer = http.createServer( function ( req, res ) {
    console.log( req );

    res.writeHead( 200, { 'Content-Type': 'text/plain' } );
    res.write();
    res.end();
} ).listen( 8080 );
console.log( 'WebServer started...' );

// start ws server
wsServer = ws.createServer( function ( connection ) {
    connection.on( "text", function ( str ) {
        console.log( "WebSocket Received Data: " + str )
        // conn.sendText( str.toUpperCase() + "!!!" )
    } );

    connection.on( "close", function ( code, reason ) {
        console.log( "WebSocket Connection Closed" );
    } )

    setInterval( function () {
        if ( webSocketData !== '' ) {
            console.log( 'Send New Device Data To WebSocket Connection' );
            connection.sendText( webSocketData );
            webSocketData = '';
        }
    }, 100 );
} ).listen( 8081 );
console.log( 'WebSocket Server Started...' );
