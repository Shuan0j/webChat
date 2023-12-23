const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    // 監聽前端發送的消息
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);

        try {
            // 解析 JSON 字串以取得原始文字
            const parsedMessage = JSON.parse(message);
            const text = parsedMessage.text;

            // 將消息廣播給所有連接的客戶端
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(text);
                }
            });
        }
        catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    // 關閉連接時的處理
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// 設置靜態文件目錄（可選）
app.use(express.static('public'));

// 啟動伺服器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});