// 导入所需的库
const express = require('express');
const http = require('http');
const websocket = require('ws');
const path = require('path');

const { getLocalIPv4 } = require('./utils');

// 创建Express应用和HTTP服务器
const app = express();
const server = http.createServer(app);
const ws = new websocket.WebSocketServer({
  server,
});

// 提供静态文件（比如index.html）
app.use(express.static(path.join(__dirname)));

// // 定义路由：当访问网站根目录时，返回index.html
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

ws.on('connection', (webSocket) => {
  webSocket.on('message', (message) => {
    // console.log('message', message.toString());
    ws.clients.forEach(client => client.send(message.toString()));
  });

  // webSocket.on('close', () => {
  //   console.log('客户端已断开');
  // });

  webSocket.on('error', (error) => {
    console.log('连接客户端错误：', error);
  });
});

// // 处理Socket.IO连接
// io.on('connection', (socket) => {
//   console.log('一个客户端已连接: ' + socket.id);

//   // 监听来自客户端的‘callNumber’事件
//   socket.on('callNumber', (data) => {
//     console.log('收到呼叫指令: ', data.roomId, data.number);

//     // 将接收到的号码广播给所有连接的客户端（包括发送者自己）
//     io.emit('playSound', { number: data.number, roomId: data.roomId });
//   });

//   socket.on('sendWebRTCOffer', (data) => {
//     io.emit('getWebRTCOffer', data);
//   });

//   socket.on('sendWebRTCAnswer', (data) => {
//     io.emit('getWebRTCAnswer', data);
//   });

//   // 处理连接断开
//   socket.on('disconnect', () => {
//     console.log('客户端断开连接: ' + socket.id);
//   });
// });

// 启动服务器，监听3000端口
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`叫号服务器运行在 http://localhost:${PORT}`);
  console.log(`叫号服务器运行在 http://${getLocalIPv4()}:${PORT}`);
  console.log(`叫号服务器ws运行在 ws://locahost:${PORT}`);
});

console.log('speech server');
// process.stdin.resume();
