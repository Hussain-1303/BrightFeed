from flask import Flask, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

try:
    client = MongoClient("mongodb://localhost:27017/")
    db = client["NewsScraper"]
    collection = db["news"]
    print("MongoDB connection successful!")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    exit(1)

@app.route('/api/news', methods=['GET'])
def get_news():
    try:
        articles = collection.find()
        articles_list = []
        for article in articles:
            try:
                # Handle different field name variations and missing fields
                source_link = article.get("sourceLink") or article.get("url") or ""
                image_url = article.get("image") or ""
                date = article.get("date") or article.get("timestamp", "")
                
                article_data = {
                    "category": article.get("category", ""),
                    "source": article.get("source", ""),
                    "headline": article.get("headline", ""),
                    "summary": article.get("summary", ""),
                    "description": article.get("description", ""),
                    "image": image_url,
                    "sourceLink": source_link,
                    "date": date,
                    "sentiment": article.get("sentiment", {})
                }
                articles_list.append(article_data)
            except Exception as article_error:
                print(f"Error processing individual article: {article_error}")
                continue
        
        print(f"Serving {len(articles_list)} articles")
        return jsonify(articles_list)
    except Exception as e:
        print(f"Error fetching articles: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')  # Using 5001 cuz 5000 is  being used by some different local PID