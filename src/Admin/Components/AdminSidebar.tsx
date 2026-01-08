import React, { useEffect } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { LayoutDashboard, Image, Users, Menu, ChevronRight, ChevronLeft, Type, MousePointer2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
export const AdminSidebar: React.FC = () => {
    const { activeTab, setActiveTab, executeFormat, activeEditorId, isSidebarOpen, toggleSidebar } = useEditor();
    const navigate = useNavigate();
    const location = useLocation();
    const handleFormat = (command: string, value?: string) => {
        executeFormat('applyFormat', command, value);
    };
    return (
        <>
            <div
                className={`fixed right-0 top-0 h-screen bg-white/95 backdrop-blur-xl shadow-2xl border-l border-slate-200 z-50 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-80 translate-x-0' : 'w-16 translate-x-0'
                    }`}
            >
                {/* Toggle Handle */}
                <button
                    onClick={toggleSidebar}
                    className="absolute left-0 top-6 -translate-x-1/2 bg-white border border-slate-200 shadow-md p-1.5 rounded-full text-slate-500 hover:text-red-600 hover:scale-110 transition-all z-50"
                    title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                    {isSidebarOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
                {/* Header / Tabs */}
                <div className={`flex transition-all duration-300 ${isSidebarOpen
                    ? 'border-b border-slate-200 bg-slate-50/50 flex-row'
                    : 'flex-col gap-2 pt-16 pb-2 items-center'
                    }`}>
                    <button
                        onClick={() => setActiveTab('navigate')}
                        className={`flex items-center justify-center gap-1 transition-all ${isSidebarOpen
                            ? `flex-1 py-4 flex-col ${activeTab === 'navigate' ? 'text-red-600 border-b-2 border-red-600 bg-red-50/50' : 'text-slate-500 hover:text-slate-700 border-slate-300 bg-slate-100'}`
                            : `w-12 h-12 rounded-xl ${activeTab === 'navigate' ? 'bg-red-100 text-red-600 shadow-sm' : 'text-slate-500 bg-slate-100'}`
                            }`}
                        title="Navigate"
                    >
                        <div className={`p-1.5 rounded-lg ${isSidebarOpen && activeTab === 'navigate' ? 'bg-red-100' : ''}`}>
                            <LayoutDashboard size={20} />
                        </div>
                        {isSidebarOpen && <span className="text-xs font-semibold uppercase tracking-wide">Navigate</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('edit')}
                        className={`flex items-center justify-center gap-1 transition-all ${isSidebarOpen
                            ? `flex-1 py-4 flex-col ${activeTab === 'edit' ? 'text-red-600 border-b-2 border-red-600 bg-red-50/50' : 'border-slate-300 text-slate-500 hover:text-slate-700 bg-slate-100'}`
                            : `w-12 h-12 rounded-xl ${activeTab === 'edit' ? 'bg-red-100 text-red-600 shadow-sm' : 'text-slate-500 bg-slate-100'}`
                            }`}
                        title="Edit Content"
                    >
                        <div className={`p-1.5 rounded-lg ${isSidebarOpen && activeTab === 'edit' ? 'bg-red-100' : ''}`}>
                            <Type size={20} />
                        </div>
                        {isSidebarOpen && <span className="text-xs font-semibold uppercase tracking-wide">Edit</span>}
                    </button>
                </div>
                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {/* Content only visible when open */}
                    <div className={`transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100 p-6' : 'opacity-0 p-0 pointer-events-none'}`}>
                        {isSidebarOpen && activeTab === 'navigate' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Dashboard</h3>
                                    <nav className="space-y-2">
                                        <button
                                            onClick={() => navigate('/admin/pages')}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-medium ${location.pathname.includes('/admin/pages')
                                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                                                : 'text-slate-600 hover:bg-slate-100'
                                                }`}
                                        >
                                            <LayoutDashboard className="w-5 h-5" />
                                            <span>Pages</span>
                                        </button>
                                        <button
                                            disabled
                                            className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 cursor-not-allowed opacity-60 hover:bg-slate-50"
                                        >
                                            <Image className="w-5 h-5" />
                                            <span>Media</span>
                                        </button>
                                        <button
                                            disabled
                                            className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 cursor-not-allowed opacity-60 hover:bg-slate-50"
                                        >
                                            <Users className="w-5 h-5" />
                                            <span>Users</span>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        )}
                        {isSidebarOpen && activeTab === 'edit' && (
                            <div className="space-y-6 animate-fadeIn">
                                {!activeEditorId ? (
                                    <div className="flex flex-col items-center justify-center text-center py-12 text-slate-400 gap-4 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                                        <MousePointer2 className="w-8 h-8 opacity-50" />
                                        <p className="text-sm">Select a text field<br />to start editing</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                                Formatting
                                            </h3>
                                            <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">ACTIVE</span>
                                        </div>
                                        {/* Font Size */}
                                        <div className="space-y-2">
                                            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Font Size</label>
                                            <div className="relative">
                                                <select
                                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none appearance-none transition-all cursor-pointer hover:bg-slate-100 text-slate-600"
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            executeFormat('applyFontSize', e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>Select Size</option>
                                                    <option value="12px">XS (12px)</option>
                                                    <option value="14px">SM (14px)</option>
                                                    <option value="16px">Base (16px)</option>
                                                    <option value="18px">LG (18px)</option>
                                                    <option value="20px">XL (20px)</option>
                                                    <option value="24px">2XL (24px)</option>
                                                    <option value="30px">3XL (30px)</option>
                                                    <option value="36px">4XL (36px)</option>
                                                    <option value="48px">5XL (48px)</option>
                                                    <option value="60px">6XL (60px)</option>
                                                </select>
                                                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                                            </div>
                                        </div>
                                        {/* Basic Styles */}
                                        <div className="space-y-2">
                                            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Style</label>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleFormat('bold')}
                                                    className="flex-1 py-3 border border-slate-200 rounded-xl bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-500 font-bold text-slate-700 transition-all hover:shadow-sm active:scale-95"
                                                    title="Bold (Ctrl+B)"
                                                >
                                                    B
                                                </button>
                                                <button
                                                    onClick={() => handleFormat('italic')}
                                                    className="flex-1 py-3 border border-slate-200 rounded-xl bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-500 italic text-slate-700 transition-all hover:shadow-sm active:scale-95"
                                                    title="Italic (Ctrl+I)"
                                                >
                                                    I
                                                </button>
                                                <button
                                                    onClick={() => handleFormat('underline')}
                                                    className="flex-1 py-3 border border-slate-200 rounded-xl bg-slate-50 border-slate-200 hover:border-slate-500 underline text-slate-700 transition-all hover:shadow-sm active:scale-95"
                                                    title="Underline (Ctrl+U)"
                                                >
                                                    U
                                                </button>
                                            </div>
                                        </div>
                                        {/* Colors */}
                                        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <div className="space-y-2">
                                                <label className="text-xs text-slate-500 font-semibold flex justify-between">
                                                    <span>Text Color</span>
                                                </label>
                                                <div className="flex gap-2 items-center">
                                                    <div className="relative w-full h-10 overflow-hidden rounded-lg border border-slate-200 shadow-sm hover:shadow transition-shadow">
                                                        <input
                                                            type="color"
                                                            className="absolute -top-2 -left-2 w-[120%] h-[150%] cursor-pointer p-0 border-0"
                                                            onChange={(e) => executeFormat('applyTextColor', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-slate-500 font-semibold flex justify-between">
                                                    <span>Highlight Color</span>
                                                </label>
                                                <div className="flex gap-2 items-center">
                                                    <div className="relative w-full h-10 overflow-hidden rounded-lg border border-slate-200 shadow-sm hover:shadow transition-shadow">
                                                        <input
                                                            type="color"
                                                            className="absolute -top-2 -left-2 w-[120%] h-[150%] cursor-pointer p-0 border-0"
                                                            onChange={(e) => executeFormat('applyBackgroundColor', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Alignment */}
                                        <div className="space-y-2">
                                            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Alignment</label>
                                            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                                                <button
                                                    onClick={() => handleFormat('justifyLeft')}
                                                    className="flex-1 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 hover:border-slate-500 text-slate-600 hover:text-slate-900 transition-all shadow-sm hover:shadow"
                                                >
                                                    ⬅
                                                </button>
                                                <button
                                                    onClick={() => handleFormat('justifyCenter')}
                                                    className="flex-1 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 hover:border-slate-500 text-slate-600 hover:text-slate-900 transition-all shadow-sm hover:shadow"
                                                >
                                                    ↔
                                                </button>
                                                <button
                                                    onClick={() => handleFormat('justifyRight')}
                                                    className="flex-1 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 hover:border-slate-500 text-slate-600 hover:text-slate-900 transition-all shadow-sm hover:shadow"
                                                >
                                                    ➡
                                                </button>
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <button
                                                onClick={() => handleFormat('removeFormat')}
                                                className="w-full py-3 text-red-600 border border-red-200 bg-red-50 rounded-xl hover:bg-red-600 hover:text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <span>✕</span> Clear Formatting
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};