/**
 * Open a model for creaeting a zone
 */
function modalCreateZone(){
    //open modal
    $('.modal').modal();
    $('#modalCreateZone').modal('open');
}

/**
 * Creation of a zone using an ajax request of POST type
 */
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

/**
 * Open the modal for editing a zone
 * @param {*} name 
 * @param {*} id 
 */
function modalEditZone(name, id){
    //get the current zone name and id
    document.getElementById('editName').value = name;
    document.getElementById('id').value = id;

    //open modal
    $('.modal').modal();
    $('#modalEditZone').modal('open');
}

/**
 * Edit a zone 
 */
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

/**
 * Deletion of a zone using an ajax request
 * @param {*} id 
 */
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
/**
 * Redirect to a zone details
 * @param {*} id 
 */
function detailsZone(id){
    window.location.href = '/' +langUsed+ '/zone/'+id;
}

