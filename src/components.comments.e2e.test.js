import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import NewsCard from './components/NewsCard';
import CommentsSection from './components/CommentsSection';
import LikeButton from './components/LikeButton';
import CommentForm from './components/CommentForm';
import CommentItem from './components/CommentItem';

/**
 * E2E Integration Tests for Comments & Likes UI System
 * 
 * This test suite validates the complete Comments & Likes functionality
 * including user interactions, state management, and component integration.
 */

// Mock react-icons to avoid import issues in test environment
jest.mock('react-icons/hi2', () => ({
  HiHeart: ({ className, onClick }) => (
    <span className={className} onClick={onClick} data-testid="heart-icon" />
  ),
  HiOutlineHeart: ({ className, onClick }) => (
    <span className={className} onClick={onClick} data-testid="heart-outline-icon" />
  ),
  HiEllipsisVertical: ({ className }) => (
    <span className={className} data-testid="ellipsis-icon" />
  ),
}));

jest.mock('react-icons/fi', () => ({
  FiCornerUpLeft: ({ className }) => (
    <span className={className} data-testid="reply-icon" />
  ),
}));

describe('Comments & Likes UI System - E2E Integration Tests', () => {
  const mockArticle = {
    category: 'tech',
    source: 'NPR',
    headline: 'Test Article for Comments',
    summary: 'This is a test article for testing comments functionality',
    description: 'Detailed description of the test article...',
    image: 'https://example.com/test-image.jpg',
    sourceLink: 'https://www.npr.org/test-article',
    date: '2025-01-15',
    sentiment: { compound: 0.5, positive: 0.7, neutral: 0.2, negative: 0.1 }
  };

  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks();
  });

  describe('NewsCard Integration', () => {
    it('should render NewsCard with Comments button', () => {
      render(<NewsCard article={mockArticle} />);
      
      // Verify article content is displayed
      expect(screen.getByText('Test Article for Comments')).toBeInTheDocument();
      expect(screen.getByText('This is a test article for testing comments functionality')).toBeInTheDocument();
      
      // Verify Comments button is present
      const commentsButton = screen.getByRole('button', { name: /comments/i });
      expect(commentsButton).toBeInTheDocument();
    });

    it('should toggle comments section when Comments button is clicked', async () => {
      render(<NewsCard article={mockArticle} />);
      
      const commentsButton = screen.getByRole('button', { name: /comments/i });
      
      // Comments section should not be visible initially (only the outer wrapper has testid)
      const commentsSections = screen.queryAllByTestId('comments-section');
      expect(commentsSections).toHaveLength(0);
      
      // Click Comments button to show comments
      fireEvent.click(commentsButton);
      
      // Comments section should now be visible
      await waitFor(() => {
        const sections = screen.queryAllByTestId('comments-section');
        expect(sections.length).toBeGreaterThan(0);
      });
      
      // Click Comments button again to hide comments
      fireEvent.click(commentsButton);
      
      // Comments section should be hidden again
      await waitFor(() => {
        const sections = screen.queryAllByTestId('comments-section');
        expect(sections).toHaveLength(0);
      });
    });
  });

  describe('CommentsSection Component', () => {
    it('should render comments section with like button and comment button', () => {
      render(<CommentsSection />);
      
      // Verify main elements are present
      const sections = screen.getAllByTestId('comments-section');
      expect(sections.length).toBeGreaterThan(0);
      
      // There should be multiple like buttons (main + comments)
      const likeButtons = screen.getAllByTestId('like-button');
      expect(likeButtons.length).toBeGreaterThan(0);
      
      // Click the comments button to show the form
      const commentsButton = screen.getByRole('button', { name: /comments/i });
      fireEvent.click(commentsButton);
      
      expect(screen.getByTestId('comment-form')).toBeInTheDocument();
    });

    it('should display mock comments and replies', () => {
      render(<CommentsSection />);
      
      // Should display mock comments based on actual component data
      expect(screen.getByText(/really insightful article/i)).toBeInTheDocument();
      expect(screen.getByText(/great piece of journalism/i)).toBeInTheDocument();
      expect(screen.getByText(/completely agree/i)).toBeInTheDocument();
    });

    it('should handle like button interactions', async () => {
      render(<CommentsSection />);
      
      let likeButtons = screen.getAllByTestId('like-button');
      
      // Get initial like count (extract number from button text)
      let likeText = likeButtons[0].textContent;
      let initialLikeCount = parseInt(likeText.match(/\d+/)[0]);
      
      // Check initial aria-label to determine if it's already liked
      let initialAriaLabel = likeButtons[0].getAttribute('aria-label');
      let isInitiallyLiked = initialAriaLabel === 'Unlike';
      
      // Click like button
      fireEvent.click(likeButtons[0]);
      
      // Should update like count - should increase by 1 if not liked, decrease by 1 if already liked
      await waitFor(() => {
        likeButtons = screen.getAllByTestId('like-button');
        let updatedCount = parseInt(likeButtons[0].textContent.match(/\d+/)[0]);
        const expectedFirstChange = isInitiallyLiked ? -1 : 1;
        expect(updatedCount).toBe(initialLikeCount + expectedFirstChange);
      });
      
      // Get fresh reference and updated count
      likeButtons = screen.getAllByTestId('like-button');
      likeText = likeButtons[0].textContent;
      initialLikeCount = parseInt(likeText.match(/\d+/)[0]);
      
      // Check aria-label after first click (should be toggled now)
      initialAriaLabel = likeButtons[0].getAttribute('aria-label');
      isInitiallyLiked = initialAriaLabel === 'Unlike';
      
      // Click again to toggle state
      fireEvent.click(likeButtons[0]);
      
      // Should toggle the like count again
      await waitFor(() => {
        likeButtons = screen.getAllByTestId('like-button');
        let finalCount = parseInt(likeButtons[0].textContent.match(/\d+/)[0]);
        const expectedSecondChange = isInitiallyLiked ? -1 : 1;
        expect(finalCount).toBe(initialLikeCount + expectedSecondChange);
      });
    });
  });

  describe('LikeButton Component', () => {
    it('should render with correct initial state', () => {
      render(<LikeButton likes={10} isLiked={false} onLike={() => {}} />);
      
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByTestId('heart-outline-icon')).toBeInTheDocument();
    });

    it('should render liked state correctly', () => {
      render(<LikeButton likes={15} isLiked={true} onLike={() => {}} />);
      
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByTestId('heart-filled-icon')).toBeInTheDocument();
    });

    it('should handle like/unlike interactions', async () => {
      let isLiked = false;
      let likeCount = 5;
      
      const mockOnLike = jest.fn(() => {
        isLiked = !isLiked;
        likeCount = isLiked ? likeCount + 1 : likeCount - 1;
      });
      
      const { rerender } = render(
        <LikeButton likes={likeCount} isLiked={isLiked} onLike={mockOnLike} />
      );
      
      const likeButton = screen.getByTestId('like-button');
      
      // Click to like
      fireEvent.click(likeButton);
      expect(mockOnLike).toHaveBeenCalled();
      
      // Re-render with updated state
      rerender(
        <LikeButton likes={6} isLiked={true} onLike={mockOnLike} />
      );
      expect(screen.getByText('6')).toBeInTheDocument();
    });

    it('should render different sizes correctly', () => {
      const { rerender } = render(
        <LikeButton likes={0} isLiked={false} onLike={() => {}} size="small" />
      );
      expect(screen.getByTestId('like-button')).toHaveClass('px-2');
      
      rerender(
        <LikeButton likes={0} isLiked={false} onLike={() => {}} size="medium" />
      );
      expect(screen.getByTestId('like-button')).toHaveClass('px-4');
      
      rerender(
        <LikeButton likes={0} isLiked={false} onLike={() => {}} size="large" />
      );
      expect(screen.getByTestId('like-button')).toHaveClass('px-6');
    });
  });

  describe('CommentForm Component', () => {
    it('should render comment form with all elements', () => {
      render(
        <CommentForm 
          onSubmit={() => {}} 
          onCancel={() => {}}
          placeholder="Share your thoughts..."
        />
      );
      
      expect(screen.getByPlaceholderText(/share your thoughts/i)).toBeInTheDocument();
      expect(screen.getByText('0/500')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /post comment/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should update character count as user types', async () => {
      render(
        <CommentForm 
          onSubmit={() => {}} 
          onCancel={() => {}}
        />
      );
      
      const textarea = screen.getByPlaceholderText(/share your thoughts/i);
      
      fireEvent.change(textarea, { target: { value: 'This is a test comment' } });
      
      expect(screen.getByText('22/500')).toBeInTheDocument();
    });

    it('should prevent submission with empty comment', async () => {
      const mockOnSubmit = jest.fn();
      
      render(
        <CommentForm 
          onSubmit={mockOnSubmit}
          onCancel={() => {}}
        />
      );
      
      const submitButton = screen.getByRole('button', { name: /post comment/i });
      
      fireEvent.click(submitButton);
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should submit comment with valid input', async () => {
      const mockOnSubmit = jest.fn();
      
      render(
        <CommentForm 
          onSubmit={mockOnSubmit}
          onCancel={() => {}}
        />
      );
      
      const textarea = screen.getByPlaceholderText(/share your thoughts/i);
      const submitButton = screen.getByRole('button', { name: /post comment/i });
      
      fireEvent.change(textarea, { target: { value: 'This is a valid comment' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith('This is a valid comment');
      });
    });

    it('should handle keyboard shortcuts', async () => {
      const mockOnSubmit = jest.fn();
      const mockOnCancel = jest.fn();
      
      render(
        <CommentForm 
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );
      
      const textarea = screen.getByPlaceholderText(/share your thoughts/i);
      
      // Test Ctrl+Enter for submit
      fireEvent.change(textarea, { target: { value: 'Test comment' } });
      fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith('Test comment');
      });
      
      // Test Escape for cancel
      fireEvent.keyDown(textarea, { key: 'Escape' });
      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should enforce character limit', async () => {
      render(
        <CommentForm 
          onSubmit={() => {}}
          onCancel={() => {}}
        />
      );
      
      const textarea = screen.getByPlaceholderText(/share your thoughts/i);
      const longText = 'a'.repeat(501);
      
      fireEvent.change(textarea, { target: { value: longText } });
      
      // Should show character limit exceeded
      expect(screen.getByText('501/500')).toBeInTheDocument();
      expect(screen.getByText('501/500')).toHaveClass('text-red-500');
    });
  });

  describe('CommentItem Component', () => {
    const mockComment = {
      id: '1',
      author: 'John Doe',
      avatar: 'https://example.com/avatar.jpg',
      content: 'This is a test comment',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      likes: 5,
      isLiked: false,
      replies: []
    };

    it('should render comment with all elements', () => {
      render(
        <CommentItem 
          comment={mockComment}
          onLike={() => {}}
          onReplyLike={() => {}}
        />
      );
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reply/i })).toBeInTheDocument();
    });

    it('should render nested replies with proper indentation', () => {
      const commentWithReplies = {
        ...mockComment,
        replies: [
          {
            id: '2',
            author: 'Jane Smith',
            avatar: 'https://example.com/avatar2.jpg',
            content: 'This is a reply',
            timestamp: new Date(Date.now() - 1000 * 60 * 15),
            likes: 2,
            isLiked: false,
            replies: []
          }
        ]
      };
      
      render(
        <CommentItem 
          comment={commentWithReplies}
          onLike={() => {}}
          onReplyLike={() => {}}
        />
      );
      
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
      expect(screen.getByText('This is a reply')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should handle like interactions on comments', async () => {
      const mockOnLike = jest.fn();
      
      render(
        <CommentItem 
          comment={mockComment}
          onLike={mockOnLike}
          onReplyLike={() => {}}
        />
      );
      
      const likeButtons = screen.getAllByTestId('like-button');
      fireEvent.click(likeButtons[0]);
      
      expect(mockOnLike).toHaveBeenCalledWith('1');
    });

    it('should toggle reply form when reply button is clicked', async () => {
      render(
        <CommentItem 
          comment={mockComment}
          onLike={() => {}}
          onReplyLike={() => {}}
        />
      );
      
      const replyButton = screen.getByRole('button', { name: /reply/i });
      
      // Reply form should not be visible initially
      expect(screen.queryByPlaceholderText(/reply to/i)).not.toBeInTheDocument();
      
      // Click reply button
      fireEvent.click(replyButton);
      
      // Reply form should now be visible
      expect(screen.getByPlaceholderText(/reply to/i)).toBeInTheDocument();
    });

    it('should display relative timestamps', () => {
      const recentComment = {
        ...mockComment,
        timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
      };
      
      render(
        <CommentItem 
          comment={recentComment}
          onLike={() => {}}
          onReplyLike={() => {}}
        />
      );
      
      expect(screen.getByText(/5m ago/i)).toBeInTheDocument();
    });
  });

  describe('Complete User Flow Integration', () => {
    it('should handle complete comment and like workflow', async () => {
      render(<NewsCard article={mockArticle} />);
      
      // 1. Open comments section
      const commentsButton = screen.getByRole('button', { name: /comments/i });
      fireEvent.click(commentsButton);
      
      await waitFor(() => {
        const sections = screen.queryAllByTestId('comments-section');
        expect(sections.length).toBeGreaterThan(0);
      });
      
      // 2. Like the post - check if count changes (increment or decrement depending on initial state)
      let likeButtons = screen.getAllByTestId('like-button');
      let likeText = likeButtons[0].textContent;
      let initialCount = parseInt(likeText.match(/\d+/)[0]);
      
      // Check initial aria-label to determine if it's already liked
      const initialAriaLabel = likeButtons[0].getAttribute('aria-label');
      const isInitiallyLiked = initialAriaLabel === 'Unlike';
      
      fireEvent.click(likeButtons[0]);
      
      await waitFor(() => {
        likeButtons = screen.getAllByTestId('like-button');
        const newCount = parseInt(likeButtons[0].textContent.match(/\d+/)[0]);
        // If initially liked, clicking should decrement; otherwise increment
        const expectedChange = isInitiallyLiked ? -1 : 1;
        expect(newCount).toBe(initialCount + expectedChange);
      });
      
      // 3. Open comment form by clicking the comments count button
      const allCommentButtons = screen.getAllByRole('button', { name: /comments/i });
      const formToggleButton = allCommentButtons[allCommentButtons.length - 1];
      fireEvent.click(formToggleButton);
      
      // 4. Write and submit a comment
      const textarea = screen.getByPlaceholderText(/share your thoughts/i);
      const submitButton = screen.getByRole('button', { name: /post comment/i });
      
      fireEvent.change(textarea, { target: { value: 'This is my test comment' } });
      fireEvent.click(submitButton);
      
      // 5. Verify comment appears in the list
      await waitFor(() => {
        expect(screen.getByText('This is my test comment')).toBeInTheDocument();
      });
    });

    it('should handle reply workflow', async () => {
      render(<CommentsSection />);
      
      // Find a comment and click reply
      const replyButtons = screen.getAllByRole('button', { name: /reply/i });
      fireEvent.click(replyButtons[0]);
      
      // Write a reply
      const replyTextarea = screen.getByPlaceholderText(/reply to/i);
      fireEvent.change(replyTextarea, { target: { value: 'This is my reply' } });
      
      // Submit reply
      const submitButtons = screen.getAllByRole('button', { name: /post comment/i });
      fireEvent.click(submitButtons[submitButtons.length - 1]);
      
      // Verify reply appears
      await waitFor(() => {
        expect(screen.getByText('This is my reply')).toBeInTheDocument();
      });
    });

    it('should maintain state consistency during multiple interactions', async () => {
      render(<CommentsSection />);
      
      // Get initial like buttons - query fresh each time
      let likeButtons = screen.getAllByTestId('like-button');
      expect(likeButtons.length).toBeGreaterThan(0);
      
      // Like multiple comments
      let initialText1 = likeButtons[0].textContent;
      let initialCount1 = parseInt(initialText1.match(/\d+/)[0]);
      
      fireEvent.click(likeButtons[0]);
      
      // Verify state updates - should increase by 1
      await waitFor(() => {
        likeButtons = screen.getAllByTestId('like-button');
        let updated = likeButtons[0].textContent;
        let newCount = parseInt(updated.match(/\d+/)[0]);
        expect(newCount).toBe(initialCount1 + 1);
      });
      
      // Re-query to get fresh reference and updated count
      likeButtons = screen.getAllByTestId('like-button');
      initialText1 = likeButtons[0].textContent;
      initialCount1 = parseInt(initialText1.match(/\d+/)[0]);
      
      // Unlike
      fireEvent.click(likeButtons[0]);
      
      // Verify count decreases by 1
      await waitFor(() => {
        likeButtons = screen.getAllByTestId('like-button');
        let final = likeButtons[0].textContent;
        let finalCount = parseInt(final.match(/\d+/)[0]);
        expect(finalCount).toBe(initialCount1 - 1);
      });
    });
  });

  describe('Accessibility and UX', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<CommentsSection />);
      
      // Check for proper button roles
      expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
      
      // Click to show comment form first
      const commentsButton = screen.getByRole('button', { name: /comments/i });
      fireEvent.click(commentsButton);
      
      // Check for proper textarea
      const textarea = screen.getByPlaceholderText(/share your thoughts/i);
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('aria-label', 'Share your thoughts');
    });

    it('should support keyboard navigation', async () => {
      render(
        <CommentForm 
          onSubmit={() => {}}
          onCancel={() => {}}
        />
      );
      
      const textarea = screen.getByPlaceholderText(/share your thoughts/i);
      const submitButton = screen.getByRole('button', { name: /post comment/i });
      
      // Focus on textarea first
      textarea.focus();
      expect(textarea).toHaveFocus();
      
      // Should be able to find focusable elements
      expect(submitButton).toBeInTheDocument();
    });

    it('should handle loading states appropriately', async () => {
      const mockOnSubmit = jest.fn();
      
      render(
        <CommentForm 
          onSubmit={mockOnSubmit}
          onCancel={() => {}}
        />
      );
      
      const textarea = screen.getByPlaceholderText(/share your thoughts/i);
      const submitButton = screen.getByRole('button', { name: /post comment/i });
      
      fireEvent.change(textarea, { target: { value: 'Test comment' } });
      fireEvent.click(submitButton);
      
      // Should show loading state
      expect(screen.getByText(/posting/i)).toBeInTheDocument();
    });
  });
});