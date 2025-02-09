let chatCode;
let userName;
let messageContainer = document.getElementById("messages");

// Navigation helper function
function navigateTo(page) {
    window.location.href = page;
}

// Generate a random chat code
function generateCode() {
    return Math.random().toString(36).substr(2, 6);
}

// Create a new chat room
function createChat() {
    userName = document.getElementById("create-name-input").value.trim();
    if (!userName) {
        alert("Please enter your name.");
        return;
    }

    chatCode = generateCode();
    localStorage.setItem("chat_" + chatCode, JSON.stringify([]));
    localStorage.setItem("user_name", userName);
    localStorage.setItem("chat_code", chatCode);

    alert(`Chat Created! Share this code: ${chatCode}`);
    navigateTo("chat.html");
}

// Join an existing chat
function joinChat() {
    userName = document.getElementById("join-name-input").value.trim();
    chatCode = document.getElementById("join-code-input").value.trim();

    if (!userName || !chatCode) {
        alert("Please enter your name and chat code.");
        return;
    }

    let existingChat = localStorage.getItem("chat_" + chatCode);
    if (!existingChat) {
        alert("Chat code not found.");
        return;
    }

    localStorage.setItem("user_name", userName);
    localStorage.setItem("chat_code", chatCode);
    navigateTo("chat.html");
}

// Send a message
function sendMessage() {
    let messageInput = document.getElementById("message-input");
    let message = messageInput.value.trim();

    if (!message) return;

    let userName = localStorage.getItem("user_name");
    let chatCode = localStorage.getItem("chat_code");
    let chatMessages = JSON.parse(localStorage.getItem("chat_" + chatCode)) || [];

    chatMessages.push({ user: userName, text: message });
    localStorage.setItem("chat_" + chatCode, JSON.stringify(chatMessages));

    displayMessages(chatMessages);
    messageInput.value = "";
}

// Display chat messages
function displayMessages(messages) {
    if (!messageContainer) return;

    messageContainer.innerHTML = "";
    messages.forEach(msg => {
        let msgDiv = document.createElement("div");
        msgDiv.classList.add("message");
        msgDiv.innerHTML = `<strong>${msg.user}:</strong> ${msg.text}`;
        messageContainer.appendChild(msgDiv);
    });
}

// Load chat messages on chat page
function loadChat() {
    let chatCode = localStorage.getItem("chat_code");
    document.getElementById("room-code").innerText = chatCode;

    let chatMessages = JSON.parse(localStorage.getItem("chat_" + chatCode)) || [];
    displayMessages(chatMessages);
}

// Auto-refresh messages every 2 seconds
function autoRefresh() {
    loadChat();
    setTimeout(autoRefresh, 2000);
}

// Run auto-refresh only on chat page
window.onload = function () {
    if (document.getElementById("room-code")) {
        autoRefresh();
    }
};

// Copy chat code to clipboard
function copyCode() {
    let code = localStorage.getItem("chat_code");
    navigator.clipboard.writeText(code);
    alert("Code copied!");
}
