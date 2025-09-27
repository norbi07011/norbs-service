import React, { useState, useEffect, DragEvent, useRef, useMemo } from 'react';
import { getFilesByProjectId, uploadFile, deleteFile } from '../../services/files';
import { File as ProjectFile } from '../../types';
import { useToast } from '../../hooks/useToast';

interface FilesManagerProps {
    projectId: string;
}

const FileIcon: React.FC<{ mimeType: string }> = ({ mimeType }) => {
    const iconClass = "w-8 h-8 text-muted-foreground";

    if (mimeType.startsWith('image/')) {
        return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
    }
    if (mimeType === 'application/pdf') {
        return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
    }
    if (mimeType.startsWith('video/')) {
        return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>;
    }
    if (['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'].includes(mimeType)) {
        return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="1" x2="10" y2="23"></line><path d="M20 17.5V15a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2.5"></path><path d="M14 17.5V15a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2.5"></path><path d="M8 17.5V15a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2.5"></path></svg>;
    }
    
    return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>;
};

const FilesManager: React.FC<FilesManagerProps> = ({ projectId }) => {
    const [files, setFiles] = useState<ProjectFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchFiles = async () => {
            setLoading(true);
            const data = await getFilesByProjectId(projectId);
            setFiles(data);
            setLoading(false);
        };
        fetchFiles();
    }, [projectId]);

    const sortedFiles = useMemo(() => {
        return [...files].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [files]);

    const handleFileUpload = async (filesToUpload: FileList | null) => {
        if (!filesToUpload || filesToUpload.length === 0 || isUploading) return;

        setIsUploading(true);
        try {
            const uploadPromises = Array.from(filesToUpload).map(file => uploadFile(projectId, file));
            const results = await Promise.allSettled(uploadPromises);
            
            const successfulUploads: ProjectFile[] = [];
            let failureCount = 0;

            results.forEach(result => {
                if (result.status === 'fulfilled') {
                    successfulUploads.push(result.value as ProjectFile);
                } else {
                    failureCount++;
                    console.error('File upload failed:', result.reason);
                }
            });

            if (successfulUploads.length > 0) {
                setFiles(prev => [...prev, ...successfulUploads]);
                addToast(`${successfulUploads.length} file(s) uploaded successfully`, 'success');
            }

            if (failureCount > 0) {
                addToast(`${failureCount} file(s) failed to upload.`, 'error');
            }

        } catch (error) {
            console.error(error);
            addToast('An unexpected error occurred during upload', 'error');
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileUpload(e.dataTransfer.files);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileUpload(e.target.files);
        if (e.target) {
            e.target.value = '';
        }
    };

    const handleDelete = async (fileId: string) => {
        if (window.confirm('Are you sure you want to delete this file?')) {
            try {
                await deleteFile(fileId);
                setFiles(prev => prev.filter(f => f.id !== fileId));
                addToast('File deleted successfully', 'success');
            } catch (error) {
                addToast('Failed to delete file', 'error');
            }
        }
    };
    
    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <div className="uiverse-card p-6">
            <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
            <div className="uiverse-card-content relative z-10">
                <h2 className="text-xl font-bold text-foreground mb-4">Project Files</h2>
                
                <div 
                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
                    onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex justify-center items-center px-6 py-10 border-2 border-border border-dashed rounded-md transition-colors cursor-pointer ${isDragging ? 'border-accent bg-accent/10' : 'hover:border-muted-foreground/50'}`}
                >
                    <input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} className="hidden" disabled={isUploading} />
                    <div className="space-y-2 text-center">
                        <svg className="mx-auto h-12 w-12 text-muted-foreground" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <button
                            type="button"
                            className="px-5 py-2 text-sm font-semibold text-accent-foreground bg-accent rounded-full hover:bg-opacity-80 transition-colors"
                        >
                            Choose files
                        </button>
                        <p className="text-sm text-muted-foreground">or drag and drop</p>
                        <p className="text-xs text-muted-foreground">Any file type up to 50MB</p>
                    </div>
                </div>

                {isUploading && (
                    <div className="mt-4 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                        <p className="text-muted-foreground mt-2">Uploading files...</p>
                    </div>
                )}

                <div className="mt-6 space-y-3">
                    {loading && <p>Loading files...</p>}
                    {!loading && sortedFiles.length === 0 && <p className="text-center py-4 text-muted-foreground">No files uploaded yet.</p>}
                    {sortedFiles.map(file => (
                        <div key={file.id} className="flex items-center gap-4 p-3 bg-glass rounded-lg">
                            <div className="flex-shrink-0">
                                <FileIcon mimeType={file.mimeType} />
                            </div>
                            <div className="flex-grow min-w-0">
                                <a href={file.path} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-accent transition-colors truncate block">{file.name}</a>
                                <p className="text-xs text-muted-foreground">Uploaded by {file.uploadedBy}</p>
                            </div>
                            <div className="hidden md:block text-right flex-shrink-0">
                                <p className="text-sm text-foreground">{formatBytes(file.size)}</p>
                                <p className="text-xs text-muted-foreground">{new Date(file.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex-shrink-0">
                                <button onClick={() => handleDelete(file.id)} className="text-muted-foreground hover:text-destructive p-2 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilesManager;
