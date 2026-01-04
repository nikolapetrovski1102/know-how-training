import { useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

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
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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

  // Handle click (open toolbar) - Position ABOVE the element
  const handleClick = () => {
    console.log('🔵 RichTextEditor clicked!', editorRef.current);
    
    if (editorRef.current) {
      const rect = editorRef.current.getBoundingClientRect();
      const toolbarHeight = 80; // Approximate toolbar height
      
      // Position above the element, ensuring it stays in viewport
      let top = rect.top - toolbarHeight - 10; // 10px gap above element
      let left = rect.left;
      
      // If toolbar would go above viewport, position it below instead
      if (top < 10) {
        top = rect.bottom + 10;
      }
      
      // Ensure toolbar doesn't go off right edge
      const toolbarWidth = 650;
      if (left + toolbarWidth > window.innerWidth) {
        left = window.innerWidth - toolbarWidth - 10;
      }
      
      // Ensure toolbar doesn't go off left edge
      left = Math.max(10, left);
      
      setToolbarPosition({ top, left });
      setShowToolbar(true);
      console.log('✅ Toolbar shown at:', { top, left });
      
      editorRef.current.focus();
    }
    
    onFocus?.();
  };

  // Handle right-click (context menu)
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('🟠 Right-click at:', e.clientY, e.clientX);
    
    if (editorRef.current) {
      const toolbarHeight = 80;
      let top = e.clientY - toolbarHeight - 10;
      let left = e.clientX;
      
      // Keep in viewport
      if (top < 10) {
        top = e.clientY + 10;
      }
      
      const toolbarWidth = 650;
      if (left + toolbarWidth > window.innerWidth) {
        left = window.innerWidth - toolbarWidth - 10;
      }
      left = Math.max(10, left);
      
      setToolbarPosition({ top, left });
      setShowToolbar(true);
      console.log('✅ Context toolbar shown at:', { top, left });
      
      editorRef.current.focus();
    }
    
    saveSelection();
  };

  // Drag handlers
  const handleDragStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - toolbarPosition.left,
        y: e.clientY - toolbarPosition.top
      });
      e.preventDefault();
    }
  };

  const handleDragMove = (e: MouseEvent) => {
    if (isDragging) {
      const newLeft = Math.max(0, Math.min(window.innerWidth - 650, e.clientX - dragOffset.x));
      const newTop = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y));
      
      setToolbarPosition({
        left: newLeft,
        top: newTop
      });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Add/remove drag listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, dragOffset]);

  // Handle blur
  const handleBlur = (e: React.FocusEvent) => {
    saveSelection();
    
    setTimeout(() => {
      if (!toolbarRef.current?.contains(document.activeElement)) {
        setShowToolbar(false);
      }
    }, 200);

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
      const selectedContent = range.extractContents();
      const span = document.createElement('span');
      span.style.fontSize = size;
      span.appendChild(selectedContent);
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
      const selectedContent = range.extractContents();
      const span = document.createElement('span');
      span.style.color = color;
      span.appendChild(selectedContent);
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
      const selectedContent = range.extractContents();
      const span = document.createElement('span');
      span.style.backgroundColor = color;
      span.appendChild(selectedContent);
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

        .rich-text-editor:focus {
          background: rgba(220, 38, 38, 0.1) !important;
          outline: 2px solid rgba(220, 38, 38, 0.5);
          outline-offset: 2px;
          text-shadow: 0 0 8px rgba(220, 38, 38, 0.3),
                       0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .rich-text-editor:focus * {
          text-shadow: 0 0 8px rgba(220, 38, 38, 0.3),
                       0 1px 2px rgba(0, 0, 0, 0.1);
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

        .toolbar-button {
          padding: 6px 10px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          color: #1e293b;
          font-weight: 500;
        }

        .toolbar-button:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .toolbar-button:active {
          background: #e2e8f0;
        }

        .toolbar-button option {
          color: #1e293b;
          background: white;
          font-weight: 500;
        }

        .drag-handle {
          cursor: grab;
          user-select: none;
        }

        .drag-handle:active {
          cursor: grabbing;
        }

        .dragging {
          cursor: grabbing !important;
        }
      `}</style>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleBlur}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        className={`
            ${className} 
            outline-none 
            cursor-text
            border border-transparent
            hover:border-slate-300
            focus:border-red-600
            focus:bg-white
            transition-all
            ${!value && placeholder ? 'before:content-[attr(data-placeholder)] before:text-slate-400' : ''}
        `}
        data-placeholder={placeholder}
        suppressContentEditableWarning
        style={{ minHeight: '1.5em' }}
      />

      {/* Toolbar */}
      {showToolbar && (
        <div
          ref={toolbarRef}
          className={`fixed bg-slate-900 text-white rounded-lg shadow-2xl ${isDragging ? 'dragging' : ''}`}
          style={{
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
            zIndex: 99999,
            minWidth: '650px',
            maxWidth: '800px',
            transition: isDragging ? 'none' : 'all 0.2s ease'
          }}
          onMouseDown={handleDragStart}
        >
          {/* Drag Handle */}
          <div className="drag-handle bg-slate-800 rounded-t-lg px-3 py-2 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-slate-500">
                <circle cx="5" cy="6" r="1.5"/>
                <circle cx="10" cy="6" r="1.5"/>
                <circle cx="15" cy="6" r="1.5"/>
                <circle cx="5" cy="10" r="1.5"/>
                <circle cx="10" cy="10" r="1.5"/>
                <circle cx="15" cy="10" r="1.5"/>
                <circle cx="5" cy="14" r="1.5"/>
                <circle cx="10" cy="14" r="1.5"/>
                <circle cx="15" cy="14" r="1.5"/>
              </svg>
              <span className="text-xs text-slate-400 font-medium">Text Formatting (Drag to move)</span>
            </div>
            <button
              className="text-slate-400 hover:text-white transition-colors"
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setShowToolbar(false);
              }}
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Toolbar Content */}
          <div className="p-3 flex items-center gap-2 flex-wrap" onMouseDown={(e) => e.stopPropagation()}>
            {/* Font Size */}
            <select
              className="toolbar-button"
              onChange={(e) => {
                if (e.target.value) {
                  applyFontSize(e.target.value);
                  e.target.value = '';
                }
              }}
              onMouseDown={(e) => e.stopPropagation()}
              defaultValue=""
            >
              <option value="" disabled>Font Size</option>
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="18px">18px</option>
              <option value="20px">20px</option>
              <option value="24px">24px</option>
              <option value="28px">28px</option>
              <option value="32px">32px</option>
              <option value="36px">36px</option>
              <option value="48px">48px</option>
              <option value="60px">60px</option>
              <option value="72px">72px</option>
            </select>

            <div className="w-px h-6 bg-slate-700 mx-1"></div>

            {/* Text Formatting */}
            <button
              className="toolbar-button font-bold"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat('bold');
              }}
              title="Bold (Ctrl+B)"
            >
              B
            </button>
            <button
              className="toolbar-button italic"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat('italic');
              }}
              title="Italic (Ctrl+I)"
            >
              I
            </button>
            <button
              className="toolbar-button underline"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat('underline');
              }}
              title="Underline (Ctrl+U)"
            >
              U
            </button>

            <div className="w-px h-6 bg-slate-700 mx-1"></div>

            {/* Text Color */}
            <div className="flex items-center gap-1 border border-slate-200 rounded px-2 py-1 bg-white">
              <label className="text-xs text-slate-900 cursor-pointer font-medium">
                Text:
              </label>
              <input
                type="color"
                className="w-8 h-6 rounded cursor-pointer border-0"
                onChange={(e) => applyTextColor(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                title="Text Color"
              />
            </div>

            {/* Background Color */}
            <div className="flex items-center gap-1 border border-slate-200 rounded px-2 py-1 bg-white">
              <label className="text-xs text-slate-900 cursor-pointer font-medium">
                BG:
              </label>
              <input
                type="color"
                className="w-8 h-6 rounded cursor-pointer border-0"
                onChange={(e) => applyBackgroundColor(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                title="Background Color"
              />
            </div>

            <div className="w-px h-6 bg-slate-700 mx-1"></div>

            {/* Alignment */}
            <button
              className="toolbar-button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat('justifyLeft');
              }}
              title="Align Left"
            >
              ⬅
            </button>
            <button
              className="toolbar-button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat('justifyCenter');
              }}
              title="Align Center"
            >
              ↔
            </button>
            <button
              className="toolbar-button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat('justifyRight');
              }}
              title="Align Right"
            >
              ➡
            </button>

            <div className="w-px h-6 bg-slate-700 mx-1"></div>

            {/* Clear Formatting */}
            <button
              className="toolbar-button text-red-600"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat('removeFormat');
              }}
              title="Clear Formatting"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </>
  );
};
