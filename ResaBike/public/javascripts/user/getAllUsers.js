var userName;

function modalModifyUser(name, mail, id){
    //get inputs values
    document.getElementById('username').value = name;
    document.getElementById('email').value = mail;
    document.getElementById('id').value = id;

    userName = name;

    //open modal
    $('.modal').modal();
    $('#modal1').modal('open');
}

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
                window.location.href = '/user';
            }
        }
    });
}
