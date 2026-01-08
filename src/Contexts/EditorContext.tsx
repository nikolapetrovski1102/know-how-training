import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Define the formatting actions available
export interface FormatActions {
    applyFormat: (command: string, value?: string) => void;
    applyFontSize: (size: string) => void;
    applyTextColor: (color: string) => void;
    applyBackgroundColor: (color: string) => void;
}

interface EditorContextType {
    activeEditorId: string | null;
    setActiveEditor: (id: string | null) => void;

    // Sidebar Tabs
    activeTab: 'edit' | 'navigate';
    setActiveTab: (tab: 'edit' | 'navigate') => void;

    // Sidebar Visibility
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;

    // Formatting actions for the currently active editor
    registerEditor: (id: string, actions: FormatActions) => void;
    unregisterEditor: (id: string) => void;
    executeFormat: (action: keyof FormatActions, ...args: any[]) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeEditorId, setActiveEditorId] = useState<string | null>(null);
    const [activeTab, setActiveTabState] = useState<'edit' | 'navigate'>('navigate');
    const [editors, setEditors] = useState<Record<string, FormatActions>>({});
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const setActiveTab = useCallback((tab: 'edit' | 'navigate') => {
        setActiveTabState(tab);
        if (!isSidebarOpen) setSidebarOpen(true);
    }, [isSidebarOpen]);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const setActiveEditor = useCallback((id: string | null) => {
        setActiveEditorId(id);
        if (id) {
            setActiveTab('edit');
            setSidebarOpen(true);
        }
    }, [setActiveTab]);

    const registerEditor = useCallback((id: string, actions: FormatActions) => {
        setEditors(prev => ({ ...prev, [id]: actions }));
    }, []);

    const unregisterEditor = useCallback((id: string) => {
        setEditors(prev => {
            const { [id]: _, ...rest } = prev;
            return rest;
        });
        if (activeEditorId === id) {
            setActiveEditorId(null);
        }
    }, [activeEditorId]);

    const executeFormat = useCallback((action: keyof FormatActions, ...args: any[]) => {
        if (!activeEditorId || !editors[activeEditorId]) {
            console.warn('No active editor to format');
            return;
        }
        const editorActions = editors[activeEditorId];
        if (editorActions[action]) {
            // @ts-ignore
            editorActions[action](...args);
        }
    }, [activeEditorId, editors]);

    return (
        <EditorContext.Provider value={{
            activeEditorId,
            setActiveEditor,
            activeTab,
            setActiveTab,
            registerEditor,
            unregisterEditor,
            executeFormat,
            isSidebarOpen,
            toggleSidebar,
            setSidebarOpen
        }}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditor = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
};
