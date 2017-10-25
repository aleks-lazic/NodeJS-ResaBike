var userName;
var alreadyChanged = false;
var selectUserAlreadyOk = false;

//modal to open the update user
function modalModifyUser(name, mail, id){
    //get inputs values
    document.getElementById('username').value = name;
    document.getElementById('email').value = mail;
    document.getElementById('id').value = id;

    userName = name;

    //open modal
    $('.modal').modal();
    $('#modalUpdateUser').modal('open');
}

//modal to update the user
function modifyUser(){
    //get values from modal's input
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var id = document.getElementById('id').value

    var same;
    if(username == userName){
        same = true;
    } else {
        same = false;
    }

    //create an object to pass it through the body
    var newUser = {
        username: username,
        email: email,
        id: id,
        same: same
    };

    //ajax PUT
    $.ajax({
        url : '/user/update',
        type : 'PUT',
        data: newUser,
        success : function(res){
            console.log(res);
            if(res == 'username'){
                alert('The username already exists');
            } else if(res == 'success'){
                $('.modal').modal();                
                $('#modalUpdateUser').modal('close');                
                $('#usersTable').load(' #usersTable');
            }
        }
    });
}

//modal to open the create user
function modalCreateUser(){

    if(!selectUserAlreadyOk){
        //load all the roles
        $.ajax({
            url : '/user/getAllRoles',
            type : 'GET',
            success : function(data){
                selectUserAlreadyOk = true;
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
    }
    
    //open modal
    $('.modal').modal();
    $('#modalCreateUser').modal('open');
}

//ON CHANGE load zones
function loadZones(){
    var select = document.getElementById('selectZone');
    var roleIndex = document.getElementById('selectRole');
    var role = roleIndex.options[roleIndex.selectedIndex].value; 

    if(alreadyChanged){
        if(role != 'sysadmin') {
            select.style.visibility = 'visible';             
        } else {
            select.style.visibility = 'hidden';                         
        }
        return;
    } 
    console.log(alreadyChanged);
    alreadyChanged = true;
    
    if(role != 'sysadmin'){
        select.style.visibility = 'visible';        
        //load all the zones
        $.ajax({
            url : '/zone/getAllZones',
            type : 'GET',
            success : function(data){
                console.log(data);
                data.forEach(function(element) {
                    var opt = document.createElement("option");
                    opt.value = element.id;
                    opt.textContent = element.name;
                    select.appendChild(opt);
                }, this);
            }
        });
    }
}

//create the user on create button
function createUser(){

    var username = document.getElementById('usernamee').value;
    var password = document.getElementById('passwordd').value;
    var password2 = document.getElementById('passwordd2').value;
    var email = document.getElementById('emaill').value;
    var roleIndex = document.getElementById('selectRole');
    var role = roleIndex.options[roleIndex.selectedIndex].value; 
    var zoneIndex = document.getElementById('selectZone');
    var idZone = zoneIndex.options[zoneIndex.selectedIndex].value;

    if(idZone > 0){

    } else {
        idZone = 0;
    }

    //create the object to create the user
    var user = {
        username: username,
        password: password,
        password2: password2,
        email: email,
        role: role,
        idZone: idZone
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
                $('.modal').modal();                
                $('#modalCreateUser').modal('close');                
                $('#usersTable').load(' #usersTable');
                $('#formCreateUser')[0].reset();                                
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

//delete the user by id
function deleteUser(id){
    //ajax DELETE
    $.ajax({
        url : '/user/'+id,
        type : 'DELETE',
        success : function(res){
            $('#usersTable').load(' #usersTable');            
        }
    });
}
