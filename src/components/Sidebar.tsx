import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import type { ActiveSection } from '../types';

const navItems: { id: ActiveSection; label: string; icon: string; color: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠', color: 'from-violet-500 to-indigo-500' },
  { id: 'photos', label: 'Photos', icon: '🖼️', color: 'from-pink-500 to-rose-500' },
  { id: 'music', label: 'Music', icon: '🎵', color: 'from-purple-500 to-violet-500' },
  { id: 'videos', label: 'Videos', icon: '🎬', color: 'from-blue-500 to-cyan-500' },
  { id: 'contacts', label: 'Contacts', icon: '👤', color: 'from-emerald-500 to-teal-500' },
  { id: 'documents', label: 'Documents', icon: '📄', color: 'from-amber-500 to-orange-500' },
  { id: 'apk', label: 'APK Files', icon: '📱', color: 'from-green-500 to-emerald-500' },
  { id: 'exe', label: 'EXE Files', icon: '💻', color: 'from-slate-500 to-gray-600' },
  { id: 'links', label: 'Links', icon: '🔗', color: 'from-indigo-500 to-blue-500' },
  { id: 'notifications', label: 'Notifications', icon: '🔔', color: 'from-yellow-500 to-amber-500' },
  { id: 'about', label: 'About', icon: '✨', color: 'from-cyan-500 to-sky-500' },
];

export default function Sidebar() {
  const { activeSection, setActiveSection, sidebarOpen, setSidebarOpen, currentUser, logout, getUnreadCount } = useStore();
  const unread = getUnreadCount();

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-72 z-30 flex flex-col bg-[#0d0d20] border-r border-white/5 shadow-2xl lg:translate-x-0 lg:relative lg:z-auto"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-xl shadow-lg shadow-violet-500/30">
              🔐
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">NexVault</h1>
              <p className="text-xs text-slate-500">Personal Cloud</p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="mx-4 mt-4 p-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{currentUser?.username}</p>
              <p className="text-slate-500 text-xs truncate">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-hide">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 relative group ${
                activeSection === item.id
                  ? 'bg-gradient-to-r text-white shadow-lg ' + item.color
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'notifications' && unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm font-medium"
          >
            <span className="text-lg">🚪</span>
            Sign Out
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
}
