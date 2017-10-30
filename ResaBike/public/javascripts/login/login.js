function login(){
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    var user = {
        username: username,
        password: password
    };

    //AJAX POST to login
    $.ajax({
        url: '/login',
        type: 'POST',
        data: user,
        success: function(result){
            if(result == 'error') {
                Materialize.toast('Le username et/ou le mot de passe ne correspondent pas', 4000);                
            } else {
                result = JSON.parse(result);
                //if the user is a sysadmin
                if(result.RoleId == 3){
                    window.location.href = '/zone';
                } else{
                    //redirect him into the zone page
                    window.location.href = '/zone/'+result.ZoneId
                }
                alert(result.RoleId);
            }
        }
    });
    
}