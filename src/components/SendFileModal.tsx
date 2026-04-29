import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import type { FileItem } from '../types';

interface Props {
  file: FileItem;
  onClose: () => void;
}

export default function SendFileModal({ file, onClose }: Props) {
  const [toEmail, setToEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const { sendFile } = useStore();

  const handleSend = () => {
    if (!toEmail.trim()) { setStatus({ type: 'error', msg: 'Please enter a recipient email.' }); return; }
    const result = sendFile(toEmail, file.id);
    if (result.success) {
      setStatus({ type: 'success', msg: `File sent successfully! The recipient will receive a notification.` });
      setTimeout(onClose, 2000);
    } else {
      setStatus({ type: 'error', msg: result.error || 'Failed to send.' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-[#141428] border border-white/10 rounded-3xl p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-bold text-lg">Transfer File</h3>
            <p className="text-slate-500 text-xs mt-0.5 truncate max-w-xs">{file.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Recipient Email</label>
            <input
              type="email"
              value={toEmail}
              onChange={e => { setToEmail(e.target.value); setStatus(null); }}
              placeholder="recipient@email.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <p className="text-slate-600 text-xs mt-1">Enter the email address of a registered NexVault user</p>
          </div>

          <AnimatePresence>
            {status && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-3 rounded-xl text-sm ${status.type === 'success' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/20 border border-red-500/30 text-red-300'}`}
              >
                {status.type === 'success' ? '✅ ' : '❌ '}{status.msg}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleSend}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            📤 Send File
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
