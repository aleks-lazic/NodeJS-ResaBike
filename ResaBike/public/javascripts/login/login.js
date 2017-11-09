/**
 * AJAX POST to check if login is ok
 * displays a toast if ok or not
 */
function login(){
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    var user = {
        username: username,
        password: password
    };

    //AJAX POST to login
    $.ajax({
        url: '/'+langUsed+'/login',
        type: 'POST',
        data: user,
        success: function(result){
            if(result == 'error') {
                Materialize.toast(`${lang.loginWrongUser}`, 4000);                
            } else {
                result = JSON.parse(result);
                //if the user is a sysadmin
                if(result.RoleId == 3){
                    window.location.href = '/'+langUsed+'/zone';
                } else{
                    //redirect him into the zone page
                    window.location.href = '/'+langUsed+'/zone/'+result.ZoneId
                }
            }
        }
    });
    
}