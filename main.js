<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
  <title>NexVault – Personal Cloud Platform</title>
  <!-- Google Fonts + Tailwind CDN (v4 is used in the project but we'll use Tailwind + custom gradients) -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <!-- Tailwind CSS via CDN + basic layer to mimic the custom blur/glassmorphism -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Framer Motion + React + ReactDOM + Zustand + UUID + React Hot Toast (and lucide maybe not needed but we use emoji) -->
  <script src="https://cdn.jsdelivr.net/npm/react@19.2.3/umd/react.development.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@19.2.3/umd/react-dom.development.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/framer-motion@12.38.0/dist/framer-motion.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/zustand@5.0.12/index.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/uuid@14.0.0/dist/umd/uuidv4.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-hot-toast@2.6.0/dist/index.js"></script>
  <!-- For proper mounting, we need JSX transform, but use Babel standalone for simplicity -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    * { font-family: 'Inter', sans-serif; }
    body { background: #0a0a1a; margin: 0; overflow-x: hidden; }
    /* custom scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #1e1e2e; border-radius: 10px; }
    ::-webkit-scrollbar-thumb { background: #4f46e5; border-radius: 10px; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    .glass-card { background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
    // ---------- UTILS (helpers, sound mock) ----------
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };
    const formatDate = (iso) => {
      const date = new Date(iso);
      return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' });
    };
    const fileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };
    const getFileCategory = (file) => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (file.type.startsWith('image/')) return 'photos';
      if (file.type.startsWith('audio/') || ['mp3','wav','flac','ogg','m4a'].includes(ext)) return 'music';
      if (file.type.startsWith('video/') || ['mp4','mov','avi','mkv'].includes(ext)) return 'videos';
      if (ext === 'vcf') return 'contacts';
      if (file.type === 'application/pdf' || ['doc','docx','xls','xlsx','ppt','pptx','txt','md'].includes(ext)) return 'documents';
      if (ext === 'apk') return 'apk';
      if (ext === 'exe' || ext === 'msi') return 'exe';
      return 'other';
    };
    const downloadFile = (dataUrl, fileName, mimeType) => {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    const playNotificationSound = () => {
      // Optional: use web audio beep
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        oscillator.connect(gain);
        gain.connect(audioCtx.destination);
        oscillator.frequency.value = 880;
        gain.gain.value = 0.2;
        oscillator.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
        oscillator.stop(audioCtx.currentTime + 0.5);
      } catch(e) { console.log('sound not supported'); }
    };

    // ---------- ZUSTAND STORE (persist, similar to original) ----------
    const { create } = window.zustand;
    const { persist } = window.zustandMiddleware || (() => (config) => (set, get, api) => config(set, get, api));
    // using manual persist mock since we rely on localStorage directly
    const uuidv4 = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
    
    const useStore = create((set, get) => ({
      users: [],
      currentUser: null,
      rememberMe: false,
      files: [],
      folders: [],
      links: [],
      notifications: [],
      activeSection: 'dashboard',
      sidebarOpen: true,

      register: (username, email, password) => {
        const { users } = get();
        const emailLower = email.toLowerCase().trim();
        if (users.find(u => u.email.toLowerCase() === emailLower)) return { success: false, error: 'Email already registered.' };
        if (users.find(u => u.username.toLowerCase() === username.toLowerCase().trim())) return { success: false, error: 'Username taken.' };
        const newUser = { id: uuidv4(), username: username.trim(), email: emailLower, password, createdAt: new Date().toISOString() };
        set({ users: [...users, newUser] });
        return { success: true };
      },
      login: (email, password, remember) => {
        const user = get().users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password);
        if (!user) return { success: false, error: 'Invalid email or password.' };
        set({ currentUser: user, rememberMe: remember });
        return { success: true };
      },
      logout: () => set({ currentUser: null, activeSection: 'dashboard', sidebarOpen: true }),
      addFile: (file) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const newFile = { ...file, id: uuidv4(), uploadedAt: new Date().toISOString(), userId: file.userId || currentUser.id };
        set(state => ({ files: [...state.files, newFile] }));
      },
      deleteFile: (id) => set(state => ({ files: state.files.filter(f => f.id !== id) })),
      moveFileToFolder: (fileId, folderId) => set(state => ({ files: state.files.map(f => f.id === fileId ? { ...f, folderId } : f) })),
      addFolder: (name, category) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const newFolder = { id: uuidv4(), name, category, createdAt: new Date().toISOString(), userId: currentUser.id };
        set(state => ({ folders: [...state.folders, newFolder] }));
      },
      deleteFolder: (id) => set(state => ({ folders: state.folders.filter(f => f.id !== id), files: state.files.map(f => f.folderId === id ? { ...f, folderId: undefined } : f) })),
      addLink: (title, url) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const newLink = { id: uuidv4(), title, url, createdAt: new Date().toISOString(), userId: currentUser.id };
        set(state => ({ links: [...state.links, newLink] }));
      },
      deleteLink: (id) => set(state => ({ links: state.links.filter(l => l.id !== id) })),
      sendFile: (toEmail, fileId) => {
        const { currentUser, users, files } = get();
        if (!currentUser) return { success: false, error: 'Not logged in.' };
        const recipient = users.find(u => u.email.toLowerCase() === toEmail.toLowerCase().trim());
        if (!recipient) return { success: false, error: 'User not found.' };
        if (recipient.id === currentUser.id) return { success: false, error: 'Cannot send to yourself.' };
        const file = files.find(f => f.id === fileId && f.userId === currentUser.id);
        if (!file) return { success: false, error: 'File missing.' };
        const notification = {
          id: uuidv4(),
          toUserId: recipient.id,
          fromUserId: currentUser.id,
          fromUsername: currentUser.username,
          fileId: file.id,
          fileName: file.name,
          fileType: file.type,
          fileData: file.data,
          fileCategory: file.category,
          fileSize: file.size,
          read: false,
          accepted: false,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ notifications: [...state.notifications, notification] }));
        return { success: true };
      },
      markNotificationRead: (id) => set(state => ({ notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n) })),
      acceptNotification: (id) => {
        const { notifications, currentUser } = get();
        const notif = notifications.find(n => n.id === id);
        if (!notif || !currentUser) return;
        const newFile = {
          id: uuidv4(),
          name: notif.fileName,
          type: notif.fileType,
          size: notif.fileSize,
          data: notif.fileData,
          uploadedAt: new Date().toISOString(),
          category: notif.fileCategory,
          userId: currentUser.id,
        };
        set(state => ({ files: [...state.files, newFile], notifications: state.notifications.map(n => n.id === id ? { ...n, accepted: true, read: true } : n) }));
      },
      deleteNotification: (id) => set(state => ({ notifications: state.notifications.filter(n => n.id !== id) })),
      setActiveSection: (section) => set({ activeSection: section }),
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      getUserFiles: () => { const { files, currentUser } = get(); return currentUser ? files.filter(f => f.userId === currentUser.id) : []; },
      getUserFolders: () => { const { folders, currentUser } = get(); return currentUser ? folders.filter(f => f.userId === currentUser.id) : []; },
      getUserLinks: () => { const { links, currentUser } = get(); return currentUser ? links.filter(l => l.userId === currentUser.id) : []; },
      getUserNotifications: () => { const { notifications, currentUser } = get(); return currentUser ? notifications.filter(n => n.toUserId === currentUser.id) : []; },
      getUnreadCount: () => { const { notifications, currentUser } = get(); return currentUser ? notifications.filter(n => n.toUserId === currentUser.id && !n.read).length : 0; },
    }));

    // Load persisted state from localStorage if any
    const saved = localStorage.getItem('nexvault-storage');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        useStore.setState(parsed);
      } catch(e) {}
    }
    useStore.subscribe((state) => {
      const toStore = { users: state.users, currentUser: state.rememberMe ? state.currentUser : null, rememberMe: state.rememberMe, files: state.files, folders: state.folders, links: state.links, notifications: state.notifications };
      localStorage.setItem('nexvault-storage', JSON.stringify(toStore));
    });

    // ---------- COMPONENTS (motion wrapped) ----------
    const motion = window.framerMotion?.motion || ((el) => el);
    const MotionDiv = ({ children, ...props }) => React.createElement('div', props, children);
    // Use framer-motion if available, else fallback
    const m = window.framerMotion?.motion || { div: MotionDiv, button: MotionDiv, header: MotionDiv, aside: MotionDiv };
    
    // Helper to get motion components
    const MotionDivC = m.div;
    const MotionButton = m.button;
    const MotionHeader = m.header;
    const MotionAside = m.aside;
    
    // ---- IMPORTANT: All UI components follow the same logic but simplified for single-file runtime ----
    // Header component
    function Header({ title }) {
      const { toggleSidebar, setActiveSection, getUnreadCount } = useStore();
      const unread = getUnreadCount();
      return React.createElement(MotionHeader, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5" },
        React.createElement("div", { className: "flex items-center gap-4" },
          React.createElement("button", { onClick: toggleSidebar, className: "lg:hidden w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all" }, "☰"),
          React.createElement("h2", { className: "text-xl font-bold text-white" }, title)),
        React.createElement("div", { className: "flex items-center gap-3" },
          React.createElement(MotionButton, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => setActiveSection('notifications'), className: "relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-yellow-400 transition-all" },
            "🔔",
            unread > 0 && React.createElement("span", { className: "absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse" }, unread > 9 ? '9+' : unread))));
    }

    // FileCard (simplified but full)
    function FileCard({ file, showFolder }) {
      const { deleteFile, getUserFolders, moveFileToFolder } = useStore();
      const [showSend, setShowSend] = React.useState(false);
      const [showMoveMenu, setShowMoveMenu] = React.useState(false);
      const [confirmDelete, setConfirmDelete] = React.useState(false);
      const folders = getUserFolders().filter(f => f.category === file.category);
      const isImage = file.type.startsWith('image/');
      const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|flac|ogg|aac|m4a)$/i.test(file.name);
      const isVideo = file.type.startsWith('video/');
      const folderName = showFolder && file.folderId ? getUserFolders().find(f => f.id === file.folderId)?.name : undefined;
      return React.createElement(React.Fragment, null,
        React.createElement(MotionDivC, { layout: true, initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, className: "bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:bg-white/8 transition-all group" },
          (isImage && React.createElement("div", { className: "aspect-video overflow-hidden" }, React.createElement("img", { src: file.data, alt: file.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }))) ||
          (isVideo && React.createElement("div", { className: "aspect-video overflow-hidden bg-black" }, React.createElement("video", { src: file.data, className: "w-full h-full object-contain", controls: true, preload: "metadata" }))) ||
          (isAudio && React.createElement("div", { className: "p-4 bg-gradient-to-br from-purple-900/40 to-violet-900/20" }, React.createElement("div", { className: "flex items-center justify-center h-16" }, React.createElement("div", { className: "text-4xl animate-pulse" }, "🎵"), React.createElement("audio", { src: file.data, controls: true, className: "w-full mt-2 h-8", preload: "metadata" })))) ||
          (!isImage && !isVideo && !isAudio && React.createElement("div", { className: "p-4 flex items-center justify-center h-24 bg-gradient-to-br from-slate-800/50 to-slate-700/20" }, React.createElement("span", { className: "text-4xl" }, file.category === 'contacts' ? '👤' : file.category === 'documents' ? '📄' : file.category === 'apk' ? '📱' : file.category === 'exe' ? '💻' : '📁'))),
          React.createElement("div", { className: "p-3" },
            React.createElement("p", { className: "text-white text-sm font-medium truncate", title: file.name }, file.name),
            React.createElement("div", { className: "flex items-center justify-between mt-1" }, React.createElement("p", { className: "text-slate-500 text-xs" }, formatFileSize(file.size)), React.createElement("p", { className: "text-slate-600 text-xs" }, formatDate(file.uploadedAt).split(',')[0])),
            folderName && React.createElement("p", { className: "text-violet-400 text-xs mt-1" }, "📂 ", folderName),
            React.createElement("div", { className: "flex gap-1.5 mt-3" },
              React.createElement("button", { onClick: () => downloadFile(file.data, file.name, file.type), className: "flex-1 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center justify-center gap-1 transition-all" }, "⬇️ Download"),
              React.createElement("button", { onClick: () => setShowSend(true), className: "flex-1 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium flex items-center justify-center gap-1 transition-all" }, "📤 Send"),
              (folders.length > 0 && !file.folderId) && React.createElement("div", { className: "relative" }, React.createElement("button", { onClick: () => setShowMoveMenu(!showMoveMenu), className: "py-1.5 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs transition-all" }, "📂"), showMoveMenu && React.createElement("div", { className: "absolute bottom-full right-0 mb-1 bg-[#1a1a35] border border-white/10 rounded-xl overflow-hidden shadow-xl z-10 min-w-36" }, folders.map(folder => React.createElement("button", { key: folder.id, onClick: () => { moveFileToFolder(file.id, folder.id); setShowMoveMenu(false); }, className: "block w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/10" }, "📁 ", folder.name)), file.folderId && React.createElement("button", { onClick: () => { moveFileToFolder(file.id, undefined); setShowMoveMenu(false); }, className: "block w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-white/10 border-t border-white/5" }, "↩ Remove")))),
              file.folderId && React.createElement("button", { onClick: () => moveFileToFolder(file.id, undefined), className: "py-1.5 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs transition-all" }, "↩"),
              React.createElement("button", { onClick: () => setConfirmDelete(true), className: "py-1.5 px-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs transition-all" }, "🗑️")))),
        confirmDelete && React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4", onClick: () => setConfirmDelete(false) }, React.createElement("div", { className: "w-full max-w-sm bg-[#141428] border border-white/10 rounded-3xl p-6 shadow-2xl", onClick: e => e.stopPropagation() }, React.createElement("div", { className: "text-4xl mb-3 text-center" }, "🗑️"), React.createElement("h3", { className: "text-white font-bold text-center mb-1" }, "Delete File?"), React.createElement("p", { className: "text-slate-400 text-sm text-center mb-5 truncate" }, `"${file.name}"`), React.createElement("div", { className: "flex gap-3" }, React.createElement("button", { onClick: () => setConfirmDelete(false), className: "flex-1 py-2.5 rounded-xl bg-white/10 text-slate-300 text-sm font-medium" }, "Cancel"), React.createElement("button", { onClick: () => { deleteFile(file.id); setConfirmDelete(false); }, className: "flex-1 py-2.5 rounded-xl bg-red-500/80 text-white text-sm font-medium" }, "Delete")))),
        showSend && React.createElement(SendFileModal, { file: file, onClose: () => setShowSend(false) })
      );
    }

    function SendFileModal({ file, onClose }) {
      const [toEmail, setToEmail] = React.useState('');
      const [status, setStatus] = React.useState(null);
      const { sendFile } = useStore();
      const handleSend = () => {
        if (!toEmail.trim()) { setStatus({ type: 'error', msg: 'Enter recipient email.' }); return; }
        const result = sendFile(toEmail, file.id);
        if (result.success) { setStatus({ type: 'success', msg: 'File sent!' }); setTimeout(onClose, 1500); } 
        else setStatus({ type: 'error', msg: result.error });
      };
      return React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4", onClick: onClose }, React.createElement("div", { className: "w-full max-w-md bg-[#141428] border border-white/10 rounded-3xl p-6 shadow-2xl", onClick: e => e.stopPropagation() }, React.createElement("div", { className: "flex justify-between mb-4" }, React.createElement("h3", { className: "text-white font-bold" }, "Transfer File"), React.createElement("button", { onClick: onClose }, "✕")), React.createElement("input", { type: "email", placeholder: "recipient@email.com", value: toEmail, onChange: e => { setToEmail(e.target.value); setStatus(null); }, className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mb-3" }), status && React.createElement("div", { className: `p-2 rounded text-sm mb-2 ${status.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}` }, status.msg), React.createElement("button", { onClick: handleSend, className: "w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold" }, "📤 Send")));
    }
    
    // Dashboard, SectionPage, LinksPage, NotificationsPage, Sidebar, AuthPage, AboutPage adapted to functional style.
    // To keep main.js manageable and complete I'll compose the full App with routing based on activeSection and auth state.
    function Dashboard() {
      const { currentUser, getUserFiles, getUserFolders, getUserLinks, getUserNotifications, setActiveSection, getUnreadCount } = useStore();
      const files = getUserFiles(); const folders = getUserFolders(); const links = getUserLinks(); const notifications = getUserNotifications(); const unread = getUnreadCount();
      const totalSize = files.reduce((a,b)=>a+b.size,0); const recent = [...files].sort((a,b)=>new Date(b.uploadedAt)-new Date(a.uploadedAt)).slice(0,5);
      const hour = new Date().getHours(); const greeting = hour<12?'Good morning':hour<17?'Good afternoon':'Good evening';
      return React.createElement("div", { className: "p-4 sm:p-6 space-y-8" }, 
        React.createElement(MotionDivC, { initial: { opacity:0,y:-20 }, animate:{opacity:1,y:0}, className:"relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/30 via-indigo-600/20 to-cyan-500/10 border border-white/10 p-6 sm:p-8" }, React.createElement("div", { className:"relative" }, React.createElement("p", { className:"text-violet-300 text-sm mb-1" }, `${greeting} 👋`), React.createElement("h2", { className:"text-3xl font-black text-white mb-2" }, currentUser?.username,"!"), React.createElement("p", { className:"text-slate-400 text-sm" }, "Welcome back to your personal vault."), React.createElement("div", { className:"mt-5 flex flex-wrap gap-3" }, React.createElement("div", { className:"flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2" }, "📦", React.createElement("span", null, files.length," files")), React.createElement("div", { className:"flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2" }, "💾", React.createElement("span", null, formatFileSize(totalSize))), unread>0 && React.createElement("div", { className:"flex items-center gap-2 bg-red-500/20 rounded-xl px-4 py-2" }, "🔔", React.createElement("span", null, unread," new"))))),
        React.createElement("div", { className:"grid grid-cols-2 sm:grid-cols-4 gap-4" }, [{label:'Total Files',value:files.length,icon:'📁'},{label:'Folders',value:folders.length,icon:'🗂️'},{label:'Links',value:links.length,icon:'🔗'},{label:'Notifications',value:notifications.length,icon:'🔔'}].map(s=>React.createElement("div", { className:"bg-white/5 border border-white/10 rounded-2xl p-4" }, React.createElement("div", { className:"text-3xl mb-2" }, s.icon), React.createElement("div", { className:"text-2xl font-black text-white" }, s.value), React.createElement("div", { className:"text-slate-500 text-xs" }, s.label)))),
        React.createElement("div", null, React.createElement("h3", { className:"text-white font-bold text-lg mb-4" }, "Quick Sections"), React.createElement("div", { className:"grid grid-cols-2 sm:grid-cols-4 gap-3" }, [['photos','🖼️','Photos'],['music','🎵','Music'],['videos','🎬','Videos'],['documents','📄','Docs']].map(([id,icon,label])=>React.createElement("button", { onClick:()=>setActiveSection(id), className:"bg-white/5 border border-white/10 rounded-2xl p-4 text-left hover:border-white/20" }, React.createElement("div", { className:"text-3xl mb-2" }, icon), React.createElement("p", { className:"text-white text-sm font-semibold" }, label))))),
        recent.length>0 && React.createElement("div", null, React.createElement("h3", { className:"text-white font-bold mb-4" }, "Recent Files"), recent.map(f=>React.createElement("div", { key:f.id, className:"flex items-center gap-4 p-3 bg-white/5 rounded-xl mb-2" }, React.createElement("div", null, "📄"), React.createElement("div", { className:"flex-1" }, React.createElement("p", { className:"text-white truncate" }, f.name), React.createElement("p", { className:"text-slate-500 text-xs" }, formatFileSize(f.size))), React.createElement("button", { onClick:()=>setActiveSection(f.category), className:"text-violet-400 text-xs" }, "View →")))));
    }
    
    // quick minimal SectionPage with upload & files
    function SectionPage({ category, title, icon, acceptTypes, description, color }) {
      const { addFile, getUserFiles, addFolder, getUserFolders } = useStore();
      const [files, setFilesState] = React.useState([]); const categoryFiles = getUserFiles().filter(f=>f.category===category && !f.folderId);
      const foldersList = getUserFolders().filter(f=>f.category===category);
      const [newFolderName, setNewFolderName] = React.useState(''); const [showFolderInput, setShowFolderInput] = React.useState(false);
      const fileInput = React.useRef(null);
      const handleUpload = async (fileList) => { if(!fileList) return; for(let f of Array.from(fileList)) { const data=await fileToBase64(f); addFile({name:f.name,type:f.type,size:f.size,data,category:category}); } };
      return React.createElement("div", { className:"flex flex-col h-full" }, React.createElement(Header, { title: `${icon} ${title}` }), React.createElement("div", { className:"flex-1 overflow-y-auto p-4 space-y-6" }, 
        React.createElement("div", { className:"border-2 border-dashed border-white/10 rounded-3xl p-8 text-center cursor-pointer hover:border-white/30", onClick:()=>fileInput.current.click(), onDragOver:e=>e.preventDefault(), onDrop:e=>{e.preventDefault(); handleUpload(e.dataTransfer.files);} }, React.createElement("input", { ref:fileInput, type:"file", multiple:true, accept:acceptTypes, className:"hidden", onChange:e=>handleUpload(e.target.files) }), React.createElement("div", { className:`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl mb-4` }, icon), React.createElement("p", { className:"text-white font-semibold" }, `Upload ${title}`), React.createElement("p", { className:"text-slate-500 text-sm mt-1" }, description)),
        React.createElement("div", { className:"flex gap-2" }, React.createElement("button", { onClick:()=>setShowFolderInput(true), className:"px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 text-sm" }, "+ Folder")),
        showFolderInput && React.createElement("div", { className:"flex gap-2 p-3 bg-amber-500/10 rounded-xl" }, React.createElement("input", { autoFocus:true, className:"flex-1 bg-white/5 px-3 py-2 rounded-xl text-white", placeholder:"Folder name", value:newFolderName, onChange:e=>setNewFolderName(e.target.value) }), React.createElement("button", { onClick:()=>{ if(newFolderName.trim()){ addFolder(newFolderName,category); setNewFolderName(''); setShowFolderInput(false); } }, className:"px-3 py-2 bg-amber-500 rounded-xl" }, "Create")),
        React.createElement("div", { className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" }, categoryFiles.map(f=>React.createElement(FileCard, { key:f.id, file:f }))))));
    }
    
    // LinksPage, NotificationsPage, AboutPage, Sidebar, AuthPage implementations as needed with small footprint but fully working
    function LinksPage() { const { getUserLinks, addLink, deleteLink } = useStore(); const links = getUserLinks(); const [title,setTitle]=React.useState(''); const [url,setUrl]=React.useState(''); const handleAdd=()=>{if(title&&url) addLink(title,url.startsWith('http')?url:'https://'+url);}; return React.createElement("div", { className:"flex flex-col h-full" }, React.createElement(Header, { title:"🔗 Important Links" }), React.createElement("div", { className:"p-4 space-y-4" }, React.createElement("div", { className:"bg-white/5 p-4 rounded-2xl" }, React.createElement("input", { placeholder:"Title", className:"w-full bg-white/5 mb-2 p-2 rounded-xl text-white", value:title, onChange:e=>setTitle(e.target.value) }), React.createElement("input", { placeholder:"URL", className:"w-full bg-white/5 mb-2 p-2 rounded-xl text-white", value:url, onChange:e=>setUrl(e.target.value) }), React.createElement("button", { onClick:handleAdd, className:"w-full py-2 bg-indigo-600 rounded-xl text-white" }, "+ Add")), links.map(l=>React.createElement("div", { key:l.id, className:"bg-white/5 p-3 rounded-xl flex justify-between items-center" }, React.createElement("div", null, React.createElement("p", { className:"text-white font-medium" }, l.title), React.createElement("a", { href:l.url, target:"_blank", className:"text-indigo-400 text-xs" }, l.url)), React.createElement("button", { onClick:()=>deleteLink(l.id), className:"text-red-400" }, "🗑️"))))); }
    function NotificationsPage() { const { getUserNotifications, acceptNotification, deleteNotification, markNotificationRead } = useStore(); const notes = getUserNotifications().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)); return React.createElement("div", { className:"flex flex-col h-full" }, React.createElement(Header, { title:"🔔 Notifications" }), React.createElement("div", { className:"p-4 space-y-3" }, notes.length===0?React.createElement("div", { className:"text-center py-20 text-slate-500" }, "No notifications"):notes.map(n=>React.createElement("div", { key:n.id, className:`p-4 rounded-2xl border ${n.read?'bg-white/3':'bg-violet-500/10 border-violet-500/30'}` }, React.createElement("div", { className:"flex justify-between" }, React.createElement("span", { className:"text-white" }, n.fromUsername," sent you a file"), React.createElement("button", { onClick:()=>deleteNotification(n.id) }, "✕")), React.createElement("p", { className:"text-sm text-slate-400" }, n.fileName), !n.accepted && React.createElement("div", { className:"flex gap-2 mt-3" }, React.createElement("button", { onClick:()=>acceptNotification(n.id), className:"px-3 py-1 bg-emerald-600 rounded-xl text-xs" }, "Accept"), React.createElement("button", { onClick:()=>markNotificationRead(n.id), className:"px-3 py-1 bg-white/10 rounded-xl text-xs" }, "Dismiss")))))); }
    function AboutPage() { return React.createElement("div", { className:"flex flex-col h-full" }, React.createElement(Header, { title:"✨ About NexVault" }), React.createElement("div", { className:"p-6 text-center space-y-4" }, React.createElement("div", { className:"w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-5xl" }, "🔐"), React.createElement("h1", { className:"text-4xl font-black text-white" }, "NexVault"), React.createElement("p", { className:"text-violet-300" }, "Personal Cloud Platform v1.0"), React.createElement("p", { className:"text-slate-400 max-w-md mx-auto" }, "Your private, secure personal cloud with unlimited storage, file sharing, folders, and real-time notifications."), React.createElement("div", { className:"bg-white/5 p-6 rounded-3xl mt-4" }, React.createElement("p", { className:"text-slate-400" }, "Developed by"), React.createElement("h2", { className:"text-2xl font-bold text-white" }, "Kerolos Adly"), React.createElement("p", { className:"text-slate-500 text-sm mt-2" }, "© 2026 All rights reserved")))); }
    function Sidebar() { const { activeSection, setActiveSection, sidebarOpen, setSidebarOpen, currentUser, logout, getUnreadCount } = useStore(); const unread = getUnreadCount(); const nav = [['dashboard','🏠','Dashboard'],['photos','🖼️','Photos'],['music','🎵','Music'],['videos','🎬','Videos'],['documents','📄','Documents'],['links','🔗','Links'],['notifications','🔔','Notifications'],['about','✨','About']]; return React.createElement(React.Fragment, null, sidebarOpen && React.createElement("div", { className:"fixed inset-0 z-20 bg-black/60 lg:hidden", onClick:()=>setSidebarOpen(false) }), React.createElement("aside", { className:`fixed top-0 left-0 h-full w-72 z-30 flex flex-col bg-[#0d0d20] border-r border-white/5 lg:relative lg:translate-x-0 transition-transform duration-300 ${sidebarOpen?'translate-x-0':'-translate-x-full'} lg:translate-x-0` }, React.createElement("div", { className:"p-6 border-b border-white/5" }, React.createElement("div", { className:"flex items-center gap-3" }, React.createElement("div", { className:"w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-xl" }, "🔐"), React.createElement("h1", { className:"text-xl font-black text-white" }, "NexVault"))), React.createElement("div", { className:"mx-4 mt-4 p-3 rounded-2xl bg-white/5" }, React.createElement("p", { className:"text-white text-sm font-semibold" }, currentUser?.username), React.createElement("p", { className:"text-slate-500 text-xs truncate" }, currentUser?.email)), React.createElement("nav", { className:"flex-1 px-3 py-4 space-y-1" }, nav.map(([id,icon,label])=>React.createElement("button", { key:id, onClick:()=>{ setActiveSection(id); setSidebarOpen(false); }, className:`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm ${activeSection===id?'bg-gradient-to-r from-violet-600 to-cyan-500 text-white':'text-slate-400 hover:text-white hover:bg-white/5'}` }, React.createElement("span", null, icon), label, id==='notifications' && unread>0 && React.createElement("span", { className:"ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center" }, unread>9?'9+':unread)))), React.createElement("div", { className:"p-4 border-t border-white/5" }, React.createElement("button", { onClick:logout, className:"w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-red-400" }, "🚪 Sign Out")))); }
    function AuthPage() { const [mode,setMode]=React.useState('login'); const [email,setEmail]=React.useState(''); const [username,setUsername]=React.useState(''); const [password,setPassword]=React.useState(''); const [error,setError]=React.useState(''); const { login, register } = useStore(); const handleSubmit=(e)=>{ e.preventDefault(); if(mode==='login'){ const res=login(email,password,false); if(!res.success) setError(res.error); } else { if(username.length<3||password.length<6) setError('Username min 3, password min 6'); else { const res=register(username,email,password); if(res.success){ setMode('login'); setUsername(''); setPassword(''); setError(''); } else setError(res.error); } } }; return React.createElement("div", { className:"min-h-screen flex items-center justify-center bg-[#0a0a1a] p-4" }, React.createElement("div", { className:"w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8" }, React.createElement("div", { className:"text-center mb-6" }, React.createElement("div", { className:"w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-3xl" }, "🔐"), React.createElement("h1", { className:"text-3xl font-black text-white mt-3" }, "NexVault")), React.createElement("div", { className:"flex gap-2 mb-6" }, ['login','register'].map(t=>React.createElement("button", { key:t, onClick:()=>{ setMode(t); setError(''); }, className:`flex-1 py-2 rounded-xl ${mode===t?'bg-gradient-to-r from-violet-600 to-cyan-500 text-white':'text-slate-400'}` }, t==='login'?'Sign In':'Register'))), error && React.createElement("div", { className:"mb-4 p-2 bg-red-500/20 rounded-xl text-red-300 text-sm" }, error), React.createElement("form", { onSubmit:handleSubmit, className:"space-y-4" }, mode==='register' && React.createElement("input", { type:"text", placeholder:"Username", className:"w-full bg-white/5 border-white/10 border rounded-xl px-4 py-3 text-white", value:username, onChange:e=>setUsername(e.target.value) }), React.createElement("input", { type:"email", placeholder:"Email", className:"w-full bg-white/5 border-white/10 border rounded-xl px-4 py-3 text-white", value:email, onChange:e=>setEmail(e.target.value) }), React.createElement("input", { type:"password", placeholder:"Password", className:"w-full bg-white/5 border-white/10 border rounded-xl px-4 py-3 text-white", value:password, onChange:e=>setPassword(e.target.value) }), React.createElement("button", { type:"submit", className:"w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold" }, mode==='login'?'Sign In':'Create Account')))); }
    
    function App() {
      const { currentUser, activeSection } = useStore();
      if (!currentUser) return React.createElement(AuthPage, null);
      const sectionMap = { dashboard: React.createElement(Dashboard, null), photos: React.createElement(SectionPage, { category:"photos", title:"Photos", icon:"🖼️", acceptTypes:"image/*", description:"Upload photos (JPG, PNG, GIF)", color:"from-pink-600 to-rose-600" }), music: React.createElement(SectionPage, { category:"music", title:"Music", icon:"🎵", acceptTypes:"audio/*", description:"MP3, WAV, FLAC", color:"from-purple-600 to-violet-600" }), videos: React.createElement(SectionPage, { category:"videos", title:"Videos", icon:"🎬", acceptTypes:"video/*", description:"MP4, AVI, MOV", color:"from-blue-600 to-cyan-600" }), documents: React.createElement(SectionPage, { category:"documents", title:"Documents", icon:"📄", acceptTypes:".pdf,.doc,.docx,.txt", description:"PDF, Word, Text", color:"from-amber-600 to-orange-600" }), links: React.createElement(LinksPage, null), notifications: React.createElement(NotificationsPage, null), about: React.createElement(AboutPage, null) };
      const content = sectionMap[activeSection] || React.createElement(Dashboard, null);
      return React.createElement("div", { className:"flex h-screen overflow-hidden bg-[#0a0a1a]" }, React.createElement(Sidebar, null), React.createElement("main", { className:"flex-1 overflow-y-auto" }, content, React.createElement(GlobalNotificationPopup, null)));
    }
    function GlobalNotificationPopup() { const { getUserNotifications, setActiveSection, markNotificationRead } = useStore(); const [popup,setPopup]=React.useState(null); const notes=getUserNotifications(); React.useEffect(()=>{ const newUnread = notes.filter(n=>!n.read && !n.accepted); if(newUnread.length){ const latest=newUnread[newUnread.length-1]; setPopup(latest); const t=setTimeout(()=>setPopup(null),7000); return ()=>clearTimeout(t); } },[notes.length]); if(!popup) return null; return React.createElement("div", { className:"fixed bottom-6 right-6 z-[9999] max-w-sm w-full bg-[#141428] border border-violet-500/30 rounded-2xl p-4 shadow-2xl" }, React.createElement("div", { className:"flex gap-3" }, React.createElement("div", { className:"w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center" }, "📁"), React.createElement("div", { className:"flex-1" }, React.createElement("p", { className:"text-violet-300 text-xs" }, "New Notification"), React.createElement("p", { className:"text-white text-sm" }, popup.fromUsername," sent you a file")), React.createElement("button", { onClick:()=>{ setActiveSection('notifications'); markNotificationRead(popup.id); setPopup(null); }, className:"text-xs bg-violet-600 px-3 py-1 rounded-xl" }, "View"))); }
    ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App, null));
  </script>
</body>
</html>
