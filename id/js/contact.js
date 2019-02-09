$(document).ready(function() {
    $('form#top-form').submit(function(e) {
        // return false so form submits through jQuery rather than reloading page.
        if (e.preventDefault) {
            e.preventDefault()
        } else {
            e.returnValue = false;
        }
        
        let userEmail = $("input[name='top-email']").val();

        if(userEmail !== '') {
            sendEmail(userEmail, 'form#top-form');
            $('form#top-form input, form#top-form button').fadeOut(500);
            setTimeout(function() {
                $('form#top-form input, form#top-form button').fadeIn(1000);
            }, 5000);
        }

        return false;
    });

    $('form#modal-form').submit(function(e) {
        // return false so form submits through jQuery rather than reloading page.
        if (e.preventDefault) {
            e.preventDefault()
        } else {
            e.returnValue = false;
        }
        
        let userEmail = $("input[name='modal-email']").val();

        if(userEmail !== '') {
            sendEmail(userEmail, 'form#modal-form');
        }
        return false;
    });

    $('form#bottom-form').submit(function(e) {
        // return false so form submits through jQuery rather than reloading page.
        if (e.preventDefault) {
            e.preventDefault()
        } else {
            e.returnValue = false;
        }

        let userEmail = $("input[name='bottom-email']").val();

        if(userEmail !== '') {
            sendEmail(userEmail, 'form#bottom-form');
        }
        return false;
    });

    function sendEmail(userEmail, formId) {
        let formErrorText = $(formId).data('error');
        let formSuccessText = $(formId).data('success');
        let submitButton = $(formId).find('button[type="submit"]');
        let originalError = $(formId)
        $('.form-error, .form-success').remove();
        $(formId).append('<div class="form-error" style="display: none;">' + formErrorText + '</div>');
        $(formId).append('<div class="form-success" style="display: none;">' + formSuccessText + '</div>');

        jQuery.ajax({
            type: "POST",
            url: "https://tanibox-oue-ahp.mailtrgt.com/form/5b10f7036cb62a311a750bc9",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({email: userEmail}),
            success: function(response) {
                $('input[type="text"]').val("");
                $('.form-success').fadeIn(1000);
                $('.form-error').fadeOut(1000);
            },
            error: function(errorObject, errorText, errorHTTP) {
                console.log(errorText);
                
                // force success
                $('input[type="text"]').val("");
                $('.form-success').fadeIn(1000);
                $('.form-error').fadeOut(1000);
                
                setTimeout(function() {
                    $('.form-success').fadeOut(500);
                }, 5000);

                /*
                // Keep the current error text in a data attribute on the form
                formError.attr('original-error', formError.text());
                //thisForm.find('.form-success').fadeIn(1000);

                formError.fadeOut(1000);
                // Show the error with the returned error text.
                formError.text(errorHTTP).fadeIn(1000);
                formSuccess.fadeOut(1000);
                submitButton.html(submitButton.attr('data-text')).removeAttr('disabled');
                */
            }
        });
    }
});