<?php
    $pwdFilePath = '.password';
?>

<html>
    <head>
        <title>Knock Knock</title>

        <link rel="stylesheet" href="files/css/main.css" />

        <script src="files/js/require/require.js" data-main="files/js/main" charset="utf-8"></script>
    </head>

    <body>
        <div id="overlay">
            <div class="close"></div>

            <h1 class="headline">Lorem Ipsum</h1>
            <p>
                Do you really want to
                <span class="action">add</span>
                the device
                <span class="name">Josephs iPhone</span>
                with MAC address
                <span class="address">00:00:00:00</span>
                to the
                <span class="target-list">authenticated</span>
                list?
            </p>

            <div class="buttons">
                <div class="button cancel">Cancel</div>
                <div class="button accept">OK</div>
            </div>
        </div>

        <div class="body">
            <h1>Knock Knock <span class="raspberry-pi-logo"></span></h1>

            <div class="split-table-view view-left">
                <h2>Authorized Devices</h2>
                <h3 class="last-sync">
                    last sync at:
                    <span class="sync-time">
                        never
                    </span>
                </h3>

                <table class="device-table">
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Address</td>
                            <td>Status</td>
                            <td>Last Time Found</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>

            <div class="split-table-view view-right">
                <h2>Found Devices</h2>
                <h3 class="last-sync">
                    last sync at:
                    <span class="sync-time">
                        never
                    </span>
                </h3>

                <table class="device-table">
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Address</td>
                            <td>Status</td>
                            <td>Last Time Found</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </body>
</html>
