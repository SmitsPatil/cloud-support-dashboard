import './style.css';

// API Configuration
const AWS_ENDPOINT = 'https://9htr20gx65.execute-api.ap-southeast-1.amazonaws.com/chat';
const GEMINI_API_KEY = 'GEMINI_API_KEY';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// DOM Elements
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const typingIndicatorContainer = document.getElementById('typing-indicator-container');
const processingText = document.getElementById('processing-text');
const sendBtn = document.getElementById('send-btn');

// Initialize Lucide Icons
lucide.createIcons();

/**
 * Handle user message submission
 */
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const message = chatInput.value.trim();
  if (!message) return;

  // Clear input and show user message
  chatInput.value = '';
  addMessage(message, 'user');
  
  // Disable input and send button
  setLoadingState(true);

  try {
    // Phase 1: AWS API Integration
    updateProcessingStatus('Fetching ticket data from AWS Backend...');
    const awsResponse = await callAWSAPI(message);
    const rawReply = awsResponse.reply || "I'm sorry, I couldn't reach the ticket system.";

    // Phase 2: Gemini AI Enhancement
    updateProcessingStatus('Refining response with Gemini AI...');
    const enhancedReply = await callGeminiAI(rawReply);

    // Final Stage: Display response
    addMessage(enhancedReply, 'bot', true);
  } catch (error) {
    console.error('Error in chat flow:', error);
    addMessage("Something went wrong with our cloud systems. Please try again later.", 'bot');
  } finally {
    setLoadingState(false);
  }
});

/**
 * Call AWS backend API
 * @param {string} userMessage 
 * @returns {Promise<object>}
 */
async function callAWSAPI(userMessage) {
  try {
    const response = await fetch(AWS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userMessage })
    });

    if (!response.ok) throw new Error('AWS Gateway Error');
    return response.json();
  } catch (err) {
    console.warn('AWS API failed or CORS blocked. Using mock response for demonstration.');
    // Simulated AWS Logic for demonstration purposes
    if (userMessage.toLowerCase().includes('payment')) {
      return { reply: "Ticket created ID TKT-1234. Solution: User needs to verify billing address or contact bank for 'Declined' error code 51." };
    } else if (userMessage.toLowerCase().includes('login')) {
      return { reply: "Ticket ID TKT-5678. Status: Pending. Instruction: Reset MFA credentials for user." };
    }
    return { reply: "System: Request received. Ticket pending generation. General maintenance in progress." };
  }
}

/**
 * Call Gemini AI to refine the message
 * @param {string} rawMessage 
 * @returns {Promise<string>}
 */
async function callGeminiAI(rawMessage) {
  try {
    // We'll use a slightly more sophisticated prompt for better "wow" effect
    const payload = {
      contents: [{
        parts: [{
          text: `You are a high-end customer support concierge. 
Refine this technical backend log/response into a polished, friendly, and helpful message. 
Keep all Ticket IDs (like TKT-XXXX) and specific technical steps EXACTLY but present them clearly.

RAW DATA: "${rawMessage}"

OUTPUT (Concise, empathetic, professional):`
        }]
      }]
    };

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || rawMessage;
  } catch (err) {
    console.error('Gemini AI refinement failed:', err);
    return rawMessage;
  }
}

/**
 * Add a message bubble to the chat container
 */
function addMessage(text, sender, isEnhanced = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  
  // Bot avatar
  if (sender === 'bot') {
    const avatar = document.createElement('div');
    avatar.style.cssText = `
      width: 28px; height: 28px; 
      border-radius: 50%; 
      background: linear-gradient(135deg, #2563EB, #60A5FA); 
      margin-bottom: 4px;
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 14px; box-shadow: var(--shadow-sm);
    `;
    avatar.innerHTML = `<i data-lucide="bot" style="width: 16px;"></i>`;
    messageDiv.appendChild(avatar);
  }

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  if (sender === 'bot' && isEnhanced) {
    const badge = document.createElement('div');
    badge.className = 'ai-badge';
    badge.innerHTML = `<i data-lucide="sparkles" style="width: 12px;"></i> Enhanced by Gemini AI`;
    contentDiv.appendChild(badge);
  }
  
  // Highlighting ticket IDs with better contrast
  const formattedText = text.replace(/(TKT-\d+)/gi, '<strong class="ticket-id">$1</strong>');
  const textContent = document.createElement('div');
  textContent.innerHTML = formattedText;
  contentDiv.appendChild(textContent);
  
  const timeDiv = document.createElement('div');
  timeDiv.className = 'message-time';
  timeDiv.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  messageDiv.appendChild(contentDiv);
  messageDiv.appendChild(timeDiv);
  
  chatMessages.appendChild(messageDiv);
  lucide.createIcons();
  
  chatMessages.scrollTo({
    top: chatMessages.scrollHeight,
    behavior: 'smooth'
  });
}

/**
 * Handle loading UI state
 */
function setLoadingState(isLoading) {
  chatInput.disabled = isLoading;
  sendBtn.disabled = isLoading;
  typingIndicatorContainer.style.display = isLoading ? 'flex' : 'none';
  
  if (isLoading) {
    chatInput.placeholder = "Support is working... Please wait";
  } else {
    chatInput.placeholder = "Type your message here...";
    chatInput.focus();
  }
}

/**
 * Update processing progress text
 */
function updateProcessingStatus(status) {
  processingText.innerText = status;
}
