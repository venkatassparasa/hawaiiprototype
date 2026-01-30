// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// TVR/STR knowledge base responses
const knowledgeBase = {
  // Registration questions
  registration: [
    {
      keywords: ['register', 'registration', 'apply', 'application'],
      response: "To register a TVR (Transient Vacation Rental) in Hawaii County, you need to submit an application to the Planning Department. The registration process includes property verification, zoning compliance check, and payment of registration fees. You can find the application forms on the Hawaii County website or visit the Planning Department office."
    },
    {
      keywords: ['fees', 'cost', 'payment'],
      response: "TVR registration fees vary based on property size and location. Current fees include a $500 application fee, annual registration fee of $250, and additional fees for NCUC (Nonconforming Use Certificate) if required. Fees must be paid at the time of application submission."
    }
  ],
  
  // Compliance questions
  compliance: [
    {
      keywords: ['compliance', 'rules', 'regulations'],
      response: "TVR compliance in Hawaii County is governed by Ordinance 25-50. Key requirements include: valid registration, adherence to occupancy limits, proper parking provisions, noise restrictions, and compliance with zoning laws. Properties must be inspected annually to maintain compliance."
    },
    {
      keywords: ['occupancy', 'occupants', 'capacity'],
      response: "Occupancy limits for TVRs depend on the zoning district and property size. Generally, R-1 zones allow 2 occupants per bedroom plus 2 additional occupants, R-2 zones allow different calculations, and commercial zones have specific requirements. Check your property's zoning classification for exact limits."
    }
  ],
  
  // Enforcement questions
  enforcement: [
    {
      keywords: ['violation', 'enforcement', 'penalty', 'fine'],
      response: "TVR violations can result in penalties ranging from $500 to $5,000 per day depending on the severity. Common violations include operating without registration, exceeding occupancy limits, and noise complaints. Enforcement actions may include notices, fines, suspension, or revocation of registration."
    },
    {
      keywords: ['complaint', 'report'],
      response: "To file a complaint about a TVR violation, contact the Hawaii County Planning Department or use the online complaint system. Provide the property address, nature of the violation, and any supporting evidence. Complaints are investigated within 5-10 business days."
    }
  ],
  
  // Ordinance questions
  ordinance: [
    {
      keywords: ['ordinance 25-50', 'law', 'statute'],
      response: "Ordinance 25-50 is Hawaii County's primary legislation governing Transient Vacation Rentals. It establishes registration requirements, operational standards, enforcement procedures, and penalties. The ordinance references Hawaii County Zoning Code Sections 25-4-16 through 25-4-16.3 for specific zoning requirements."
    },
    {
      keywords: ['zoning', 'zoning code', '25-4-16'],
      response: "Hawaii County Zoning Code Sections 25-4-16 through 25-4-16.3 specifically address TVR regulations. These sections define where TVRs are permitted, set operational standards, establish parking requirements, and outline development standards for different zoning districts."
    }
  ]
};

// Out of scope responses
const outOfScopeResponses = [
  "I can only help with TVR/STR (Transient Vacation Rental/Short Term Rental) questions related to Hawaii County. For other county services, please visit the main Hawaii County website.",
  "My knowledge is limited to TVR registration, compliance, and enforcement in Hawaii County. For general county information, please contact the appropriate department directly.",
  "I'm specifically designed to answer questions about Ordinance 25-50 and TVR regulations. For other topics, you may want to check the Hawaii County website or call the main information line."
];

export const mockChatbotService = {
  // Send message and get response
  async sendMessage(message, conversationId = null) {
    await delay(1500); // Simulate thinking time
    
    const lowerMessage = message.toLowerCase();
    
    // Check for TVR/STR related keywords
    const tvrKeywords = ['tvr', 'str', 'transient vacation rental', 'short term rental', 'rental', 'vacation rental', 'ordinance 25-50', 'zoning', 'registration', 'compliance', 'enforcement'];
    const isTvrRelated = tvrKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (!isTvrRelated) {
      return {
        success: true,
        data: {
          message: outOfScopeResponses[Math.floor(Math.random() * outOfScopeResponses.length)],
          conversationId: conversationId || 'conv_' + Date.now(),
          timestamp: new Date().toISOString(),
          isOutOfScope: true
        }
      };
    }
    
    // Search knowledge base for relevant response
    let response = "I'm here to help with TVR/STR questions in Hawaii County. Could you be more specific about what you'd like to know regarding registration, compliance, enforcement, or Ordinance 25-50?";
    
    // Search through knowledge base
    for (const category of Object.values(knowledgeBase)) {
      for (const item of category) {
        if (item.keywords.some(keyword => lowerMessage.includes(keyword))) {
          response = item.response;
          break;
        }
      }
      if (response !== item.response) break;
    }
    
    // Add specific responses for common questions
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      response = "Hello! I'm your TVR/STR assistant for Hawaii County. I can help you with questions about registration, compliance, enforcement, and Ordinance 25-50. What would you like to know?";
    }
    
    if (lowerMessage.includes('thank')) {
      response = "You're welcome! If you have more questions about TVR regulations in Hawaii County, feel free to ask.";
    }
    
    return {
      success: true,
      data: {
        message: response,
        conversationId: conversationId || 'conv_' + Date.now(),
        timestamp: new Date().toISOString(),
        isOutOfScope: false
      }
    };
  },
  
  // Get conversation history (mock)
  async getConversationHistory(conversationId) {
    await delay(300);
    return {
      success: true,
      data: {
        conversationId,
        messages: [] // In a real implementation, this would return actual history
      }
    };
  },
  
  // Start new conversation
  async startConversation() {
    await delay(200);
    return {
      success: true,
      data: {
        conversationId: 'conv_' + Date.now(),
        welcomeMessage: "Hello! I'm your TVR/STR assistant for Hawaii County. I can help you with questions about registration, compliance, enforcement, and Ordinance 25-50. What would you like to know?"
      }
    };
  }
};
