import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store/useStore';
import AuthPage from './components/AuthPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import SectionPage from './components/SectionPage';
import LinksPage from './components/LinksPage';
import NotificationsPage from './components/NotificationsPage';
import AboutPage from './components/AboutPage';
import GlobalNotificationPopup from './components/GlobalNotificationPopup';

const sectionConfig: Record<string, {
  category: string; title: string; icon: string;
  accept: string; desc: string; color: string;
}> = {
  photos: {
    category: 'photos', title: 'Photos', icon: '🖼️',
    accept: 'image/*',
    desc: 'JPG, PNG, GIF, WebP, SVG and all image formats',
    color: 'from-pink-600 to-rose-600',
  },
  music: {
    category: 'music', title: 'Music', icon: '🎵',
    accept: 'audio/*,.mp3,.wav,.flac,.ogg,.aac,.m4a',
    desc: 'MP3, WAV, FLAC, OGG, AAC, M4A and more',
    color: 'from-purple-600 to-violet-600',
  },
  videos: {
    category: 'videos', title: 'Videos', icon: '🎬',
    accept: 'video/*,.mp4,.mkv,.avi,.mov,.webm',
    desc: 'MP4, MKV, AVI, MOV, WebM and all video formats',
    color: 'from-blue-600 to-cyan-600',
  },
  contacts: {
    category: 'contacts', title: 'Contacts', icon: '👤',
    accept: '.vcf',
    desc: 'Only .vcf vCard contact files are accepted',
    color: 'from-emerald-600 to-teal-600',
  },
  documents: {
    category: 'documents', title: 'Documents', icon: '📄',
    accept: '.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.ppt,.pptx',
    desc: 'PDF, Word, Excel, PowerPoint, TXT, CSV files',
    color: 'from-amber-600 to-orange-600',
  },
  apk: {
    category: 'apk', title: 'APK Files', icon: '📱',
    accept: '.apk',
    desc: 'Android APK installation packages',
    color: 'from-green-600 to-emerald-600',
  },
  exe: {
    category: 'exe', title: 'EXE Files', icon: '💻',
    accept: '.exe,.msi',
    desc: 'Windows 86-bit and 64-bit executable files',
    color: 'from-slate-600 to-gray-600',
  },
};

export default function App() {
  const { currentUser, activeSection } = useStore();

  useEffect(() => {
    document.body.style.fontFamily = "'Inter', sans-serif";
    document.body.style.backgroundColor = '#0a0a1a';
    document.body.style.color = 'white';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }, []);

  if (!currentUser) {
    return <AuthPage />;
  }

  const renderContent = () => {
    if (activeSection === 'dashboard') {
      return (
        <div className="flex flex-col h-full">
          <Header title="🏠 Dashboard" />
          <div className="flex-1 overflow-y-auto">
            <Dashboard />
          </div>
        </div>
      );
    }

    if (activeSection === 'links') return <LinksPage />;
    if (activeSection === 'notifications') return <NotificationsPage />;
    if (activeSection === 'about') return <AboutPage />;

    const config = sectionConfig[activeSection];
    if (config) {
      return (
        <SectionPage
          key={activeSection}
          category={config.category}
          title={config.title}
          icon={config.icon}
          acceptTypes={config.accept}
          description={config.desc}
          color={config.color}
        />
      );
    }

    return null;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a1a]">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="relative flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden flex flex-col"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Global notification popup */}
      <GlobalNotificationPopup />
    </div>
  );
}
