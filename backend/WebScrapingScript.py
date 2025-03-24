from bs4 import BeautifulSoup
import requests
import time
import os
from datetime import datetime
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["NewsScraper"]
collection = db["news"]

# Create a folder for articles
if not os.path.exists('news_articles'):
    os.makedirs('news_articles')

# Get user input for category
print("Enter a news category (e.g., world, technology, business, sport, arts, science):")
news_category = input('>').strip().lower()
print(f'Filtering news for: {news_category}')

# Valid category mapping for special cases
guardian_valid_categories = ["world", "technology", "business", "science", "environment", "sport", "global-development"]

aljazeera_categories = {
    "world": "news",
    "middleeast": "middle-east",
    "africa": "africa",
    "asia": "asia",
    "us": "news/us-canada",
    "europe": "europe",
    "business": "economy",
    "tech": "science-and-technology"
}

# News source configuration
news_sources = {
    "BBC": {
        "url": f"https://www.bbc.com/{'news/' + news_category if news_category not in ['arts', 'sport'] else news_category}",
        "card-headline": "h2",
        "card-description": "p"
    },
    "CNN": {
        "url": f"https://www.cnn.com/{news_category}",
        "headline": "h2",
        "description": "span"
    },
    "CBC": {
        "url": f"https://www.cbc.ca/news/{news_category}",
        "headline": "h3",
        "description": "p"
    },
    "Global News": {
        "url": f"https://globalnews.ca/{news_category}",
        "tag": "span",
        "class": "c-posts__headlineText",
        "description_tag": "div",
        "description_class": "c-posts__excerpt"
    },
    "The Guardian": {
        "url": f"https://www.theguardian.com/{news_category if news_category in guardian_valid_categories else 'world'}",
        "tag": "h3",
        "class": "fc-item__title",
        "description_tag": "div",
        "description_class": "fc-item__standfirst"
    },
    "Al Jazeera": {
        "url": f"https://www.aljazeera.com/{aljazeera_categories.get(news_category, 'news')}/",
        "tag": "a",
        "class": "u-clickable-card__link",
        "description_tag": "div",
        "description_class": "gc__excerpt"
    },
    "NPR": {
        "url": f"https://www.npr.org/sections/{news_category}",
        "tag": "h2",
        "class": "title"
    },
    "ABC News": {
        "url": f"https://abcnews.go.com/{news_category.capitalize()}",
        "tag": "h2",
        "class": "Heading"
    }, 
    "The New York Times": {
        "url": f"https://www.nytimes.com/section/{news_category}",
        "tag": "h2",
        "class": "css-1j9dxys"
    }, 
    "CTV News": {
        "url": f"https://www.ctvnews.ca/{news_category}/",
        "tag": "h3",
        "class": "teaserTitle"
}






}

def find_news(source_name, source_config):
    url = source_config["url"]
    print(f"\nFetching news from {source_name}: {url}")

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }

    try:
        response = requests.get(url, headers=headers)
    except Exception as e:
        print(f"Error fetching from {source_name}: {e}")
        return

    if response.status_code != 200:
        print(f"Failed to retrieve news from {url}. HTTP Status Code: {response.status_code}")
        return

    soup = BeautifulSoup(response.text, 'html.parser')

    # Extract article blocks
    if source_name == "BBC":
        articles = soup.find_all(source_config["card-headline"])
    elif source_name in ["CNN", "CBC"]:
        articles = soup.find_all(source_config["headline"])
    elif source_name in ["Global News", "Al Jazeera", "NPR", "ABC News", "The New York Times", "CTV News"]:
        articles = soup.find_all(source_config["tag"], class_=source_config["class"])
    elif source_name == "The Guardian":
        articles = soup.select("h3.fc-item__title")
    else:
        print(f"No parser logic for {source_name}")
        return

    if not articles:
        print(f"No articles found for {source_name} at {url}")
        return

    # Save to file
    with open("news_articles/news_article.txt", "a", encoding="utf-8") as f:
        f.write(f"\n=== {source_name} - {time.strftime('%Y-%m-%d %H:%M:%S')} ===\n")

        for index, article in enumerate(articles[:10]): # Retrieve top 10 articles
            # Extract headline
            if source_name in ["The Guardian", "Al Jazeera", "NPR"]:
                headline_link = article.find("a")
                headline = headline_link.text.strip() if headline_link else article.text.strip()
            else:
                headline = article.text.strip()

            # Extract description
            if source_name in ["Global News", "The Guardian", "Al Jazeera", "ABC News", "The New York Times", "CTV News"]:
                description = article.find_next(
                    source_config["description_tag"],
                    class_=source_config["description_class"]
                )
            else:
                description = article.find_next(
                    source_config.get("card-description", source_config.get("description"))
                )

            description_text = description.text.strip() if description else "No description available"

            # Write to file
            f.write(f"\nHeadline: {headline}\n")
            f.write(f"Description: {description_text}\n")
            f.write(f"Source: {url}\n")
            f.write("=" * 50 + "\n")

            print(f"Saved from {source_name}: {headline}")

            # Save to MongoDB
            collection.insert_one({
                "source": source_name,
                "headline": headline,
                "description": description_text,
                "url": url,
                "timestamp": datetime.utcnow()
            })

# Run loop every 5 minutes
if __name__ == '__main__':
    while True:
        for source, config in news_sources.items():
            find_news(source, config)

        time_wait = 5
        print(f"\n Waiting {time_wait} minutes before fetching news again...")
        time.sleep(time_wait * 60)
