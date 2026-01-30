# Workflow Status Integration with Listing Pages

## Overview
This guide explains how workflow status has been integrated into various listing pages throughout the TVR Compliance Dashboard, allowing users to easily track the progress of applications, complaints, violations, and other records through their respective Temporal workflows.

## Integration Components

### 1. WorkflowStatusBadge Component
**Location**: `src/components/workflows/WorkflowStatusBadge.jsx`

A reusable component that displays workflow status information for any record.

**Props**:
- `recordId`: The unique identifier of the record (e.g., "TVR-2026-001")
- `recordType`: The type of workflow (e.g., "tvr-registration", "complaint-investigation")
- `compact`: Whether to show compact view (default: false)
- `showProgress`: Whether to show progress bar (default: true)
- `className`: Additional CSS classes

**Features**:
- Real-time workflow status display
- Progress visualization
- Current step and assignee information
- Direct link to workflow details
- Error handling and loading states
- Responsive design

### 2. WorkflowDetailPanel Component
**Location**: `src/components/workflows/WorkflowDetailPanel.jsx`

A comprehensive panel for displaying detailed workflow information within detail pages.

**Props**:
- `recordId`: The unique identifier of the record
- `recordType`: The type of workflow
- `title`: Custom title for the panel (default: "Workflow Progress")
- `showFullDetails`: Whether to show complete workflow history (default: true)
- `className`: Additional CSS classes

**Features**:
- Complete workflow timeline
- Expandable history section
- Quick action buttons
- Progress visualization
- Integration with full workflow details

## Implemented Integrations

### 1. TVR Registration List
**File**: `src/components/registration/RegistrationList.jsx`

**Added Features**:
- New "Workflow Progress" column in the table
- Real-time status updates for each registration
- Progress bars showing completion percentage
- Direct links to workflow details

**Example Usage**:
```jsx
<WorkflowStatusBadge 
  recordId={reg.number}
  recordType="tvr-registration"
  compact={false}
  showProgress={true}
/>
```

**Mock Data Mapping**:
- `TVR-2026-001` → Running workflow (65% complete, NCUC Review)
- `TVR-2026-002` → Completed workflow (100% complete)
- `TVR-2026-003` → Waiting workflow (30% complete, Initial Review)

### 2. Complaint Investigation List
**File**: `src/components/complaints/ComplaintsList.jsx`

**Added Features**:
- New "Workflow Progress" column
- Investigation workflow tracking
- Error display for failed workflows
- Priority-based workflow assignment

**Example Usage**:
```jsx
<WorkflowStatusBadge 
  recordId={complaint.number}
  recordType="complaint-investigation"
  compact={false}
  showProgress={true}
/>
```

**Mock Data Mapping**:
- `COMP-2026-001` → Running workflow (45% complete, Evidence Collection)
- `COMP-2026-002` → Failed workflow (Site Visit failed)

### 3. Violation Cases List
**File**: `src/components/enforcement/ViolationCases.jsx`

**Added Features**:
- Compact workflow status display
- Appeal workflow tracking
- Integration with violation management

**Example Usage**:
```jsx
<WorkflowStatusBadge 
  recordId={caseItem.caseNumber}
  recordType="violation-appeal"
  compact={true}
  showProgress={true}
/>
```

**Mock Data Mapping**:
- `VC-2026-001` → Running workflow (35% complete, Document Review)
- `VC-2026-002` → Waiting workflow (15% complete, Appeal Filed)

### 4. Registration Detail Page
**File**: `src/components/registration/RegistrationDetail.jsx`

**Added Features**:
- Full workflow detail panel
- Complete timeline view
- Expandable history section
- Quick action buttons

**Example Usage**:
```jsx
<WorkflowDetailPanel 
  recordId={registration.number}
  recordType="tvr-registration"
  title="TVR Registration Workflow"
  showFullDetails={true}
  className="mb-6"
/>
```

## Workflow Status Types

### Status Indicators
- **Running** 🔄 (Blue) - Workflow is actively processing
- **Completed** ✅ (Green) - Workflow finished successfully
- **Failed** ❌ (Red) - Workflow encountered an error
- **Paused** ⏸️ (Gray) - Workflow is temporarily paused
- **Waiting** ⏳ (Yellow) - Workflow is waiting for input/action

### Progress Visualization
- **Progress Bars**: Visual representation of completion percentage
- **Current Step**: Shows the active workflow step
- **Assignee**: Displays who is currently responsible
- **Timeline**: Shows start and estimated completion dates

## Data Flow Architecture

### 1. Mock Data Structure
```javascript
const mockWorkflows = {
  'TVR-2026-001': {
    id: 'tvr-registration-001',
    type: 'tvr-registration',
    status: 'running',
    progress: 65,
    currentStep: 'NCUC Review',
    assignee: 'Planning Department',
    startedAt: '2024-01-15T10:30:00Z',
    estimatedCompletion: '2024-02-20T17:00:00Z'
  }
};
```

### 2. API Integration Points
When connected to Temporal, the components will call:
- `GET /api/temporal/workflows` for listing workflows
- `GET /api/temporal/workflows/{workflowId}` for detailed information

### 3. Record-to-Workflow Mapping
```javascript
const recordToWorkflowMapping = {
  // TVR Registrations
  'TVR-2026-001': 'tvr-registration-001',
  'TVR-2026-002': 'tvr-registration-002',
  
  // Complaints
  'COMP-2026-001': 'complaint-investigation-001',
  'COMP-2026-002': 'complaint-investigation-002',
  
  // Violations
  'VC-2026-001': 'violation-appeal-001',
  'VC-2026-002': 'violation-appeal-002'
};
```

## User Experience Features

### 1. Real-time Updates
- Automatic status refresh
- Progress bar animations
- Live assignee updates

### 2. Navigation Integration
- Direct links to workflow details
- Breadcrumb navigation
- Contextual action buttons

### 3. Error Handling
- Graceful degradation when workflows are unavailable
- Clear error messages
- Retry mechanisms

### 4. Responsive Design
- Mobile-friendly layouts
- Adaptive column sizing
- Touch-friendly interactions

## Implementation Benefits

### 1. Improved Visibility
- Users can see workflow progress without leaving listing pages
- Quick status identification through color coding
- Progress tracking at a glance

### 2. Enhanced Navigation
- Direct access to detailed workflow information
- Contextual workflow management
- Seamless integration with existing UI

### 3. Better User Experience
- Reduced navigation overhead
- Immediate status feedback
- Consistent visual design

### 4. Scalability
- Reusable components for different record types
- Easy to extend to new workflow types
- Consistent API integration pattern

## Future Enhancements

### 1. Real-time WebSocket Updates
- Live workflow status updates
- Push notifications for status changes
- Real-time progress tracking

### 2. Advanced Filtering
- Filter listings by workflow status
- Workflow-based search capabilities
- Multi-criteria filtering

### 3. Workflow Actions
- Start workflows directly from listings
- Pause/resume workflows inline
- Quick workflow management

### 4. Analytics Integration
- Workflow performance metrics
- SLA tracking and reporting
- Bottleneck identification

## Testing Considerations

### 1. Component Testing
- Status badge rendering
- Progress bar functionality
- Error state handling
- Loading state display

### 2. Integration Testing
- API connectivity
- Data mapping accuracy
- Navigation functionality
- Cross-component communication

### 3. User Acceptance Testing
- Workflow visibility
- User interaction flows
- Performance under load
- Mobile responsiveness

## Migration to Production

### 1. API Configuration
```javascript
// Update WorkflowStatusBadge to use real API
const fetchWorkflowStatus = async () => {
  const response = await fetch(`/api/temporal/workflows/by-record/${recordId}`);
  const data = await response.json();
  return data.workflow;
};
```

### 2. Environment Variables
```env
REACT_APP_TEMPORAL_API_URL=https://api.hawaiicounty.gov/temporal
REACT_APP_WORKFLOW_REFRESH_INTERVAL=30000
```

### 3. Error Boundaries
- Wrap components in error boundaries
- Implement fallback UI for API failures
- Log errors for monitoring

## Conclusion

The workflow status integration provides users with immediate visibility into the progress of their applications, complaints, and violations without requiring navigation to separate workflow pages. This improves efficiency, reduces context switching, and provides a more cohesive user experience throughout the TVR Compliance Dashboard.

The modular design allows for easy extension to additional record types and workflow categories, while maintaining consistency in visual design and user interaction patterns.
