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
            },
            {
                pattern: /.*\b(i am|i'm)\s+(.*)/i,
                response: [
                    "How long have you been $2?",
                    "Do you believe it is normal to be $2?",
                    "Do you enjoy being $2?",
                    "Why do you think you're $2?"
                ]
            },
            {
                pattern: /.*\b(i feel|i am feeling)\s+(.*)/i,
                response: [
                    "Tell me more about feeling $2.",
                    "Do you often feel $2?",
                    "When do you usually feel $2?",
                    "What makes you feel $2?"
                ]
            },
            {
                pattern: /.*\b(i want|i need)\s+(.*)/i,
                response: [
                    "What would it mean to you if you got $2?",
                    "Why do you want $2?",
                    "What would you do if you got $2?",
                    "If you got $2, then what would you do?"
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
        if (input.match(/.*\b(goodbye|bye|quit|exit)\b.*/i)) {
            return "Goodbye. It was nice talking to you.";
        }

        for (const {pattern, response} of this.patterns) {
            const match = input.match(pattern);
            if (match) {
                let chosen = response[Math.floor(Math.random() * response.length)];
                // Replace placeholders with captured groups
                for (let i = 1; i < match.length; i++) {
                    chosen = chosen.replace(`$${i}`, match[i]);
                }
                return chosen;
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