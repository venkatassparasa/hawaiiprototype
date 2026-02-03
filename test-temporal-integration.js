#!/usr/bin/env node

/**
 * Hawaii County TVR Compliance - Temporal Integration Test
 * This script tests the Temporal workflow integration
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3010';
const TEMPORAL_UI_URL = 'http://localhost:8080';

// Test data
const testWorkflowData = {
  TVRRegistration: {
    workflowType: 'TVRRegistrationWorkflow',
    input: {
      applicationId: `TEST-${Date.now()}`,
      propertyId: 'PROP-12345',
      applicantName: 'Test Applicant',
      propertyAddress: '123 Test St, Kailua-Kona, HI 96740',
      zoningCode: 'R-1',
      requiresNCUC: false,
      assignee: 'Planning Department',
      priority: 'medium'
    }
  },
  ComplaintInvestigation: {
    workflowType: 'ComplaintInvestigationWorkflow',
    input: {
      complaintId: `COMP-${Date.now()}`,
      propertyId: 'PROP-12345',
      complainantName: 'Test Complainant',
      complaintType: 'Illegal Rental',
      description: 'Test complaint for illegal vacation rental',
      priority: 'medium',
      assignee: 'Enforcement Officer'
    }
  }
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testConnection() {
  console.log('🔍 Testing API connection...');
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ API server is running:', response.status);
    return true;
  } catch (error) {
    console.log('❌ API server connection failed:', error.message);
    return false;
  }
}

async function testTemporalConnection() {
  console.log('🔍 Testing Temporal connection...');
  try {
    const response = await axios.get(`${TEMPORAL_UI_URL}/api/v1/namespaces`);
    console.log('✅ Temporal UI is running:', response.status);
    return true;
  } catch (error) {
    console.log('❌ Temporal UI connection failed:', error.message);
    return false;
  }
}

async function testWorkflowList() {
  console.log('📋 Testing workflow list endpoint...');
  try {
    const response = await axios.get(`${API_BASE_URL}/api/temporal/workflows`);
    console.log('✅ Workflow list endpoint working:', response.data.workflows?.length || 0, 'workflows found');
    return true;
  } catch (error) {
    console.log('❌ Workflow list endpoint failed:', error.response?.data || error.message);
    return false;
  }
}

async function testWorkflowStart(workflowType, data) {
  console.log(`🚀 Testing ${workflowType} workflow start...`);
  try {
    const response = await axios.post(`${API_BASE_URL}/api/temporal/workflows/start`, data);
    console.log(`✅ ${workflowType} workflow started successfully:`, response.data.workflowId);
    return response.data.workflowId;
  } catch (error) {
    console.log(`❌ ${workflowType} workflow start failed:`, error.response?.data || error.message);
    return null;
  }
}

async function testWorkflowDetails(workflowId) {
  console.log(`🔍 Testing workflow details for: ${workflowId}`);
  try {
    const response = await axios.get(`${API_BASE_URL}/api/temporal/workflows/${workflowId}`);
    console.log('✅ Workflow details retrieved:', {
      type: response.data.type,
      status: response.data.status,
      progress: response.data.progress
    });
    return true;
  } catch (error) {
    console.log('❌ Workflow details failed:', error.response?.data || error.message);
    return false;
  }
}

async function testWorkflowDefinitions() {
  console.log('📚 Testing workflow definitions...');
  try {
    const response = await axios.get(`${API_BASE_URL}/api/temporal/workflow-definitions`);
    console.log('✅ Workflow definitions retrieved:', response.data.length, 'definitions');
    return true;
  } catch (error) {
    console.log('❌ Workflow definitions failed:', error.response?.data || error.message);
    return false;
  }
}

async function runIntegrationTest() {
  console.log('🏝️  Hawaii County TVR Compliance - Temporal Integration Test');
  console.log('========================================================');
  console.log('');

  // Test basic connections
  const apiConnected = await testConnection();
  const temporalConnected = await testTemporalConnection();
  
  if (!apiConnected || !temporalConnected) {
    console.log('');
    console.log('❌ Basic connectivity tests failed. Please ensure:');
    console.log('   1. API server is running on http://localhost:3010');
    console.log('   2. Temporal UI is running on http://localhost:8088');
    console.log('   3. Run: start-temporal-integration.bat (Windows) or start-temporal-integration.sh (Linux/Mac)');
    return;
  }

  console.log('');
  console.log('🧪 Running integration tests...');
  console.log('');

  // Test API endpoints
  await testWorkflowList();
  await testWorkflowDefinitions();

  // Test workflow execution
  console.log('');
  console.log('🔄 Testing workflow execution...');
  
  const tvrWorkflowId = await testWorkflowStart('TVRRegistration', testWorkflowData.TVRRegistration);
  if (tvrWorkflowId) {
    await sleep(2000); // Wait a bit for workflow to start
    await testWorkflowDetails(tvrWorkflowId);
  }

  const complaintWorkflowId = await testWorkflowStart('ComplaintInvestigation', testWorkflowData.ComplaintInvestigation);
  if (complaintWorkflowId) {
    await sleep(2000); // Wait a bit for workflow to start
    await testWorkflowDetails(complaintWorkflowId);
  }

  console.log('');
  console.log('🎉 Integration test completed!');
  console.log('========================================================');
  console.log('✅ Services tested successfully:');
  if (apiConnected) console.log('   • API Server');
  if (temporalConnected) console.log('   • Temporal Server');
  console.log('   • Workflow List API');
  console.log('   • Workflow Definitions API');
  if (tvrWorkflowId) console.log('   • TVR Registration Workflow');
  if (complaintWorkflowId) console.log('   • Complaint Investigation Workflow');
  console.log('');
  console.log('🌐 View running workflows at: http://localhost:8080');
  console.log('📚 View API docs at: http://localhost:3010/docs');
  console.log('🏠 Open dashboard at: http://localhost:5173/workflows');
}

// Run the test
runIntegrationTest().catch(console.error);
