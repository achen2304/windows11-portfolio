'use client';

import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../../theme-provider';
import { themes } from '@/lib/themes';

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  options: {
    label: string;
    onClick: () => void;
    shortcut?: string;
    disabled?: boolean;
    dividerAfter?: boolean;
  }[];
  position?: { top: number; left: number };
}

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  options,
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="shadow-lg rounded-sm z-[999] dropdown-menu"
      style={{
        background:
          theme === 'dark' ? currentTheme.glass.background : '#ffffff',
        border: `1px solid ${currentTheme.border}`,
        minWidth: '180px',
        transformOrigin: 'top left',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
      }}
    >
      {options.map((option, index) => (
        <React.Fragment key={index}>
          <button
            type="button"
            className={`w-full text-left px-4 py-1.5 text-xs ${
              option.disabled ? 'opacity-50' : 'hover:cursor-pointer'
            }`}
            style={{
              color: currentTheme.text.primary,
              background: 'transparent',
              border: 'none',
              outline: 'none',
            }}
            disabled={option.disabled}
            onClick={(e) => {
              e.stopPropagation();
              if (!option.disabled) {
                option.onClick();
                onClose();
              }
            }}
            onMouseEnter={(e) => {
              if (!option.disabled) {
                e.currentTarget.style.background =
                  theme === 'dark'
                    ? currentTheme.button.backgroundHover
                    : 'rgba(0, 0, 0, 0.08)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <div className="flex justify-between items-center">
              <span>{option.label}</span>
              {option.shortcut && (
                <span
                  className="ml-4 text-xs"
                  style={{ color: currentTheme.text.muted }}
                >
                  {option.shortcut}
                </span>
              )}
            </div>
          </button>
          {option.dividerAfter && (
            <div
              className="mx-2 my-1 h-px"
              style={{ background: currentTheme.divider }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// File dropdown options with handlers
export const createFileDropdownOptions = (
  onNew: () => void,
  onSave: () => void,
  onExit: () => void
) => [
  {
    label: 'New',
    onClick: onNew,
    shortcut: 'Ctrl+N',
  },
  {
    label: 'Open...',
    onClick: () => {},
    shortcut: 'Ctrl+O',
    disabled: true,
    dividerAfter: true,
  },
  {
    label: 'Save',
    onClick: onSave,
    shortcut: 'Ctrl+S',
    dividerAfter: true,
  },
  {
    label: 'Exit',
    onClick: onExit,
  },
];

// Edit dropdown options with handlers
export const createEditDropdownOptions = (
  onUndo: () => void,
  onCut: () => void,
  onCopy: () => void,
  onPaste: () => void,
  onRedo: () => void,
  canUndo: boolean = false,
  canRedo: boolean = false
) => [
  {
    label: 'Undo',
    onClick: onUndo,
    shortcut: 'Ctrl+Z',
    disabled: !canUndo,
  },
  {
    label: 'Redo',
    onClick: onRedo,
    shortcut: 'Ctrl+Y',
    dividerAfter: true,
    disabled: !canRedo,
  },
  {
    label: 'Cut',
    onClick: onCut,
    shortcut: 'Ctrl+X',
  },
  {
    label: 'Copy',
    onClick: onCopy,
    shortcut: 'Ctrl+C',
  },
  {
    label: 'Paste',
    onClick: onPaste,
    shortcut: 'Ctrl+V',
  },
];

export default Dropdown;
