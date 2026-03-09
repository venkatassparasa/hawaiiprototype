import { BlobServiceClient, BlockBlobClient, BlobUploadCommonResponse } from '@azure/storage-blob';
import { logger } from '../utils/logger';

export interface StorageUploadResult {
  url: string;
  etag: string;
  lastModified: Date;
  contentLength: number;
}

export interface EvidenceMetadata {
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

export class AzureStorageService {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;

  constructor() {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING environment variable is required');
    }

    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    this.containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'evidence';

    this.initializeContainer();
  }

  /**
   * Initialize the storage container
   */
  private async initializeContainer(): Promise<void> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      await containerClient.createIfNotExists({ access: 'private' });
      logger.info(`Azure Storage container '${this.containerName}' initialized`);
    } catch (error) {
      logger.error('Error initializing Azure Storage container:', error);
      throw error;
    }
  }

  /**
   * Upload screenshot as block blob
   */
  async uploadScreenshot(
    buffer: Buffer,
    filename: string,
    metadata: EvidenceMetadata
  ): Promise<StorageUploadResult> {
    try {
      const blobName = `screenshots/${this.generateBlobName(filename, metadata)}`;
      const blockBlobClient = this.blobServiceClient.getContainerClient(this.containerName).getBlockBlobClient(blobName);

      // Set blob metadata
      const blobMetadata = {
        violationId: metadata.violationId,
        propertyId: metadata.propertyId,
        platform: metadata.platform,
        listingId: metadata.listingId,
        capturedAt: metadata.capturedAt.toISOString(),
        device: metadata.device,
        type: metadata.type,
        uploadedAt: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      };

      // Upload block blob with metadata
      const uploadResponse: BlobUploadCommonResponse = await blockBlobClient.upload(buffer, buffer.length, {
        metadata: blobMetadata,
        blobHTTPHeaders: {
          blobContentType: metadata.mimeType || 'image/png',
          blobCacheControl: 'public, max-age=31536000', // Cache for 1 year
          blobContentDisposition: `inline; filename="${filename}"`
        },
        tags: {
          type: metadata.type,
          platform: metadata.platform,
          violationId: metadata.violationId,
          propertyId: metadata.propertyId
        }
      });

      logger.info(`Screenshot uploaded to Azure Blob Storage: ${blobName}`, {
        size: buffer.length,
        etag: uploadResponse.etag,
        url: blockBlobClient.url
      });

      return {
        url: blockBlobClient.url,
        etag: uploadResponse.etag || '',
        lastModified: uploadResponse.lastModified || new Date(),
        contentLength: buffer.length
      };
    } catch (error) {
      logger.error('Error uploading screenshot to Azure Blob Storage:', error);
      throw new Error(`Failed to upload screenshot: ${error.message}`);
    }
  }

  /**
   * Upload document as block blob
   */
  async uploadDocument(
    buffer: Buffer,
    filename: string,
    metadata: EvidenceMetadata
  ): Promise<StorageUploadResult> {
    try {
      const blobName = `documents/${this.generateBlobName(filename, metadata)}`;
      const blockBlobClient = this.blobServiceClient.getContainerClient(this.containerName).getBlockBlobClient(blobName);

      // Set blob metadata
      const blobMetadata = {
        violationId: metadata.violationId,
        propertyId: metadata.propertyId,
        platform: metadata.platform,
        listingId: metadata.listingId,
        capturedAt: metadata.capturedAt.toISOString(),
        device: metadata.device,
        type: metadata.type,
        uploadedAt: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      };

      // Upload document
      const uploadResponse: BlobUploadCommonResponse = await blockBlobClient.upload(buffer, buffer.length, {
        metadata: blobMetadata,
        blobHTTPHeaders: {
          blobContentType: metadata.mimeType || 'application/pdf',
          blobCacheControl: 'public, max-age=31536000',
          blobContentDisposition: `attachment; filename="${filename}"`
        },
        tags: {
          type: metadata.type,
          platform: metadata.platform,
          violationId: metadata.violationId,
          propertyId: metadata.propertyId
        }
      });

      logger.info(`Document uploaded to Azure Blob Storage: ${blobName}`, {
        size: buffer.length,
        etag: uploadResponse.etag,
        url: blockBlobClient.url
      });

      return {
        url: blockBlobClient.url,
        etag: uploadResponse.etag || '',
        lastModified: uploadResponse.lastModified || new Date(),
        contentLength: buffer.length
      };
    } catch (error) {
      logger.error('Error uploading document to Azure Blob Storage:', error);
      throw new Error(`Failed to upload document: ${error.message}`);
    }
  }

  /**
   * Upload video as block blob
   */
  async uploadVideo(
    buffer: Buffer,
    filename: string,
    metadata: EvidenceMetadata
  ): Promise<StorageUploadResult> {
    try {
      const blobName = `videos/${this.generateBlobName(filename, metadata)}`;
      const blockBlobClient = this.blobServiceClient.getContainerClient(this.containerName).getBlockBlobClient(blobName);

      // Set blob metadata
      const blobMetadata = {
        violationId: metadata.violationId,
        propertyId: metadata.propertyId,
        platform: metadata.platform,
        listingId: metadata.listingId,
        capturedAt: metadata.capturedAt.toISOString(),
        device: metadata.device,
        type: metadata.type,
        uploadedAt: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      };

      // Upload video (using block blob for large files)
      const uploadResponse: BlobUploadCommonResponse = await blockBlobClient.upload(buffer, buffer.length, {
        metadata: blobMetadata,
        blobHTTPHeaders: {
          blobContentType: metadata.mimeType || 'video/mp4',
          blobCacheControl: 'public, max-age=31536000',
          blobContentDisposition: `attachment; filename="${filename}"`
        },
        tags: {
          type: metadata.type,
          platform: metadata.platform,
          violationId: metadata.violationId,
          propertyId: metadata.propertyId
        }
      });

      logger.info(`Video uploaded to Azure Blob Storage: ${blobName}`, {
        size: buffer.length,
        etag: uploadResponse.etag,
        url: blockBlobClient.url
      });

      return {
        url: blockBlobClient.url,
        etag: uploadResponse.etag || '',
        lastModified: uploadResponse.lastModified || new Date(),
        contentLength: buffer.length
      };
    } catch (error) {
      logger.error('Error uploading video to Azure Blob Storage:', error);
      throw new Error(`Failed to upload video: ${error.message}`);
    }
  }

  /**
   * Upload large file using block blob upload (for files > 256MB)
   */
  async uploadLargeFile(
    buffer: Buffer,
    filename: string,
    metadata: EvidenceMetadata,
    chunkSize: number = 4 * 1024 * 1024 // 4MB chunks
  ): Promise<StorageUploadResult> {
    try {
      const blobName = `large-files/${this.generateBlobName(filename, metadata)}`;
      const blockBlobClient = this.blobServiceClient.getContainerClient(this.containerName).getBlockBlobClient(blobName);

      // Set blob metadata
      const blobMetadata = {
        violationId: metadata.violationId,
        propertyId: metadata.propertyId,
        platform: metadata.platform,
        listingId: metadata.listingId,
        capturedAt: metadata.capturedAt.toISOString(),
        device: metadata.device,
        type: metadata.type,
        uploadedAt: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        uploadMethod: 'block-blob'
      };

      // Upload using block blob method for large files
      const blockIds: string[] = [];
      const totalBlocks = Math.ceil(buffer.length / chunkSize);

      logger.info(`Starting large file upload: ${filename}`, {
        totalSize: buffer.length,
        chunkSize,
        totalBlocks
      });

      // Upload blocks in parallel
      const uploadPromises: Promise<void>[] = [];
      
      for (let i = 0; i < totalBlocks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, buffer.length);
        const chunk = buffer.slice(start, end);
        
        const blockId = this.generateBlockId(i);
        blockIds.push(blockId);
        
        uploadPromises.push(
          blockBlobClient.stageBlock(blockId, chunk, chunk.length)
        );
      }

      // Wait for all blocks to upload
      await Promise.all(uploadPromises);

      // Commit blocks
      const uploadResponse: BlobUploadCommonResponse = await blockBlobClient.commitBlockList(blockIds, {
        metadata: blobMetadata,
        blobHTTPHeaders: {
          blobContentType: metadata.mimeType || 'application/octet-stream',
          blobCacheControl: 'public, max-age=31536000',
          blobContentDisposition: `attachment; filename="${filename}"`
        },
        tags: {
          type: metadata.type,
          platform: metadata.platform,
          violationId: metadata.violationId,
          propertyId: metadata.propertyId
        }
      });

      logger.info(`Large file uploaded to Azure Blob Storage: ${blobName}`, {
        size: buffer.length,
        etag: uploadResponse.etag,
        url: blockBlobClient.url,
        totalBlocks
      });

      return {
        url: blockBlobClient.url,
        etag: uploadResponse.etag || '',
        lastModified: uploadResponse.lastModified || new Date(),
        contentLength: buffer.length
      };
    } catch (error) {
      logger.error('Error uploading large file to Azure Blob Storage:', error);
      throw new Error(`Failed to upload large file: ${error.message}`);
    }
  }

  /**
   * Get blob metadata
   */
  async getBlobMetadata(blobName: string): Promise<any> {
    try {
      const blockBlobClient = this.blobServiceClient.getContainerClient(this.containerName).getBlockBlobClient(blobName);
      const properties = await blockBlobClient.getProperties();
      return properties.metadata;
    } catch (error) {
      logger.error(`Error getting blob metadata for ${blobName}:`, error);
      throw error;
    }
  }

  /**
   * Delete blob
   */
  async deleteBlob(blobName: string): Promise<void> {
    try {
      const blockBlobClient = this.blobServiceClient.getContainerClient(this.containerName).getBlockBlobClient(blobName);
      await blockBlobClient.delete();
      logger.info(`Blob deleted: ${blobName}`);
    } catch (error) {
      logger.error(`Error deleting blob ${blobName}:`, error);
      throw error;
    }
  }

  /**
   * List blobs by tag
   */
  async listBlobsByTag(tagName: string, tagValue: string): Promise<string[]> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blobs: string[] = [];
      
      for await (const blob of containerClient.findBlobsByTags(tagName, tagValue)) {
        blobs.push(blob.name);
      }
      
      return blobs;
    } catch (error) {
      logger.error(`Error listing blobs by tag ${tagName}:${tagValue}:`, error);
      throw error;
    }
  }

  /**
   * Get blob URL with SAS token (for secure access)
   */
  getBlobUrlWithSas(blobName: string, expiresInSeconds: number = 3600): string {
    try {
      const blockBlobClient = this.blobServiceClient.getContainerClient(this.containerName).getBlockBlobClient(blobName);
      
      const sasToken = blockBlobClient.generateBlobSASQueryParameters({
        expiresOn: new Date(new Date().valueOf() + expiresInSeconds * 1000),
        permissions: 'r' // Read only
      });

      return `${blockBlobClient.url}?${sasToken}`;
    } catch (error) {
      logger.error(`Error generating SAS token for blob ${blobName}:`, error);
      throw error;
    }
  }

  /**
   * Generate unique blob name
   */
  private generateBlobName(filename: string, metadata: EvidenceMetadata): string {
    const timestamp = metadata.capturedAt.toISOString().replace(/[:.]/g, '-');
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${metadata.platform}/${metadata.violationId}/${timestamp}_${sanitizedFilename}`;
  }

  /**
   * Generate block ID for block blob upload
   */
  private generateBlockId(blockNumber: number): string {
    const blockId = blockNumber.toString().padStart(8, '0');
    return Buffer.from(blockId).toString('base64');
  }

  /**
   * Get container statistics
   */
  async getContainerStats(): Promise<{
    blobCount: number;
    totalSize: number;
    lastModified: Date;
  }> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      let blobCount = 0;
      let totalSize = 0;
      let lastModified = new Date(0);

      for await (const blob of containerClient.listBlobsFlat()) {
        blobCount++;
        totalSize += blob.properties.contentLength || 0;
        
        if (blob.properties.lastModified && blob.properties.lastModified > lastModified) {
          lastModified = blob.properties.lastModified;
        }
      }

      return {
        blobCount,
        totalSize,
        lastModified
      };
    } catch (error) {
      logger.error('Error getting container stats:', error);
      throw error;
    }
  }

  /**
   * Archive old evidence files
   */
  async archiveOldEvidence(daysOld: number = 90): Promise<number> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      let archivedCount = 0;
      
      for await (const blob of containerClient.listBlobsFlat()) {
        if (blob.properties.lastModified && blob.properties.lastModified < cutoffDate) {
          // Move to archive container or delete
          await this.deleteBlob(blob.name);
          archivedCount++;
        }
      }
      
      logger.info(`Archived ${archivedCount} evidence files older than ${daysOld} days`);
      return archivedCount;
    } catch (error) {
      logger.error('Error archiving old evidence:', error);
      throw error;
    }
  }

  /**
   * Generate blob URL for public access
   */
  getPublicUrl(blobName: string): string {
    const blockBlobClient = this.blobServiceClient.getContainerClient(this.containerName).getBlockBlobClient(blobName);
    return blockBlobClient.url;
  }
}
