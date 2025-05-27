
var username = null;
var stompClient = null;

document.addEventListener('DOMContentLoaded', function() {
    let nome = prompt("Digite seu nome: ", "Anônimo").trim();
    username = nome;
    connect(nome);
});


function connect(username) {
    if(username) {
        var socket = new SockJS('http://localhost:8080/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}



function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);
    console.log("username: " + username)
    // Tell your username to the server
    stompClient.send("/app/addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )
}

function onMessageReceived(event) {
    console.log(event)
    let chat = document.getElementById("chat-container")
    let message = document.createElement("div")
    message.className = "message"
    let eventBody = JSON.parse(event.body);
    if (eventBody.type === "JOIN") {
        message.className = "message"
        message.innerHTML = `Usuário ${eventBody.sender} entrou!`
        chat.appendChild(message);
    } else {
        message.innerHTML = `[${eventBody.sender}] - ${eventBody.content}`
        chat.appendChild(message);
    }


}


function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}


function sendMessage(event) {
    const messageInput = document.getElementById('message-input');
    var messageContent = messageInput.value.trim();
    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}