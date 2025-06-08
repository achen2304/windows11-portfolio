'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../../theme-provider';
import { themes } from '@/lib/themes';
import Dropdown, {
  createFileDropdownOptions,
  createEditDropdownOptions,
} from './drop-down';
import useEditorHandlers from './handlers';
import { useWindowManager, WindowState } from '../../window-manager';
import { useAppOpener } from '../../app-openers';

export const TextEditorApp: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const { closeWindow, windows } = useWindowManager();
  const { openAppById } = useAppOpener();

  // Load content from local storage if available
  const getInitialContent = () => {
    if (typeof window !== 'undefined') {
      const savedContent = localStorage.getItem('notepad-content');
      if (savedContent) return savedContent;
    }
    return `hi, i'm cai chen

to get started checkout the apps in the background, taskbar or start menu to get started!`;
  };

  const [content, setContent] = useState<string>(getInitialContent());
  const [lineCol, setLineCol] = useState({ line: 1, col: 1 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Dropdown menu state
  const [activeMenu, setActiveMenu] = useState<'file' | 'edit' | null>(null);

  // Handler for new document (close and reopen)
  const handleNewDocumentAction = () => {
    // Find the current window ID that starts with text-editor
    const textEditorWindow = windows.find((window: WindowState) =>
      window.id.startsWith('text-editor')
    );

    if (textEditorWindow) {
      // First close the current window
      closeWindow(textEditorWindow.id);

      // Then open a new one after a small delay
      setTimeout(() => {
        openAppById('text-editor');
      }, 100);
    }
  };

  // Handler for exiting
  const handleExit = () => {
    // Find the current window ID that starts with text-editor
    const textEditorWindow = windows.find((window: WindowState) =>
      window.id.startsWith('text-editor')
    );

    if (textEditorWindow) {
      closeWindow(textEditorWindow.id);
    }
  };

  // Load content from storage on mount and save on unmount
  useEffect(() => {
    // Initialize the history with the current content when component mounts
    const initialContent = getInitialContent();
    // Store a reference to the textarea element at effect time
    const textareaElement = textareaRef.current;

    if (initialContent && textareaElement) {
      textareaElement.value = initialContent;
    }

    // Save content to storage when component unmounts
    return () => {
      // Use the stored reference, not textareaRef.current which may have changed
      if (typeof window !== 'undefined' && textareaElement) {
        localStorage.setItem('notepad-content', textareaElement.value);
      }
    };
  }, []);

  // Close dropdown when clicking outside the menu
  useEffect(() => {
    const handleWindowClick = (e: MouseEvent) => {
      // Don't close if clicking on a dropdown item
      if (e.target instanceof Element) {
        const isDropdownClick = e.target.closest('.dropdown-menu') !== null;
        const isMenuBarClick = e.target.closest('.menu-bar-item') !== null;

        if (!isDropdownClick && !isMenuBarClick && activeMenu) {
          setActiveMenu(null);
        }
      }
    };

    // Add listeners to close the dropdown when clicking elsewhere
    if (activeMenu) {
      // Add with slight delay to avoid immediate closure
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleWindowClick);
      }, 100);

      // Also close when pressing Escape
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setActiveMenu(null);
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleWindowClick);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [activeMenu]);

  // Get handlers from custom hook
  const handlers = useEditorHandlers(
    textareaRef,
    setContent,
    handleNewDocumentAction
  );

  const {
    handleNewDocument,
    handleSave,
    handleUndo,
    handleCut,
    handleCopy,
    handlePaste,
    handleRedo,
    handleChange,
    canUndo,
    canRedo,
  } = handlers;

  // Menu click handler
  const handleMenuClick = (
    menuType: 'file' | 'edit',
    event: React.MouseEvent
  ) => {
    // Prevent event from bubbling up to window
    event.stopPropagation();
    event.preventDefault();

    if (activeMenu === menuType) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuType);
    }
  };

  // Track cursor position with wrapper function
  const updateCursorPosition = () => {
    handlers.updateCursorPosition(textareaRef, setLineCol);
  };

  // Define text editor colors based on theme
  const editorColors = {
    background: theme === 'dark' ? currentTheme.surface : '#ffffff',
    text: theme === 'dark' ? currentTheme.text.primary : '#000000',
    menuBackground:
      theme === 'dark' ? currentTheme.glass.backgroundDark : '#ffffff',
    menuText: theme === 'dark' ? currentTheme.text.primary : '#000000',
    menuHover:
      theme === 'dark'
        ? currentTheme.button.backgroundHover
        : 'rgba(0, 0, 0, 0.08)',
    border: theme === 'dark' ? currentTheme.border : '#e5e5e5',
    statusBarBackground:
      theme === 'dark' ? currentTheme.glass.background : '#f0f0f0',
    statusBarText: theme === 'dark' ? currentTheme.text.secondary : '#555555',
  };

  return (
    <div
      className="h-full flex flex-col min-h-0"
      style={{ background: editorColors.background }}
    >
      {/* Menu bar */}
      <div
        className="flex text-xs border-b relative"
        style={{
          borderColor: editorColors.border,
          color: editorColors.menuText,
          position: 'relative', // Ensure proper positioning context
        }}
      >
        <div
          className={`px-3 py-1.5 transition-colors duration-150 hover:cursor-pointer menu-bar-item ${
            activeMenu === 'file' ? 'bg-opacity-80' : ''
          }`}
          style={{
            color: editorColors.menuText,
            background:
              activeMenu === 'file' ? editorColors.menuHover : 'transparent',
          }}
          onClick={(e) => handleMenuClick('file', e)}
        >
          File
        </div>
        <div
          className={`px-3 py-1.5 transition-colors duration-150 hover:cursor-pointer menu-bar-item ${
            activeMenu === 'edit' ? 'bg-opacity-80' : ''
          }`}
          style={{
            color: editorColors.menuText,
            background:
              activeMenu === 'edit' ? editorColors.menuHover : 'transparent',
          }}
          onClick={(e) => handleMenuClick('edit', e)}
        >
          Edit
        </div>

        <div className="relative">
          {/* File Dropdown */}
          {activeMenu === 'file' && (
            <div
              className="absolute top-full left-0 dropdown-menu"
              style={{ marginLeft: '-87px' }}
            >
              <Dropdown
                isOpen={true}
                onClose={() => setActiveMenu(null)}
                position={{ top: 0, left: 0 }}
                options={createFileDropdownOptions(
                  handleNewDocument,
                  handleSave,
                  handleExit
                )}
              />
            </div>
          )}

          {/* Edit Dropdown */}
          {activeMenu === 'edit' && (
            <div
              className="absolute top-full left-0 dropdown-menu"
              style={{ marginLeft: '-44px' }}
            >
              <Dropdown
                isOpen={true}
                onClose={() => setActiveMenu(null)}
                position={{ top: 0, left: 0 }}
                options={createEditDropdownOptions(
                  handleUndo,
                  handleCut,
                  handleCopy,
                  handlePaste,
                  handleRedo,
                  canUndo,
                  canRedo
                )}
              />
            </div>
          )}
        </div>
      </div>

      {/* Content area */}
      <textarea
        ref={textareaRef}
        className="flex-1 w-full resize-none outline-none p-3 font-mono"
        style={{
          backgroundColor: editorColors.background,
          color: editorColors.text,
        }}
        value={content}
        onChange={handleChange}
        onClick={updateCursorPosition}
        onKeyUp={updateCursorPosition}
      />

      {/* Status bar */}
      <div
        className="flex justify-between items-center text-xs px-3 py-1.5 border-t"
        style={{
          background: editorColors.statusBarBackground,
          borderColor: editorColors.border,
          color: editorColors.statusBarText,
        }}
      >
        <div className="flex items-center space-x-4">
          <span>
            Ln {lineCol.line}, Col {lineCol.col}
          </span>
          <span>100%</span>
          <span>Windows (CRLF)</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};

export default TextEditorApp;
