import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { formatFileSize, formatDate, downloadFile } from '../utils/helpers';
import SendFileModal from './SendFileModal';
import type { FileItem } from '../types';

interface Props {
  file: FileItem;
  showFolder?: boolean;
}

export default function FileCard({ file, showFolder }: Props) {
  const { deleteFile, getUserFolders, moveFileToFolder } = useStore();
  const [showSend, setShowSend] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const folders = getUserFolders().filter(f => f.category === file.category);

  const isImage = file.type.startsWith('image/');
  const isAudio = file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|flac|ogg|aac|m4a)$/i);
  const isVideo = file.type.startsWith('video/');

  const folderName = showFolder && file.folderId
    ? getUserFolders().find(f => f.id === file.folderId)?.name
    : undefined;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:bg-white/8 transition-all group"
      >
        {/* Preview */}
        {isImage && (
          <div className="aspect-video overflow-hidden">
            <img src={file.data} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        )}
        {isVideo && (
          <div className="aspect-video overflow-hidden bg-black">
            <video src={file.data} className="w-full h-full object-contain" controls preload="metadata" />
          </div>
        )}
        {isAudio && (
          <div className="p-4 bg-gradient-to-br from-purple-900/40 to-violet-900/20">
            <div className="flex items-center justify-center h-16">
              <div className="text-4xl animate-pulse">🎵</div>
            </div>
            <audio src={file.data} controls className="w-full mt-2 h-8" preload="metadata" />
          </div>
        )}
        {!isImage && !isVideo && !isAudio && (
          <div className="p-4 flex items-center justify-center h-24 bg-gradient-to-br from-slate-800/50 to-slate-700/20">
            <span className="text-4xl">
              {file.category === 'contacts' ? '👤' :
               file.category === 'documents' ? '📄' :
               file.category === 'apk' ? '📱' :
               file.category === 'exe' ? '💻' : '📁'}
            </span>
          </div>
        )}

        {/* Info */}
        <div className="p-3">
          <p className="text-white text-sm font-medium truncate" title={file.name}>{file.name}</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-slate-500 text-xs">{formatFileSize(file.size)}</p>
            <p className="text-slate-600 text-xs">{formatDate(file.uploadedAt).split(',')[0]}</p>
          </div>
          {folderName && (
            <p className="text-violet-400 text-xs mt-1">📂 {folderName}</p>
          )}

          {/* Actions */}
          <div className="flex gap-1.5 mt-3">
            <button
              onClick={() => downloadFile(file.data, file.name, file.type)}
              title="Download"
              className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center justify-center gap-1 transition-all"
            >
              ⬇️ Download
            </button>
            <button
              onClick={() => setShowSend(true)}
              title="Send"
              className="flex-1 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium flex items-center justify-center gap-1 transition-all"
            >
              📤 Send
            </button>
            {folders.length > 0 && !file.folderId && (
              <div className="relative">
                <button
                  onClick={() => setShowMoveMenu(!showMoveMenu)}
                  title="Move to folder"
                  className="py-1.5 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs transition-all"
                >
                  📂
                </button>
                <AnimatePresence>
                  {showMoveMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute bottom-full right-0 mb-1 bg-[#1a1a35] border border-white/10 rounded-xl overflow-hidden shadow-xl z-10 min-w-36"
                    >
                      {folders.map(folder => (
                        <button
                          key={folder.id}
                          onClick={() => { moveFileToFolder(file.id, folder.id); setShowMoveMenu(false); }}
                          className="block w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/10 transition-all"
                        >
                          📁 {folder.name}
                        </button>
                      ))}
                      {file.folderId && (
                        <button
                          onClick={() => { moveFileToFolder(file.id, undefined); setShowMoveMenu(false); }}
                          className="block w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-white/10 transition-all border-t border-white/5"
                        >
                          ↩ Remove from folder
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            {file.folderId && (
              <button
                onClick={() => moveFileToFolder(file.id, undefined)}
                title="Remove from folder"
                className="py-1.5 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs transition-all"
              >
                ↩
              </button>
            )}
            <button
              onClick={() => setConfirmDelete(true)}
              title="Delete"
              className="py-1.5 px-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs transition-all"
            >
              🗑️
            </button>
          </div>
        </div>
      </motion.div>

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
              <div className="text-4xl mb-3 text-center">🗑️</div>
              <h3 className="text-white font-bold text-center mb-1">Delete File?</h3>
              <p className="text-slate-400 text-sm text-center mb-5 truncate">"{file.name}"</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2.5 rounded-xl bg-white/10 text-slate-300 text-sm font-medium hover:bg-white/20 transition-all">Cancel</button>
                <button onClick={() => deleteFile(file.id)} className="flex-1 py-2.5 rounded-xl bg-red-500/80 text-white text-sm font-medium hover:bg-red-500 transition-all">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSend && <SendFileModal file={file} onClose={() => setShowSend(false)} />}
      </AnimatePresence>
    </>
  );
}
