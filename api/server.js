const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'compliance-dashboard-backend',
    version: '1.0.0'
  });
});

// Basic API endpoints
app.get('/api/properties', (req, res) => {
  res.json({
    properties: [],
    total: 0,
    message: 'Properties endpoint - placeholder'
  });
});

app.get('/api/violations', (req, res) => {
  res.json({
    violations: [],
    total: 0,
    message: 'Violations endpoint - placeholder'
  });
});

app.get('/api/complaints', (req, res) => {
  res.json({
    complaints: [],
    total: 0,
    message: 'Complaints endpoint - placeholder'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Dashboard Backend API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
