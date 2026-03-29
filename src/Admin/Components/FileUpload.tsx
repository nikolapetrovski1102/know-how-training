import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { FileText, Upload, X } from 'lucide-react';
import { apiFetch } from '../../Utils/fetchWrapper';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7062';

interface FileUploadProps {
    currentFileUrl?: string;
    onFileChange: (newUrl: string) => void;
    label?: string;
    accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    currentFileUrl,
    onFileChange,
    label = 'Document',
    accept = '.pdf,.doc,.docx'
}) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Upload to server
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await apiFetch(`${API_BASE}/api/FileUpload/document`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }

            const data = await response.json();

            onFileChange(data.fileUrl);

            toast.success('✅ File uploaded!');
        } catch (err: any) {
            console.error('Upload error:', err);
            toast.error(`❌ ${err.message}`);
        } finally {
            setUploading(false);
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const clearFile = () => {
        onFileChange('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="relative group">
            <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>

            <div className="flex items-center gap-4 p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl hover:border-red-400 transition-colors">
                {currentFileUrl ? (
                    <div className="flex flex-1 items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 text-red-600">
                            <FileText size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-900 truncate">
                                {currentFileUrl.split('/').pop()}
                            </p>
                            <a
                                href={`${API_BASE}${currentFileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-red-600 hover:text-red-700 hover:underline"
                            >
                                View File
                            </a>
                        </div>
                        <button
                            onClick={clearFile}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-white rounded-lg shadow-sm"
                            title="Remove file"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div
                        className="flex-1 cursor-pointer flex items-center justify-center gap-2 text-slate-500 hover:text-red-600 transition-colors py-2"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload size={20} />
                        <span className="text-sm font-medium">Click to upload document</span>
                    </div>
                )}
            </div>

            {uploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl z-10">
                    <div className="flex items-center gap-3 text-red-600 font-medium">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                        <span>Uploading...</span>
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
};
