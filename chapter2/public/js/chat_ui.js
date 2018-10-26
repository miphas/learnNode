
// 显示可疑的文本消息
function divEscapedContentElement(message) {
    return $('<div></div>').text(message);
}

// 显示系统创建受信的消息
function divSystemContentElement(message) {
    return $('<div></div>').html('<i>' + message + '</i>');
}

function processInput(chatApp, socket) {
    var message = $('#send-message').val();
    var systemMessage;

    // 处理用户命令
    if (message.charAt(0) == '/') {
        systemMessage = chatApp.processCommand(message);
        if (systemMessage) {
            $('#messages').append(divSystemContentElement(systemMessage));
        }
    }
    else {
        chatApp.sendMessage($('#room').text(), message);
        $('#messages').append(divEscapedContentElement(message));
        $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    }
    $('#send-message').val('');
}

// 客户端程序初始化
var socket = io.connect();

$(document).ready(function() {
    var chatApp = new Chat(socket);
    // 显示更名结果
    socket.on('nameResult', function(result) {
        var message;
        if (result.success) {
            message = 'You are now known as ' + result.name + '.';
        }
        else {
            message = result.message;
        }
        $('#messages').append(divSystemContentElement(message));
    });

    socket.on('joinResult', function(result) {
        $('#room').text(result.room);
        $('#messages').append(divSystemContentElement('Room Changed'));
    });

    socket.on('message', function(message) {
        var newElement = $('<div></div>').text(message.text);
        $('#messages').append(newElement);
    });

    socket.on('rooms', function(rooms) {
        $('#room-list').empty();

        for (var room in rooms) {
            room = room.substring(1, room.length);
            if (room != '') {
                $('#room-list').append(divEscapedContentElement(room));
            }
        }
        $('#room-list div').click(function() {
            chatApp.processCommand('/join' + $(this).text());
            $('#send-message').focus();
        });
    });

    setInterval(function() {
        socket.emit('rooms');
    }, 1000);

    $('#send-message').focus();

    $('#send-form').submit(function(e) {
        e.preventDefault();
        processInput(chatApp, socket);
        //return false;
    });
    
});