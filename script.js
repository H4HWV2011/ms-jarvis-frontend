
## Complete JavaScript File Content

**INSTRUCTIONS FOR 100% ACCURACY:**
1. Press `Ctrl + A` (select all existing content)
2. Press `Delete` (clear the file completely)
3. Copy and paste this ENTIRE JavaScript file:

```javascript
// Ms. Jarvis - Appalachian Mountain Interface

class MountainJarvis {
    constructor() {
        // === CHANGE ONLY THIS LINE if backend URL changes ===
        this.apiBaseUrl = "https://api.mountainshares.us";
        this.userId = this.generateUserId();
        this.isConnected = false;
        this.messageCount = 0;

        // Initialize
        this.initializeElements();
        this.bindEvents();
        this.setupImageHandling();
        this.startMonitoring();

        console.log('🏔️ Mountain Jarvis initialized');
    }

    generateUserId() {
        return `mountain_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    initializeElements() {
        // Header elements
        this.mainAvatar = document.getElementById('mainAvatar');
        this.statusLight = document.getElementById('statusLight');
        this.statusMessage = document.getElementById('statusMessage');

        // Dashboard elements
        this.totalContracts = document.getElementById('totalContracts');
        this.healthyContracts = document.getElementById('healthyContracts');
        this.corruptedContracts = document.getElementById('corruptedContracts');
        this.treasuryHealth = document.getElementById('treasuryHealth');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.aiStatus = document.getElementById('aiStatus');

        // Chat elements
        this.chatAvatar = document.getElementById('chatAvatar');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.thinkingIndicator = document.getElementById('thinkingIndicator');
        this.clearChat = document.getElementById('clearChat');
    }

    bindEvents() {
        // Send message events
        this.sendBtn.addEventListener('click', () => this.sendMessage());

        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.autoResizeInput();
        });

        // Dashboard controls
        this.refreshBtn.addEventListener('click', () => {
            this.refreshBtn.style.transform =
