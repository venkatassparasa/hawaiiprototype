# Crawler API Integration Examples

This document provides practical code examples for integrating the Hawaii Vacation Rental Crawler API with the TVR Compliance Dashboard.

## 1. API Client Service Implementation

### Complete Service Class
```javascript
// src/services/crawlerApiService.js
import { logger } from '../utils/logger';

class CrawlerApiService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_CRAWLER_API_URL || 'http://localhost:3000';
    this.apiKey = process.env.REACT_APP_CRAWLER_API_KEY;
    this.timeout = 30000; // 30 seconds
  }

  // Generic API request method with error handling
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
      timeout: this.timeout,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      logger.error('Crawler API request failed:', error);
      throw new Error(`Failed to connect to crawler API: ${error.message}`);
    }
  }

  // Start crawling operation
  async startCrawl(platform = 'all', options = {}) {
    const defaultOptions = {
      locations: [
        'Kailua-Kona, HI',
        'Hilo, HI', 
        'Waimea, HI',
        'Pahoa, HI',
        'Honokaa, HI'
      ],
      maxListings: 1000,
      guests: 2,
      checkIn: this.getDefaultCheckIn(),
      checkOut: this.getDefaultCheckOut(),
    };

    const payload = { ...defaultOptions, ...options };
    
    logger.info(`Starting ${platform} crawl with options:`, payload);
    
    return this.makeRequest(`/api/crawl/${platform}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Get crawl job status
  async getCrawlStatus(jobId) {
    return this.makeRequest(`/api/crawl/status/${jobId}`);
  }

  // Get crawl history
  async getCrawlHistory(limit = 50, platform = 'all') {
    const params = new URLSearchParams({ limit, platform });
    return this.makeRequest(`/api/crawl/history?${params}`);
  }

  // Get crawl statistics
  async getStatistics() {
    return this.makeRequest('/api/crawl/statistics');
  }

  // Get all violations
  async getViolations(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.makeRequest(`/api/violations?${params}`);
  }

  // Get violations for specific property
  async getPropertyViolations(propertyId) {
    return this.makeRequest(`/api/violations/property/${propertyId}`);
  }

  // Get violation details
  async getViolationDetails(violationId) {
    return this.makeRequest(`/api/violations/${violationId}`);
  }

  // Update violation status
  async updateViolationStatus(violationId, status, notes) {
    return this.makeRequest(`/api/violations/${violationId}/review`, {
      method: 'POST',
      body: JSON.stringify({ status, notes }),
    });
  }

  // Search for properties
  async searchProperty(searchCriteria) {
    return this.makeRequest('/api/properties/search', {
      method: 'POST',
      body: JSON.stringify(searchCriteria),
    });
  }

  // Get property details
  async getPropertyDetails(propertyId) {
    return this.makeRequest(`/api/properties/${propertyId}`);
  }

  // Get violation statistics
  async getViolationStatistics() {
    return this.makeRequest('/api/violations/statistics');
  }

  // Get violation trends
  async getViolationTrends(days = 30) {
    return this.makeRequest(`/api/violations/trends?days=${days}`);
  }

  // Helper methods
  getDefaultCheckIn() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  getDefaultCheckOut() {
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    return dayAfterTomorrow.toISOString().split('T')[0];
  }

  // Rate-limited fetch for batch operations
  async batchRequest(requests, delay = 100) {
    const results = [];
    
    for (const request of requests) {
      try {
        const result = await this.makeRequest(request.endpoint, request.options);
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
      
      // Add delay between requests
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    return results;
  }
}

export const crawlerApiService = new CrawlerApiService();
```

## 2. React Hook for Crawler Data

### Custom Hook for Property Violations
```javascript
// src/hooks/usePropertyViolations.js
import { useState, useEffect, useCallback } from 'react';
import { crawlerApiService } from '../services/crawlerApiService';

export const usePropertyViolations = (propertyId) => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchViolations = useCallback(async () => {
    if (!propertyId) return;

    setLoading(true);
    setError(null);

    try {
      const violationData = await crawlerApiService.getPropertyViolations(propertyId);
      setViolations(violationData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchViolations();
  }, [fetchViolations]);

  const updateViolation = useCallback(async (violationId, status, notes) => {
    try {
      await crawlerApiService.updateViolationStatus(violationId, status, notes);
      // Refresh violations list
      await fetchViolations();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchViolations]);

  return {
    violations,
    loading,
    error,
    refetch: fetchViolations,
    updateViolation,
  };
};
```

### Custom Hook for Crawler Statistics
```javascript
// src/hooks/useCrawlerStatistics.js
import { useState, useEffect, useCallback } from 'react';
import { crawlerApiService } from '../services/crawlerApiService';

export const useCrawlerStatistics = (refreshInterval = 60000) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const stats = await crawlerApiService.getStatistics();
      setStatistics(stats.statistics);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();

    if (refreshInterval > 0) {
      const interval = setInterval(fetchStatistics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchStatistics, refreshInterval]);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics,
  };
};
```

## 3. Enhanced Registration Detail Component

### Complete Integration Example
```javascript
// src/components/registration/RegistrationDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { crawlerApiService } from '../../services/crawlerApiService';
import { usePropertyViolations } from '../../hooks/usePropertyViolations';
import { AlertTriangle, CheckCircle, Clock, ExternalLink, Camera } from 'lucide-react';

const RegistrationDetail = () => {
  const { id } = useParams();
  const [registration, setRegistration] = useState(null);
  const [crawlerData, setCrawlerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  // Use custom hook for violations
  const { violations, loading: violationsLoading, updateViolation } = usePropertyViolations(
    crawlerData?._id
  );

  useEffect(() => {
    fetchRegistrationData();
  }, [id]);

  useEffect(() => {
    if (registration) {
      fetchCrawlerData();
    }
  }, [registration]);

  const fetchRegistrationData = async () => {
    try {
      // Fetch registration data from your existing API
      const response = await fetch(`/api/registrations/${id}`);
      const data = await response.json();
      setRegistration(data);
    } catch (error) {
      console.error('Error fetching registration:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCrawlerData = async () => {
    try {
      // Search for property in crawler database
      const propertyData = await crawlerApiService.searchProperty({
        address: registration.property.address,
        tmk: registration.property.tmk,
      });

      if (propertyData.properties.length > 0) {
        const property = propertyData.properties[0];
        setCrawlerData(property);
      }
    } catch (error) {
      console.error('Error fetching crawler data:', error);
    }
  };

  const handleViolationUpdate = async (violationId, status, notes) => {
    const result = await updateViolation(violationId, status, notes);
    if (result.success) {
      // Show success message
      alert('Violation updated successfully');
    } else {
      // Show error message
      alert(`Error updating violation: ${result.error}`);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'detected': return <AlertTriangle className="w-4 h-4" />;
      case 'under-review': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <div className="p-6">Loading registration details...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {registration?.number}
          </h1>
          <p className="text-slate-600">{registration?.property.address}</p>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'details'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Registration Details
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'monitoring'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Platform Monitoring
          </button>
          <button
            onClick={() => setActiveTab('violations')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
              activeTab === 'violations'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Violations
            {violations.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {violations.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          {/* Your existing registration details content */}
          <h2 className="text-lg font-semibold mb-4">Registration Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-600">Status</p>
              <p className="font-medium">{registration?.status}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Submitted Date</p>
              <p className="font-medium">{registration?.submittedDate}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Property Type</p>
              <p className="font-medium">{registration?.property.type}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Max Occupancy</p>
              <p className="font-medium">{registration?.property.maxOccupants}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'monitoring' && crawlerData && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Platform Monitoring Data</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {crawlerData.airbnb?.isActive && (
              <div className="border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-blue-900">Airbnb Listing</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Active
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="text-slate-600">Price:</span> ${crawlerData.airbnb.price}/night</p>
                  <p><span className="text-slate-600">Rating:</span> {crawlerData.airbnb.rating}⭐ ({crawlerData.airbnb.reviews} reviews)</p>
                  <p><span className="text-slate-600">Max Guests:</span> {crawlerData.airbnb.maxGuests}</p>
                  <p><span className="text-slate-600">Last Seen:</span> {new Date(crawlerData.airbnb.lastSeen).toLocaleDateString()}</p>
                </div>
                <a 
                  href={crawlerData.airbnb.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Listing
                </a>
              </div>
            )}
            
            {crawlerData.vrbo?.isActive && (
              <div className="border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-green-900">VRBO Listing</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Active
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="text-slate-600">Price:</span> ${crawlerData.vrbo.price}/night</p>
                  <p><span className="text-slate-600">Rating:</span> {crawlerData.vrbo.rating}⭐ ({crawlerData.vrbo.reviews} reviews)</p>
                  <p><span className="text-slate-600">Max Guests:</span> {crawlerData.vrbo.maxGuests}</p>
                  <p><span className="text-slate-600">Last Seen:</span> {new Date(crawlerData.vrbo.lastSeen).toLocaleDateString()}</p>
                </div>
                <a 
                  href={crawlerData.vrbo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Listing
                </a>
              </div>
            )}
          </div>

          {/* Property Risk Score */}
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-medium mb-3">Risk Assessment</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Violation Risk Score</p>
                <p className="text-2xl font-bold">{crawlerData.violationScore}/100</p>
              </div>
              <div className="w-32 bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    crawlerData.violationScore >= 70 ? 'bg-red-600' :
                    crawlerData.violationScore >= 40 ? 'bg-yellow-600' :
                    'bg-green-600'
                  }`}
                  style={{ width: `${crawlerData.violationScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'violations' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Detected Violations</h2>
          
          {violationsLoading ? (
            <div className="text-center py-8">Loading violations...</div>
          ) : violations.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <p>No violations detected for this property</p>
            </div>
          ) : (
            <div className="space-y-4">
              {violations.map((violation) => (
                <div key={violation._id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(violation.status)}
                        <h3 className="font-medium text-slate-900">
                          {violation.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(violation.severity)}`}>
                          {violation.severity}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        Detected: {new Date(violation.detectedAt).toLocaleDateString()}
                      </p>
                      {violation.evidence?.listingData && (
                        <div className="text-sm text-slate-600">
                          <p>Platform: {violation.evidence.listingData.platform}</p>
                          <p>Price: ${violation.evidence.listingData.price}/night</p>
                          <p>Max Guests: {violation.evidence.listingData.occupancy}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {violation.evidence?.screenshots?.length > 0 && (
                        <button className="p-2 text-slate-600 hover:text-slate-900" title="View Evidence">
                          <Camera className="w-4 h-4" />
                        </button>
                      )}
                      <a 
                        href={violation.evidence?.listingData?.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-slate-600 hover:text-slate-900"
                        title="View Listing"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Evidence Screenshots */}
                  {violation.evidence?.screenshots?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-slate-600 mb-2">Evidence:</p>
                      <div className="flex gap-2">
                        {violation.evidence.screenshots.map((screenshot, index) => (
                          <img 
                            key={index}
                            src={screenshot} 
                            alt="Violation evidence"
                            className="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                            onClick={() => window.open(screenshot, '_blank')}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {violation.status === 'detected' && (
                      <button
                        onClick={() => handleViolationUpdate(violation._id, 'under-review', 'Starting review process')}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Start Review
                      </button>
                    )}
                    {violation.status === 'under-review' && (
                      <>
                        <button
                          onClick={() => handleViolationUpdate(violation._id, 'confirmed', 'Violation confirmed')}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleViolationUpdate(violation._id, 'resolved', 'No violation found')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RegistrationDetail;
```

## 4. Crawler Dashboard Component

### Full Dashboard Implementation
```javascript
// src/components/crawler/CrawlerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { crawlerApiService } from '../../services/crawlerApiService';
import { useCrawlerStatistics } from '../../hooks/useCrawlerStatistics';
import { Play, Clock, CheckCircle, AlertTriangle, TrendingUp, Activity } from 'lucide-react';

const CrawlerDashboard = () => {
  const [activeCrawls, setActiveCrawls] = useState([]);
  const [crawlHistory, setCrawlHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const { statistics, loading: statsLoading } = useCrawlerStatistics(30000); // Refresh every 30 seconds

  useEffect(() => {
    fetchCrawlHistory();
  }, []);

  const fetchCrawlHistory = async () => {
    try {
      const history = await crawlerApiService.getCrawlHistory(10);
      setCrawlHistory(history.history);
    } catch (error) {
      console.error('Error fetching crawl history:', error);
    }
  };

  const startCrawl = async (platform) => {
    setLoading(true);
    try {
      const result = await crawlerApiService.startCrawl(platform, {
        locations: ['Kailua-Kona, HI', 'Hilo, HI', 'Waimea, HI'],
        maxListings: 500,
      });
      
      setActiveCrawls([...activeCrawls, {
        ...result,
        platform,
        startTime: new Date(),
        status: 'running'
      }]);
      
      // Refresh history
      setTimeout(fetchCrawlHistory, 1000);
    } catch (error) {
      alert(`Error starting crawl: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <Activity className="w-4 h-4 text-blue-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDuration = (startTime) => {
    const duration = Date.now() - new Date(startTime).getTime();
    const minutes = Math.floor(duration / 60000);
    return `${minutes}m`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Violation Detection Crawler</h1>
          <p className="text-slate-600">Monitor Airbnb and VRBO listings for TVR violations</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => startCrawl('airbnb')}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {loading ? 'Starting...' : 'Start Airbnb'}
          </button>
          <button
            onClick={() => startCrawl('vrbo')}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Start VRBO
          </button>
          <button
            onClick={() => startCrawl('all')}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Start Full Crawl
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Properties</p>
                <p className="text-2xl font-bold text-slate-900">{statistics.totalProperties}</p>
              </div>
              <div className="p-2 bg-slate-100 rounded-lg">
                <Activity className="w-5 h-5 text-slate-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Listings</p>
                <p className="text-2xl font-bold text-blue-600">
                  {statistics.activeAirbnbListings + statistics.activeVRBOListings}
                </p>
                <p className="text-xs text-slate-500">
                  Airbnb: {statistics.activeAirbnbListings} | VRBO: {statistics.activeVRBOListings}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Violations</p>
                <p className="text-2xl font-bold text-red-600">{statistics.totalViolations}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Unregistered</p>
                <p className="text-2xl font-bold text-orange-600">{statistics.unregisteredProperties}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Crawls */}
      {activeCrawls.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Active Crawls</h2>
          <div className="space-y-3">
            {activeCrawls.map((crawl) => (
              <div key={crawl.jobId} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(crawl.status)}
                  <div>
                    <p className="font-medium text-slate-900">{crawl.platform.toUpperCase()} Crawl</p>
                    <p className="text-sm text-slate-600">Job ID: {crawl.jobId}</p>
                    <p className="text-sm text-slate-600">Duration: {formatDuration(crawl.startTime)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {crawl.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">Est: {crawl.estimatedTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crawl History */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Crawl History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2">Platform</th>
                <th className="text-left py-2">Job ID</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Started</th>
                <th className="text-left py-2">Duration</th>
                <th className="text-left py-2">Listings</th>
                <th className="text-left py-2">Violations</th>
              </tr>
            </thead>
            <tbody>
              {crawlHistory.map((crawl) => (
                <tr key={crawl.jobId} className="border-b border-slate-100">
                  <td className="py-2 font-medium">{crawl.platform.toUpperCase()}</td>
                  <td className="py-2 font-mono text-xs">{crawl.jobId}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(crawl.status)}
                      <span>{crawl.status}</span>
                    </div>
                  </td>
                  <td className="py-2">{new Date(crawl.startedAt).toLocaleString()}</td>
                  <td className="py-2">
                    {crawl.completedAt 
                      ? `${Math.floor((new Date(crawl.completedAt) - new Date(crawl.startedAt)) / 60000)}m`
                      : 'In progress'
                    }
                  </td>
                  <td className="py-2">{crawl.statistics?.listingsProcessed || 0}</td>
                  <td className="py-2">{crawl.statistics?.violationsFound || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CrawlerDashboard;
```

## 5. Environment Configuration

### Dashboard Environment Variables
```env
# Add to your existing .env file
REACT_APP_CRAWLER_API_URL=http://localhost:3000
REACT_APP_CRAWLER_API_KEY=your_dashboard_api_key_here

# Production URLs
# REACT_APP_CRAWLER_API_URL=https://crawler-api.hawaiicounty.gov
# REACT_APP_CRAWLER_API_KEY=your_production_api_key
```

## 6. Error Handling and Retry Logic

### Robust API Client with Retry
```javascript
// src/services/resilientCrawlerApi.js
class ResilientCrawlerApi {
  constructor(maxRetries = 3, retryDelay = 1000) {
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
  }

  async requestWithRetry(endpoint, options = {}, attempt = 1) {
    try {
      return await crawlerApiService.makeRequest(endpoint, options);
    } catch (error) {
      if (attempt < this.maxRetries && this.isRetryableError(error)) {
        console.warn(`Request failed, retrying (${attempt}/${this.maxRetries}):`, error.message);
        await this.delay(this.retryDelay * attempt); // Exponential backoff
        return this.requestWithRetry(endpoint, options, attempt + 1);
      }
      throw error;
    }
  }

  isRetryableError(error) {
    // Retry on network errors and 5xx server errors
    return error.message.includes('Failed to connect') || 
           error.message.includes('timeout') ||
           (error.message.includes('API Error') && parseInt(error.message.split(' ')[2]) >= 500);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Wrapper methods with retry logic
  async getViolations(filters = {}) {
    return this.requestWithRetry(`/api/violations?${new URLSearchParams(filters)}`);
  }

  async getPropertyViolations(propertyId) {
    return this.requestWithRetry(`/api/violations/property/${propertyId}`);
  }

  async startCrawl(platform, options) {
    return this.requestWithRetry(`/api/crawl/${platform}`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }
}

export const resilientCrawlerApi = new ResilientCrawlerApi();
```

These integration examples provide a complete foundation for connecting the crawler API with your TVR Compliance Dashboard, including error handling, real-time updates, and comprehensive user interfaces for monitoring and managing violation detection.
