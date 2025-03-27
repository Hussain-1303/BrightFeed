from bs4 import BeautifulSoup
import requests
import time
import os
import random
from datetime import datetime
from pymongo import MongoClient
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["NewsScraper"]
collection = db["news"]

# Create a folder for articles DEBUGGING
if not os.path.exists('news_articles'):
    os.makedirs('news_articles')

# List of categories to cycle through
categories = ["world", "technology", "business", "sport", "arts", "science"]
category_index = 0 

# News source configuration 
news_sources = {
    "BBC": {
        "url_template": "https://www.bbc.com/{category}",
        "default_category": "news",
        "category_map": {"arts": "culture", "sport": "sport"},
        "card-headline": "h2",
        "card-description": "p",
        "image_tag": "img",
        "image_attr": "src"
    },
    "CNN": {
        "url_template": "https://www.cnn.com/{category}",
        "default_category": "world",
        "category_map": {},
        "headline": "h2",
        "description": "span",
        "image_tag": "img",
        "image_attr": "src"
    },
    "CBC": {
        "url_template": "https://www.cbc.ca/news/{category}",
        "default_category": "world",
        "category_map": {},
        "headline": "h3",
        "description": "p",
        "image_tag": "img",
        "image_attr": "src"
    },
    "Global News": {
        "url_template": "https://globalnews.ca/{category}",
        "default_category": "news",
        "category_map": {},
        "tag": "span",
        "class": "c-posts__headlineText",
        "description_tag": "div",
        "description_class": "c-posts__excerpt",
        "image_tag": "img",
        "image_attr": "src"
    },
    "The Guardian": {
        "url_template": "https://www.theguardian.com/{category}",
        "default_category": "world",
        "category_map": {"technology": "technology", "business": "business", "science": "science", "sport": "sport"},
        "valid_categories": ["world", "technology", "business", "science", "environment", "sport", "global-development"],
        "tag": "h3",
        "class": "fc-item__title",
        "description_tag": "div",
        "description_class": "fc-item__standfirst",
        "image_tag": "img",
        "image_attr": "src"
    },
    "Al Jazeera": {
        "url_template": "https://www.aljazeera.com/{category}/",
        "default_category": "news",
        "category_map": {
            "world": "news", "middleeast": "middle-east", "africa": "africa",
            "asia": "asia", "us": "news/us-canada", "europe": "europe",
            "business": "economy", "tech": "science-and-technology"
        },
        "tag": "a",
        "class": "u-clickable-card__link",
        "description_tag": "div",
        "description_class": "gc__excerpt",
        "image_tag": "img",
        "image_attr": "src"
    },
    "NPR": {
        "url_template": "https://www.npr.org/sections/{category}",
        "default_category": "news",
        "category_map": {},
        "tag": "h2",
        "class": "title",
        "image_tag": "img",
        "image_attr": "src"
    },
    "ABC News": {
        "url_template": "https://abcnews.go.com/{category}",
        "default_category": "International",
        "category_map": {"business": "Business", "technology": "Technology", "sport": "Sports"},
        "tag": "h2",
        "class": "Heading",
        "image_tag": "img",
        "image_attr": "src"
    },
    "The New York Times": {
        "url_template": "https://www.nytimes.com/section/{category}",
        "default_category": "world",
        "category_map": {},
        "tag": "h2",
        "class": "css-1j9dxys",
        "image_tag": "img",
        "image_attr": "src"
    },
    "CTV News": {
        "url_template": "https://www.ctvnews.ca/{category}",
        "default_category": "world",
        "category_map": {},
        "tag": "h3",
        "class": "teaserTitle",
        "image_tag": "img",
        "image_attr": "src"
    },
}

def get_url(source_config, category):
    category_map = source_config.get("category_map", {})
    valid_categories = source_config.get("valid_categories", [])
    mapped_category = category_map.get(category, category if category in valid_categories else source_config["default_category"])
    return source_config["url_template"].format(category=mapped_category)

def find_news(source_name, source_config, current_category):
    url = get_url(source_config, current_category)
    print(f"\nFetching news from {source_name} in category '{current_category}': {url}")

    session = requests.Session()
    retry_strategy = Retry(total=3, backoff_factor=1, status_forcelist=[429, 500, 502, 503, 504])
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }

    try:
        response = session.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except Exception as e:
        print(f"Error fetching from {source_name}: {e}")
        return

    soup = BeautifulSoup(response.text, 'html.parser')

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

    with open("news_articles/news_article.txt", "a", encoding="utf-8") as f:
        f.write(f"\n=== {source_name} - {current_category} - {time.strftime('%Y-%m-%d %H:%M:%S')} ===\n")

        for index, article in enumerate(articles[:10]):
            if source_name in ["The Guardian", "Al Jazeera", "NPR"]:
                headline_link = article.find("a")
                headline = headline_link.text.strip() if headline_link else article.text.strip()
                article_url = headline_link['href'] if headline_link else url
            else:
                headline = article.text.strip()
                article_url = article.find("a")['href'] if article.find("a") else url

            if not article_url.startswith('http'):
                article_url = requests.compat.urljoin(url, article_url)

            desc_tag = source_config.get("description_tag") or source_config.get("card-description") or source_config.get("description")
            desc_class = source_config.get("description_class")

            if desc_tag:
                if desc_class:
                    description = article.find(desc_tag, class_=desc_class)
                else:
                    description = article.find(desc_tag)
            else:
                description = None

            if description and description.text.strip():
                description_text = description.text.strip()
            else:
                if len(headline.split()) > 5:
                    description_text = "Summary based on headline: " + headline
                else:
                    description_text = "No description available from source"

            summary = description_text[:100] + "..." if len(description_text) > 100 else description_text

            image = article.find_previous(source_config["image_tag"]) or article.find_next(source_config["image_tag"])
            image_url = image[source_config["image_attr"]] if image and source_config["image_attr"] in image.attrs else None
            if image_url and not image_url.startswith('http'):
                image_url = requests.compat.urljoin(url, image_url)

            f.write(f"\nHeadline: {headline}\n")
            f.write(f"Summary: {summary}\n")
            f.write(f"Description: {description_text}\n")
            f.write(f"Image: {image_url or 'None'}\n")
            f.write(f"Source: {article_url}\n")
            f.write("=" * 50 + "\n")

            print(f"Saved from {source_name}: {headline}")

            if collection.count_documents({"headline": headline}) > 0:
                print(f"Skipped {headline} - Already exists")
                continue

            collection.insert_one({
                "category": current_category,
                "source": source_name,
                "headline": headline,
                "summary": summary,
                "description": description_text,
                "image": image_url,
                "url": article_url,
                "timestamp": datetime.utcnow()
            })

if __name__ == '__main__':
    while True:
        current_category = categories[category_index % len(categories)]
        category_index += 1

        for source, config in news_sources.items():
            find_news(source, config, current_category)
            time.sleep(random.uniform(1, 3))

        time_wait = 5
        print(f"\nWaiting {time_wait} minutes before fetching next category '{categories[category_index % len(categories)]}'...")
        time.sleep(time_wait * 60)
