import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { playNotificationSound } from '../utils/sound';

interface PopupData {
  id: string;
  fromUsername: string;
  fileName: string;
  fileCategory: string;
}

export default function GlobalNotificationPopup() {
  const { getUserNotifications, setActiveSection, markNotificationRead } = useStore();
  const [popup, setPopup] = useState<PopupData | null>(null);
  const seenIds = useRef<Set<string>>(new Set());
  const notifications = getUserNotifications();

  useEffect(() => {
    const unread = notifications.filter(n => !n.read && !n.accepted);
    const newOnes = unread.filter(n => !seenIds.current.has(n.id));

    if (newOnes.length > 0) {
      const latest = newOnes[newOnes.length - 1];
      newOnes.forEach(n => seenIds.current.add(n.id));

      setPopup({
        id: latest.id,
        fromUsername: latest.fromUsername,
        fileName: latest.fileName,
        fileCategory: latest.fileCategory,
      });

      playNotificationSound();

      // Auto dismiss after 7 seconds
      const timer = setTimeout(() => setPopup(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [notifications.length]);

  const getFileIcon = (category: string) => {
    const icons: Record<string, string> = {
      photos: '🖼️', music: '🎵', videos: '🎬', contacts: '👤',
      documents: '📄', apk: '📱', exe: '💻', other: '📁'
    };
    return icons[category] || '📁';
  };

  return (
    <AnimatePresence>
      {popup && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full"
        >
          <div className="bg-[#141428] border border-violet-500/30 rounded-2xl p-4 shadow-2xl shadow-violet-500/20">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-xl flex-shrink-0 shadow-lg animate-pulse">
                {getFileIcon(popup.fileCategory)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-violet-300 text-xs font-semibold uppercase tracking-wider">New Notification</p>
                <p className="text-white text-sm font-medium mt-0.5">
                  <span className="text-violet-300">{popup.fromUsername}</span> sent you a file
                </p>
                <p className="text-slate-400 text-xs truncate mt-0.5">{popup.fileName}</p>
              </div>
              <button
                onClick={() => setPopup(null)}
                className="text-slate-600 hover:text-white transition-colors text-sm flex-shrink-0"
              >
                ✕
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  setActiveSection('notifications');
                  markNotificationRead(popup.id);
                  setPopup(null);
                }}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-semibold hover:shadow-lg transition-all"
              >
                📬 Visit Notification Center
              </button>
              <button
                onClick={() => setPopup(null)}
                className="px-3 py-2 rounded-xl bg-white/10 text-slate-400 text-xs hover:text-white transition-all"
              >
                Later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
