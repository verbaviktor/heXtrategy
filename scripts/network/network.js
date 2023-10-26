const recipientIPInput = document.getElementById('recipientIP');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('sendButton');

let peerConnection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
let dataChannel = peerConnection.createDataChannel('chatDataChannel');

dataChannel.onopen = () => {
    console.log('Data channel opened');
};

dataChannel.onmessage = (event) => {
    alert('Recieved: ' + event.data);
};

sendButton.addEventListener('click', () => {
    const recipientIP = recipientIPInput.value;
    const message = messageInput.value;
    dataChannel.send(message);
    messageInput.value = '';
});


const ws = new WebSocket('ws://your-websocket-server-ip:port');

ws.onopen = () => {
    console.log('WebSocket connection opened');
};

ws.onmessage = (event) => {
    const recipientIP = recipientIPInput.value;
    ws.send(JSON.stringify({ recipientIP, message: messageInput.value }));
};

ws.onclose = () => {
    console.log('WebSocket connection closed');
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};