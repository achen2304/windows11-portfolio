'use client';

import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { useTheme } from '../../../theme-provider';
import { themes } from '@/lib/themes';
import { CommentWithStringId } from './types';
import { generateUserColor, formatTimestamp } from './utils';

interface CommentItemProps {
  comment: CommentWithStringId;
  isLiked: boolean;
  onToggleLike: (commentId: string, isLiked: boolean) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  isLiked,
  onToggleLike,
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];

  const colors = {
    background: currentTheme.surface,
    border: currentTheme.border,
    text: currentTheme.text.primary,
    textMuted: currentTheme.text.muted,
    hover: currentTheme.button.backgroundHover,
    red: '#f91880',
  };

  return (
    <div
      className="p-3 border-b transition-colors hover:cursor-pointer"
      style={{
        borderColor: colors.border,
        backgroundColor: 'transparent',
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = colors.hover)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = 'transparent')
      }
    >
      <div className="flex space-x-3">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: generateUserColor(comment.username) }}
        >
          {comment.username.charAt(0).toUpperCase()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-1">
            <span className="font-bold text-sm" style={{ color: colors.text }}>
              {comment.username}
            </span>
            {comment.handle && (
              <span className="text-sm" style={{ color: colors.textMuted }}>
                @{comment.handle}
              </span>
            )}
            <span className="text-sm" style={{ color: colors.textMuted }}>
              ·
            </span>
            <span className="text-sm" style={{ color: colors.textMuted }}>
              {formatTimestamp(comment.timestamp)}
            </span>
            <div className="ml-auto">
              <BiDotsHorizontalRounded
                className="w-5 h-5 opacity-50 hover:opacity-100 cursor-pointer"
                style={{ color: colors.textMuted }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="mt-1">
            <p
              className="text-sm whitespace-pre-wrap"
              style={{ color: colors.text }}
            >
              {comment.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(comment._id, isLiked);
              }}
              className="flex items-center space-x-2 text-sm group"
              style={{ color: isLiked ? colors.red : colors.textMuted }}
            >
              <div className="p-1.5 rounded-full group-hover:bg-red-50 group-hover:bg-opacity-20">
                {isLiked ? (
                  <FaHeart className="w-4 h-4" style={{ color: colors.red }} />
                ) : (
                  <FaRegHeart className="w-4 h-4" />
                )}
              </div>
              {comment.likes > 0 && <span>{comment.likes}</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
