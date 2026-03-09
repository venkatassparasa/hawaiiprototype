import { Property, IProperty } from '../models/Property';
import { Violation, IViolation } from '../models/Violation';
import { AzureStorageService } from './azureStorageService';
import { logger } from '../utils/logger';
import { Actor } from 'apify';

export interface ViolationDetectionResult {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  evidence: any;
  detectedAt: Date;
}

export interface ListingData {
  platform: 'airbnb' | 'vrbo';
  listingId: string;
  url: string;
  title: string;
  price: number;
  occupancy: number;
  description: string;
  lastScraped: Date;
  screenshots?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export class ViolationDetector {
  private azureStorageService: AzureStorageService;
  private actor: Actor;

  constructor() {
    this.azureStorageService = new AzureStorageService();
    this.actor = new Actor();
  }

  /**
   * Detect violations for a property
   */
  async detectViolations(
    property: IProperty,
    listingData: ListingData,
    platform: 'airbnb' | 'vrbo',
    screenshotUrl?: string
  ): Promise<Partial<IViolation>[]> {
    const violations: Partial<IViolation>[] = [];
    const detectedAt = new Date();

    try {
      // 1. Check for unregistered operation
      const unregisteredViolation = await this.checkUnregisteredOperation(property, listingData, detectedAt);
      if (unregisteredViolation) {
        violations.push(unregisteredViolation);
      }

      // 2. Check occupancy violations
      const occupancyViolation = await this.checkOccupancyViolation(property, listingData, detectedAt);
      if (occupancyViolation) {
        violations.push(occupancyViolation);
      }

      // 3. Check zoning violations
      const zoningViolation = await this.checkZoningViolation(property, listingData, detectedAt);
      if (zoningViolation) {
        violations.push(zoningViolation);
      }

      // 4. Check for multiple listings
      const multipleListingViolation = await this.checkMultipleListings(property, listingData, detectedAt);
      if (multipleListingViolation) {
        violations.push(multipleListingViolation);
      }

      // 5. Check for false advertising
      const falseAdvertisingViolation = await this.checkFalseAdvertising(property, listingData, detectedAt);
      if (falseAdvertisingViolation) {
        violations.push(falseAdvertisingViolation);
      }

      // 6. Check for license violations
      const licenseViolation = await this.checkLicenseViolation(property, listingData, detectedAt);
      if (licenseViolation) {
        violations.push(licenseViolation);
      }

      // 7. Check for price violations
      const priceViolation = await this.checkPriceViolation(property, listingData, detectedAt);
      if (priceViolation) {
        violations.push(priceViolation);
      }

      // 8. Take additional screenshots if needed
      if (violations.length > 0 && !screenshotUrl) {
        const additionalScreenshotUrl = await this.takeAdditionalScreenshot(listingData.url, property, listingData);
        if (additionalScreenshotUrl) {
          violations.forEach(violation => {
            if (violation.evidence?.screenshots) {
              violation.evidence.screenshots.push(additionalScreenshotUrl);
            }
          });
        }
      }

      logger.info(`Detected ${violations.length} violations for property ${property._id}`, {
        violations: violations.map(v => v.type),
        platform,
        listingId: listingData.listingId
      });

      return violations;
    } catch (error) {
      logger.error('Error detecting violations:', error);
      throw error;
    }
  }

  /**
   * Check for unregistered operation
   */
  private async checkUnregisteredOperation(
    property: IProperty,
    listingData: ListingData,
    detectedAt: Date
  ): Promise<Partial<IViolation> | null> {
    if (property.isRegistered) {
      return null;
    }

    // Check if registration is required for this zone
    const registrationRequired = this.isRegistrationRequired(property.zoneCode);
    if (!registrationRequired) {
      return null;
    }

    const screenshots = await this.captureScreenshots(listingData.url, 'unregistered-check');

    return {
      propertyId: property._id,
      type: 'unregistered',
      severity: 'high',
      status: 'detected',
      evidence: {
        screenshots,
        listingData: {
          platform: listingData.platform,
          listingId: listingData.listingId,
          url: listingData.url,
          title: listingData.title,
          price: listingData.price,
          occupancy: listingData.occupancy,
          description: listingData.description,
          lastScraped: listingData.lastScraped
        },
        comparisonData: {
          isRegistered: property.isRegistered,
          registrationNumber: property.registrationNumber,
          zoneCode: property.zoneCode,
          registrationRequired: true
        }
      },
      detectedAt,
      detectedBy: 'system',
      detectionScore: 95,
      description: `Property operating without TVR registration in ${property.zoneCode} zone`
    };
  }

  /**
   * Check for occupancy violations
   */
  private async checkOccupancyViolation(
    property: IProperty,
    listingData: ListingData,
    detectedAt: Date
  ): Promise<Partial<IViolation> | null> {
    const maxOccupancy = this.getMaxOccupancyForZone(property.zoneCode);
    if (!maxOccupancy || listingData.occupancy <= maxOccupancy) {
      return null;
    }

    const screenshots = await this.captureScreenshots(listingData.url, 'occupancy-check');

    return {
      propertyId: property._id,
      type: 'occupancy-violation',
      severity: this.calculateOccupancySeverity(listingData.occupancy, maxOccupancy),
      status: 'detected',
      evidence: {
        screenshots,
        listingData: {
          platform: listingData.platform,
          listingId: listingData.listingId,
          url: listingData.url,
          title: listingData.title,
          price: listingData.price,
          occupancy: listingData.occupancy,
          description: listingData.description,
          lastScraped: listingData.lastScraped
        },
        comparisonData: {
          listedOccupancy: listingData.occupancy,
          maxAllowedOccupancy: maxOccupancy,
          zoneCode: property.zoneCode,
          excessOccupancy: listingData.occupancy - maxOccupancy
        }
      },
      detectedAt,
      detectedBy: 'system',
      detectionScore: this.calculateOccupancyConfidence(listingData.occupancy, maxOccupancy),
      description: `Property listing ${listingData.occupancy} occupants exceeds maximum allowed ${maxOccupancy} for ${property.zoneCode} zone`
    };
  }

  /**
   * Check for zoning violations
   */
  private async checkZoningViolation(
    property: IProperty,
    listingData: ListingData,
    detectedAt: Date
  ): Promise<Partial<IViolation> | null> {
    const allowedZones = this.getAllowedZonesForShortTermRentals();
    if (allowedZones.includes(property.zoneCode)) {
      return null;
    }

    const screenshots = await this.captureScreenshots(listingData.url, 'zoning-check');

    return {
      propertyId: property._id,
      type: 'zoning-violation',
      severity: 'high',
      status: 'detected',
      evidence: {
        screenshots,
        listingData: {
          platform: listingData.platform,
          listingId: listingData.listingId,
          url: listingData.url,
          title: listingData.title,
          price: listingData.price,
          occupancy: listingData.occupancy,
          description: listingData.description,
          lastScraped: listingData.lastScraped
        },
        comparisonData: {
          propertyZoning: property.zoneCode,
          allowedZones: allowedZones,
          zoningRestrictions: this.getZoningRestrictions(property.zoneCode)
        }
      },
      detectedAt,
      detectedBy: 'system',
      detectionScore: 98,
      description: `Property operating in ${property.zoneCode} zone where short-term rentals are prohibited`
    };
  }

  /**
   * Check for multiple platform listings
   */
  private async checkMultipleListings(
    property: IProperty,
    listingData: ListingData,
    detectedAt: Date
  ): Promise<Partial<IViolation> | null> {
    const otherPlatform = listingData.platform === 'airbnb' ? property.vrbo : property.airbnb;
    
    if (!otherPlatform || !otherPlatform.isActive) {
      return null;
    }

    const screenshots = await this.captureScreenshots(listingData.url, 'multiple-listings-check');

    return {
      propertyId: property._id,
      type: 'multiple-listings',
      severity: 'medium',
      status: 'detected',
      evidence: {
        screenshots,
        listingData: {
          platform: listingData.platform,
          listingId: listingData.listingId,
          url: listingData.url,
          title: listingData.title,
          price: listingData.price,
          occupancy: listingData.occupancy,
          description: listingData.description,
          lastScraped: listingData.lastScraped
        },
        comparisonData: {
          airbnbListingId: property.airbnb?.listingId,
          vrboListingId: property.vrbo?.listingId,
          propertyMatch: true,
          platforms: ['airbnb', 'vrbo']
        }
      },
      detectedAt,
      detectedBy: 'system',
      detectionScore: 88,
      description: `Property listed on multiple platforms: ${listingData.platform} and ${otherPlatform.platform || 'other'}`
    };
  }

  /**
   * Check for false advertising
   */
  private async checkFalseAdvertising(
    property: IProperty,
    listingData: ListingData,
    detectedAt: Date
  ): Promise<Partial<IViolation> | null> {
    const suspiciousKeywords = this.getSuspiciousKeywords(listingData.description);
    if (suspiciousKeywords.length === 0) {
      return null;
    }

    const screenshots = await this.captureScreenshots(listingData.url, 'false-advertising-check');

    return {
      propertyId: property._id,
      type: 'false-advertising',
      severity: 'low',
      status: 'detected',
      evidence: {
        screenshots,
        listingData: {
          platform: listingData.platform,
          listingId: listingData.listingId,
          url: listingData.url,
          title: listingData.title,
          price: listingData.price,
          occupancy: listingData.occupancy,
          description: listingData.description,
          lastScraped: listingData.lastScraped
        },
        comparisonData: {
          suspiciousKeywords,
          descriptionAnalysis: this.analyzeDescription(listingData.description),
          propertyType: property.propertyType
        }
      },
      detectedAt,
      detectedBy: 'system',
      detectionScore: 65,
      description: `Listing contains potentially misleading information: ${suspiciousKeywords.join(', ')}`
    };
  }

  /**
   * Check for license violations
   */
  private async checkLicenseViolation(
    property: IProperty,
    listingData: ListingData,
    detectedAt: Date
  ): Promise<Partial<IViolation> | null> {
    const licenseRequired = this.isLicenseRequired(property.zoneCode);
    if (!licenseRequired || property.registrationNumber) {
      return null;
    }

    const screenshots = await this.captureScreenshots(listingData.url, 'license-check');

    return {
      propertyId: property._id,
      type: 'license-violation',
      severity: 'high',
      status: 'detected',
      evidence: {
        screenshots,
        listingData: {
          platform: listingData.platform,
          listingId: listingData.listingId,
          url: listingData.url,
          title: listingData.title,
          price: listingData.price,
          occupancy: listingData.occupancy,
          description: listingData.description,
          lastScraped: listingData.lastScraped
        },
        comparisonData: {
          licenseRequired: true,
          registrationNumber: property.registrationNumber,
          zoneCode: property.zoneCode,
          licenseType: this.getRequiredLicenseType(property.zoneCode)
        }
      },
      detectedAt,
      detectedBy: 'system',
      detectionScore: 92,
      description: `Property operating without required license for ${property.zoneCode} zone`
    };
  }

  /**
   * Check for price violations
   */
  private async checkPriceViolation(
    property: IProperty,
    listingData: ListingData,
    detectedAt: Date
  ): Promise<Partial<IViolation> | null> {
    const priceViolation = this.detectPriceViolation(listingData.price, property.zoneCode);
    if (!priceViolation) {
      return null;
    }

    const screenshots = await this.captureScreenshots(listingData.url, 'price-check');

    return {
      propertyId: property._id,
      type: 'price-violation',
      severity: 'medium',
      status: 'detected',
      evidence: {
        screenshots,
        listingData: {
          platform: listingData.platform,
          listingId: listingData.listingId,
          url: listingData.url,
          title: listingData.title,
          price: listingData.price,
          occupancy: listingData.occupancy,
          description: listingData.description,
          lastScraped: listingData.lastScraped
        },
        comparisonData: {
          listedPrice: listingData.price,
          priceViolation: priceViolation,
          zoneCode: property.zoneCode,
          marketPriceRange: this.getMarketPriceRange(property.zoneCode)
        }
      },
      detectedAt,
      detectedBy: 'system',
      detectionScore: 75,
      description: `Listing price $${listingData.price} may violate pricing regulations for ${property.zoneCode} zone`
    };
  }

  /**
   * Capture screenshots of a listing
   */
  private async captureScreenshots(url: string, purpose: string): Promise<string[]> {
    try {
      const screenshots: string[] = [];
      
      // Take primary screenshot
      const screenshotBuffer = await this.actor.call('apify/web-screenshot', {
        url,
        width: 1920,
        height: 1080,
        waitUntil: 'networkidle2'
      });

      const metadata = {
        violationId: 'temp',
        propertyId: 'temp',
        platform: 'web',
        listingId: 'temp',
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

      screenshots.push(uploadResult.url);

      logger.info(`Captured screenshot for ${purpose}: ${uploadResult.url}`);
      return screenshots;
    } catch (error) {
      logger.error(`Error capturing screenshots for ${purpose}:`, error);
      return [];
    }
  }

  /**
   * Take additional screenshot
   */
  private async takeAdditionalScreenshot(url: string, property: IProperty, listingData: ListingData): Promise<string | null> {
    try {
      const screenshotBuffer = await this.actor.call('apify/web-screenshot', {
        url,
        width: 1920,
        height: 1080,
        waitUntil: 'networkidle2',
        scrollPage: true
      });

      const metadata = {
        violationId: 'temp',
        propertyId: property._id.toString(),
        platform: listingData.platform,
        listingId: listingData.listingId,
        capturedAt: new Date(),
        device: 'apify-screenshot-full',
        type: 'screenshot' as const,
        size: screenshotBuffer.body.length,
        mimeType: 'image/png'
      };

      const filename = `full-page-${listingData.platform}-${listingData.listingId}-${Date.now()}.png`;
      const uploadResult = await this.azureStorageService.uploadScreenshot(
        screenshotBuffer.body,
        filename,
        metadata
      );

      return uploadResult.url;
    } catch (error) {
      logger.error('Error taking additional screenshot:', error);
      return null;
    }
  }

  // Helper methods for violation detection logic

  private isRegistrationRequired(zoneCode: string): boolean {
    const registrationRequiredZones = ['R-1', 'R-2', 'R-3', 'Commercial'];
    return registrationRequiredZones.includes(zoneCode);
  }

  private getMaxOccupancyForZone(zoneCode: string): number {
    const occupancyLimits: { [key: string]: number } = {
      'R-1': 6,
      'R-2': 8,
      'R-3': 10,
      'Commercial': 12,
      'Agricultural': 6
    };
    return occupancyLimits[zoneCode] || 0;
  }

  private calculateOccupancySeverity(listedOccupancy: number, maxOccupancy: number): 'low' | 'medium' | 'high' | 'critical' {
    const excess = listedOccupancy - maxOccupancy;
    if (excess <= 2) return 'low';
    if (excess <= 4) return 'medium';
    if (excess <= 6) return 'high';
    return 'critical';
  }

  private calculateOccupancyConfidence(listedOccupancy: number, maxOccupancy: number): number {
    const excess = listedOccupancy - maxOccupancy;
    const confidence = Math.min(95, 70 + (excess * 5));
    return confidence;
  }

  private getAllowedZonesForShortTermRentals(): string[] {
    return ['Commercial', 'Resort'];
  }

  private getZoningRestrictions(zoneCode: string): string[] {
    const restrictions: { [key: string]: string[] } = {
      'R-1': ['no-commercial-activity', 'owner-occupancy-required', 'max-occupancy-6'],
      'R-2': ['no-commercial-activity', 'max-occupancy-8'],
      'R-3': ['no-commercial-activity', 'max-occupancy-10'],
      'Agricultural': ['agricultural-use-only', 'no-commercial-activity', 'max-occupancy-6']
    };
    return restrictions[zoneCode] || [];
  }

  private getSuspiciousKeywords(description: string): string[] {
    const suspiciousWords = [
      'unlimited', 'unrestricted', 'no-permit', 'illegal', 'unlicensed',
      'cash-only', 'off-the-books', 'hidden', 'secret', 'unregistered'
    ];
    
    return suspiciousWords.filter(word => 
      description.toLowerCase().includes(word.toLowerCase())
    );
  }

  private analyzeDescription(description: string): any {
    const wordCount = description.split(/\s+/).length;
    const hasContactInfo = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b|\b\d{10}\b/.test(description);
    const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(description);
    
    return {
      wordCount,
      hasContactInfo,
      hasEmail,
      suspiciousPhrases: this.getSuspiciousKeywords(description)
    };
  }

  private isLicenseRequired(zoneCode: string): boolean {
    const licenseRequiredZones = ['Commercial', 'Resort', 'R-1', 'R-2', 'R-3'];
    return licenseRequiredZones.includes(zoneCode);
  }

  private getRequiredLicenseType(zoneCode: string): string {
    const licenseTypes: { [key: string]: string } = {
      'Commercial': 'Commercial TVR License',
      'Resort': 'Resort TVR License',
      'R-1': 'Residential TVR License',
      'R-2': 'Residential TVR License',
      'R-3': 'Residential TVR License'
    };
    return licenseTypes[zoneCode] || 'General TVR License';
  }

  private detectPriceViolation(price: number, zoneCode: string): any {
    // This would integrate with Hawaii County pricing regulations
    // For now, return null (no violation)
    return null;
  }

  private getMarketPriceRange(zoneCode: string): { min: number; max: number } {
    const priceRanges: { [key: string]: { min: number; max: number } } = {
      'R-1': { min: 100, max: 300 },
      'R-2': { min: 80, max: 250 },
      'R-3': { min: 60, max: 200 },
      'Commercial': { min: 150, max: 500 },
      'Agricultural': { min: 50, max: 150 }
    };
    return priceRanges[zoneCode] || { min: 50, max: 500 };
  }
}
