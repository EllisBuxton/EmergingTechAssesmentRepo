class Eliza {
    constructor() {
        // Initialize chat history
        this.chatHistory = document.getElementById('chat-history');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-button');

        // Bind event listeners
        this.sendButton.addEventListener('click', () => this.handleUserInput());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserInput();
        });

        // Show initial greeting
        this.addMessage("Hello! I'm ELIZA, a virtual psychotherapist. How are you feeling today?", 'eliza');
    }

    handleUserInput() {
        const input = this.userInput.value.trim();
        if (input === '') return;
        
        this.addMessage(input, 'user');
        this.userInput.value = '';
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        this.chatHistory.appendChild(messageDiv);
        this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Eliza();
}); 