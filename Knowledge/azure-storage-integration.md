# Azure Blob Storage Integration Guide

This guide explains how the Hawaii Vacation Rental Crawler API has been updated to use Azure Blob Storage instead of AWS S3 for evidence storage.

## Overview

The crawler API now uses **Azure Blob Storage** for storing violation evidence, including:
- **Screenshots** of property listings
- **Documents** related to violations
- **Videos** of property evidence
- **Large files** using block blob upload

## Architecture Changes

### Before (AWS S3)
```
Crawler API → AWS S3 → Evidence Files
```

### After (Azure Blob Storage)
```
Crawler API → Azure Blob Storage → Evidence Files
```

## Azure Storage Service Features

### Core Functionality
- **Block Blob Upload** - Standard file uploads with metadata
- **Large File Support** - Chunked upload for files > 256MB
- **Metadata Management** - Rich metadata for evidence tracking
- **SAS Token Generation** - Secure time-limited access URLs
- **Blob Organization** - Hierarchical folder structure

### Storage Organization
```
evidence/
├── screenshots/
│   ├── airbnb/{violation-id}/{timestamp}_{filename}
│   └── vrbo/{violation-id}/{timestamp}_{filename}
├── documents/
│   ├── airbnb/{violation-id}/{timestamp}_{filename}
│   └── vrbo/{violation-id}/{timestamp}_{filename}
├── videos/
│   ├── airbnb/{violation-id}/{timestamp}_{filename}
│   └── vrbo/{violation-id}/{timestamp}_{filename}
└── large-files/
    ├── airbnb/{violation-id}/{timestamp}_{filename}
    └── vrbo/{violation-id}/{timestamp}_{filename}
```

## Implementation Details

### AzureStorageService Class

#### Key Methods
```typescript
// Upload screenshots
async uploadScreenshot(buffer: Buffer, filename: string, metadata: EvidenceMetadata)

// Upload documents
async uploadDocument(buffer: Buffer, filename: string, metadata: EvidenceMetadata)

// Upload videos
async uploadVideo(buffer: Buffer, filename: string, metadata: EvidenceMetadata)

// Upload large files (chunked)
async uploadLargeFile(buffer: Buffer, filename: string, metadata: EvidenceMetadata)

// Generate secure URLs
getBlobUrlWithSas(blobName: string, expiresInSeconds: number)
```

#### Metadata Structure
```typescript
interface EvidenceMetadata {
  violationId: string;
  propertyId: string;
  platform: string;
  listingId: string;
  capturedAt: Date;
  device: string;
  type: 'screenshot' | 'document' | 'video';
  size: number;
  mimeType: string;
}
```

### Blob Metadata and Tags

#### Metadata Properties
- **violationId** - Associated violation ID
- **propertyId** - Property reference
- **platform** - airbnb or vrbo
- **listingId** - Platform listing ID
- **capturedAt** - Capture timestamp
- **device** - Capture device/method
- **type** - Evidence type
- **uploadedAt** - Upload timestamp
- **environment** - dev/staging/prod

#### Blob Tags
- **type** - Evidence type for filtering
- **platform** - Platform for filtering
- **violationId** - Violation for filtering
- **propertyId** - Property for filtering

## Configuration

### Environment Variables
```env
# Azure Storage Configuration
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=youraccount;AccountKey=yourkey;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER_NAME=evidence
```

### Terraform Integration
The Azure deployment automatically creates:
- **Storage Account** with appropriate SKU
- **Storage Container** for evidence
- **Managed Identity** for secure access
- **Connection String** in Key Vault

## Usage Examples

### Upload Screenshot
```typescript
const azureStorageService = new AzureStorageService();

const buffer = Buffer.from(screenshotData);
const metadata = {
  violationId: 'violation-123',
  propertyId: 'property-456',
  platform: 'airbnb',
  listingId: 'listing-789',
  capturedAt: new Date(),
  device: 'apify-screenshot',
  type: 'screenshot' as const,
  size: buffer.length,
  mimeType: 'image/png'
};

const result = await azureStorageService.uploadScreenshot(buffer, 'screenshot.png', metadata);
console.log(`Screenshot uploaded: ${result.url}`);
```

### Upload Large File
```typescript
const largeFileBuffer = Buffer.from(largeFileData);
const metadata = {
  // ... metadata
  type: 'video' as const,
  size: largeFileBuffer.length,
  mimeType: 'video/mp4'
};

const result = await azureStorageService.uploadLargeFile(
  largeFileBuffer, 
  'evidence-video.mp4', 
  metadata,
  4 * 1024 * 1024 // 4MB chunks
);
```

### Generate Secure URL
```typescript
const secureUrl = azureStorageService.getBlobUrlWithSas(
  'screenshots/airbnb/violation-123/2024-03-09_screenshot.png',
  3600 // 1 hour expiry
);
```

### List Blobs by Tag
```typescript
const violationScreenshots = await azureStorageService.listBlobsByTag(
  'violationId', 
  'violation-123'
);
```

## Migration from AWS S3

### Changes Required
1. **Update Dependencies** - Add `@azure/storage-blob`
2. **Replace S3 Service** - Use `AzureStorageService`
3. **Update Environment Variables** - Use Azure storage connection string
4. **Update Terraform** - Use Azure storage resources

### Code Migration
```typescript
// Before (AWS S3)
import { S3Service } from './s3Service';
const s3Service = new S3Service();
const result = await s3Service.uploadScreenshot(buffer, filename, metadata);

// After (Azure Blob Storage)
import { AzureStorageService } from './azureStorageService';
const azureStorageService = new AzureStorageService();
const result = await azureStorageService.uploadScreenshot(buffer, filename, metadata);
```

## Performance Features

### Block Blob Upload
- **Parallel Upload** - Multiple chunks uploaded simultaneously
- **Resume Capability** - Interrupted uploads can be resumed
- **Progress Tracking** - Upload progress monitoring
- **Error Handling** - Automatic retry for failed chunks

### Large File Optimization
```typescript
// Automatic chunking for large files
const chunkSize = 4 * 1024 * 1024; // 4MB chunks
const totalBlocks = Math.ceil(buffer.length / chunkSize);

// Parallel upload of chunks
const uploadPromises = [];
for (let i = 0; i < totalBlocks; i++) {
  const chunk = buffer.slice(start, end);
  uploadPromises.push(blockBlobClient.stageBlock(blockId, chunk));
}
await Promise.all(uploadPromises);
```

## Security Features

### Managed Identity Authentication
```typescript
// Uses Azure AD managed identity
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
```

### SAS Token Security
```typescript
// Time-limited, permission-specific access
const sasToken = blockBlobClient.generateBlobSASQueryParameters({
  expiresOn: new Date(new Date().valueOf() + expiresInSeconds * 1000),
  permissions: 'r' // Read only
});
```

### Private Container Access
```typescript
// Container is private by default
await containerClient.createIfNotExists({ access: 'private' });
```

## Monitoring and Logging

### Upload Tracking
```typescript
logger.info(`Screenshot uploaded to Azure Blob Storage: ${blobName}`, {
  size: buffer.length,
  etag: uploadResponse.etag,
  url: blockBlobClient.url
});
```

### Error Handling
```typescript
try {
  const result = await azureStorageService.uploadScreenshot(buffer, filename, metadata);
  return result;
} catch (error) {
  logger.error('Error uploading screenshot to Azure Blob Storage:', error);
  throw new Error(`Failed to upload screenshot: ${error.message}`);
}
```

## Cost Optimization

### Storage Tiers
- **Standard** - General purpose storage
- **Premium** - High-performance storage
- **Archive** - Long-term storage for old evidence

### Lifecycle Management
```typescript
// Archive old evidence files
async archiveOldEvidence(daysOld: number = 90): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  let archivedCount = 0;
  for await (const blob of containerClient.listBlobsFlat()) {
    if (blob.properties.lastModified && blob.properties.lastModified < cutoffDate) {
      await this.deleteBlob(blob.name);
      archivedCount++;
    }
  }
  
  return archivedCount;
}
```

## Integration with Violation Detection

### Updated ViolationDetector
```typescript
export class ViolationDetector {
  private azureStorageService: AzureStorageService;

  async detectViolations(property: IProperty, listingData: ListingData): Promise<Partial<IViolation>[]> {
    // ... violation detection logic
    
    // Capture and upload screenshots
    const screenshots = await this.captureScreenshots(listingData.url, 'violation-check');
    
    // Store evidence URLs in violation record
    violation.evidence = {
      screenshots,
      listingData,
      comparisonData
    };
  }

  private async captureScreenshots(url: string, purpose: string): Promise<string[]> {
    // Take screenshot using Apify
    const screenshotBuffer = await this.actor.call('apify/web-screenshot', { url });
    
    // Upload to Azure Blob Storage
    const metadata = {
      violationId: 'temp',
      propertyId: property._id.toString(),
      platform: listingData.platform,
      listingId: listingData.listingId,
      capturedAt: new Date(),
      device: 'apify-screenshot',
      type: 'screenshot' as const,
      size: screenshotBuffer.body.length,
      mimeType: 'image/png'
    };

    const filename = `${purpose}-${Date.now()}.png`;
    const uploadResult = await this.azureStorageService.uploadScreenshot(
      screenshotBuffer.body,
      filename,
      metadata
    );

    return [uploadResult.url];
  }
}
```

## Testing

### Unit Tests
```typescript
describe('AzureStorageService', () => {
  let service: AzureStorageService;

  beforeEach(() => {
    service = new AzureStorageService();
  });

  test('should upload screenshot successfully', async () => {
    const buffer = Buffer.from('test image data');
    const metadata = createMockMetadata();
    
    const result = await service.uploadScreenshot(buffer, 'test.png', metadata);
    
    expect(result.url).toBeDefined();
    expect(result.etag).toBeDefined();
    expect(result.contentLength).toBe(buffer.length);
  });
});
```

### Integration Tests
```typescript
describe('Azure Storage Integration', () => {
  test('should upload and retrieve blob', async () => {
    const service = new AzureStorageService();
    const buffer = Buffer.from('test data');
    
    // Upload
    const uploadResult = await service.uploadScreenshot(buffer, 'test.png', metadata);
    
    // Verify blob exists
    const metadata = await service.getBlobMetadata(uploadResult.url);
    expect(metadata.violationId).toBe(metadata.violationId);
  });
});
```

## Troubleshooting

### Common Issues

#### Connection String Error
```bash
Error: AZURE_STORAGE_CONNECTION_STRING environment variable is required
```
**Solution**: Set the Azure Storage connection string in environment variables.

#### Container Access Error
```bash
Error: Container does not exist
```
**Solution**: The service automatically creates the container, check permissions.

#### Upload Timeout
```bash
Error: Upload timeout
```
**Solution**: Use chunked upload for large files or increase timeout.

#### SAS Token Error
```bash
Error: Invalid SAS token
```
**Solution**: Check SAS token permissions and expiry time.

### Debug Mode
```typescript
// Enable debug logging
process.env.DEBUG = 'azure:*';

// Monitor upload progress
const uploadResponse = await blockBlobClient.upload(buffer, buffer.length, {
  onProgress: (progress) => {
    console.log(`Upload progress: ${progress.loadedBytes} / ${progress.contentLength}`);
  }
});
```

## Best Practices

### Performance
- **Use appropriate blob types** - Block blob for most files
- **Implement chunked upload** for large files
- **Cache blob URLs** for frequently accessed evidence
- **Use CDN** for static content delivery

### Security
- **Use managed identities** instead of connection strings
- **Set appropriate permissions** on containers
- **Use SAS tokens** for temporary access
- **Enable soft delete** for data protection

### Cost Management
- **Choose appropriate storage tier** based on access patterns
- **Implement lifecycle policies** for old evidence
- **Monitor storage usage** and set up alerts
- **Compress large files** before upload

## Azure Portal Integration

### Storage Account Management
1. **Navigate to Storage Account** in Azure Portal
2. **Monitor usage** in Metrics blade
3. **Set up alerts** for storage operations
4. **Configure lifecycle management** in Data Management

### Container Management
1. **View container contents** in Storage Explorer
2. **Set access policies** for containers
3. **Monitor blob operations** in Activity Log
4. **Configure CORS** for web access

This Azure Blob Storage integration provides a robust, scalable, and secure solution for evidence storage in the Hawaii Vacation Rental Crawler API, with enterprise-grade features and seamless Azure ecosystem integration.
