import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import FileCard from './FileCard';
import type { Folder } from '../types';

interface Props {
  folder: Folder;
}

export default function FolderView({ folder }: Props) {
  const { getUserFiles, deleteFolder } = useStore();
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const allFiles = getUserFiles();
  const folderFiles = allFiles.filter(f => f.folderId === folder.id);

  return (
    <motion.div layout className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-all" onClick={() => setExpanded(!expanded)}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xl shadow-lg">
          📁
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate">{folder.name}</p>
          <p className="text-slate-500 text-xs">{folderFiles.length} file{folderFiles.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition-all"
            title="Delete folder"
          >
            🗑️
          </button>
          <motion.span
            animate={{ rotate: expanded ? 90 : 0 }}
            className="text-slate-500 text-sm"
          >
            ▶
          </motion.span>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 border-t border-white/5 pt-4">
              {folderFiles.length === 0 ? (
                <div className="text-center py-8 text-slate-600">
                  <p className="text-sm">This folder is empty</p>
                  <p className="text-xs mt-1">Upload files and move them here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {folderFiles.map(file => (
                    <FileCard key={file.id} file={file} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            onClick={() => setConfirmDelete(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-[#141428] border border-white/10 rounded-3xl p-6 shadow-2xl"
            >
              <div className="text-4xl mb-3 text-center">🗂️</div>
              <h3 className="text-white font-bold text-center mb-1">Delete Folder?</h3>
              <p className="text-slate-400 text-sm text-center mb-1">"{folder.name}"</p>
              <p className="text-slate-500 text-xs text-center mb-5">Files inside will be moved out of the folder but not deleted.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2.5 rounded-xl bg-white/10 text-slate-300 text-sm font-medium hover:bg-white/20 transition-all">Cancel</button>
                <button onClick={() => { deleteFolder(folder.id); setConfirmDelete(false); }} className="flex-1 py-2.5 rounded-xl bg-red-500/80 text-white text-sm font-medium hover:bg-red-500 transition-all">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
