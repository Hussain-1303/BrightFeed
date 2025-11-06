import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const LikeCommentSection = ({ article }) => {
  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);

  const articleId = article.content_hash;
  const token = localStorage.getItem('token');
  const currentUserEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    fetchLikes();
    if (showComments) {
      fetchComments();
    }
  }, [articleId, showComments]);

  const fetchLikes = async () => {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/api/articles/${articleId}/likes`, {
        headers
      });
      const data = await response.json();
      setLikes(data.like_count);
      setUserLiked(data.user_liked);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/articles/${articleId}/comments`);
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!token) {
      alert('Please sign in to like articles');
      return;
    }

    try {
      const endpoint = userLiked ? 'unlike' : 'like';
      const method = userLiked ? 'DELETE' : 'POST';

      const response = await fetch(`${API_URL}/api/articles/${articleId}/${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.like_count);
        setUserLiked(data.liked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!token) {
      alert('Please sign in to comment');
      return;
    }

    if (!commentText.trim()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comment_text: commentText })
      });

      if (response.ok) {
        const data = await response.json();
        setComments([data.comment, ...comments]);
        setCommentText('');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/articles/${articleId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setComments(comments.filter(c => c._id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="border-t pt-3 mt-3">
      {/* Like and Comment Buttons */}
      <div className="flex items-center gap-4 mb-3">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
            userLiked
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill={userLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="font-medium">{likes}</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="font-medium">{comments.length}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          {/* Add Comment Form */}
          {token ? (
            <form onSubmit={handleAddComment} className="mb-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
                maxLength="500"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {commentText.length}/500
                </span>
                <button
                  type="submit"
                  disabled={loading || !commentText.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Posting...' : 'Comment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Please sign in to comment
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No comments yet. Be the first!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold text-gray-800">
                        {comment.username}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    {currentUserEmail === comment.user_email && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700">{comment.comment_text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LikeCommentSection;