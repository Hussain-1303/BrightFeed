from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"], "supports_credentials": True}})

app.config['SECRET_KEY'] = 'your-secret-key-here'

try:
    client = MongoClient("mongodb://localhost:27017/")
    db = client["NewsScraper"]
    news_collection = db["news"]
    subscriptions_collection = db["subscriptions"]
    users_collection = db["users"]
    print("MongoDB connection successful!")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    exit(1)

@app.before_request
def log_request():
    print(f"Received {request.method} request for {request.path} from {request.remote_addr}")

@app.after_request
def apply_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.add('Access-Control-Max-Age', '86400')
    return response

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
                "sentiment": article.get("sentiment", {"headline": {"compound": 0.3}}), # Mock sentiment
                "tags": article.get("tags", [word for word in article["headline"].split() if len(word) > 3][:3]) # Mock tags
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
        return jsonify({"message": f"Subscribed {email} to {category} news!"})
    except Exception as e:
        print(f"Error subscribing: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/signup', methods=['POST', 'OPTIONS'])
def signup():
    try:
        print(f"Processing {request.method} request for /api/signup")
        if request.method == 'OPTIONS':
            print("Returning OPTIONS response for signup")
            return jsonify({}), 200

        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({'message': 'All fields are required', 'success': False}), 400

        if users_collection.find_one({'email': email}):
            return jsonify({'message': 'Email already exists', 'success': False}), 400

        hashed_password = generate_password_hash(password)
        users_collection.insert_one({'username': username, 'email': email, 'password': hashed_password})
        return jsonify({'message': 'User registered successfully', 'success': True}), 201
    except Exception as e:
        print(f"Error during signup: {e}")
        return jsonify({'message': str(e), 'success': False}), 500

@app.route('/api/signin', methods=['POST', 'OPTIONS'])
def signin():
    try:
        print(f"Processing {request.method} request for /api/signin")
        if request.method == 'OPTIONS':
            print("Returning OPTIONS response for signin")
            return jsonify({}), 200

        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message': 'Email and password are required', 'success': False}), 400

        user = users_collection.find_one({'email': email})
        if user and check_password_hash(user['password'], password):
            token = jwt.encode({
                'email': email,
                'username': user['username'],
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, app.config['SECRET_KEY'])
            return jsonify({'message': 'Login successful', 'success': True, 'token': token, 'username': user['username']}), 200
        return jsonify({'message': 'Invalid credentials', 'success': False}), 401
    except Exception as e:
        print(f"Error during signin: {e}")
        return jsonify({'message': str(e), 'success': False}), 500

@app.route('/api/profile', methods=['GET'])
def get_profile():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        email = payload['email']
        user = users_collection.find_one({'email': email})
        if user:
            return jsonify({'username': user['username'], 'email': user['email']}), 200
        return jsonify({'message': 'User not found'}), 404
    except Exception as e:
        print(f"Profile error: {e}")
        return jsonify({'message': str(e)}), 401

@app.route('/api/profile', methods=['PUT'])
def update_profile():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        email = payload['email']
        data = request.get_json()
        users_collection.update_one({'email': email}, {'$set': {'username': data['username'], 'email': data['email']}})
        return jsonify({'message': 'Profile updated', 'success': True}), 200
    except Exception as e:
        print(f"Update profile error: {e}")
        return jsonify({'message': str(e), 'success': False}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')