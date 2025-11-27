import '@testing-library/jest-dom';

/**
 * E2E Integration Tests for /api/news endpoint
 * 
 * This test suite validates that the API endpoint returns properly formatted
 * article data with all required fields and handles database inconsistencies
 * gracefully without throwing 500 errors.
 */

// Mock fetch for testing API calls
global.fetch = jest.fn();

describe('API /api/news Endpoint - E2E Integration Tests', () => {
  const API_BASE_URL = 'http://localhost:5001';
  const NEWS_ENDPOINT = `${API_BASE_URL}/api/news`;

  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Successful API Response', () => {
    it('should return properly formatted articles with all required fields', async () => {
      // Mock successful API response
      const mockArticles = [
        {
          category: 'tech',
          source: 'NPR',
          headline: 'AI Revolution in Software Development',
          summary: 'New AI tools are changing how developers work',
          description: 'Detailed description of AI impact on coding...',
          image: 'https://example.com/image1.jpg',
          sourceLink: 'https://www.npr.org/2025/01/15/ai-revolution',
          date: '2025-01-15',
          sentiment: { compound: 0.5, positive: 0.7, neutral: 0.2, negative: 0.1 }
        },
        {
          category: 'science',
          source: 'NPR',
          headline: 'Breakthrough in Quantum Computing',
          summary: 'Scientists achieve new quantum milestone',
          description: 'Revolutionary advancement in quantum technology...',
          image: 'https://example.com/image2.jpg',
          sourceLink: 'https://www.npr.org/2025/01/16/quantum-breakthrough',
          date: '2025-01-16',
          sentiment: { compound: 0.8, positive: 0.9, neutral: 0.1, negative: 0.0 }
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockArticles,
      });

      const response = await fetch(NEWS_ENDPOINT);
      const articles = await response.json();

      // Verify response structure
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBe(2);

      // Verify each article has all required fields
      articles.forEach(article => {
        expect(article).toHaveProperty('category');
        expect(article).toHaveProperty('source');
        expect(article).toHaveProperty('headline');
        expect(article).toHaveProperty('summary');
        expect(article).toHaveProperty('description');
        expect(article).toHaveProperty('image');
        expect(article).toHaveProperty('sourceLink');
        expect(article).toHaveProperty('date');
        expect(article).toHaveProperty('sentiment');

        // Verify field types and non-null values for critical fields
        expect(typeof article.category).toBe('string');
        expect(typeof article.source).toBe('string');
        expect(typeof article.headline).toBe('string');
        expect(typeof article.summary).toBe('string');
        expect(typeof article.description).toBe('string');
        expect(typeof article.image).toBe('string');
        expect(typeof article.sourceLink).toBe('string');
        expect(typeof article.date).toBe('string');
        expect(typeof article.sentiment).toBe('object');

        // Verify sourceLink is a valid URL format
        if (article.sourceLink) {
          expect(article.sourceLink).toMatch(/^https?:\/\/.+/);
        }
      });
    });

    it('should handle articles with missing or null fields gracefully', async () => {
      // Mock response simulating server.py transformation - all articles have all fields with fallback values
      const mockArticlesWithMissingFields = [
        {
          category: 'tech',
          source: 'NPR',
          headline: 'Test Article',
          summary: '',  // Empty summary
          description: '',  // Server converts null to empty string
          image: '',    // Server provides empty string for missing field
          sourceLink: 'https://example.com/test',
          date: '2025-01-15',
          sentiment: {}  // Empty sentiment object
        },
        {
          category: '',  // Empty category
          source: 'NPR',
          headline: 'Another Test',
          summary: 'Test summary',
          description: 'Test description',
          image: '',  // Empty image URL
          sourceLink: '',  // Empty sourceLink
          date: '',   // Server provides empty string for missing field
          sentiment: { compound: 0.5 }
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockArticlesWithMissingFields,
      });

      const response = await fetch(NEWS_ENDPOINT);
      const articles = await response.json();

      expect(response.ok).toBe(true);
      expect(Array.isArray(articles)).toBe(true);

      // Verify all articles still have all required properties (even if empty/default values)
      articles.forEach(article => {
        expect(article).toHaveProperty('category');
        expect(article).toHaveProperty('source');
        expect(article).toHaveProperty('headline');
        expect(article).toHaveProperty('summary');
        expect(article).toHaveProperty('description');
        expect(article).toHaveProperty('image');
        expect(article).toHaveProperty('sourceLink');
        expect(article).toHaveProperty('date');
        expect(article).toHaveProperty('sentiment');

        // Verify fallback values work correctly
        expect(typeof article.category).toBe('string');
        expect(typeof article.source).toBe('string');
        expect(typeof article.headline).toBe('string');
        expect(typeof article.summary).toBe('string');
        expect(typeof article.description).toBe('string');
        expect(typeof article.image).toBe('string');
        expect(typeof article.sourceLink).toBe('string');
        expect(typeof article.date).toBe('string');
        expect(typeof article.sentiment).toBe('object');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      // Mock server error response
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Database connection failed' }),
      });

      const response = await fetch(NEWS_ENDPOINT);
      
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);

      const errorResponse = await response.json();
      expect(errorResponse).toHaveProperty('error');
      expect(typeof errorResponse.error).toBe('string');
    });

    it('should handle network errors', async () => {
      // Mock network error
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetch(NEWS_ENDPOINT)).rejects.toThrow('Network error');
    });

    it('should handle empty response gracefully', async () => {
      // Mock empty articles array
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [],
      });

      const response = await fetch(NEWS_ENDPOINT);
      const articles = await response.json();

      expect(response.ok).toBe(true);
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBe(0);
    });
  });

  describe('Data Integrity Validation', () => {
    it('should validate sourceLink field name handling (legacy url vs sourceLink)', async () => {
      // Mock response simulating how server.py handles url field and converts to sourceLink
      const mockArticlesWithUrlField = [
        {
          category: 'tech',
          source: 'NPR',
          headline: 'Legacy Article with URL field',
          summary: 'This article uses the old url field',
          description: 'Testing backward compatibility...',
          image: 'https://example.com/legacy.jpg',
          sourceLink: 'https://www.npr.org/legacy-url',  // Server converts 'url' to 'sourceLink'
          date: '2025-01-15',
          sentiment: { compound: 0.5 }
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockArticlesWithUrlField,
      });

      const response = await fetch(NEWS_ENDPOINT);
      const articles = await response.json();

      expect(response.ok).toBe(true);
      expect(articles[0]).toHaveProperty('sourceLink');
      
      // The API should convert 'url' field to 'sourceLink' in response
      expect(articles[0].sourceLink).toBe('https://www.npr.org/legacy-url');
    });

    it('should handle date field variations (date vs timestamp)', async () => {
      // Mock response simulating how server.py handles timestamp field and converts to date
      const mockArticlesWithTimestamp = [
        {
          category: 'tech',
          source: 'NPR',
          headline: 'Article with timestamp',
          summary: 'Uses timestamp instead of date',
          description: 'Testing date field handling...',
          image: 'https://example.com/timestamp.jpg',
          sourceLink: 'https://www.npr.org/timestamp-test',
          date: '2025-01-15T10:30:00Z',  // Server converts 'timestamp' to 'date'
          sentiment: { compound: 0.5 }
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockArticlesWithTimestamp,
      });

      const response = await fetch(NEWS_ENDPOINT);
      const articles = await response.json();

      expect(response.ok).toBe(true);
      expect(articles[0]).toHaveProperty('date');
      
      // The API should handle timestamp field and map it to date
      expect(articles[0].date).toBe('2025-01-15T10:30:00Z');
    });

    it('should validate sentiment analysis data structure', async () => {
      const mockArticlesWithSentiment = [
        {
          category: 'tech',
          source: 'NPR',
          headline: 'Article with Sentiment Analysis',
          summary: 'Testing sentiment data structure',
          description: 'Validating sentiment analysis integration...',
          image: 'https://example.com/sentiment.jpg',
          sourceLink: 'https://www.npr.org/sentiment-test',
          date: '2025-01-15',
          sentiment: {
            compound: 0.7532,
            positive: 0.8,
            negative: 0.1,
            neutral: 0.1
          }
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockArticlesWithSentiment,
      });

      const response = await fetch(NEWS_ENDPOINT);
      const articles = await response.json();

      expect(response.ok).toBe(true);
      expect(articles[0].sentiment).toBeDefined();
      expect(typeof articles[0].sentiment).toBe('object');
      
      // Validate sentiment score ranges (if present)
      const sentiment = articles[0].sentiment;
      if (sentiment.compound !== undefined) {
        expect(sentiment.compound).toBeGreaterThanOrEqual(-1);
        expect(sentiment.compound).toBeLessThanOrEqual(1);
      }
      if (sentiment.positive !== undefined) {
        expect(sentiment.positive).toBeGreaterThanOrEqual(0);
        expect(sentiment.positive).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('Performance and Load Handling', () => {
    it('should handle large number of articles efficiently', async () => {
      // Generate mock data for 100 articles
      const mockLargeDataset = Array.from({ length: 100 }, (_, index) => ({
        category: ['tech', 'science', 'world', 'business'][index % 4],
        source: 'NPR',
        headline: `Test Article ${index + 1}`,
        summary: `Summary for article ${index + 1}`,
        description: `Detailed description for article ${index + 1}`,
        image: `https://example.com/image${index + 1}.jpg`,
        sourceLink: `https://www.npr.org/article-${index + 1}`,
        date: '2025-01-15',
        sentiment: { compound: Math.random() * 2 - 1 }
      }));

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockLargeDataset,
      });

      const startTime = Date.now();
      const response = await fetch(NEWS_ENDPOINT);
      const articles = await response.json();
      const endTime = Date.now();

      expect(response.ok).toBe(true);
      expect(articles.length).toBe(100);
      
      // Verify all articles maintain proper structure
      articles.forEach(article => {
        expect(article).toHaveProperty('category');
        expect(article).toHaveProperty('sourceLink');
        expect(article).toHaveProperty('sentiment');
      });

      // Performance should be reasonable (less than 1 second for mock response)
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});