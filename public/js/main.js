$(document).ready(function(){
    var socket = io();
    /* Ask for their Name If null = Prompt Again Else = Proceed */
    var name = prompt("Please Enter Your Name: ");
    if(!name){
        var name = prompt("Please Enter Your Name: ");
    }else{
        socket.emit('got_a_new_user', {name, session_id: '<%= session_id %>'});
    }

    /* When send button is clicked */
    $('#send').click(function(){
        let message = $('#message').val();
        if(message){
            socket.emit('add_message', {name, message});
            $('#message').val("");
        }
        return false;
    });

    /* Socket IO listener */
    socket.on('new_user', function(res){
        if(res){
            let html = `<p class="status">${res.userdata.name} has joined. </p><br>`;
            $('#conversation-cont').append(html);
        }
    });
    socket.on('added_message', function(res){
        if(res){
            let html = `<div><p><strong>${res.data.name}</strong>: ${res.data.message}</p></div>`;
            $('#conversation-cont').append(html);
        }
    });
    socket.on('sent_message', function(res){
        if(res){
            let html = `<div id="sent-msg"><p class="sent-message">${res.data.message}</p></div>`;
            $('#conversation-cont').append(html);
        }
    });
    socket.on('disconnected_user', function(res){
        if(res){
            let html = `<p class="status">${res.name} has logged out. </p><br>`;
            $('#conversation-cont').append(html);
        }
    });
    socket.on('load_conversation', function(res){
        if(res){
            let html = "";
            for(let i=0; i<res.length; i++){
                html += `<div><p><strong>${res[i].name}</strong>: ${res[i].message}</p></div>`;
            }
            $('#conversation-cont').html(html);
        }
    });
    /* So we could just press enter rather than clicking the send button */
    $('input').keyup(function(event){
        if (event.keyCode === 13) {
            let message = $('#message').val();
            if(message){
                socket.emit('add_message', {name, message});
                $('#message').val("");
            }
            return false;
        }
    });
});