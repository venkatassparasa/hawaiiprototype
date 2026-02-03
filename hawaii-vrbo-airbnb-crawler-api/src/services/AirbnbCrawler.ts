import { query } from '../config/database';
import { logger } from '../utils/logger';

export interface AirbnbListing {
  id: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  price: {
    nightly: number;
    weekly?: number;
    monthly?: number;
    currency: string;
  };
  capacity: {
    guests: number;
    bedrooms: number;
    bathrooms: number;
    beds: number;
  };
  amenities: string[];
  images: string[];
  host: {
    id: string;
    name: string;
    responseRate?: number;
    responseTime?: string;
  };
  availability: {
    available: boolean;
    checkIn: string;
    checkOut: string;
  };
  reviews: {
    count: number;
    rating: number;
  };
  url: string;
  scrapedAt: string;
}

export interface CrawlOptions {
  locations: string[];
  maxListings?: number;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export interface CrawlStatistics {
  totalProperties: number;
  activeAirbnbListings: number;
  totalViolations: number;
  unregisteredProperties: number;
  lastCrawl: string;
}

export class AirbnbCrawler {
  private readonly maxRetries = 3;
  private readonly delayBetweenRequests = 1000; // 1 second

  async crawlHawaiiListings(options: CrawlOptions): Promise<void> {
    logger.info(`Starting Airbnb crawl for locations: ${options.locations.join(', ')}`);
    
    try {
      // Mock implementation - in real scenario, this would use Apify SDK to scrape Airbnb
      const mockListings = await this.generateMockListings(options);
      
      for (const listing of mockListings) {
        await this.processListing(listing);
        await this.delay(this.delayBetweenRequests);
      }
      
      logger.info(`Completed Airbnb crawl. Processed ${mockListings.length} listings`);
    } catch (error) {
      logger.error('Airbnb crawl failed:', error);
      throw error;
    }
  }

  private async generateMockListings(options: CrawlOptions): Promise<AirbnbListing[]> {
    const listings: AirbnbListing[] = [];
    const count = Math.min(options.maxListings || 100, 50); // Limit to 50 for demo
    
    for (let i = 0; i < count; i++) {
      const location = options.locations[i % options.locations.length];
      listings.push({
        id: `airbnb-${Date.now()}-${i}`,
        title: `Hawaii Vacation Rental ${i + 1}`,
        description: `Beautiful vacation rental in ${location}`,
        location: {
          address: `${123 + i} Main St, ${location}, HI`,
          city: location.split(',')[0],
          state: 'HI',
          country: 'USA',
          coordinates: {
            lat: 19.8968 + (Math.random() - 0.5) * 0.1,
            lng: -155.5828 + (Math.random() - 0.5) * 0.1,
          },
        },
        price: {
          nightly: 150 + Math.floor(Math.random() * 200),
          currency: 'USD',
        },
        capacity: {
          guests: 2 + Math.floor(Math.random() * 8),
          bedrooms: 1 + Math.floor(Math.random() * 4),
          bathrooms: 1 + Math.floor(Math.random() * 3),
          beds: 1 + Math.floor(Math.random() * 5),
        },
        amenities: ['WiFi', 'Kitchen', 'Parking', 'AC'],
        images: [`https://example.com/image${i}.jpg`],
        host: {
          id: `host-${i}`,
          name: `Host ${i + 1}`,
          responseRate: 90 + Math.floor(Math.random() * 10),
        },
        availability: {
          available: Math.random() > 0.3,
          checkIn: '2024-02-01',
          checkOut: '2024-02-08',
        },
        reviews: {
          count: Math.floor(Math.random() * 100),
          rating: 3 + Math.random() * 2,
        },
        url: `https://airbnb.com/rooms/${i}`,
        scrapedAt: new Date().toISOString(),
      });
    }
    
    return listings;
  }

  private async processListing(listing: AirbnbListing): Promise<void> {
    try {
      // Check if property already exists
      const existingProperty = await query(
        'SELECT * FROM properties WHERE property_id = $1',
        [listing.id]
      );

      if (existingProperty.rows.length === 0) {
        // Insert new property
        await query(
          `INSERT INTO properties (property_id, address, zoning_code, max_occupancy, created_at, updated_at) 
           VALUES ($1, $2, $3, $4, NOW(), NOW())`,
          [
            listing.id,
            listing.location.address,
            'R-1', // Default zoning
            listing.capacity.guests,
          ]
        );
        logger.info(`Added new property: ${listing.id}`);
      } else {
        // Update existing property
        await query(
          `UPDATE properties SET address = $1, max_occupancy = $2, updated_at = NOW() 
           WHERE property_id = $3`,
          [
            listing.location.address,
            listing.capacity.guests,
            listing.id,
          ]
        );
      }

      // Check for violations (mock implementation)
      await this.checkForViolations(listing);
      
    } catch (error) {
      logger.error(`Error processing listing ${listing.id}:`, error);
    }
  }

  private async checkForViolations(listing: AirbnbListing): Promise<void> {
    const violations = [];

    // Mock violation detection logic
    if (listing.capacity.guests > 6) {
      violations.push({
        type: 'Occupancy Limit Exceeded',
        description: `Property allows ${listing.capacity.guests} guests, exceeding local limits`,
        severity: 'high',
      });
    }

    if (listing.price.nightly < 50) {
      violations.push({
        type: 'Suspicious Pricing',
        description: 'Unusually low nightly rate may indicate illegal rental',
        severity: 'medium',
      });
    }

    // Insert violations if found
    for (const violation of violations) {
      await query(
        `INSERT INTO violations (violation_id, property_id, violation_type, description, status, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [
          `violation-${listing.id}-${Date.now()}`,
          listing.id,
          violation.type,
          violation.description,
          'open',
        ]
      );
    }
  }

  async getCrawlStatistics(): Promise<CrawlStatistics> {
    try {
      const propertiesResult = await query('SELECT COUNT(*) as total FROM properties');
      const violationsResult = await query('SELECT COUNT(*) as total FROM violations WHERE status = $1', ['open']);
      
      return {
        totalProperties: parseInt(propertiesResult.rows[0].total),
        activeAirbnbListings: Math.floor(Math.random() * 100), // Mock data
        totalViolations: parseInt(violationsResult.rows[0].total),
        unregisteredProperties: Math.floor(Math.random() * 20), // Mock data
        lastCrawl: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Error getting crawl statistics:', error);
      throw error;
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = this.maxRetries
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        logger.warn(`Operation failed (attempt ${attempt}/${maxRetries}):`, error);
        
        if (attempt < maxRetries) {
          await this.delay(1000 * attempt); // Exponential backoff
        }
      }
    }
    
    throw lastError!;
  }
}
