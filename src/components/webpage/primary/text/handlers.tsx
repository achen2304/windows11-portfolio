'use client';

import React from 'react';
import { useToast } from '@/components/ui/toast';
import { copyToClipboard } from '@/lib/notification-utils';
import { useAppOpeners } from '@/components/webpage/app-openers';

export const defaultText = `hi, i'm cai \n\nthis is my (wip) portfolio website :) \n\nto get started checkout the "about" or slack app in the background, taskbar or start menu! \n\np.s. **everything** is interactive `;

export const useEditorHandlers = (
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
  setContent: React.Dispatch<React.SetStateAction<string>>,
  onNewDocument?: () => void
) => {
  const { addToast } = useToast();
  const { openTextEditor } = useAppOpeners();
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);

  const [textHistory, setTextHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);

  const resetHistory = React.useCallback((initialText: string) => {
    setTextHistory([initialText]);
    setHistoryIndex(0);
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  const handleNewDocument = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('notepad-content', defaultText);
    }

    addToast({
      title: 'New document created',
      description: 'All content has been reset to default',
      type: 'info',
    });

    resetHistory(defaultText);

    if (textareaRef.current) {
      textareaRef.current.value = defaultText;
    }

    if (onNewDocument) {
      onNewDocument();
    }

    setContent(defaultText);

    setTimeout(() => {
      openTextEditor();
    }, 600);
  };

  const handleSave = () => {
    if (typeof window !== 'undefined' && textareaRef.current) {
      localStorage.setItem('notepad-content', textareaRef.current.value || '');

      addToast({
        title: 'Document saved',
        description: 'Your changes have been saved',
        type: 'success',
      });
    }
  };

  React.useEffect(() => {
    const handleTextChange = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const currentText = textarea.value;

      if (textHistory.length === 0) {
        resetHistory(currentText);
        return;
      }

      if (historyIndex >= 0 && textHistory[historyIndex] === currentText) {
        return;
      }

      const newHistory = textHistory.slice(0, historyIndex + 1);
      newHistory.push(currentText);

      if (newHistory.length > 100) {
        newHistory.shift();
      }

      setTextHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      setCanUndo(newHistory.length > 1);
      setCanRedo(false);
    };

    if (textareaRef.current) {
      handleTextChange();
    }

    const textarea = textareaRef.current;
    if (textarea) {
      const observer = new MutationObserver(() => {
        handleTextChange();
      });

      observer.observe(textarea, {
        attributes: true,
        childList: true,
        characterData: true,
      });

      return () => observer.disconnect();
    }
  }, [historyIndex, textHistory, resetHistory, textareaRef]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(textHistory[newIndex]);

      setCanUndo(newIndex > 0);
      setCanRedo(true);

      addToast({
        title: 'Undo successful',
        type: 'success',
      });
    } else {
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

      setCanUndo(true);
      setCanRedo(newIndex < textHistory.length - 1);

      addToast({
        title: 'Redo successful',
        type: 'success',
      });
    } else {
      addToast({
        title: 'Nothing to redo',
        type: 'info',
      });
    }
  };

  const handleCut = () => {
    if (textareaRef.current) {
      const textToCopy = textareaRef.current.value;

      copyToClipboard(textToCopy, 'Cut to clipboard', addToast).then(
        (success) => {
          if (success) {
            setContent('');
          }
        }
      );
    }
  };

  const handleCopy = () => {
    if (textareaRef.current) {
      const textToCopy = textareaRef.current.value;
      copyToClipboard(textToCopy, 'Copied to clipboard', addToast);
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (textareaRef.current) {
        const currentText = textareaRef.current.value;
        const newText = currentText
          ? `${currentText}\n${clipboardText}`
          : clipboardText;
        setContent(newText);

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
    handleNewDocument,
    handleSave,
    handleUndo,
    handleCut,
    handleCopy,
    handlePaste,
    handleRedo,
    canUndo,
    canRedo,
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    updateCursorPosition,
  };
};

export default useEditorHandlers;
