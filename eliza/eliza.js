// The code follows the core pattern-matching principles of the original ELIZA:
// Uses regular expressions for pattern matching
// Implements response templates with variables
// Maintains conversation context through simple substitution
// Key research papers to reference:
// Weizenbaum, J. (1966). "ELIZA—A Computer Program For the Study of Natural Language Communication Between Man and Machine"
// Colby, K. M. (1975). "Artificial Paranoia: A Computer Simulation of Paranoid Process"

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
            },
            {
                pattern: /.*\b(what|who|when|where|how|why)\s+(.*)/i,
                response: [
                    "Why do you ask?",
                    "What do you think?",
                    "Why does that interest you?",
                    "What answer would please you most?",
                    "What do you think about $2?"
                ]
            },
            {
                pattern: /.*\b(always|never)\b.*/i,
                response: [
                    "Can you think of a specific example?",
                    "Are you sure that's always/never true?",
                    "Is it really that absolute?",
                    "Can you think of any exceptions?",
                    "Perhaps there are some cases where that isn't true?"
                ]
            },
            {
                pattern: /.*\b(my mother|my father|my parents|mom|dad)\b.*/i,
                response: [
                    "Tell me more about your relationship with your $1.",
                    "How do you feel about your $1?",
                    "How does your relationship with your $1 affect your other relationships?",
                    "What's your earliest memory of your $1?",
                    "Has your relationship with your $1 changed over time?"
                ]
            },
            {
                pattern: /.*\b(depressed|sad|unhappy|miserable)\b.*/i,
                response: [
                    "I hear that you're feeling down.",
                    "That must be difficult to deal with.",
                    "I'm listening. Can you tell me more?",
                    "What do you think might help right now?",
                    "How long have you been feeling this way?"
                ]
            },
            {
                pattern: /.*\b(angry|mad|furious|upset)\b.*/i,
                response: [
                    "What makes you feel so angry?",
                    "When you feel this way, what do you usually do?",
                    "Has anyone else noticed your anger?",
                    "How do you typically handle your anger?",
                    "What would help you feel calmer right now?"
                ]
            },
            {
                pattern: /.*\b(because|cause)\b.*/i,
                response: [
                    "Is that the real reason?",
                    "What other reasons might there be?",
                    "Does that reason explain anything else?",
                    "What makes you think that's the cause?"
                ]
            },
            {
                pattern: /.*\b(dream|dreams|dreamt)\b.*/i,
                response: [
                    "What do you think that dream means?",
                    "Do you often remember your dreams?",
                    "How did that dream make you feel?",
                    "What images from that dream stood out to you?",
                    "Do you see any connection between your dreams and your life?"
                ]
            },
            {
                pattern: /.*\b(yes|yeah|yep)\b.*/i,
                response: [
                    "You seem quite certain about that.",
                    "Can you elaborate on that?",
                    "I see. Tell me more.",
                    "What makes you so sure?",
                    "And how does that make you feel?"
                ]
            },
            {
                pattern: /.*\b(no|nope|nah)\b.*/i,
                response: [
                    "Why not?",
                    "Are you sure?",
                    "What makes you say no?",
                    "Could you explain your reasoning?",
                    "Is there any situation where you might say yes?"
                ]
            },
            {
                pattern: /.*\b(friend|friends)\b.*/i,
                response: [
                    "Tell me more about your friends.",
                    "How do your friends influence your life?",
                    "What do you value most in friendship?",
                    "How do you feel about your friendships?",
                    "Do you find it easy to make friends?"
                ]
            },
            {
                pattern: /.*/,
                response: [
                    "Please tell me more about that.",
                    "How does that make you feel?",
                    "Can you elaborate on that?",
                    "Why do you say that?",
                    "I see. Go on.",
                    "That's interesting. Can you tell me more?",
                    "How do you feel when you think about that?",
                    "What does that suggest to you?",
                    "I understand. Please continue.",
                    "Does talking about this bring up any particular feelings?"
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

        // Add to constructor
        this.conversationContext = {
            mentionedTopics: new Set(),
            emotionalState: null,
            consecutiveNegatives: 0
        };
    }

    handleUserInput() {
        const input = this.userInput.value.trim();
        if (input === '') return;
        
        this.updateContext(input);
        this.addMessage(input, 'user');
        
        const response = this.generateResponse(input);
        const followUp = !response.includes('?') && Math.random() < 0.3 ? 
            this.getFollowUpQuestion() : null;
        
        setTimeout(() => {
            this.addMessage(response, 'eliza');
            if (followUp) {
                setTimeout(() => this.addMessage(followUp, 'eliza'), 1000);
            }
        }, 500);
        
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
                let selectedResponse = this.selectResponse(response, input);
                
                // Replace captured groups if they exist
                for (let i = 1; i < match.length; i++) {
                    selectedResponse = selectedResponse.replace(`$${i}`, match[i]);
                }
                
                return selectedResponse;
            }
        }

        return "I'm not sure I understand. Can you rephrase that?";
    }

    // Add this new method to improve response selection
    selectResponse(responses, input) {
        // Avoid repeating the last response if possible
        if (!this.lastResponse) {
            this.lastResponse = '';
        }
        
        let availableResponses = responses.filter(r => r !== this.lastResponse);
        if (availableResponses.length === 0) {
            availableResponses = responses;
        }
        
        const response = availableResponses[Math.floor(Math.random() * availableResponses.length)];
        this.lastResponse = response;
        return response;
    }

    // Add method to track context
    updateContext(input) {
        // Track mentioned topics
        const topics = ['family', 'work', 'health', 'relationships'].filter(topic => 
            input.toLowerCase().includes(topic)
        );
        topics.forEach(topic => this.conversationContext.mentionedTopics.add(topic));
        
        // Track emotional state
        const emotions = {
            positive: ['happy', 'glad', 'excited', 'relaxed', 'better'],
            negative: ['sad', 'angry', 'depressed', 'troubled']
        };
        
        let currentEmotion = null;
        for (const [state, words] of Object.entries(emotions)) {
            if (words.some(word => input.toLowerCase().includes(word))) {
                currentEmotion = state;
            }
        }
        
        // Update consecutive negatives counter
        if (currentEmotion === 'negative') {
            this.conversationContext.consecutiveNegatives++;
        } else {
            this.conversationContext.consecutiveNegatives = 0;
        }
        
        this.conversationContext.emotionalState = currentEmotion;
    }

    getFollowUpQuestion() {
        if (this.conversationContext.consecutiveNegatives >= 2) {
            return "Would you like to talk more about what's troubling you?";
        }
        if (this.conversationContext.mentionedTopics.has('family')) {
            return "How do your family relationships affect other areas of your life?";
        }
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Eliza();
}); 