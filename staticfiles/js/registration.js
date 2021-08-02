$(document).ready(function(){    

    avatarFileUploud();
    registrationSender();
    registrationValidator();

});

function avatarFileUploud(){
    var $label = $('.avatar_file_upload');
    var labelVal = $label.html();

    $('#id_avatar').on('change', function(element) {
        var fileName = '';
        if (element.target.value){
            fileName = element.target.value.split('\\').pop();
        }
        if(fileName){
            $label.find('.fa').removeClass('fa-download').addClass('fa-check');
            $label.addClass('has-file').find('.atatar_label').html(fileName);
        }
        else{
            $label.find('.fa').removeClass('fa-check').addClass('fa-download');
            $label.removeClass('has-file').html(labelVal);
        }
    });
}

function registrationSender(){
    const registrationSocket = new WebSocket(
        'ws://' + window.location.host + '/ws/registration/'
    );
    $('.send').click(function(){
        registrationSocket.send(JSON.stringify({
            'register': true,
        }));
    });
}


function validatMinCountChapters(inputId, min_chapters){
    $('#'+inputId).on('input', function(){
        if($(this).val().length < min_chapters){
            $(this).addClass('invalid').removeClass('valid')
            $(this).next().show();
        }
        else{
            $(this).removeClass('invalid').addClass('valid');
            $(this).next().hide();
        }
    });
}

function registrationValidator(){
    $('#id_username').blur(function(){
        let data = {
            username: $(this).val()
        }
        $.ajax({
            method: "GET",
            dataType: "json",
            data: data,
            success: function(response){
                if(response['exists']){
                    $('#id_username').addClass('username_exist').removeClass('username_not_exist');
                    $('.exist').show();
                }
                else{
                    $('#id_username').removeClass('username_exist').addClass('username_not_exist');
                    $('.exist').hide();
                }
            }
        });
    });
    $('#id_password2').on('input', function(){
        if($('#id_password2').val() != $('#id_password').val()){
            $(this).addClass('invalid').removeClass('valid');
            $(this).next().show();
        }
        else{
            $(this).removeClass('invalid').addClass('valid');
            $(this).next().hide();
        }
    });

    $('form.card').submit(function(event){
        if($('#id_password2').val() != $('#id_password').val()){
            $('#id_password2').addClass('invalid').removeClass('valid');
            $('#id_password2').next().show();
        }

        if($('.invalid').length > 0){
            event.preventDefault();
            $('.invalid')[0].focus();   
        }
    });
    validatMinCountChapters('id_username', 3);
    validatMinCountChapters('id_password', 6);
}