$(document).ready(function() {
    $('#download-windows').click(function() {
        ga('send', 'event', 'Binaries', 'download', 'Download - Windows');
    });

    $('#download-linux').click(function() {
        ga('send', 'event', 'Binaries', 'download', 'Download - Linux');
    });
});