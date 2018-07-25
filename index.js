function getFile(){
    var hash = $("#hashofFile").val();

    window.location.href = `/getFile/${hash}`;


}
