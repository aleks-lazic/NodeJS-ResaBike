//Open the modal to create a zone
function modalCreateZone(){
    //open modal
    $('.modal').modal();
    $('#modalCreateZone').modal('open');
}

//AJAX POST to create the zone
function createZone(){
    //get all values from form
    var name = document.getElementById('name').value;
    
    //create the object to create the zone
    var zone = {
        name: name,
    };

    // POST ajax to create the zone
    $.ajax({
        url : '/fr/zone/create',
        type : 'POST',
        data: zone,
        success : function(res){
            $('.modal').modal();                
            $('#modalCreateZone').modal('close');                
            $('#zonesTable').load(' #zonesTable');
            $('#formCreateZone')[0].reset();                                            
        }
    });
}

//Open the modal to edit a zone
function modalEditZone(name, id){
    //get the current zone name and id
    document.getElementById('editName').value = name;
    document.getElementById('id').value = id;

    //open modal
    $('.modal').modal();
    $('#modalEditZone').modal('open');
}

//AJAX PUT to edit the zone
function editZone(){
    var name = document.getElementById('editName').value;
    var id = document.getElementById('id').value;
    
    var zone = {
        name: name,
        id: id
    };

     // POST ajax to create the zone
     $.ajax({
        url : '/fr/zone/update',
        type : 'PUT',
        data: zone,
        success : function(res){
            $('.modal').modal();                
            $('#modalEditZone').modal('close');                
            $('#zonesTable').load(' #zonesTable');
            $('#formEditZone')[0].reset();                                            
        }
    });

    
}

//AJAX DELETE to delete a zone
function deleteZone(id){
    // DELETE ajax to delete the zone
    $.ajax({
        url : '/fr/zone/delete/'+id,
        type : 'DELETE',
        success : function(res){
            $('#zonesTable').load(' #zonesTable');
            $('#formCreateZone')[0].reset();                                                        
        }
    });
}

//AJAX GET for zone details
function detailsZone(id){
    window.location.href = '/' +langUsed+ '/zone/'+id;
}

