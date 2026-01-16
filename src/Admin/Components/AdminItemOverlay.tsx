import React from 'react';

interface AdminItemOverlayProps {
    children: React.ReactNode;
    width?: string; // "25%", "50%", "75%", "100%"
    onResize: (newWidth: string) => void;
    onDelete: () => void;
    label: string;
}

export const AdminItemOverlay: React.FC<AdminItemOverlayProps> = ({
    children,
    width = "100%",
    onResize,
    onDelete,
    label
}) => {
    const widths = ["25%", "50%", "75%", "100%"];

    return (
        <div
            className="relative group border-2 border-transparent hover:border-red-500 rounded-xl transition-all p-1"
            style={{ width: width }}
        >
            {/* Header / Info Label */}
            <div className="absolute -top-3 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-20 uppercase tracking-tighter">
                {label} ({width})
            </div>

            {/* Resize Handles - Simplified to Buttons for better Control */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <div className="flex bg-white/90 backdrop-blur rounded border border-slate-200 overflow-hidden shadow-sm">
                    {widths.map(w => (
                        <button
                            key={w}
                            onClick={(e) => { e.stopPropagation(); onResize(w); }}
                            className={`px-1.5 py-0.5 text-[8px] font-bold border-r last:border-r-0 hover:bg-slate-100 ${width === w ? 'bg-red-50 text-red-600' : 'text-slate-500'}`}
                        >
                            {w}
                        </button>
                    ))}
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="bg-white/90 backdrop-blur rounded border border-slate-200 p-1 text-red-500 hover:bg-red-50 shadow-sm"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            {/* Content Buffer for Hover */}
            <div className="h-full">
                {children}
            </div>
        </div>
    );
};
