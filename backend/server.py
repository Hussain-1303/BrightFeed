from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

try:
    client = MongoClient("mongodb://localhost:27017/")
    db = client["NewsScraper"]
    news_collection = db["news"]
    subscriptions_collection = db["subscriptions"]
    print("MongoDB connection successful!")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    exit(1)

@app.route('/api/news', methods=['GET'])
def get_news():
    try:
        articles = news_collection.find()
        articles_list = [
            {
                "category": article["category"],
                "source": article["source"],
                "headline": article["headline"],
                "summary": article["summary"],
                "description": article["description"],
                "image": article["image"],
                "sourceLink": article["sourceLink"],
                "date": article["date"],
                "sentiment": article.get("sentiment", {})  # Include sentiment scores, default to empty dict if missing
            } for article in articles
        ]
        print(f"Serving {len(articles_list)} articles")
        return jsonify(articles_list)
    except Exception as e:
        print(f"Error fetching articles: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    try:
        data = request.get_json()
        email = data.get('email')
        category = data.get('category', 'positive')
        if not email:
            return jsonify({"error": "Email is required"}), 400
        subscription = {
            "email": email,
            "category": category,
            "subscribedAt": datetime.utcnow().isoformat()
        }
        subscriptions_collection.insert_one(subscription)
        return jsonify({"message": f"Subscribed {email} to {category} news!"}), 200
    except Exception as e:
        print(f"Error subscribing: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')