// global variables
var sys = require("sys"),
    http = require("http"),
    path = require("path"),
    url = require("url"),
    filesys = require("fs"),
    ws = require("nodejs-websocket"),
    qs = require("querystring"),

    mimeTypes = {
        "ecma": "application/ecmascript",
        "epub": "application/epub+zip",
        "js": "application/javascript",
        "json": "application/json",
        "doc": "application/msword",
        "pdf": "application/pdf",
        "cer": "application/pkix-cert",
        "rss": "application/rss+xml",
        "rtf": "application/rtf",
        "xhtml": "application/xhtml+xml",
        "xml": "application/xml",
        "zip": "application/zip",
        "bmp": "image/bmp",
        "gif": "image/gif",
        "jpg": "image/jpeg",
        "png": "image/png",
        "svg": "image/svg+xml",
        "tiff": "image/tiff",
        "css": "text/css",
        "csv": "text/csv",
        "html": "text/html",
        "txt": "text/plain",
        "uri": "text/uri-list",
        "mp4": "video/mp4",
        "mpg": "video/mpeg"
    },

    server,
    webSocketConnection,
    webSocketData = '',

    requestCallbackForSearchedDevices = '/newDevicesFound'

    rootDir = "/home/pi/knock-knock/www-data/",
    availableDevicesJson = "../device-data/available-devices.json",
    searchedDevicesJson = "../device-data/searched-devices.json",
    indexLocation = "index.html";


// helper functions
function setCORSHeaders( response ) {
    response.setHeader( 'Access-Control-Allow-Origin', '*' );
    response.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE' );
    response.setHeader( 'Access-Control-Allow-Headers', 'X-Requested-With,content-type' );
    response.setHeader( 'Access-Control-Allow-Credentials', true );

    return response;
}

function getJSON ( url, callback ) {
    filesys.readFile( url, 'utf8', function (err, data ) {
        if ( data ) {
            callback( JSON.parse( data ) );
        }
    } );
}

function fileExists ( path, callback ) {
    filesys.exists( fullPath, function( exists ) {
        callback( exists );
    } );
}

// start http server
server = http.createServer( function( request, response ) {
    var requestedPath = url.parse( request.url ).pathname,
        fullPath = path.join( rootDir, requestedPath );

    // extend headers
    response = setCORSHeaders( response );

    // switch requests
    switch ( requestedPath ) {
        case '/getJsonData=auth-dev':
            getJSON( availableDevicesJson, function( data ) {
                data[ 'type' ] = 'auth-devices';

                response.writeHeader( 200, { "Content-Type": "application/json" } );
                response.write( JSON.stringify( data ) );
                response.end();
            } );

            // console.log( 'request auth dev data' );
        break;

        case '/getJsonData=searched-dev':
            getJSON( searchedDevicesJson, function ( data ) {
                data[ 'type' ] = 'auth-devices';

                response.writeHeader( 200, { "Content-Type": "application/json" } );
                response.write( JSON.stringify( data ) );
                response.end();
            } );
        break;

        case '/':
            response.writeHeader( 302, { "Location": indexLocation });
            response.end();
        break;

        case requestCallbackForSearchedDevices:
            console.log( 'New Searched Devices Available' );

            getJSON( searchedDevicesJson, function ( data ) {
                data = JSON.parse( data );
                data[ 'type' ] = 'searched-devices';

                webSocketData = JSON.stringify( data );
            } );
        break;

        default:
            // search for requested file
            filesys.exists( fullPath, function( exists ) {
                if ( !exists ) {
                    response.writeHeader( 404, { "Content-Type": "text/plain" } );
                    response.write( "404 Not Found\n" );
                    response.end();
                } else {
                    filesys.readFile( fullPath, "binary", function ( err, file ) {
                        if ( err ) {
                            response.writeHeader( 500, { "Content-Type": "text/plain" } );
                            response.write( err + "\n" );
                            response.end();
                        } else {
                            var extention = path.extname( fullPath ).split( '.' )[ 1 ],
                                mimeType = getMimeType( extention ),
                                headerSettings = { 'Content-Type': mimeType };

                            response.writeHeader( 200, headerSettings );
                            response.write( file, "binary" );
                            response.end();
                        }
                    });
                }
            });
        break;
    }
} );

function getMimeType ( type ) {
    if ( type in mimeTypes ) {
        return mimeTypes[ type ];
    }

    return '';
}

server.listen( 8080 );
console.log( 'HTTP Server Started...' );


// start ws server
var wsServer = ws.createServer( function ( connection ) {
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
