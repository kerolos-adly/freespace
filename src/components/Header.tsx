import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function Header({ title }: { title: string }) {
  const { toggleSidebar, getUnreadCount, setActiveSection } = useStore();
  const unread = getUnreadCount();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
        >
          <span className="text-xl">☰</span>
        </button>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveSection('notifications')}
          className="relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-yellow-400 transition-all"
        >
          <span className="text-xl">🔔</span>
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </motion.button>
      </div>
    </motion.header>
  );
}
