from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configuration from environment
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fallback-secret-key-change-in-production')
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')

# CORS configuration for production
CORS(app, resources={
    r"/api/*": {
        "origins": [FRONTEND_URL, "http://localhost:3000", "https://*.vercel.app"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# MongoDB connection
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')  # Test connection
    db = client["NewsScraper"]
    news_collection = db["news"]
    subscriptions_collection = db["subscriptions"]
    users_collection = db["users"]
    print("✅ MongoDB connection successful!")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    exit(1)

@app.before_request
def log_request():
    print(f"📥 {request.method} {request.path} from {request.remote_addr}")

@app.after_request
def apply_cors_headers(response):
    origin = request.headers.get('Origin')
    allowed_origins = [FRONTEND_URL, 'http://localhost:3000']
    
    if origin in allowed_origins or (origin and origin.endswith('.vercel.app')):
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
    
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Max-Age'] = '86400'
    return response

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        client.admin.command('ping')
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500

@app.route('/api/news', methods=['GET'])
def get_news():
    try:
        articles = news_collection.find().limit(100)
        articles_list = [
            {
                "category": article.get("category", "general"),
                "source": article.get("source", "Unknown"),
                "headline": article.get("headline", ""),
                "summary": article.get("summary", article.get("description", "")[:150]),
                "description": article.get("description", ""),
                "image": article.get("image"),
                "sourceLink": article.get("sourceLink", ""),
                "publishedAt": article.get("date", datetime.utcnow().isoformat()),
                "sentiment": article.get("sentiment", {"headline": {"compound": 0.0}}),
                "tags": article.get("tags", [])
            } for article in articles
        ]
        print(f"📰 Serving {len(articles_list)} articles")
        return jsonify(articles_list), 200
    except Exception as e:
        print(f"❌ Error fetching articles: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    try:
        data = request.get_json()
        email = data.get('email')
        category = data.get('category', 'general')
        
        if not email:
            return jsonify({"error": "Email is required"}), 400
        
        # Check if already subscribed
        existing = subscriptions_collection.find_one({"email": email, "category": category})
        if existing:
            return jsonify({"message": f"Already subscribed to {category} news"}), 200
        
        subscription = {
            "email": email,
            "category": category,
            "subscribedAt": datetime.utcnow().isoformat(),
            "active": True
        }
        subscriptions_collection.insert_one(subscription)
        print(f"✉️ New subscription: {email} → {category}")
        return jsonify({"message": f"Subscribed {email} to {category} news!"}), 201
    except Exception as e:
        print(f"❌ Error subscribing: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/signup', methods=['POST', 'OPTIONS'])
def signup():
    try:
        if request.method == 'OPTIONS':
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
        users_collection.insert_one({
            'username': username,
            'email': email,
            'password': hashed_password,
            'createdAt': datetime.utcnow().isoformat()
        })
        print(f"👤 New user registered: {username}")
        return jsonify({'message': 'User registered successfully', 'success': True}), 201
    except Exception as e:
        print(f"❌ Error during signup: {e}")
        return jsonify({'message': str(e), 'success': False}), 500

@app.route('/api/signin', methods=['POST', 'OPTIONS'])
def signin():
    try:
        if request.method == 'OPTIONS':
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
            }, app.config['SECRET_KEY'], algorithm='HS256')
            print(f"🔐 User logged in: {user['username']}")
            return jsonify({
                'message': 'Login successful',
                'success': True,
                'token': token,
                'username': user['username']
            }), 200
        return jsonify({'message': 'Invalid credentials', 'success': False}), 401
    except Exception as e:
        print(f"❌ Error during signin: {e}")
        return jsonify({'message': str(e), 'success': False}), 500

@app.route('/api/profile', methods=['GET'])
def get_profile():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'message': 'No authorization token provided'}), 401
            
        token = auth_header.split(' ')[1]
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        email = payload['email']
        
        user = users_collection.find_one({'email': email})
        if user:
            return jsonify({
                'username': user['username'],
                'email': user['email']
            }), 200
        return jsonify({'message': 'User not found'}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token expired'}), 401
    except Exception as e:
        print(f"❌ Profile error: {e}")
        return jsonify({'message': str(e)}), 401

@app.route('/api/profile', methods=['PUT'])
def update_profile():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'message': 'No authorization token provided'}), 401
            
        token = auth_header.split(' ')[1]
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        email = payload['email']
        
        data = request.get_json()
        new_username = data.get('username')
        new_email = data.get('email')
        
        users_collection.update_one(
            {'email': email},
            {'$set': {
                'username': new_username,
                'email': new_email,
                'updatedAt': datetime.utcnow().isoformat()
            }}
        )
        print(f"✏️ Profile updated: {new_username}")
        return jsonify({'message': 'Profile updated', 'success': True}), 200
    except Exception as e:
        print(f"❌ Update profile error: {e}")
        return jsonify({'message': str(e), 'success': False}), 400

# Root endpoint
@app.route('/')
def index():
    return jsonify({
        "name": "BrightFeed API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/api/health",
            "news": "/api/news",
            "auth": ["/api/signup", "/api/signin"],
            "profile": "/api/profile",
            "subscribe": "/api/subscribe"
        }
    }), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(debug=os.getenv('FLASK_ENV') != 'production', port=port, host='0.0.0.0')