# Architecture Analysis & Implementation Plan

## Current Architecture Overview

### Frontend Framework & Stack
- **Framework**: React 19.2.0 with Vite
- **UI Library**: Tailwind CSS + custom components
- **Routing**: React Router DOM v7
- **State Management**: React Context (RoleContext)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion

### Project Structure
```
src/
├── components/
│   ├── layout/ (Layout, Sidebar, Header)
│   ├── auth/ (Login)
│   ├── dashboard/
│   ├── reports/ (basic Reports component)
│   ├── properties/
│   ├── enforcement/
│   ├── complaints/
│   ├── inspections/
│   ├── registration/
│   ├── appeals/
│   ├── renewals/
│   ├── public/
│   └── settings/
├── context/
│   └── RoleContext.jsx
├── assets/
└── main.jsx
```

### Authentication & Authorization
- **Auth System**: Role-based access control using React Context
- **Roles**: Admin, Enforcement Officer, Finance, Planning, Legal, Public
- **Protected Routes**: Implemented via ProtectedRoute component
- **Route Protection**: Role-based visibility in Sidebar and route definitions

### Current Reports Module
- **Location**: `/src/components/reports/Reports.jsx`
- **Functionality**: Static dashboard with charts (compliance trends, violation breakdown)
- **Technology**: Recharts for visualization
- **Limitations**: No dynamic reporting, no data source configuration, no export functionality

### Backend Integration
- **Current State**: No backend integration detected (no axios/fetch calls for APIs)
- **Data**: Currently using hardcoded/mock data
- **API Pattern**: Needs to be established

## Implementation Plan

### Phase 1: Foundation Setup
1. **Create Knowledge folder** with implementation documents
2. **Add required dependencies** for drag-drop, PDF/CSV export, and chatbot
3. **Establish API layer** with proper error handling and validation
4. **Create data models** for reports and chatbot

### Phase 2: Custom Reporting Module

#### 2.1 UI Components
- **Reports Dashboard**: List existing reports, create new button
- **Report Builder**: Visual drag-drop interface
- **Report Preview**: Paginated table with export options
- **Data Source Configuration**: Dropdown with dynamic field loading
- **Filter Builder**: Visual condition builder with AND/OR grouping

#### 2.2 Backend APIs
- **Data Sources**: `GET /reporting/sources` - list available sources and schemas
- **Report Preview**: `POST /reporting/preview` - execute report with pagination
- **Export Endpoints**: `POST /reporting/export/csv`, `POST /reporting/export/pdf`
- **CRUD Operations**: Full CRUD for report definitions
- **Security**: Input validation, SQL injection prevention, rate limiting

#### 2.3 Data Sources to Support
- TVR Registry records
- Complaints
- Inspections
- Enforcement actions
- Users
- Properties
- Payments

### Phase 3: Chatbot Implementation

#### 3.1 UI Components
- **Floating Chat Button**: Fixed position on right edge of viewport
- **Chat Panel**: Modal/drawer with conversation history
- **Message Components**: User and assistant message styling
- **Typing Indicator**: Loading state for bot responses

#### 3.2 Backend Implementation
- **Chat Endpoint**: `POST /chatbot/message`
- **Scope Control**: Strict system prompt limiting to TVR/STR topics
- **Knowledge Base**: Ordinance 25-50 and Zoning Code 25-4-16 to 25-4-16.3
- **Conversation Management**: Session handling and context

#### 3.3 Scope Enforcement
- TVR registration/compliance/enforcement only
- Ordinance 25-50 references
- Hawaii County Zoning Code sections
- Polite refusal for out-of-scope questions

### Phase 4: Integration & Security

#### 4.1 Role-Based Access
- **Reporting**: Admin, Enforcement Officer, Finance, Planning, Legal roles
- **Chatbot**: Available to all users (public portal)
- **API Security**: Role validation on all endpoints

#### 4.2 Performance Considerations
- **Pagination**: Implement for report previews
- **Export Limits**: Maximum record limits for exports
- **Caching**: Cache data source schemas and report definitions
- **Rate Limiting**: Prevent abuse of chatbot and export features

## Technical Requirements

### New Dependencies Needed
```json
{
  "react-beautiful-dnd": "^13.1.1", // Drag and drop
  "jspdf": "^2.5.1", // PDF generation
  "html2canvas": "^1.4.1", // PDF export support
  "papaparse": "^5.4.1", // CSV parsing/export
  "axios": "^1.6.0", // HTTP client
  "date-fns": "^2.30.0", // Date utilities
  "react-window": "^1.8.8", // Virtual scrolling for large datasets
  "react-hot-toast": "^2.4.1" // Toast notifications
}
```

### File Structure Additions
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
│   │   └── MessageInput.jsx
├── services/
│   ├── api.js
│   ├── reportingService.js
│   └── chatbotService.js
├── utils/
│   ├── reportValidation.js
│   ├── exportUtils.js
│   └── chatbotUtils.js
└── hooks/
    ├── useReporting.js
    └── useChatbot.js
```

## Security Considerations

### Input Validation
- Sanitize all user inputs for report building
- Validate filter conditions against field types
- Prevent SQL injection through parameterized queries

### Access Control
- Role-based access to reporting features
- Rate limiting on export and chatbot endpoints
- Audit logging for report generation and chatbot usage

### Data Protection
- Maximum export size limits
- Pagination for large datasets
- Sensitive data filtering based on user roles

## Next Steps

1. **Immediate**: Create Knowledge folder and add dependencies
2. **Week 1**: Implement reporting UI components and basic API structure
3. **Week 2**: Complete reporting backend and chatbot UI
4. **Week 3**: Implement chatbot backend and integrate everything
5. **Week 4**: Testing, documentation, and deployment preparation

This plan ensures clean integration with existing architecture while adding the requested features with proper security and performance considerations.
