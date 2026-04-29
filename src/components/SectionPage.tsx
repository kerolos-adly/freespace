import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { fileToBase64, getFileCategory } from '../utils/helpers';
import FileCard from './FileCard';
import FolderView from './FolderView';
import Header from './Header';

interface Props {
  category: string;
  title: string;
  icon: string;
  acceptTypes: string;
  description: string;
  color: string;
}

export default function SectionPage({ category, title, icon, acceptTypes, description, color }: Props) {
  const { addFile, addFolder, getUserFiles, getUserFolders } = useStore();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [view, setView] = useState<'files' | 'folders'>('files');
  const [search, setSearch] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const allFiles = getUserFiles();
  const allFolders = getUserFolders();
  const categoryFiles = allFiles.filter(f => f.category === category && !f.folderId);
  const categoryFolders = allFolders.filter(f => f.category === category);
  const filteredFiles = categoryFiles.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    let count = 0;
    for (const file of Array.from(fileList)) {
      try {
        const data = await fileToBase64(file);
        const cat = getFileCategory(file);
        // For contacts, only allow vcf
        if (category === 'contacts' && !file.name.toLowerCase().endsWith('.vcf')) {
          continue;
        }
        addFile({
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          data,
          category: category as any,
          userId: '',
        });
        count++;
      } catch (e) {
        console.error('Upload error', e);
      }
    }
    setUploadedCount(count);
    setUploading(false);
    setTimeout(() => setUploadedCount(0), 3000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    addFolder(newFolderName.trim(), category);
    setNewFolderName('');
    setShowFolderInput(false);
    setView('folders');
  };

  return (
    <div className="flex flex-col h-full">
      <Header title={`${icon} ${title}`} />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`relative cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 p-8 text-center ${
            dragging
              ? 'border-violet-500 bg-violet-500/10 scale-[1.02]'
              : 'border-white/10 hover:border-white/30 bg-white/3 hover:bg-white/5'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            multiple
            accept={acceptTypes}
            onChange={e => handleFiles(e.target.files)}
            className="hidden"
          />
          <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl mb-4 shadow-lg transition-transform duration-300 ${dragging ? 'scale-110 rotate-6' : ''}`}>
            {icon}
          </div>
          <p className="text-white font-semibold text-lg">
            {uploading ? '⏳ Uploading...' : dragging ? '✨ Drop it!' : `Upload ${title}`}
          </p>
          <p className="text-slate-500 text-sm mt-1">{description}</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-violet-600/30 to-cyan-500/30 border border-violet-500/30 rounded-xl px-4 py-2">
            <span className="text-slate-300 text-sm">Click to browse or drag & drop</span>
          </div>
          {uploadedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 text-emerald-400 text-sm font-medium"
            >
              ✅ {uploadedCount} file{uploadedCount > 1 ? 's' : ''} uploaded!
            </motion.div>
          )}
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setView('files')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${view === 'files' ? `bg-gradient-to-r ${color} text-white shadow-lg` : 'bg-white/5 text-slate-400 hover:text-white'}`}
            >
              📄 Files ({categoryFiles.length})
            </button>
            <button
              onClick={() => setView('folders')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${view === 'folders' ? `bg-gradient-to-r ${color} text-white shadow-lg` : 'bg-white/5 text-slate-400 hover:text-white'}`}
            >
              📁 Folders ({categoryFolders.length})
            </button>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 sm:w-48 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-all"
            />
            <button
              onClick={() => setShowFolderInput(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-sm font-medium transition-all whitespace-nowrap"
            >
              + Folder
            </button>
          </div>
        </div>

        {/* New Folder Input */}
        <AnimatePresence>
          {showFolderInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-3 items-center bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4"
            >
              <input
                autoFocus
                type="text"
                placeholder="Folder name..."
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') createFolder(); if (e.key === 'Escape') setShowFolderInput(false); }}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              />
              <button onClick={createFolder} className="px-4 py-2 rounded-xl bg-amber-500/80 hover:bg-amber-500 text-white text-sm font-semibold transition-all">Create</button>
              <button onClick={() => setShowFolderInput(false)} className="px-3 py-2 rounded-xl bg-white/10 text-slate-400 text-sm transition-all">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <AnimatePresence mode="wait">
          {view === 'files' ? (
            <motion.div key="files" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {filteredFiles.length === 0 ? (
                <div className="text-center py-16 text-slate-600">
                  <div className="text-6xl mb-4">{icon}</div>
                  <p className="text-lg font-semibold text-slate-500">
                    {search ? 'No files match your search' : `No ${title.toLowerCase()} yet`}
                  </p>
                  <p className="text-sm mt-1">{search ? 'Try a different keyword' : 'Upload your first file above'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {filteredFiles.map(file => (
                      <FileCard key={file.id} file={file} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="folders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {categoryFolders.length === 0 ? (
                <div className="text-center py-16 text-slate-600">
                  <div className="text-6xl mb-4">📁</div>
                  <p className="text-lg font-semibold text-slate-500">No folders yet</p>
                  <p className="text-sm mt-1">Create a folder to organize your files</p>
                </div>
              ) : (
                <AnimatePresence>
                  {categoryFolders.map(folder => (
                    <FolderView key={folder.id} folder={folder} />
                  ))}
                </AnimatePresence>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
