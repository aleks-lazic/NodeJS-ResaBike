$(document).ready(function() {

    // for HTML5 "required" attribute
    $("#selectRole[required]").css({display: "block", height: 0, padding: 0, width: 0, position: 'absolute'});
    
    //récupérer tous les rôles    
    $.ajax({
        url : '/user/getAllRoles',
        type : 'GET',
        success : function(data){
            data = JSON.parse(data);
            var select = document.getElementById('selectRole');
            data.forEach(function(element) {
                var opt = document.createElement("option");
                opt.value = element.name;
                opt.textContent = element.name;
                select.appendChild(opt);
            }, this);
        }
    });
});

function createUser(){

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var password2 = document.getElementById('password2').value;
    var email = document.getElementById('email').value;
    var roleIndex = document.getElementById('selectRole');
    var role = roleIndex.options[roleIndex.selectedIndex].value; 

    // //create the object to create the user
    var user = {
        username: username,
        password: password,
        password2: password2,
        email: email,
        role: role
    };

    $.ajax({
        url : '/user/create',
        type : 'POST',
        data: user,
        success : function(res){
            res = JSON.parse(res);
            console.log(typeof(res));
            console.log(res);
            if(res == 'success'){
                window.location.href = '/user';
            } else{
                if(res == 'username'){
                    alert("This user already exists");
                    return;
                }else if(res == 'password'){
                    console.log(res);                    
                    alert("The passwords are not matching");
                    return;
                }
            }
        }
    });
}
