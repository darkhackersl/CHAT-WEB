// Chat Persistence
function saveChatHistory() {
    const chatBox = document.getElementById("chat-box");
    localStorage.setItem("chatHistory", chatBox.innerHTML);
}

function loadChatHistory() {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = localStorage.getItem("chatHistory") || "";
}

window.onload = loadChatHistory;
window.onunload = saveChatHistory;

// Send Message
document.getElementById("send-btn").addEventListener("click", async () => {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    appendMessage("user", userInput);

    // Show Typing Indicator
    const chatBox = document.getElementById("chat-box");
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("typing-indicator");
    typingIndicator.textContent = "AI is typing...";
    chatBox.appendChild(typingIndicator);

    try {
        const response = await fetch(`https://www.dark-yasiya-api.site/ai/chatgpt?q=${encodeURIComponent(userInput)}`);
        const data = await response.json();

        chatBox.removeChild(typingIndicator);
        appendMessage("ai", data.result || "Sorry, I couldn't understand that.");
    } catch (error) {
        chatBox.removeChild(typingIndicator);
        appendMessage("ai", "Error: Unable to connect to the AI server.");
    }
});

// Voice Input
document.getElementById("voice-btn").addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
        const userInput = document.getElementById("user-input");
        userInput.value = event.results[0][0].transcript;
    };
});

// Theme Toggle Logic
const themeToggleButton = document.getElementById("theme-toggle");

themeToggleButton.addEventListener("click", () => {
    // Toggle dark and light theme classes
    document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme");

    // Save the current theme to localStorage for persistence
    const currentTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
    localStorage.setItem("theme", currentTheme);
});

// Load theme preference on page load
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light"; // Default to light
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.add("light-theme");
    }
});

// Change Language Based on User Selection
function changeLanguage(lang) {
    // This would trigger the translation API or language-specific responses
    document.documentElement.lang = lang;
    // Example: Adjust chat responses or translate messages
    // languageAPI.translate(userInput, lang);
}
// Example of using Google Translate API
async function translateText(text, targetLang) {
    const response = await fetch('https://translation.googleapis.com/language/translate/v2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_GOOGLE_API_KEY',
        },
        body: JSON.stringify({
            q: text,
            target: targetLang,
        }),
    });
    const data = await response.json();
    return data.data.translations[0].translatedText;
}

// Function to save user profile data (name, avatar) in localStorage
function saveProfile() {
    const name = document.getElementById('name').value;
    const avatarFile = document.getElementById('avatar').files[0];

    if (name) {
        // Save the name in localStorage
        localStorage.setItem('userName', name);
    }

    if (avatarFile) {
        // Read and store avatar image if the user uploads one
        const reader = new FileReader();
        reader.onload = function (e) {
            localStorage.setItem('userAvatar', e.target.result);
            updateProfile();
        };
        reader.readAsDataURL(avatarFile);
    }

    // Hide the user profile form after saving
    document.querySelector('.user-profile').style.display = 'none';

    // Update profile display after saving
    updateProfile();
}

// Function to load and display the saved user profile (name, avatar) from localStorage
function loadProfile() {
    const userName = localStorage.getItem('userName');
    const userAvatar = localStorage.getItem('userAvatar');

    if (userName) {
        // Display the user's name
        document.getElementById('user-name-display').textContent = `Hello, ${userName}!`;
    }

    if (userAvatar) {
        // Display the user's avatar
        document.getElementById('avatar-display').src = userAvatar;
    }
}

// Function to update profile display on the webpage (called after saving or loading profile)
function updateProfile() {
    const userName = localStorage.getItem('userName');
    const userAvatar = localStorage.getItem('userAvatar');

    // If the profile data exists, display it in the profile section
    if (userName) {
        document.getElementById('user-name-display').textContent = `Hello, ${userName}!`;
    }

    if (userAvatar) {
        document.getElementById('avatar-display').src = userAvatar;
    }
}

// Event listener to load the profile when the page loads
window.addEventListener('load', loadProfile);

// Function to handle the user input and chatbot response (personalized)
/*function chatWithBot(userInput) {
    const userName = localStorage.getItem('userName') || 'Guest';
    let result = '';*/

    // Personalized response based on the user's name
   /* if (userInput.toLowerCase().includes('hello')) {
        result = `Hello, ${userName}! How can I assist you today?`;
    } else if (userInput.toLowerCase().includes('how are you')) {
        result = `I'm doing great, ${userName}! How about you?`;
    } else {
        result = `Sorry, ${userName}, I didn't quite catch that. Can you rephrase your question?`;
    }*/

    // Display the chatbot's response
   /* document.getElementById('chat-box').innerHTML += `<div class="bot-response">${result}</div>`;
}*/

// Example: Simulate a user typing and the bot responding
document.getElementById('send-btn').addEventListener('click', function () {
    const userInput = document.getElementById('user-input').value;
    chatWithBot(userInput);
    document.getElementById('user-input').value = ''; // Clear the input field
});

// Function to reset the user profile (optional feature)
function resetProfile() {
    localStorage.removeItem('userName');
    localStorage.removeItem('userAvatar');
    loadProfile();
}

// Event listener for the reset profile button (if you want to add this feature)
document.getElementById('reset-profile-btn').addEventListener('click', resetProfile);


// Event listener for the reset profile button (if you want to add this feature)
document.getElementById('reset-profile-btn').addEventListener('click', resetProfile);

// Example using a sentiment analysis library or API
async function detectEmotion(text) {
    const response = await fetch('https://api.some-sentiment-analysis-api.com', {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return data.sentiment;  // Example: 'positive', 'negative', 'neutral'
}

// Use the detected emotion to customize the chatbot's response
async function generateResponse(userInput) {
    const sentiment = await detectEmotion(userInput);
    
    let response = '';

    if (sentiment === 'positive') {
        response = 'I am glad to hear that! 😊';
    } else if (sentiment === 'negative') {
        response = 'I’m sorry to hear that. 😢 How can I help?';
    } else {
        response = 'Thanks for sharing! How can I assist you today?';
    }

    // Display response
    document.getElementById('chat-box').innerHTML += `<div class="bot-response">${response}</div>`;
}


// Append Message
function appendMessage(sender, text) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", sender);
    messageElement.textContent = text;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Quick Replies
function quickReply(message) {
    const userInput = document.getElementById("user-input");
    userInput.value = message;
    document.getElementById("send-btn").click();
}
