$(document).ready(function(){
    const statusSocket = new WebSocket(
        'ws://' + window.location.host + '/ws/status/'
    );

    statusSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        if(data.online){
            $('#'+data.username+' .online_icon').addClass('online');
            $('#count_online_users').text(parseInt($('#count_online_users').text()) + 1);

        }
        else{
            $('#'+data.username+' .online_icon').removeClass('online');
            $('#count_online_users').text(parseInt($('#count_online_users').text()) - 1);   
        }
    };

    if($('#login-button').length){
        var loginButton = $('#login-button');

        loginButton.click(function(e) {
            statusSocket.send(JSON.stringify({
                'online': true,
                'username': $('#id_username').val()
            }));
        });
    }
    else{
        var logoutButton = $('#logout-button');

        logoutButton.click(function(e) {
            statusSocket.send(JSON.stringify({
                'online': false,
                'username': $('#user').text()
            }));
        });
    }
});