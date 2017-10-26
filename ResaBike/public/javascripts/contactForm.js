(function() {
    $('form > input, form > textarea').keyup(function() {

        var empty = false ;

        $('form > input, form > textarea').each(function() {
            if ($(this).val() == '') {
                empty = true;
            }
        });

        if (empty) {
            $('#submit_button').attr('disabled', 'disabled');
        } else {
            $('#submit_button').removeAttr('disabled');
        }
        
    });
    $("#submit_button").click(function(){
        Materialize.toast('Email has been sent !', 3000, 'rounded');
    });
})()

//$('#submit_button').click(successMailSend());

//Sending a toast when successfully send email
// function successMailSend(){
//     Materialize.toast('Email has been sent !', 3000, 'rounded')
// }