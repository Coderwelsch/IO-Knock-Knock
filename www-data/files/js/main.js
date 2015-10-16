// global variables
var requiredScripts = [
        'jquery/jquery-2.1.4.min'
    ],

    webSocket,
    wsUrl = 'ws://knock-knock-pi.local:8081',

    getAuthJsonUrl = 'files/php/get-available-device-data.php',
    getSearchJsonUrl = 'files/php/get-searched-device-data.php',
    removeJsonUrl = 'files/php/remove-auth-device-data.php',

    authDeviceData = {},
    searchedDeviceData = {},
    authLastSyncTime = Date.now(),
    authInterval = 0,
    searchedInterval = 0,

    searchedActions = { label: 'Add', class: 'add' },
    authActions = { label: 'Remove', class: 'remove' },

    $overlayDeviceManager,
    $overlayLogin,
    $body,
    $loginBtn,
    $authDeviceView,
    $searchedDeviceView,
    $searchedLastSyncTime,
    $authDeviceTable,
    $searchedDeviceTable,
    $authDeviceTableBody,
    $authLastSyncTime;


// main functions
function init() {
    initVariables();
    bindEvents();
    main();
}

function initVariables() {
    webSocket = new WebSocket( wsUrl );

    $overlayDeviceManager = $( '#overlay-device-manager' );
    $overlayLogin = $( '#login-form' );
    $body = $( '.body' );
    $loginBtn = $body.find( '.login-button' );
    $authDeviceView = $body.find( '.split-table-view.view-left' );
    $searchedDeviceView = $body.find( '.split-table-view.view-right' );
    $searchedDeviceTable = $searchedDeviceView.find( 'table.device-table' );
    $searchedDeviceTableBody = $searchedDeviceTable.find( 'tbody' );
    $searchedLastSyncTime = $searchedDeviceView.find( 'span.sync-time' );

    $authDeviceTable = $authDeviceView.find( 'table.device-table' );
    $searchedDeviceTable = $searchedDeviceView.find( 'table.device-table' );
    $authDeviceTableBody = $authDeviceTable.find( 'tbody' );
    $authLastSyncTime = $authDeviceView.find( 'span.sync-time' );
}

function bindEvents() {
    webSocket.onmessage = receivedMessageFromServer;

    $authDeviceTableBody.on( 'click', 'span.action.remove', removeItemClicked );
    $searchedDeviceTableBody.on( 'click', 'span.action.add', addItemClicked );

    if ( $loginBtn.hasClass( 'log-in' ) ) {
        $loginBtn.on( 'click', loginBtnClicked );
    } else {
        $loginBtn.on( 'click', logOut );
    }
}

function logOut() {
    window.location.href = 'index.php?logout=true'
}

function loginBtnClicked( event ) {
    $overlayLogin.addClass( 'show' );
    $body.addClass( 'blurry' );

    $overlayLogin.find( 'input' ).focus();

    $overlayLogin.one( 'click', '.close', function () {
        $body.removeClass( 'blurry' );
        $overlayLogin.removeClass( 'show' );
    } );
}

function main() {
    startDataRequesting();
}

function removeItemClicked( event ) {
    var $this = $( this ),
        $row = $this.closest( 'tr' ),
        index = parseInt( $row.attr( 'data-index' ) );

    stopDataRequesting();
    addOverlay( 'remove', authDeviceData[ index ] );
}

function addItemClicked( event ) {
    var $this = $( this ),
        $row = $this.closest( 'tr' ),
        index = parseInt( $row.attr( 'data-index' ) );

    stopDataRequesting();
    addOverlay( 'add', searchedDeviceData[ index ] );
}

function addOverlay( type, deviceData ) {
    var data = {
        remove: {
            headline: 'Remove Device !?',
            action: 'remove',
            target: 'authentificated'
        },
        add: {
            headline: 'Add Device !?',
            action: 'add',
            target: 'authentificated'
        }
    };

    $overlayDeviceManager.addClass( 'show' );
    $body.addClass( 'blurry' );

    $overlayDeviceManager.find( '.headline' ).text( data[ type ].headline );
    $overlayDeviceManager.find( '.action' ).text( data[ type ].action );
    $overlayDeviceManager.find( '.name' ).text( deviceData.name );
    $overlayDeviceManager.find( '.address' ).text( deviceData.address );
    $overlayDeviceManager.find( '.target-list' ).text( data[ type ].target );

    $overlayDeviceManager.one( 'click', '.close, .button.cancel', overlayCloseClicked );
    $overlayDeviceManager.one( 'click', '.button.accept', function () {
        applyData( type, deviceData );
    } );
}

function applyData( type, data ) {
    data[ 'type' ] = type;

    $.ajax( {
        type: "POST",
        url: removeJsonUrl,
        data: data,
        success: function( data ) {

            if ( data.success ) {
                overlayCloseClicked();
            } else {
                console.log( 'ERROR: ', data.error );
            }
        },
        dataType: 'json'
    } );
}

function overlayCloseClicked() {
    $overlayDeviceManager.removeClass( 'show' );
    $body.removeClass( 'blurry' );
    startDataRequesting();
}

function stopDataRequesting() {
    clearInterval( authInterval );
    clearInterval( searchedInterval );
}

function startDataRequesting() {
    getAuthJsonData();
    getSearchedJsonData();
}

function getAuthJsonData() {
    authInterval = setInterval( function () {
        $.getJSON( getAuthJsonUrl, updateAuthDevices );
    }, 4000 );
}

function getSearchedJsonData( data ) {
    searchedInterval = setInterval( function () {
        $.getJSON( getSearchJsonUrl, updateSearchedDevices );
    }, 4000 );
}

function updateTableData( data, $tableBody, $syncTime, action ) {
    var now = new Date();

    // empty table
    $tableBody.empty();

    // update auth sync time
    $syncTime.text( getFormattedTimeString( now ) );

    for ( var i = 0; i < data.length; i++ ) {
        var item = data[ i ],
            timestamp = new Date( item.time ),
            $row = $( '<tr></tr>' ).attr( 'data-index', i ),
            $entry = $( '<td></td>' ),
            $name = $entry.clone().addClass( 'name' ).text( item.name ),
            $address = $entry.clone().addClass( 'address' ).text( item.address ),
            $status = $entry.clone().addClass( 'status' ),
            $timestamp = $entry.clone().addClass( 'time' ),
            $actions = $entry.clone().addClass( 'actions' );

        // status
        if ( item.status === '0' ) {
            $status.text( 'Not Available' );
        } else if ( item.status === '1' ) {
            $status.text( 'Available' );
        } else {
            $status.text( 'Unknown: ' + item.status );
        }

        var $action = $( '<span></span>' )
                            .addClass( 'action' )
                            .addClass( action.class )
                            .text( action.label );

        $actions.append( $action );

        // timestamp
        $timestamp.text( getFormattedTimeString( timestamp ) );

        // apply data to view
        $row
            .append( $name )
            .append( $address )
            .append( $status )
            .append( $timestamp )
            .append( $actions );

        $tableBody.append( $row );
    }
}

function getFormattedTimeString( time ) {
    var hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours(),
        minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes(),
        seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();

    return hours + ':' + minutes + ':' + seconds;
}

function updateSearchedDevices ( data ) {
    searchedDeviceData = data;
    updateTableData( searchedDeviceData, $searchedDeviceTableBody, $searchedLastSyncTime, searchedActions );
}

function updateAuthDevices( data ) {
    // reset auth device data to new data
    authDeviceData = data;
    updateTableData( authDeviceData, $authDeviceTableBody, $authLastSyncTime, authActions );
}

function receivedMessageFromServer( message ) {
    var messageData = JSON.parse( message.data );

    switch ( messageData.type ) {
        case 'auth-devices':
            updateAuthDevices( messageData );
        break;

        // TODO: Implement WebSocket Callbacks the right way
        case 'searched-devices':
        default:
            // updateSearchedDevices( messageData );
            // console.log( messageData );
            // console.log( 'WebSocket: Unknown Data Type Received:', messageData );
        break;
    }
}

function error( errorMsg ) {
    console.error( errorMsg );
}


// require
require( requiredScripts, init, error );
