// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Comprehensive TVR/STR knowledge base responses
const knowledgeBase = {
  // Registration questions
  registration: [
    {
      keywords: ['register', 'registration', 'apply', 'application'],
      response: "To register a TVR (Transient Vacation Rental) in Hawaii County, you need to submit an application to the Planning Department. The registration process includes: 1) Property verification and zoning compliance check, 2) NCUC (Nonconforming Use Certificate) if required, 3) Payment of registration fees ($500 application fee + $250 annual fee), 4) Annual inspection requirement. Applications are available on the Hawaii County website or at the Planning Department office."
    },
    {
      keywords: ['fees', 'cost', 'payment'],
      response: "TVR registration fees include: $500 application fee (non-refundable), $250 annual registration fee, NCUC processing fee of $1,000 if required, and inspection fees starting at $150. All fees must be paid at the time of application submission. Late registration penalties may apply if operating without proper registration."
    },
    {
      keywords: ['ncuc', 'nonconforming', 'certificate'],
      response: "NCUC (Nonconforming Use Certificate) is required for TVRs in areas where vacation rentals weren't permitted when current zoning was adopted. The NCUC process costs $1,000 and requires proof that the TVR existed prior to the zoning change. Properties in R-1, R-2, and R-3 residential zones typically need NCUC approval."
    },
    {
      keywords: ['inspection', 'inspect', 'safety'],
      response: "Annual inspections are required for all TVR registrations. Inspections cover: 1) Safety equipment (smoke detectors, fire extinguishers), 2) Parking compliance, 3) Occupancy limits, 4) Building code compliance. Inspection fees start at $150. Failed inspections require corrections within 30 days to maintain registration."
    }
  ],
  
  // Compliance questions
  compliance: [
    {
      keywords: ['compliance', 'rules', 'regulations'],
      response: "TVR compliance in Hawaii County is governed by Ordinance 25-50 and Zoning Code Sections 25-4-16 through 25-4-16.3. Key requirements include: valid registration display, occupancy limits (2 per bedroom + 2), parking requirements (1 space per bedroom + 1), noise restrictions (quiet hours 10pm-7am), and annual inspections. Non-compliance can result in fines up to $5,000 per day."
    },
    {
      keywords: ['occupancy', 'occupants', 'capacity'],
      response: "Occupancy limits are strictly enforced: R-1 zones allow 2 occupants per bedroom plus 2 additional, R-2 zones allow 2 occupants per bedroom plus 4 additional, and commercial zones follow building code limits. Children under 12 count as half occupants. Maximum occupancy cannot exceed 12 people regardless of bedroom count."
    },
    {
      keywords: ['parking', 'parking requirements'],
      response: "Parking requirements per Zoning Code 25-4-16.2: 1 covered parking space per bedroom plus 1 additional space. Parking must be on-site and properly surfaced. Street parking is not counted toward requirements. Properties without adequate parking may be denied registration or face enforcement action."
    },
    {
      keywords: ['noise', 'quiet hours', 'disturbance'],
      response: "Noise restrictions apply to all TVRs: Quiet hours are 10:00 PM to 7:00 AM. Outdoor activities must be conducted at reasonable volumes. Multiple noise complaints can trigger enforcement action and possible registration suspension. Properties must provide guests with noise policy information."
    },
    {
      keywords: ['signage', 'display', 'registration number'],
      response: "All TVRs must display their registration number prominently on the property exterior. The sign must be at least 12x12 inches, clearly visible from the street, and include the TVR registration number and emergency contact information. Failure to display registration can result in $500 fines."
    }
  ],
  
  // Enforcement questions
  enforcement: [
    {
      keywords: ['violation', 'enforcement', 'penalty', 'fine'],
      response: "TVR violations under Ordinance 25-50 carry significant penalties: Operating without registration ($500-$5,000 per day), exceeding occupancy ($500-$2,000 per violation), inadequate parking ($500-$1,000), noise violations ($250-$1,000), and failure to display registration ($500). Repeat offenses can result in registration suspension or revocation."
    },
    {
      keywords: ['complaint', 'report'],
      response: "To file a TVR complaint: 1) Call Planning Department at (808) 961-8285, 2) Use online complaint form at hawaiicounty.gov, 3) Email planning@hawaiicounty.gov, or 4) Visit the Aupuni Center in Hilo. Include property address, violation details, and evidence. Complaints are investigated within 5-10 business days."
    },
    {
      keywords: ['suspension', 'revocation', 'appeal'],
      response: "TVR registration can be suspended for 30-90 days for serious violations or revoked for repeated offenses. Property owners have 15 days to appeal enforcement actions to the Planning Director. Appeals must be filed in writing with supporting evidence and appeal fee of $250."
    }
  ],
  
  // Ordinance questions
  ordinance: [
    {
      keywords: ['ordinance 25-50', 'law', 'statute'],
      response: "Ordinance 25-50 is Hawaii County's comprehensive TVR legislation enacted in 2018. Key provisions: Mandatory registration system, NCUC requirements for nonconforming uses, occupancy and parking standards, enforcement procedures, penalty structure, and annual inspection requirements. The ordinance references Hawaii Revised Statutes §46-7.5 and Zoning Code Sections 25-4-16 through 25-4-16.3."
    },
    {
      keywords: ['zoning', 'zoning code', '25-4-16'],
      response: "Hawaii County Zoning Code Sections 25-4-16 through 25-4-16.3 govern TVRs: 25-4-16 defines TVRs and permitted districts, 25-4-16.1 establishes registration requirements, 25-4-16.2 sets parking and development standards, 25-4-16.3 outlines enforcement procedures. TVRs are permitted in R-1, R-2, R-3 (with NCUC), and all commercial districts."
    },
    {
      keywords: ['hawaii revised statutes', 'hrs', 'state law'],
      response: "Hawaii Revised Statutes §46-7.5 authorizes counties to regulate TVRs. State law requires counties to establish registration systems, enforcement procedures, and allow TVRs in resort districts and some residential areas. County ordinances must be consistent with state law but can be more restrictive."
    },
    {
      keywords: ['definitions', 'terms', 'meaning'],
      response: "Key definitions from Ordinance 25-50: TVR = rental of residential property for less than 30 consecutive days, Transient = stays less than 30 days, NCUC = Nonconforming Use Certificate for legal nonconforming uses, Registration Certificate = annual permit to operate TVR. Full definitions available in Ordinance 25-50, Section 2."
    }
  ],

  // Property specific questions
  property: [
    {
      keywords: ['residential', 'r-1', 'r-2', 'r-3'],
      response: "TVR zoning requirements: R-1 (Single Family) - NCUC required, max 2 occupants/bedroom + 2, 1 parking/bedroom + 1. R-2 (Two Family) - NCUC required, max 2 occupants/bedroom + 4, 1 parking/bedroom + 1. R-3 (Multi-Family) - NCUC required, 2 occupants/bedroom + 4, 1 parking/bedroom + 1. All residential zones require annual inspections."
    },
    {
      keywords: ['commercial', 'resort', 'business'],
      response: "TVRs in commercial and resort districts have fewer restrictions: No NCUC required, occupancy follows building code, parking per commercial standards, annual inspections still required. Resort districts include Waikoloa, Mauna Lani, and Kailua-Kona resort areas."
    },
    {
      keywords: ['agricultural', 'ag', 'farm'],
      response: "TVRs in agricultural districts require Special Use Permit. Agricultural properties must maintain primary agricultural use and cannot be operated primarily as vacation rentals. Additional requirements include minimum lot sizes and agricultural activity documentation."
    }
  ],

  // Process and timeline questions
  process: [
    {
      keywords: ['timeline', 'how long', 'process'],
      response: "TVR registration timeline: Application submission (1-2 weeks review), NCUC processing (4-6 weeks if required), Inspection scheduling (1-2 weeks), Final approval (1 week). Total process typically 6-10 weeks for properties requiring NCUC, 2-4 weeks for conforming properties."
    },
    {
      keywords: ['eta', 'completion', 'when will', 'how long until', 'estimated time'],
      response: "Once you submit your TVR registration application, the estimated time to completion is: 2-4 weeks for properties in commercial zones (no NCUC required), or 6-10 weeks for properties in residential zones requiring NCUC approval. The timeline includes application review, any required NCUC processing, inspection scheduling, and final approval."
    },
    {
      keywords: ['renewal', 'expire', 'annual'],
      response: "TVR registrations expire annually on the anniversary date. Renewal requires: $250 fee, updated property information, and passing annual inspection. Renewal applications should be submitted 30 days before expiration to avoid lapse in registration."
    }
  ],

  // Tax registration requirements
  tax: [
    {
      keywords: ['tax', 'taxation', 'hrs 237d', 'transient accommodations tax', 'tat'],
      response: "TVR operators must register for Hawaii Transient Accommodations Tax (TAT) under HRS Chapter 237D. Requirements: 1) Register with Department of Taxation within 20 days of first rental, 2) File periodic TAT returns (monthly/quarterly), 3) Collect 10.25% TAT from guests, 4) Keep detailed rental records for 3 years. Registration available at tax.hawaii.gov."
    },
    {
      keywords: ['general excise tax', 'get', 'ge tax'],
      response: "TVR operators must also register for General Excise Tax (GET) - currently 4% county rate + 0.5% county surcharge. GET applies to gross rental income before TAT. Registration required through Department of Taxation's BB-1 packet. Both GET and TAT must be filed separately."
    },
    {
      keywords: ['third party', 'airbnb', 'vrbo', 'booking.com', 'rent collector'],
      response: "Third-party rent collectors (Airbnb, VRBO, etc.) must disclose rental information to property owners under HRS 237D-8.5. They must provide: 1) Gross rental amounts, 2) Taxes collected on behalf, 3) Number of rental days, 4) Property identification. Property owners need this information for accurate tax filing."
    },
    {
      keywords: ['tax id', 'tax identification', 'employer id', 'fein'],
      response: "TVR operators need a Federal Employer Identification Number (FEIN) for tax purposes, even if no employees. Apply online at IRS.gov (Form SS-4). FEIN required for TAT/GET registration and opening business bank accounts for rental income."
    }
  ],

  // Property information and research
  propertyResearch: [
    {
      keywords: ['property search', 'property information', 'real property', 'tax records'],
      response: "Research property information using Hawaii County's Real Property Tax website at qpublic.schneidercorp.com (Application ID 1048). You can find: property ownership, tax map keys, zoning classification, assessed values, and property boundaries. This helps determine TVR eligibility and requirements."
    },
    {
      keywords: ['gis', 'mapping', 'zoning map', 'parcel map'],
      response: "Use Hawaii County's Public GIS portal at gis.hawaiicounty.gov (Web App Viewer ID 9b151ed79941489a8d360f79660c29ac) to view: zoning districts, property boundaries, flood zones, infrastructure, and planning layers. This helps verify zoning compliance and identify any restrictions affecting TVR operations."
    },
    {
      keywords: ['tax map key', 'tmk', 'parcel number'],
      response: "Find your Tax Map Key (TMK) on property tax documents or the Real Property Tax website. TMK format: 3-4-XXX-XXX-XXX (district-zone-section-plot). TMK is required for TVR applications and helps determine zoning, property boundaries, and compliance requirements."
    },
    {
      keywords: ['qpublic', 'schneidercorp', 'property ownership'],
      response: "Find property ownership information on Hawaii County's Real Property Tax website at qpublic.schneidercorp.com (Application ID 1048). Search by address, owner name, or Tax Map Key to find current ownership, assessed values, and property details. This information helps verify TVR eligibility and compliance requirements."
    },
    {
      keywords: ['property ownership'],
      response: "Find property ownership information on Hawaii County's Real Property Tax website at qpublic.schneidercorp.com (Application ID 1048). Search by address, owner name, or Tax Map Key to find current ownership, assessed values, and property details. This information helps verify TVR eligibility and compliance requirements."
    },
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
    const tvrKeywords = ['tvr', 'str', 'transient vacation rental', 'short term rental', 'rental', 'vacation rental', 'ordinance 25-50', 'zoning', 'registration', 'compliance', 'enforcement', 'ncuc', 'fees', 'occupancy', 'parking', 'noise', 'violation', 'complaint', 'inspection', 'renewal', 'tax', 'tat', 'get', 'property search', 'gis', 'tmk', 'tax map key', 'r-1', 'r-2', 'r-3', 'agricultural', 'commercial', 'residential', 'fein', 'employer identification', 'qpublic', 'schneidercorp', 'building permit', 'property tax', 'school district'];
    const isTvrRelated = tvrKeywords.some(keyword => lowerMessage.includes(keyword));
    
    // Specific out-of-scope business question
    if (lowerMessage.includes('starting a business') && !lowerMessage.includes('tvr') && !lowerMessage.includes('rental')) {
      return {
        success: true,
        data: {
          message: "I can only help with TVR/STR (Transient Vacation Rental/Short Term Rental) questions related to Hawaii County. For general business registration questions, please contact the Hawaii County Department of Business Development or visit the main Hawaii County website.",
          conversationId: conversationId || 'conv_' + Date.now(),
          timestamp: new Date().toISOString(),
          isOutOfScope: true
        }
      };
    }
    
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
    let response = "I'm here to help with TVR/STR questions in Hawaii County. I can assist with registration requirements, compliance rules, enforcement procedures, Ordinance 25-50, zoning codes, tax requirements, and property research. What would you like to know?";
    
    // Search through knowledge base
    for (const category of Object.values(knowledgeBase)) {
      for (const item of category) {
        if (item.keywords.some(keyword => lowerMessage.includes(keyword))) {
          response = item.response;
          break;
        }
      }
      if (response !== "I'm here to help with TVR/STR questions in Hawaii County. I can assist with registration requirements, compliance rules, enforcement procedures, Ordinance 25-50, zoning codes, tax requirements, and property research. What would you like to know?") break;
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
