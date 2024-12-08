class Eliza {
    constructor() {
        // Initialize chat history
        this.chatHistory = document.getElementById('chat-history');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-button');

        // Add patterns array after existing constructor code
        this.patterns = [
            {
                pattern: /.*(hello|hi|hey).*/i,
                response: [
                    "Hello. Please tell me what's on your mind.",
                    "Hi. How are you feeling today?",
                    "How do you do. What would you like to discuss?"
                ]
            }
        ];

        // Add default responses
        this.defaultResponses = [
            "Please go on.",
            "Tell me more about that.",
            "I see.",
            "Very interesting.",
            "I understand.",
            "Can you elaborate on that?"
        ];

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
        const response = this.generateResponse(input);
        setTimeout(() => this.addMessage(response, 'eliza'), 500);
        this.userInput.value = '';
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        this.chatHistory.appendChild(messageDiv);
        this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
    }

    // Add generateResponse method
    generateResponse(input) {
        // Try to match input against patterns
        for (const {pattern, response} of this.patterns) {
            const match = input.match(pattern);
            if (match) {
                return response[Math.floor(Math.random() * response.length)];
            }
        }

        // If no pattern matches, use default response
        return this.defaultResponses[
            Math.floor(Math.random() * this.defaultResponses.length)
        ];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Eliza();
}); 