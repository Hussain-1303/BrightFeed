from bs4 import BeautifulSoup
import requests
import time
import os
from datetime import datetime
from pymongo import MongoClient

# Connects to MongoDB
client = MongoClient("mongodb://localhost:27017/") # host
db = client["NewsScraper"] # Database name
collection = db["news"] # Collection name


# Create a directory for storing posts
if not os.path.exists('news_articles'):
    os.makedirs('news_articles')

print("Enter a news category you are interested in (e.g., world, technology, business, sport, arts, science):")
news_category = input('>').strip().lower()
print(f'Filtering news for: {news_category}')

# BBC and CNN URL mapping
news_sources = {
    "BBC": {
        "url": f"https://www.bbc.com/{'news/' + news_category if news_category not in ['arts', 'sport'] else news_category}",
        "card-headline": "h2",
        "card-metadata-lastupdated": "span",
        "card-metadata-tag": "span",
        "card-description": "p"
    },
    "CNN": {
        "url": f"https://www.cnn.com/{news_category}",
        "headline": "h2",
        "description": "span"  
    }
}

def find_news(source_name, source_config):
    url = source_config["url"]
    print(f"Fetching news from {source_name}: {url}")

    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to retrieve news from {url}. HTTP Status Code: {response.status_code}")
        return

    soup = BeautifulSoup(response.text, 'html.parser')

    # Handle different structures for BBC and CNN
    if source_name == "BBC":
        articles = soup.find_all(source_config["card-headline"])
    elif source_name == "CNN":
        articles = soup.find_all(source_config["headline"])
    else:
        print(f"Unsupported source: {source_name}")
        return

    if not articles:
        print(f"No news articles found for {source_name}.")
        return

    with open("news_articles/news_article.txt", "a", encoding="utf-8") as f:  # Append to post.txt
        f.write(f"\n=== {source_name} - {time.strftime('%Y-%m-%d %H:%M:%S')} ===\n")  # Timestamp
        
        for index, article in enumerate(articles[:10]):  # Limit to top 10 articles
            headline = article.text.strip()

            # Get description if available
            description = article.find_next(source_config.get("card-description", source_config.get("description")))
            description_text = description.text.strip() if description else "No description available"

            f.write(f"\nHeadline: {headline}\n")
            f.write(f"Description: {description_text}\n")
            f.write(f"Source: {url}\n")
            f.write("=" * 50 + "\n")  # Separator

            print(f'Saved from {source_name}: {headline}')

if __name__ == '__main__':
    while True:
        for source, config in news_sources.items():
            find_news(source, config)

        time_wait = 5  # Runs every 5 minutes
        print(f'Waiting {time_wait} minutes before fetching news again...')
        time.sleep(time_wait * 60)
