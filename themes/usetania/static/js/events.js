$(document).ready(function() {
    $('#download-windows').click(function() {
        ga('send', 'event', 'Binaries', 'download', 'Download - Windows');
        fbq('track', 'StartTrial', {
            value: 'Windows'
        });
    });

    $('#download-linux').click(function() {
        ga('send', 'event', 'Binaries', 'download', 'Download - Linux');
        fbq('track', 'StartTrial', {
            value: 'Linux'
        });
    });

    $('#submit-contact-en').click(function() {
        ga('send', 'event', 'Contact', 'submit', 'Submit - English');
        fbq('track', 'Lead');
    });

    // copy to clipboard
    $('#copy-address').bind('click', function() {
        var input = $('#eth-address');
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(input).text()).select();
        try {
            var success = document.execCommand('copy');
            if (success) {
                $('#copy-address').trigger('copied', ['Copied!']);
                $temp.remove();
            } else {
                $('#copy-address').trigger('copied', ['Copy with Ctrl-c']);
                $temp.remove();
            }

            // tracker
            ga('send', 'event', 'Donate', 'click', 'Donate - Ethereum');
            fbq('track', 'Donate');
        } catch (err) {
            $('#copy-address').trigger('copied', ['Copy with Ctrl-c']);
            $temp.remove();
        }
    });
    
    // Handler for updating the tooltip message.
    $('#copy-address').bind('copied', function() {
        $('#copy-address').text('Copied');
        setTimeout(function() {
            $('#copy-address').text('Copy to Clipboard');
        }, 2000);
    });
});