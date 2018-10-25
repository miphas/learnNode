
var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {}
var namesUsed = [];
var currentRoom = {};

exports.listen = function(server) {
    // 启动Socket.IO服务器，允许它搭载在已有的HTTP服务器上
    io = socketio.listen(server);
    io.set('log level', 1);
    // 定义用户连接的处理逻辑
    io.sockets.on('connection', function(socket) {
        // 用户连接时赋予其一个访客名
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
        // 在用户连接上来时放入聊天室Lobby
        joinRoom(socket, 'Lobby');
        // 处理用户的消息、更名以及聊天室创建变更
        handleMessageBoardcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);

        // 用户发出请求时，向其提供已经被占用聊天室的列表
        socket.on('room', function(){
            socket.emit('room', io.sockets.manager.rooms)
        });
        // 定义用户断开连接后的清除逻辑
        handleClientDisconnection(socket, nickNames, namesUsed);
    });
}

// 1. 分配用户昵称
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    // 生成新的昵称
    var name = 'Guest' + guestNumber;
    // 用户昵称与客户端ID关联
    nickNames[socket.id] = name;
    // 向用户传递其昵称
    socket.emit('nameResult', {
        success: true,
        name: name
    });
    // 记录已有昵称
    namesUsed.push(name);
    return guestNumber + 1;
}

// 2. 进入聊天室的相关逻辑
function joinRoom(socket, room) {
    // 用户进入房间
    socket.join(room);
    // 记录用户当前房间
    currentRoom[socket.id] = room;
    // 让用户知道进入了新的房间
    socket.emit('joinResult', {room: room});
    socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + ' has joined ' + room + '.'
    });

    // 统计房间内用户信息
    var usersInRoom = io.sockets.clients(room);
    if (usersInRoom.length > 1) {
        var usersInRoomSummary = 'Users currently in ' + room + ': ';
        for (var index in usersInRoom) {
            var userSocketId = usersInRoom[index].id;
            if (userSocketId != socket.id) {
                if (index > 0) {
                    usersInRoomSummary += ", ";
                }
                usersInRoomSummary += nickNames[userSocketId];
            }
        }
        usersInRoomSummary += '.';
        // 发送给指定用户
        socket.emit('message', {text: usersInRoomSummary});
    }
}

// 3. 处理昵称变更
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    socket.on('nameAttempt', function(name) {
        // 昵称不能以Guest开头
        if (name.indexOf('Guest') == 0) {
            socket.emit('nameResult', {
                success: false,
                message: 'Name cannot begin with Guest'
            });
        }
        else {
            // 昵称不存在则注册
            if (namesUsed.indexOf(name) == -1) {
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name;
                delete namesUsed[previousNameIndex];
                socket.emit('nameResult', {
                    success: true,
                    name: name
                });
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: previousName + ' is now known as ' + name + '.'
                });
            }
            // 已存在则更改失败
            else {
                socket.emit('nameResult', {
                    success: false,
                    message: 'That name is already in use'
                });
            }
        }
    });
}

// 4. 发送聊天消息
function handleMessageBoardcasting(socket) {
    socket.on('message', function(message) {
        socket.broadcast.to(message.room).emit(
            'message',
            {text: nickNames[socket.id] + ": " + message.text}
        );
    });
}

// 5. 创建房间
function handleRoomJoining(socket) {
    socket.on('join', function(room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom);
    });
}

// 6. 用户断开连接
function handleClientDisconnection(socket) {
    socket.on('disconnect', function(){
        var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
    });
}