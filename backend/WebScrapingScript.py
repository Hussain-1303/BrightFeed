from bs4 import BeautifulSoup
import requests
import time
import random
from datetime import datetime
from pymongo import MongoClient
import logging
import hashlib
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('npr_scraper.log'),
        logging.StreamHandler()
    ]
)

# Initialize VADER sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

# Main scraper configuration and logic
def main():
    # MongoDB setup - use environment variable
    mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
    
    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        db = client["NewsScraper"]
        collection = db["news"]
        logging.info("✅ MongoDB connection successful")
    except Exception as e:
        logging.error(f"❌ MongoDB connection failed: {e}")
        exit(1)

    # NPR configuration
    config = {
        "base_url": "https://www.npr.org",
        "categories": {
            "art": "sections/arts",
            "tech": "sections/technology",
            "science": "sections/science",
            "world": "sections/world",
            "gaming": "sections/technology",
            "sport": "sections/sports",
            "business": "sections/business"
        },
        "selectors": {
            "articles": "article.item",
            "headline": "h2.title a",
            "link": "h2.title a",
            "image": "div.imagewrap img",
            "description": "p.teaser a",
            "timestamp": "time[datetime]"
        },
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Referer": "https://www.npr.org/"
        }
    }

    def scrape_page(url):
        """Fetch page with error handling"""
        try:
            response = requests.get(url, headers=config["headers"], timeout=10)
            response.raise_for_status()
            return response.text
        except Exception as e:
            logging.error(f"❌ Error fetching {url}: {str(e)}")
            return None

    def parse_article(article, category):
        """Extract article data with robust error handling and sentiment analysis"""
        try:
            # Headline and URL
            headline_elem = article.select_one(config["selectors"]["headline"])
            if not headline_elem:
                logging.warning(f"⚠️ No headline found for article in {category}")
                return None
                
            headline = headline_elem.text.strip()
            url = headline_elem['href']
            if not url.startswith('http'):
                url = config["base_url"] + url
            
            logging.debug(f"Found headline: {headline}")

            # Skip duplicates
            content_hash = hashlib.md5((headline + url).encode()).hexdigest()
            if collection.find_one({"content_hash": content_hash}):
                logging.debug(f"🔄 Duplicate article skipped: {headline}")
                return None

            # Description
            desc_elem = article.select_one(config["selectors"]["description"])
            description = ""
            if desc_elem:
                time_elem = desc_elem.find('time')
                if time_elem:
                    time_elem.extract()
                description = desc_elem.text.strip()
                if not description:
                    description = headline[:100] + "..."
            else:
                description = headline[:100] + "..."

            logging.debug(f"Extracted description: {description}")

            # Sentiment Analysis using VADER
            headline_sentiment = analyzer.polarity_scores(headline)
            description_sentiment = analyzer.polarity_scores(description)
            logging.debug(f"Headline sentiment: {headline_sentiment}")

            # Image
            img_elem = article.select_one(config["selectors"]["image"])
            img_url = img_elem['src'] if img_elem and 'src' in img_elem.attrs else None

            # Timestamps
            time_elem = article.select_one(config["selectors"]["timestamp"])
            timestamp = time_elem['datetime'] if time_elem and 'datetime' in time_elem.attrs else datetime.utcnow().isoformat()

            # Map NPR categories
            mapped_category = category
            if category == "gaming":
                mapped_category = "tech"

            return {
                "category": mapped_category,
                "source": "NPR",
                "headline": headline,
                "description": description,
                "summary": description[:150] + "..." if len(description) > 150 else description,
                "sourceLink": url,
                "image": img_url,
                "date": timestamp,
                "content_hash": content_hash,
                "sentiment": {
                    "headline": headline_sentiment,
                    "description": description_sentiment
                }
            }

        except Exception as e:
            logging.warning(f"⚠️ Error parsing article in {category}: {str(e)}")
            return None

    def scrape_category(category):
        """Scrape a single category"""
        url = f"{config['base_url']}/{config['categories'][category]}"
        logging.info(f"🔍 Scraping {category}: {url}")
        
        html = scrape_page(url)
        if not html:
            return []
            
        soup = BeautifulSoup(html, 'html.parser')
        articles = []
        
        article_elements = soup.select(config["selectors"]["articles"])
        if not article_elements:
            logging.warning(f"⚠️ No articles found for {category}")
        
        for article in article_elements[:15]:
            parsed = parse_article(article, category)
            if parsed:
                articles.append(parsed)
        
        logging.info(f"✅ Scraped {len(articles)} articles from {category}")
        return articles

    def save_articles(articles):
        """Save to MongoDB with batch insert"""
        if not articles:
            logging.info("ℹ️ No articles to save")
            return
            
        try:
            new_articles = [
                article for article in articles
                if not collection.find_one({"content_hash": article["content_hash"]})
            ]
            
            if new_articles:
                result = collection.insert_many(new_articles)
                logging.info(f"✅ Inserted {len(result.inserted_ids)} new articles")
            else:
                logging.info("ℹ️ No new articles found (all duplicates)")
                
        except Exception as e:
            logging.error(f"❌ Database error: {str(e)}")

    # Main execution loop - runs every 4 hours (14400 seconds)
    try:
        logging.info("🚀 NPR Scraper started - will run every 4 hours")
        
        while True:
            logging.info(f"⏱️ Starting scrape cycle at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            
            all_articles = []
            for category in config["categories"]:
                try:
                    articles = scrape_category(category)
                    all_articles.extend(articles)
                    time.sleep(random.uniform(1, 3))  # Respectful delay between requests
                except Exception as e:
                    logging.error(f"❌ Error in {category}: {str(e)}")
                    continue
            
            save_articles(all_articles)
            
            logging.info("✅ Scrape cycle complete")
            logging.info("⏰ Next scrape in 4 hours...")
            
            # Wait 4 hours (14400 seconds) before next scrape
            time.sleep(14400)
            
    except KeyboardInterrupt:
        logging.info("🛑 Scraper stopped by user")
    finally:
        client.close()
        logging.info("🔌 MongoDB connection closed")

if __name__ == '__main__':
    main()