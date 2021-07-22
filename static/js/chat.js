$(document).ready(function(){
    $('#action_menu_btn').click(function(){
        $('.action_menu').toggle();
    });

    var chat = $('#chat');
    var chatTextField = $('#chat-message');
    var chatSendButton = $('#send-message-button');
    var chatUsername = $('#user').text()
    var countLoadMessages = 30;

    const chatSocket = new WebSocket(
        'ws://' + window.location.host + '/ws/chat/'
    );

    chat.animate({scrollTop: chat.get(0).scrollTopMax}, 100);

    chatTextField.focus();
    chatTextField.keyup(function(e) {
        if (e.keyCode === 13) {
            chatSendButton.click();
        }
    });

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);

        if($('#user').text() == data.username){
            chat.append('<div class="d-flex justify-content-end mb-4">'+
                            '<div class="msg_cotainer_send d-flex flex-column">'+
                                data.message +
                                '<span class="msg_time_send">'+ data.sent_at +'</span>'+
                            '</div>'+
                            '<div class="img_cont_msg">'+
                                '<img src="'+ data.avatar_url +'" class="rounded-circle user_img_msg">'+
                            '</div>'+
                        '</div>'
                        );
        }
        else{
            chat.append('<div class="d-flex justify-content-start mb-4" id="'+ data.username +'">'+
                            '<div class="img_cont_msg">'+
                                '<img src="'+ data.avatar_url +'" class="rounded-circle user_img_msg">'+
                                '<span class="online_icon online"></span>'+
                            '</div>'+
                            '<div class="msg_cotainer d-flex flex-column">'+
                                '<span class="username" style="color:#d23c0d">'+ data.username +'</span>'+
                                data.message +
                                '<span class="msg_time">'+ data.sent_at +'</span>'+
                            '</div>'+
                        '</div>');
        }
        $('#count_messages').text(data.count_messages + 1);
        chat.animate({scrollTop: chat.get(0).scrollTopMax}, 100);
        countLoadMessages += 1
    };

    chatSendButton.click(function(e) {
        if($.trim(chatTextField.val())){

            chatSocket.send(JSON.stringify({
                'message': chatTextField.val(),
                'username': chatUsername,
                'count_messages': parseInt($('#count_messages').text())
            }));
        }
        chatTextField.val('');
    });


    const registrationSocket = new WebSocket(
        'ws://' + window.location.host + '/ws/registration/'
    );
    registrationSocket.onmessage = function(e){
        const data = JSON.parse(e.data);

        if(data.register){
            $('#count_users').text(parseInt($('#count_users').text()) + 1); 
        }
    }


    $('#load-more-button').click(function(){
        let data = {
            countLoadMessages:countLoadMessages
        }

        $.ajax({
            method: "GET",
            dataType: "json",
            data: data,
            success: function(response){
                let more_messages = response['more_messages']
                if(!more_messages){
                    $('#load-more').remove();
                }
                else{
                    var $loadMore = $('#load-more').detach();
                    var message = ''
                    $.each(more_messages, function(key, obj){
                        if($('#user').text() == obj['author_username']){
                            message +=   '<div class="d-flex justify-content-end mb-4">'+
                                            '<div class="msg_cotainer_send d-flex flex-column">'+
                                                obj['message'] +
                                                '<span class="msg_time_send">'+ obj['sent_at'] +'</span>'+
                                            '</div>'+
                                            '<div class="img_cont_msg">'+
                                                '<img src="'+ obj['author_avatar'] +'" class="rounded-circle user_img_msg">'+
                                            '</div>'+
                                        '</div>'
                        }
                        else{
                            message +=   '<div class="d-flex justify-content-start mb-4" id="'+ obj['author_username'] +'">'+
                                            '<div class="img_cont_msg">'+
                                                '<img src="'+ obj['author_avatar'] +'" class="rounded-circle user_img_msg">'+
                                                '<span class="online_icon online"></span>'+
                                            '</div>'+
                                            '<div class="msg_cotainer d-flex flex-column">'+
                                                '<span class="username" style="color:#d23c0d">'+ obj['author_username'] +'</span>'+
                                                obj['message'] +
                                                '<span class="msg_time">'+ obj['sent_at'] +'</span>'+
                                            '</div>'+
                                        '</div>'
                        }
                    })
                    chat.prepend(message);
                    chat.prepend($loadMore);
                    countLoadMessages += 20;
                    if(parseInt($('#count_messages').text()) <= countLoadMessages){
                        $('#load-more').remove();
                    }
                }   
            }
        })
    })        
});