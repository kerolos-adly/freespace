import { motion } from 'framer-motion';
import Header from './Header';

const features = [
  { icon: '🖼️', title: 'Photo Gallery', desc: 'Store and manage all your photos with beautiful previews' },
  { icon: '🎵', title: 'Music Library', desc: 'Upload and organize music files with audio playback' },
  { icon: '🎬', title: 'Video Vault', desc: 'Store videos with built-in video player' },
  { icon: '👤', title: 'VCF Contacts', desc: 'Upload and manage .vcf contact files securely' },
  { icon: '📄', title: 'Documents', desc: 'PDF, Word, Excel, TXT and more file types' },
  { icon: '📱', title: 'APK Files', desc: 'Store Android APK installation files' },
  { icon: '💻', title: 'EXE Files', desc: 'Windows 86-bit and 64-bit executables' },
  { icon: '🔗', title: 'Important Links', desc: 'Save and name your important URLs' },
  { icon: '📤', title: 'File Transfer', desc: 'Send files to other platform users by email' },
  { icon: '🔔', title: 'Notification Center', desc: 'Receive files from other users in real-time' },
  { icon: '📁', title: 'Folders', desc: 'Create and manage custom folders per section' },
  { icon: '🔒', title: 'High Privacy', desc: 'Each user data is completely isolated and secure' },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="✨ About NexVault" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/30 via-indigo-500/20 to-cyan-500/10 border border-white/10 p-8 text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)]" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-5xl mb-6 shadow-2xl shadow-violet-500/40"
          >
            🔐
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-2">NexVault</h1>
          <p className="text-violet-300 text-lg font-medium mb-1">Personal Cloud Platform</p>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Your private, secure, and unlimited personal cloud storage platform with a beautiful modern interface.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <span className="px-4 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-sm font-medium">Version 1.0</span>
            <span className="px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-sm font-medium">© 2026</span>
            <span className="px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-sm font-medium">Unlimited Storage</span>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div>
          <h2 className="text-white font-bold text-xl mb-4">Platform Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 hover:bg-white/8 transition-all"
              >
                <div className="text-3xl mb-3">{feat.icon}</div>
                <h3 className="text-white font-semibold text-sm">{feat.title}</h3>
                <p className="text-slate-500 text-xs mt-1">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Developer Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 p-8"
          style={{ background: 'linear-gradient(135deg, rgba(15,15,35,0.8) 0%, rgba(30,20,60,0.6) 100%)' }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-4xl shadow-2xl shadow-violet-500/40 flex-shrink-0"
            >
              👨‍💻
            </motion.div>
            <div>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Developed by</p>
              <h2 className="text-3xl font-black text-white mb-2">Kerolos Adly</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                NexVault was designed and developed with passion to provide a truly private, beautiful, and feature-rich personal cloud experience.
                Every detail was crafted to ensure the highest level of privacy, usability, and performance.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Zustand'].map(tech => (
                  <span key={tech} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mt-8 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: 'File Sections', value: '8+' },
              { label: 'File Types', value: '20+' },
              { label: 'Privacy Level', value: '100%' },
              { label: 'Storage', value: '∞' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-3xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="text-center pb-8">
          <p className="text-slate-600 text-sm">
            NexVault © 2026 · Developed by <span className="text-violet-400 font-semibold">Kerolos Adly</span>
          </p>
          <p className="text-slate-700 text-xs mt-1">All rights reserved · Built with ❤️</p>
        </div>
      </div>
    </div>
  );
}
