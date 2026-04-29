import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { formatDate } from '../utils/helpers';
import Header from './Header';

export default function LinksPage() {
  const { getUserLinks, addLink, deleteLink } = useStore();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const links = getUserLinks();
  const filtered = links.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.url.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!title.trim()) { setError('Please enter a title.'); return; }
    if (!url.trim()) { setError('Please enter a URL.'); return; }
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    addLink(title.trim(), finalUrl);
    setTitle('');
    setUrl('');
    setError('');
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="🔗 Important Links" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Add Link Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6"
        >
          <h3 className="text-white font-bold mb-4">Add New Link</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Link title (e.g. My Portfolio)"
              value={title}
              onChange={e => { setTitle(e.target.value); setError(''); }}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
            />
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={e => { setUrl(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              onClick={handleAdd}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold text-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              + Add Link
            </button>
          </div>
        </motion.div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search links..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-all text-sm"
        />

        {/* Links List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            <div className="text-6xl mb-4">🔗</div>
            <p className="text-lg font-semibold text-slate-500">{search ? 'No links match' : 'No links yet'}</p>
            <p className="text-sm mt-1">Add your important links above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AnimatePresence>
              {filtered.map(link => (
                <motion.div
                  key={link.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 hover:bg-white/8 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-xl flex-shrink-0 shadow-lg">
                      🔗
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{link.title}</p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 text-xs truncate block transition-colors"
                        onClick={e => e.stopPropagation()}
                      >
                        {link.url}
                      </a>
                      <p className="text-slate-600 text-xs mt-1">{formatDate(link.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 text-xs font-medium flex items-center justify-center gap-1 transition-all"
                    >
                      🌐 Open
                    </a>
                    <button
                      onClick={() => setConfirmDelete(link.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs transition-all"
                    >
                      🗑️
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Confirm Delete */}
        <AnimatePresence>
          {confirmDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
              onClick={() => setConfirmDelete(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-sm bg-[#141428] border border-white/10 rounded-3xl p-6 shadow-2xl"
              >
                <div className="text-4xl mb-3 text-center">🗑️</div>
                <h3 className="text-white font-bold text-center mb-5">Delete this link?</h3>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl bg-white/10 text-slate-300 text-sm font-medium">Cancel</button>
                  <button onClick={() => { deleteLink(confirmDelete); setConfirmDelete(null); }} className="flex-1 py-2.5 rounded-xl bg-red-500/80 text-white text-sm font-medium hover:bg-red-500 transition-all">Delete</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
