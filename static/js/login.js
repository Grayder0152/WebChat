$(document).ready(function(){    

    statusSender();

});
function statusSender(){
    const statusSocket = new WebSocket(
        'ws://' + window.location.host + '/ws/status/'
    );

    $('#login-button').click(function(e) {
        statusSocket.send(JSON.stringify({
            'online': true,
            'username': $('#id_username').val()
        }));
    });
}
