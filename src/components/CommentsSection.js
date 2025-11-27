import React, { useState, useEffect } from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import LikeButton from './LikeButton';

const CommentsSection = ({ articleId, darkMode = false }) => {
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  // Mock data for demonstration - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    const mockComments = [
      {
        id: 1,
        author: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d6d3dc?w=150&h=150&fit=crop&crop=face',
        content: 'This is a really insightful article! Thanks for sharing this important information.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        likes: 12,
        isLiked: false,
        replies: [
          {
            id: 2,
            author: 'Michael Chen',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            content: 'I completely agree! The data presented here is eye-opening.',
            timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
            likes: 5,
            isLiked: true
          }
        ]
      },
      {
        id: 3,
        author: 'David Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        content: 'Great piece of journalism. I wish more outlets covered topics like this with such depth and nuance.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        likes: 8,
        isLiked: false,
        replies: []
      }
    ];
    
    setComments(mockComments);
    setLikes(Math.floor(Math.random() * 100) + 20); // Random likes between 20-120
    setIsLiked(Math.random() > 0.5); // Random initial like state
  }, [articleId]);

  const handleAddComment = (newComment) => {
    const comment = {
      id: Date.now(),
      author: 'Current User', // In real app, get from auth context
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      replies: []
    };
    
    setComments(prev => [comment, ...prev]);
    setShowCommentForm(false);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleCommentLike = (commentId, isReply = false, parentId = null) => {
    setComments(prev => prev.map(comment => {
      if (isReply && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === commentId) {
              return {
                ...reply,
                isLiked: !reply.isLiked,
                likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
              };
            }
            return reply;
          })
        };
      } else if (!isReply && comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
        };
      }
      return comment;
    }));
  };

  return (
    <div 
      data-testid="comments-section"
      className={`w-full max-w-4xl mx-auto p-6 rounded-xl border transition-colors duration-300 
      ${darkMode 
        ? 'bg-neutral-800 border-neutral-700' 
        : 'bg-white border-neutral-200'
      }`}
    >
      {/* Likes and Comments Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-6">
          <LikeButton 
            likes={likes}
            isLiked={isLiked}
            onLike={handleLike}
            darkMode={darkMode}
          />
          <button 
            onClick={() => setShowCommentForm(!showCommentForm)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105
              ${darkMode 
                ? 'text-neutral-300 hover:text-white hover:bg-neutral-700' 
                : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
              }`}
          >
            <span className="text-xl">💬</span>
            <span className="font-medium">
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </span>
          </button>
        </div>
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <div className="mb-6">
          <CommentForm 
            onSubmit={handleAddComment}
            onCancel={() => setShowCommentForm(false)}
            darkMode={darkMode}
          />
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className={`text-center py-8 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
            <span className="text-6xl opacity-50 mb-3 block">💬</span>
            <p className="text-lg font-medium mb-1">No comments yet</p>
            <p className="text-sm">Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={(commentId) => handleCommentLike(commentId)}
              onReplyLike={(replyId, parentId) => handleCommentLike(replyId, true, parentId)}
              darkMode={darkMode}
            />
          ))
        )}
      </div>

      {/* Load More Comments (Future Feature) */}
      {comments.length > 5 && (
        <div className="text-center mt-6">
          <button className={`px-6 py-2 rounded-lg border transition-colors duration-200
            ${darkMode 
              ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-700' 
              : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            Load more comments
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;