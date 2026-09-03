// 导入所需的库
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

console.log('speech');

const { getLocalIPv4 } = require('./utils');

// 创建Express应用和HTTP服务器
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

console.log('server');

// 提供静态文件（比如index.html）
app.use(express.static(path.join(__dirname)));

// 定义路由：当访问网站根目录时，返回index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/client', (req, res) => {
  res.sendFile(path.join(__dirname, 'client.html'));
});

// 处理Socket.IO连接
io.on('connection', (socket) => {
  console.log('一个客户端已连接: ' + socket.id);

  // 监听来自客户端的‘callNumber’事件
  socket.on('callNumber', (data) => {
    console.log('收到呼叫指令: ', data.roomId, data.number);

    // 将接收到的号码广播给所有连接的客户端（包括发送者自己）
    io.emit('playSound', { number: data.number, roomId: data.roomId });
  });

  socket.on('sendWebRTCOffer', (data) => {
    io.emit('getWebRTCOffer', data);
  });

  socket.on('sendWebRTCAnswer', (data) => {
    io.emit('getWebRTCAnswer', data);
  });

  // 处理连接断开
  socket.on('disconnect', () => {
    console.log('客户端断开连接: ' + socket.id);
  });
});

// 启动服务器，监听3000端口
const PORT = process.env.PORT || 3000;

server.listen(PORT, (error) => {
  console.log(`叫号服务器运行在 http://localhost:${PORT}`);
  console.log(`叫号服务器运行在 http://${getLocalIPv4()}:${PORT}`);
});

console.log('speech server');
// process.stdin.resume();
