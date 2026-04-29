import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { formatDate, downloadFile } from '../utils/helpers';
import Header from './Header';

export default function NotificationsPage() {
  const { getUserNotifications, markNotificationRead, acceptNotification, deleteNotification } = useStore();
  const notifications = getUserNotifications().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleAccept = (id: string) => {
    acceptNotification(id);
  };

  const getFileIcon = (category: string) => {
    const icons: Record<string, string> = {
      photos: '🖼️', music: '🎵', videos: '🎬', contacts: '👤',
      documents: '📄', apk: '📱', exe: '💻', other: '📁'
    };
    return icons[category] || '📁';
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="🔔 Notifications" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-20 text-slate-600">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="text-8xl mb-6"
            >
              🔔
            </motion.div>
            <p className="text-xl font-semibold text-slate-500">All clear!</p>
            <p className="text-sm mt-1">You have no notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm">{notifications.filter(n => !n.read).length} unread</p>
              <button
                onClick={() => notifications.forEach(n => n.read && deleteNotification(n.id))}
                className="text-xs text-slate-500 hover:text-red-400 transition-colors"
              >
                Clear read
              </button>
            </div>
            <AnimatePresence>
              {notifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30, height: 0 }}
                  className={`relative rounded-2xl border p-5 transition-all ${
                    notif.read
                      ? 'bg-white/3 border-white/5'
                      : 'bg-violet-500/5 border-violet-500/20'
                  }`}
                >
                  {!notif.read && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                  )}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-500/30 border border-violet-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                      {getFileIcon(notif.fileCategory)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">
                        📨 <span className="text-violet-300">{notif.fromUsername}</span> sent you a file
                      </p>
                      <p className="text-slate-400 text-sm mt-0.5 truncate">
                        <span className="text-white">{notif.fileName}</span>
                      </p>
                      <p className="text-slate-600 text-xs mt-1">{formatDate(notif.createdAt)}</p>

                      {/* Preview for images */}
                      {notif.fileCategory === 'photos' && notif.fileData && !notif.accepted && (
                        <div className="mt-3 rounded-xl overflow-hidden max-w-xs">
                          <img src={notif.fileData} alt={notif.fileName} className="w-full h-32 object-cover opacity-60" />
                        </div>
                      )}

                      {!notif.accepted ? (
                        <div className="flex gap-2 mt-4">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleAccept(notif.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-semibold shadow-lg hover:shadow-emerald-500/30 transition-all"
                          >
                            ✅ Accept & Save to my files
                          </motion.button>
                          <button
                            onClick={() => { markNotificationRead(notif.id); }}
                            className="px-3 py-2 rounded-xl bg-white/10 text-slate-400 text-xs hover:text-white transition-all"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => downloadFile(notif.fileData, notif.fileName, notif.fileType)}
                            className="px-3 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/30 transition-all"
                          >
                            ⬇️
                          </button>
                        </div>
                      ) : (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-emerald-400 text-xs font-medium">✅ Saved to your files</span>
                          <button
                            onClick={() => downloadFile(notif.fileData, notif.fileName, notif.fileType)}
                            className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/30 transition-all"
                          >
                            ⬇️ Download again
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="absolute top-3 left-3 w-6 h-6 rounded-full bg-white/0 hover:bg-red-500/20 text-slate-600 hover:text-red-400 text-xs flex items-center justify-center transition-all"
                    title="Delete notification"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
