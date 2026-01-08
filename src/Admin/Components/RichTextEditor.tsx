import React, { useRef, useState, useEffect, useId } from 'react';
import toast from 'react-hot-toast';
import { useEditor } from '../../contexts/EditorContext';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  className = '',
  placeholder = ''
}) => {
  const editorId = useId();
  const { registerEditor, unregisterEditor, setActiveEditor, activeEditorId } = useEditor();
  const editorRef = useRef<HTMLDivElement>(null);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);

  // Sync value to editor when it changes externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Save selection
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0).cloneRange());
      return selection.getRangeAt(0).cloneRange();
    }
    return null;
  };

  // Restore selection
  const restoreSelection = () => {
    if (savedSelection && editorRef.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedSelection);
      editorRef.current.focus();
      return true;
    }
    return false;
  };

  // Select newly created span (keep text selected)
  const selectSpan = (span: HTMLSpanElement) => {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(span);
    selection?.removeAllRanges();
    selection?.addRange(range);
    saveSelection();
  };

  // Helper to find existing span wrapper
  const findExistingSpan = (range: Range): HTMLSpanElement | null => {
    const container = range.commonAncestorContainer;

    // If text node, check parent
    if (container.nodeType === Node.TEXT_NODE && container.parentNode instanceof HTMLSpanElement) {
      if (container.parentNode.textContent === range.toString()) {
        return container.parentNode;
      }
    }

    // If span element directly (rare but possible with full selection)
    if (container instanceof HTMLSpanElement) {
      if (container.textContent === range.toString()) {
        return container;
      }
    }

    return null;
  };

  // Apply formatting
  const applyFormat = (command: string, value?: string) => {
    restoreSelection();
    document.execCommand(command, false, value);
    saveSelection();

    setTimeout(() => {
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }, 10);
  };

  // Apply font size (keep selection)
  const applyFontSize = (size: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      toast.error('Please select text first');
      return;
    }

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      toast.error('Please select text first');
      return;
    }

    try {
      // 1. Check if we can update existing span
      const existingSpan = findExistingSpan(range);
      if (existingSpan) {
        existingSpan.style.fontSize = size;
        selectSpan(existingSpan);
        setTimeout(() => {
          if (editorRef.current) onChange(editorRef.current.innerHTML);
        }, 10);
        toast.success(`Font size: ${size}`);
        return;
      }

      const selectedContent = range.extractContents();

      // Check if selectedContent is a single span element with existing styles
      let span: HTMLSpanElement;
      if (selectedContent.childNodes.length === 1 &&
        selectedContent.firstChild instanceof HTMLSpanElement) {
        // Reuse existing span and add/update fontSize
        span = selectedContent.firstChild as HTMLSpanElement;
        span.style.fontSize = size;
      } else {
        // Create new span
        span = document.createElement('span');
        span.style.fontSize = size;
        span.appendChild(selectedContent);
      }

      range.insertNode(span);
      selectSpan(span);

      setTimeout(() => {
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      }, 10);

      toast.success(`Font size: ${size}`);
    } catch (err) {
      console.error('Font size error:', err);
      toast.error('Failed to apply font size');
    }
  };

  // Apply text color (keep selection)
  const applyTextColor = (color: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      toast.error('Please select text first');
      return;
    }

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      toast.error('Please select text first');
      return;
    }

    try {
      // 1. Check if we can update existing span
      const existingSpan = findExistingSpan(range);
      if (existingSpan) {
        existingSpan.style.color = color;
        selectSpan(existingSpan);
        setTimeout(() => {
          if (editorRef.current) onChange(editorRef.current.innerHTML);
        }, 10);
        toast.success('Color applied');
        return;
      }

      const selectedContent = range.extractContents();

      // Check if selectedContent is a single span element with existing styles
      let span: HTMLSpanElement;
      if (selectedContent.childNodes.length === 1 &&
        selectedContent.firstChild instanceof HTMLSpanElement) {
        // Reuse existing span and add/update color
        span = selectedContent.firstChild as HTMLSpanElement;
        span.style.color = color;
      } else {
        // Create new span
        span = document.createElement('span');
        span.style.color = color;
        span.appendChild(selectedContent);
      }

      range.insertNode(span);
      selectSpan(span);

      setTimeout(() => {
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      }, 10);

      toast.success('Color applied');
    } catch (err) {
      toast.error('Failed to apply color');
    }
  };

  // Apply background color (keep selection)
  const applyBackgroundColor = (color: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      toast.error('Please select text first');
      return;
    }

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      toast.error('Please select text first');
      return;
    }

    try {
      // 1. Check if we can update existing span
      const existingSpan = findExistingSpan(range);
      if (existingSpan) {
        existingSpan.style.backgroundColor = color;
        selectSpan(existingSpan);
        setTimeout(() => {
          if (editorRef.current) onChange(editorRef.current.innerHTML);
        }, 10);
        toast.success('Background applied');
        return;
      }

      const selectedContent = range.extractContents();

      // Check if selectedContent is a single span element with existing styles
      let span: HTMLSpanElement;
      if (selectedContent.childNodes.length === 1 &&
        selectedContent.firstChild instanceof HTMLSpanElement) {
        // Reuse existing span and add/update backgroundColor
        span = selectedContent.firstChild as HTMLSpanElement;
        span.style.backgroundColor = color;
      } else {
        // Create new span
        span = document.createElement('span');
        span.style.backgroundColor = color;
        span.appendChild(selectedContent);
      }

      range.insertNode(span);
      selectSpan(span);

      setTimeout(() => {
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      }, 10);

      toast.success('Background applied');
    } catch (err) {
      toast.error('Failed to apply background');
    }
  };

  // Register editor actions on mount
  useEffect(() => {
    registerEditor(editorId, {
      applyFormat,
      applyFontSize,
      applyTextColor,
      applyBackgroundColor
    });

    return () => unregisterEditor(editorId);
  }, []);

  const handleFocus = () => {
    setActiveEditor(editorId);
    onFocus?.();
  };

  // Handle blur
  const handleBlur = () => {
    saveSelection();
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    onBlur?.();
  };

  // Handle input changes (real-time)
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const isActive = activeEditorId === editorId;

  return (
    <>
      <style>{`
        .rich-text-editor {
          transition: all 0.2s ease;
          cursor: text;
          position: relative;
          min-height: 1.5em;
        }

        .rich-text-editor:hover {
          background: rgba(220, 38, 38, 0.05) !important;
          outline: 1px dashed rgba(220, 38, 38, 0.3);
          outline-offset: 2px;
        }

        .rich-text-editor:focus, .rich-text-editor[data-active="true"] {
          background: rgba(220, 38, 38, 0.05) !important;
          outline: 2px solid rgba(220, 38, 38, 0.5);
          outline-offset: 2px;
        }

        .rich-text-editor span[style] {
          all: revert;
        }

        .rich-text-editor::selection {
          background-color: rgba(220, 38, 38, 0.3);
          color: inherit;
        }

        .rich-text-editor *::selection {
          background-color: rgba(220, 38, 38, 0.3);
          color: inherit;
        }
      `}</style>

      <div
        ref={editorRef}
        contentEditable
        data-active={isActive}
        onInput={handleInput}
        onBlur={handleBlur}
        onFocus={handleFocus}
        // Selection handling could be improved to detect selection changes and update sidebar UI (e.g. highlight bold button)
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        className={`
            ${className} 
            outline-none 
            cursor-text
            border border-transparent
            hover:border-slate-300
            transition-all
            ${!value && placeholder ? 'before:content-[attr(data-placeholder)] before:text-slate-400' : ''}
        `}
        data-placeholder={placeholder}
        suppressContentEditableWarning
        style={{ minHeight: '1.5em' }}
      />
    </>
  );
};
