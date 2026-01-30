# UI-Only Implementation Plan

## Updated Scope
**Focus**: Frontend UI Components only (no backend APIs)
**Backend**: Mock data and simulated responses for demonstration

## Phase 1: Dependencies & Setup

### Required Dependencies
```json
{
  "react-beautiful-dnd": "^13.1.1", // Drag and drop
  "jspdf": "^2.5.1", // PDF generation (client-side)
  "html2canvas": "^1.4.1", // PDF export support
  "papaparse": "^5.4.1", // CSV export
  "date-fns": "^2.30.0", // Date utilities
  "react-window": "^1.8.8", // Virtual scrolling
  "react-hot-toast": "^2.4.1" // Toast notifications
}
```

## Phase 2: Custom Reporting UI Components

### 2.1 Reports Dashboard (`/src/components/reporting/ReportsDashboard.jsx`)
- List existing reports (mock data)
- Create new report button
- Search and filter reports
- Report actions (edit, duplicate, delete)

### 2.2 Report Builder (`/src/components/reporting/ReportBuilder.jsx`)
- **Data Source Selector**: Dropdown with mock sources
- **Field Selector**: Drag-drop interface with react-beautiful-dnd
- **Filter Builder**: Visual condition builder
- **Save/Update Report**: Form with validation

### 2.3 Report Preview (`/src/components/reporting/ReportPreview.jsx`)
- Paginated table with mock data
- Export buttons (CSV/PDF - client-side)
- Applied filters summary
- Record count display

### 2.4 Supporting Components
- **DataSourceSelector.jsx**: Dropdown with field loading
- **FieldSelector.jsx**: Drag-drop field selection
- **FilterBuilder.jsx**: Visual filter conditions
- **ExportOptions.jsx**: Export format selection

## Phase 3: Chatbot UI Components

### 3.1 Floating Chat Button (`/src/components/chatbot/ChatButton.jsx`)
- Fixed position on right edge
- Always visible on all pages
- Click to open chat panel
- Unread message indicator

### 3.2 Chat Panel (`/src/components/chatbot/ChatPanel.jsx`)
- Modal/drawer overlay
- Conversation history
- New chat button
- Close button

### 3.3 Message Components
- **MessageList.jsx**: Scrollable message container
- **MessageInput.jsx**: Text input with send button
- **TypingIndicator.jsx**: Loading state

## Phase 4: Mock Data & Services

### 4.1 Mock Data Structure
```javascript
// Mock data sources
const mockDataSources = [
  {
    id: 'tvr_registry',
    name: 'TVR Registry',
    fields: [
      { id: 'property_id', name: 'Property ID', type: 'string' },
      { id: 'owner_name', name: 'Owner Name', type: 'string' },
      { id: 'registration_date', name: 'Registration Date', type: 'date' },
      { id: 'status', name: 'Status', type: 'string' },
      // ... more fields
    ]
  },
  // ... more sources
];

// Mock reports
const mockReports = [
  {
    id: '1',
    name: 'Active TVR Registrations',
    dataSource: 'tvr_registry',
    fields: ['property_id', 'owner_name', 'registration_date'],
    filters: [{ field: 'status', operator: 'equals', value: 'active' }],
    createdBy: 'Admin',
    createdAt: '2024-01-15'
  },
  // ... more reports
];
```

### 4.2 Mock Services
- **mockReportingService.js**: Simulated API calls with setTimeout
- **mockChatbotService.js**: Simulated chatbot responses
- **mockData.js**: Sample data for all sources

## Phase 5: Integration & Routing

### 5.1 Update App.jsx Routes
```javascript
// Add new routes
<Route path="/reports" element={<Reports />} />
<Route path="/reports/new" element={<ReportBuilder />} />
<Route path="/reports/:id/edit" element={<ReportBuilder />} />
<Route path="/reports/:id/preview" element={<ReportPreview />} />
```

### 5.2 Update Sidebar.jsx
- Add "Custom Reports" menu item
- Role-based visibility (non-public users)

### 5.3 Global Chatbot Integration
- Add ChatButton to Layout.jsx
- Ensure it appears on all pages

## File Structure (UI Only)
```
src/
├── components/
│   ├── reporting/
│   │   ├── ReportsDashboard.jsx
│   │   ├── ReportBuilder.jsx
│   │   ├── ReportPreview.jsx
│   │   ├── DataSourceSelector.jsx
│   │   ├── FieldSelector.jsx
│   │   ├── FilterBuilder.jsx
│   │   └── ExportOptions.jsx
│   ├── chatbot/
│   │   ├── ChatButton.jsx
│   │   ├── ChatPanel.jsx
│   │   ├── MessageList.jsx
│   │   ├── MessageInput.jsx
│   │   └── TypingIndicator.jsx
│   └── layout/
│       └── Layout.jsx (updated with ChatButton)
├── services/
│   ├── mockReportingService.js
│   ├── mockChatbotService.js
│   └── mockData.js
├── utils/
│   ├── exportUtils.js (client-side PDF/CSV)
│   └── validationUtils.js
└── hooks/
    ├── useReporting.js
    └── useChatbot.js
```

## Implementation Priority

### Week 1: Foundation
1. Add dependencies to package.json
2. Create mock data and services
3. Implement basic reporting components structure

### Week 2: Reporting UI
1. Complete ReportsDashboard
2. Implement ReportBuilder with drag-drop
3. Add FilterBuilder functionality
4. Implement ReportPreview with exports

### Week 3: Chatbot UI
1. Implement ChatButton and ChatPanel
2. Add message components
3. Integrate with Layout.jsx
4. Add mock chatbot responses

### Week 4: Polish & Integration
1. Add animations and transitions
2. Implement responsive design
3. Add error handling and loading states
4. Test and refine UX

## Mock Backend Behavior

### Reporting Service Simulation
- `getReports()`: Returns mock reports array
- `getDataSources()`: Returns available data sources
- `previewReport()`: Returns paginated mock data
- `saveReport()`: Simulates saving with validation
- `exportReport()`: Generates client-side CSV/PDF

### Chatbot Service Simulation
- `sendMessage()`: Returns scoped responses after delay
- Predefined responses for TVR/STR topics
- Polite refusal for out-of-scope questions
- Simulated typing indicator

## Export Implementation (Client-Side)

### CSV Export
- Use papaparse to convert data to CSV
- Download using blob and anchor tag

### PDF Export
- Use jspdf + html2canvas
- Convert table preview to PDF
- Include filters summary in header

This UI-only approach allows full frontend implementation with mock data, demonstrating all features while backend APIs can be added later.
