import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { formatFileSize, formatDate } from '../utils/helpers';
import type { ActiveSection } from '../types';

const categoryCards = [
  { id: 'photos' as ActiveSection, label: 'Photos', icon: '🖼️', color: 'from-pink-600 to-rose-600', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
  { id: 'music' as ActiveSection, label: 'Music', icon: '🎵', color: 'from-purple-600 to-violet-600', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'videos' as ActiveSection, label: 'Videos', icon: '🎬', color: 'from-blue-600 to-cyan-600', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'contacts' as ActiveSection, label: 'Contacts', icon: '👤', color: 'from-emerald-600 to-teal-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'documents' as ActiveSection, label: 'Documents', icon: '📄', color: 'from-amber-600 to-orange-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'apk' as ActiveSection, label: 'APK Files', icon: '📱', color: 'from-green-600 to-emerald-600', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  { id: 'exe' as ActiveSection, label: 'EXE Files', icon: '💻', color: 'from-slate-600 to-gray-600', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
  { id: 'links' as ActiveSection, label: 'Links', icon: '🔗', color: 'from-indigo-600 to-blue-600', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
];

export default function Dashboard() {
  const { currentUser, getUserFiles, getUserFolders, getUserLinks, getUserNotifications, setActiveSection, getUnreadCount } = useStore();
  const files = getUserFiles();
  const folders = getUserFolders();
  const links = getUserLinks();
  const notifications = getUserNotifications();
  const unread = getUnreadCount();

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  const recentFiles = [...files].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()).slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/30 via-indigo-600/20 to-cyan-500/10 border border-white/10 p-6 sm:p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <p className="text-violet-300 text-sm font-medium mb-1">{greeting} 👋</p>
          <h2 className="text-3xl font-black text-white mb-2">{currentUser?.username}!</h2>
          <p className="text-slate-400 text-sm">Welcome back to your personal vault. Everything is safe and secure.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2 border border-white/10">
              <span>📦</span>
              <span className="text-slate-300 text-sm font-medium">{files.length} files stored</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2 border border-white/10">
              <span>💾</span>
              <span className="text-slate-300 text-sm font-medium">{formatFileSize(totalSize)} used</span>
            </div>
            {unread > 0 && (
              <div className="flex items-center gap-2 bg-red-500/20 rounded-xl px-4 py-2 border border-red-500/30">
                <span>🔔</span>
                <span className="text-red-300 text-sm font-medium">{unread} new notification{unread > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Files', value: files.length, icon: '📁', color: 'violet' },
          { label: 'Folders', value: folders.length, icon: '🗂️', color: 'blue' },
          { label: 'Links', value: links.length, icon: '🔗', color: 'cyan' },
          { label: 'Notifications', value: notifications.length, icon: '🔔', color: 'amber' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/8 transition-all"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-slate-500 text-xs mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Category Cards */}
      <div>
        <h3 className="text-white font-bold text-lg mb-4">Your Sections</h3>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {categoryCards.map((card) => {
            const count = files.filter(f => f.category === card.id).length;
            return (
              <motion.button
                key={card.id}
                variants={item}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveSection(card.id)}
                className={`${card.bg} ${card.border} border rounded-2xl p-4 text-left hover:border-white/20 transition-all group`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-xl mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <p className="text-white text-sm font-semibold">{card.label}</p>
                <p className="text-slate-500 text-xs mt-1">{count} file{count !== 1 ? 's' : ''}</p>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Recent Files */}
      {recentFiles.length > 0 && (
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Recent Files</h3>
          <div className="space-y-2">
            {recentFiles.map((file, i) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/8 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-lg flex-shrink-0">
                  {file.category === 'photos' ? '🖼️' :
                   file.category === 'music' ? '🎵' :
                   file.category === 'videos' ? '🎬' :
                   file.category === 'contacts' ? '👤' :
                   file.category === 'documents' ? '📄' :
                   file.category === 'apk' ? '📱' :
                   file.category === 'exe' ? '💻' : '📁'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{file.name}</p>
                  <p className="text-slate-500 text-xs">{formatFileSize(file.size)} · {formatDate(file.uploadedAt)}</p>
                </div>
                <button
                  onClick={() => setActiveSection(file.category as ActiveSection)}
                  className="opacity-0 group-hover:opacity-100 text-xs text-violet-400 hover:text-violet-300 transition-all"
                >
                  View →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {files.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-slate-600"
        >
          <div className="text-6xl mb-4">✨</div>
          <p className="text-lg font-semibold text-slate-500">Your vault is empty</p>
          <p className="text-sm mt-1">Start uploading files to any section</p>
        </motion.div>
      )}
    </div>
  );
}
