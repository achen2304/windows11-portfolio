'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../../theme-provider';
import { themes } from '@/lib/themes';
import { useToast } from '@/components/ui/toast';
import { FaTwitter, FaPenNib, FaTimes } from 'react-icons/fa';
import { Filter } from 'bad-words';
import { useWindowSize, WindowSizeProvider } from '../../breakpoints';
import { TwitterAppProps, CommentWithStringId, SortOption } from './types';
import { generateUserColor } from './utils';
import { CommentItem } from './comment-item';

const TwitterContent: React.FC<TwitterAppProps> = ({ className = '' }) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const { addToast } = useToast();
  const { isXs, isSm } = useWindowSize();

  const isSmallScreen = isXs || isSm;

  const [allComments, setAllComments] = useState<CommentWithStringId[]>([]); // Store all comments
  const [displayedComments, setDisplayedComments] = useState<
    CommentWithStringId[]
  >([]); // Comments currently shown
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [username, setUsername] = useState('');
  const [handle, setHandle] = useState('');
  const [content, setContent] = useState('');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [displayCount, setDisplayCount] = useState(20);
  const COMMENTS_PER_PAGE = 20;

  const [usernameError, setUsernameError] = useState('');
  const [contentError, setContentError] = useState('');

  const [showCompose, setShowCompose] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  const filter = new Filter();

  const fetchAllComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/twitter?limit=1000');
      const data = await response.json();

      if (data.comments) {
        setAllComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      addToast({
        title: 'Error loading comments',
        description: 'Please try refreshing the page',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const sortAndDisplayComments = useCallback(() => {
    const sortedComments = [...allComments];

    if (sortBy === 'likes') {
      sortedComments.sort((a, b) => {
        if (b.likes !== a.likes) {
          return b.likes - a.likes;
        }
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });
    } else {
      sortedComments.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }

    setDisplayedComments(sortedComments.slice(0, displayCount));
  }, [allComments, sortBy, displayCount]);

  useEffect(() => {
    fetchAllComments();
  }, [fetchAllComments]);

  useEffect(() => {
    sortAndDisplayComments();
  }, [sortAndDisplayComments]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      const newDisplayCount = displayCount + COMMENTS_PER_PAGE;
      if (newDisplayCount <= allComments.length) {
        setDisplayCount(newDisplayCount);
      }
    }
  }, [loading, displayCount, allComments.length, COMMENTS_PER_PAGE]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const postComment = async () => {
    setUsernameError('');
    setContentError('');

    if (!username.trim()) {
      setUsernameError('Please provide your name');
      return;
    }

    if (!content.trim()) {
      setContentError('Please provide a message');
      return;
    }

    if (content.length > 280) {
      setContentError('Please keep your message under 280 characters');
      return;
    }

    if (filter.isProfane(content)) {
      setContentError(
        'Your message contains inappropriate language. Please revise and try again'
      );
      return;
    }

    setPosting(true);
    try {
      const response = await fetch('/api/twitter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          handle: handle.trim() || '',
          content: content.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setContent('');

        const newComment = {
          _id: data.comment._id,
          username: username.trim(),
          handle: handle.trim() || '',
          content: content.trim(),
          timestamp: new Date().toISOString(),
          likes: 0,
        };

        setAllComments((prevComments) => [newComment, ...prevComments]);
        setDisplayCount(COMMENTS_PER_PAGE);
        setDisplayedComments((prevDisplayed) => [
          newComment,
          ...prevDisplayed.slice(0, COMMENTS_PER_PAGE - 1),
        ]);

        addToast({
          title: 'Posted!',
          description: 'Your comment has been posted',
          type: 'success',
        });
      } else {
        throw new Error(data.error || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      addToast({
        title: 'Error posting comment',
        description:
          error instanceof Error ? error.message : 'Please try again',
        type: 'error',
      });
    } finally {
      setPosting(false);
    }
  };

  const toggleLike = async (commentId: string, isLiked: boolean) => {
    try {
      const action = isLiked ? 'unlike' : 'like';
      const response = await fetch(
        `/api/twitter?id=${commentId}&action=${action}`,
        {
          method: 'PUT',
        }
      );

      if (response.ok) {
        const newLikedComments = new Set(likedComments);
        if (isLiked) {
          newLikedComments.delete(commentId);
        } else {
          newLikedComments.add(commentId);
        }
        setLikedComments(newLikedComments);

        setAllComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? { ...comment, likes: comment.likes + (isLiked ? -1 : 1) }
              : comment
          )
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const colors = {
    background: currentTheme.surface,
    border: currentTheme.border,
    text: currentTheme.text.primary,
    textSecondary: currentTheme.text.secondary,
    textMuted: currentTheme.text.muted,
    hover: currentTheme.button.backgroundHover,
    blue: '#1d9bf0',
    red: '#f91880',
    inputBackground: currentTheme.glass.background,
  };

  return (
    <div
      className={`h-full flex flex-col ${className}`}
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <div
        className={`${
          isSmallScreen ? 'px-3 py-2' : 'px-4 py-3'
        } border-b sticky top-0 backdrop-blur-md z-10`}
        style={{
          borderColor: colors.border,
          backgroundColor: `${colors.background}ee`,
        }}
      >
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-3">
            <div
              className="p-2 rounded-full"
              style={{ backgroundColor: `${colors.blue}15` }}
            >
              <FaTwitter
                className={`${isSmallScreen ? 'w-4 h-4' : 'w-5 h-5'}`}
                style={{ color: colors.blue }}
              />
            </div>
            <div>
              <h1
                className={`${
                  isSmallScreen ? 'text-sm' : 'text-lg'
                } font-bold leading-tight`}
                style={{ color: colors.text }}
              >
                Comments
              </h1>
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className={`${
                  isSmallScreen ? 'px-2 py-1 text-sm' : 'px-3 py-1.5 text-sm'
                } rounded-full border appearance-none cursor-pointer transition-all hover:shadow-sm`}
                style={{
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                  color: colors.text,
                  paddingRight: isSmallScreen ? '20px' : '24px',
                }}
              >
                <option value="date">Latest</option>
                <option value="likes">Most Liked</option>
              </select>
              <div
                className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={{ color: colors.textMuted }}
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Compose Toggle Button - Always visible */}
            <button
              onClick={() => setShowCompose(!showCompose)}
              className={`${
                isSmallScreen ? 'p-1.5' : 'p-2'
              } rounded-full transition-all duration-200 hover:scale-105 active:scale-95`}
              style={{
                backgroundColor: showCompose ? colors.blue : `${colors.blue}15`,
                color: showCompose ? 'white' : colors.blue,
                boxShadow: showCompose ? `0 2px 8px ${colors.blue}40` : 'none',
                cursor: 'pointer',
              }}
              title={showCompose ? 'Close compose' : 'Write comment'}
            >
              {showCompose ? (
                <FaTimes
                  className={`${isSmallScreen ? 'w-3 h-3' : 'w-4 h-4'}`}
                />
              ) : (
                <FaPenNib
                  className={`${isSmallScreen ? 'w-3 h-3' : 'w-4 h-4'}`}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Compose Tweet */}
      {showCompose && (
        <div
          className={`${isSmallScreen ? 'p-2' : 'p-4'} border-b`}
          style={{ borderColor: colors.border }}
        >
          <div className={`flex ${isSmallScreen ? 'space-x-2' : 'space-x-3'}`}>
            {/* Avatar */}
            <div
              className={`${
                isSmallScreen ? 'w-10 h-10' : 'w-12 h-12'
              } rounded-full flex items-center justify-center text-white font-bold`}
              style={{
                backgroundColor: username
                  ? generateUserColor(username)
                  : colors.blue,
              }}
            >
              {username ? username.charAt(0).toUpperCase() : '?'}
            </div>

            {/* Compose */}
            <div className="flex-1">
              {/* User Info */}
              <div
                className={`${
                  isSmallScreen ? 'flex flex-col space-y-2' : 'flex space-x-2'
                } mb-3`}
              >
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (usernameError) setUsernameError('');
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${
                      usernameError ? 'border-red-500' : ''
                    }`}
                    style={{
                      backgroundColor: colors.inputBackground,
                      borderColor: usernameError ? '#ef4444' : colors.border,
                      color: colors.text,
                    }}
                    maxLength={50}
                  />
                  {usernameError && (
                    <div
                      className="text-sm mt-1"
                      style={{
                        color: theme === 'dark' ? '#ef4444' : '#dc2626',
                      }}
                    >
                      {usernameError}
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="@handle (optional)"
                  value={handle}
                  onChange={(e) =>
                    setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))
                  }
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  style={{
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                  maxLength={50}
                />
              </div>

              {/* Content */}
              <div>
                <textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (contentError) setContentError('');
                  }}
                  className={`w-full p-3 border rounded-lg resize-none ${
                    isSmallScreen ? 'text-sm' : 'text-md'
                  } ${contentError ? 'border-red-500' : ''}`}
                  style={{
                    backgroundColor: colors.inputBackground,
                    borderColor: contentError ? '#ef4444' : colors.border,
                    color: colors.text,
                    minHeight: '80px',
                  }}
                  maxLength={280}
                />
                {contentError && (
                  <div
                    className="text-sm mt-1"
                    style={{
                      color: theme === 'dark' ? '#ef4444' : '#dc2626',
                    }}
                  >
                    {contentError}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm" style={{ color: colors.textMuted }}>
                  {content.length}/280
                </span>
                <button
                  onClick={postComment}
                  disabled={posting || !username.trim() || !content.trim()}
                  className="px-4 py-1 rounded-full font-bold text-white text-sm disabled:opacity-50"
                  style={{
                    backgroundColor: colors.blue,
                    cursor:
                      posting || !username.trim() || !content.trim()
                        ? 'not-allowed'
                        : 'pointer',
                    opacity:
                      posting || !username.trim() || !content.trim() ? 0.5 : 1,
                  }}
                >
                  {posting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        {loading ? (
          <div className="p-8 text-center">
            <div
              className="inline-block animate-spin rounded-full h-8 w-8 border-b-2"
              style={{ borderColor: colors.blue }}
            ></div>
            <p className="mt-2 text-sm" style={{ color: colors.textMuted }}>
              Loading comments...
            </p>
          </div>
        ) : displayedComments.length === 0 ? (
          <div className="p-8 text-center">
            <p
              className={`${isSmallScreen ? 'text-sm' : 'text-lg'}`}
              style={{ color: colors.text }}
            >
              No comments yet
            </p>
            <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
              Be the first to leave a comment!
            </p>
          </div>
        ) : (
          <div>
            {displayedComments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                isLiked={likedComments.has(comment._id)}
                onToggleLike={toggleLike}
              />
            ))}

            {/* End of results */}
            {displayCount >= allComments.length && allComments.length > 0 && (
              <div className="p-4 text-center">
                <p className="text-sm" style={{ color: colors.textMuted }}>
                  You&apos;ve reached the end of the comments
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TwitterApp: React.FC<TwitterAppProps> = ({ className = '' }) => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={contentRef} className="h-full flex flex-col">
      <WindowSizeProvider containerRef={contentRef}>
        <TwitterContent className={className} />
      </WindowSizeProvider>
    </div>
  );
};

export default TwitterApp;
