'use client';

import React from 'react';
import { useToast } from '@/components/ui/toast';
import { copyToClipboard } from '@/lib/notification-utils';

// Text editor handlers
export const useEditorHandlers = (
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
  setContent: React.Dispatch<React.SetStateAction<string>>,
  onNewDocument?: () => void
) => {
  // Get toast functionality
  const { addToast } = useToast();

  // Track undo/redo state
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);

  // Keep track of text changes for undo/redo
  const [textHistory, setTextHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);

  // Function to reset history - wrapped in useCallback to prevent recreation on each render
  const resetHistory = React.useCallback((initialText: string) => {
    setTextHistory([initialText]);
    setHistoryIndex(0);
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  // File menu handlers
  const handleNewDocument = () => {
    const defaultText = `hi, i'm cai chen \n\nthis is my portfolio website :) \n\nto get started checkout the "about" app in the background, taskbar or start menu! \n\np.s. all of buttons are interactive!`;

    // Reset the storage
    if (typeof window !== 'undefined') {
      localStorage.setItem('notepad-content', defaultText);
    }

    // Show notification
    addToast({
      title: 'New document created',
      description: 'All content has been reset to default',
      type: 'info',
    });

    // Reset history
    resetHistory(defaultText);

    // If we have a callback for new document, call it
    if (onNewDocument) {
      onNewDocument();
    } else {
      // Otherwise just update the content
      setContent(defaultText);
    }
  };

  const handleSave = () => {
    // Save to local storage
    if (typeof window !== 'undefined' && textareaRef.current) {
      localStorage.setItem('notepad-content', textareaRef.current.value || '');

      // Show toast notification
      addToast({
        title: 'Document saved',
        description: 'Your changes have been saved',
        type: 'success',
      });

      // We no longer reopen the app on save
    }
  };

  // Add current text to history when text changes
  React.useEffect(() => {
    // Create a handler function to process text changes
    const handleTextChange = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const currentText = textarea.value;

      // Initialize history if empty
      if (textHistory.length === 0) {
        resetHistory(currentText);
        return;
      }

      // Don't add to history if text hasn't changed
      if (historyIndex >= 0 && textHistory[historyIndex] === currentText) {
        return;
      }

      // Remove any future history if we're not at the end
      const newHistory = textHistory.slice(0, historyIndex + 1);
      newHistory.push(currentText);

      // Limit history size to prevent memory issues
      if (newHistory.length > 100) {
        newHistory.shift();
      }

      setTextHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      // Update undo/redo availability
      setCanUndo(newHistory.length > 1);
      setCanRedo(false);
    };

    // Call the handler initially
    if (textareaRef.current) {
      handleTextChange();
    }

    // Set up a MutationObserver to watch for value changes
    const textarea = textareaRef.current;
    if (textarea) {
      const observer = new MutationObserver(() => {
        handleTextChange();
      });

      // Start observing the textarea for value changes
      observer.observe(textarea, {
        attributes: true,
        childList: true,
        characterData: true,
      });

      // Clean up observer when component unmounts
      return () => observer.disconnect();
    }
  }, [historyIndex, textHistory, resetHistory, textareaRef]);

  // Edit menu handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(textHistory[newIndex]);

      // Update undo/redo state
      setCanUndo(newIndex > 0);
      setCanRedo(true);

      // Show success toast
      addToast({
        title: 'Undo successful',
        type: 'success',
      });
    } else {
      // Show toast for no more undo history
      addToast({
        title: 'Nothing to undo',
        type: 'info',
      });
    }
  };

  const handleRedo = () => {
    if (historyIndex < textHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setContent(textHistory[newIndex]);

      // Update undo/redo state
      setCanUndo(true);
      setCanRedo(newIndex < textHistory.length - 1);

      // Show success toast
      addToast({
        title: 'Redo successful',
        type: 'success',
      });
    } else {
      // Show toast for no more redo history
      addToast({
        title: 'Nothing to redo',
        type: 'info',
      });
    }
  };

  const handleCut = () => {
    if (textareaRef.current) {
      // Save to clipboard
      const textToCopy = textareaRef.current.value;

      // Use the integrated copyToClipboard utility
      copyToClipboard(textToCopy, 'Cut to clipboard', addToast).then(
        (success) => {
          if (success) {
            // Clear the content
            setContent('');
          }
        }
      );
    }
  };

  const handleCopy = () => {
    if (textareaRef.current) {
      // Copy to clipboard using the integrated utility
      const textToCopy = textareaRef.current.value;
      copyToClipboard(textToCopy, 'Copied to clipboard', addToast);
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (textareaRef.current) {
        // Add clipboard text to the end of the current content with a new line
        const currentText = textareaRef.current.value;
        const newText = currentText
          ? `${currentText}\n${clipboardText}`
          : clipboardText;
        setContent(newText);

        // Show toast notification
        addToast({
          title: 'Content pasted',
          description: `${clipboardText.length} characters pasted`,
          type: 'success',
        });
      }
    } catch (err) {
      console.error('Failed to read clipboard', err);
      addToast({
        title: 'Failed to paste content',
        description: 'Could not access clipboard',
        type: 'error',
      });
    }
  };

  // Remove handleSelectAll as it's no longer needed

  // Line and column tracking
  const updateCursorPosition = (
    textareaRef: React.RefObject<HTMLTextAreaElement | null>,
    setLineCol: React.Dispatch<
      React.SetStateAction<{ line: number; col: number }>
    >
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const text = textarea.value;
    const cursorPos = textarea.selectionStart;

    // Count lines and columns
    let line = 1;
    let col = 1;

    for (let i = 0; i < cursorPos; i++) {
      if (text[i] === '\n') {
        line++;
        col = 1;
      } else {
        col++;
      }
    }

    setLineCol({ line, col });
  };

  return {
    // File handlers
    handleNewDocument,
    handleSave,

    // Edit handlers
    handleUndo,
    handleCut,
    handleCopy,
    handlePaste,
    handleRedo,

    // Undo/Redo state
    canUndo,
    canRedo,

    // Content handling
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    updateCursorPosition,
  };
};

export default useEditorHandlers;
