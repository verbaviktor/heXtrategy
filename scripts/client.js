const socket = new WebSocket('ws://127.0.0.1:6969');

// Add event listeners to handle WebSocket events
socket.onopen = function (event) {
    console.log('WebSocket connection opened.');
    if (socket.readyState === WebSocket.OPEN) {
        socket.send("getPlayerID");
        console.log('Package sent');
    } else {
        console.error('WebSocket connection is not open.');
    }
    // You can send an initial message or request game data here
};

socket.onmessage = function (event) {
    // Handle incoming messages from the server
    const message = JSON.parse(event.data);
    console.log(message);
    // Implement your game logic based on the received data
};

socket.onclose = function (event) {
    if (event.wasClean) {
        console.log('WebSocket connection closed cleanly, code=' + event.code + ', reason=' + event.reason);
    } else {
        console.error('WebSocket connection abruptly closed.');
    }
};