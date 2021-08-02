$(document).ready(function(){    

    statusSender();

});
function statusSender(){
    const statusSocket = new WebSocket(
        'ws://' + window.location.host + '/ws/status/'
    );

    $('#login-button').click(function(e) {
        e.preventDefault();
        let form = $('form');
        let formData = form.serialize();
        $.ajax({
            method: 'POST',
            url: '/auth/user-status/',
            data: formData,
            success: function (response) {
                if(response['login']){
                    statusSocket.send(JSON.stringify({
                        'online': true,
                        'username': $('#id_username').val()
                    }));
                }
                form.submit();
            }
        });
    });
}
