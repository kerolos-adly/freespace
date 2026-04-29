## Overview

NexVault is a full‑stack personal cloud platform that runs entirely in your browser. It provides a secure, private, and visually stunning environment to store, organize, and share all your digital assets — from photos and music to documents and executable files. With real‑time file transfers, folder management, and a modern glass‑morphic UI, NexVault redefines what a personal cloud can be.

---

## Features

| Category | Details |
|----------|---------|
| 🔐 **Authentication** | Secure login/register with email/password + Remember Me (data stays local). |
| 🖼️ **Photo Gallery** | Upload, preview, and manage images with beautiful grid view. |
| 🎵 **Music Library** | Built‑in audio player supports MP3, WAV, FLAC, OGG, and M4A. |
| 🎬 **Video Vault** | Upload and play videos directly in the browser (MP4, MOV, AVI, MKV). |
| 👤 **VCF Contacts** | Upload \`.vcf\` contact files only, keeping your address book structured. |
| 📄 **Documents** | Store PDFs, Word/Excel files, text files, APK installers, and Windows EXEs. |
| 🔗 **Important Links** | Save and organise URLs with custom titles and quick access. |
| 📁 **Custom Folders** | Create folders per section and move files into them. |
| 📤 **File Transfer** | Send files to other NexVault users by email – they receive a real‑time notification. |
| 🔔 **Notification Center** | Real‑time inbox for incoming files; accept or dismiss transfers. |
| 🔊 **Audio/Visual Alerts** | Playful sound and pop‑up previews for new incoming files. |
| 🌙 **Animated Dark UI** | Fully responsive, glass‑morphic design with smooth animations (Framer Motion). |
| 🔒 **100% Private** | All data stored locally via \`localStorage\`. No external servers – your data stays yours. |

---

## Tech Stack

- **React 19** – UI library
- **TypeScript** – Type safety (compiled to JS)
- **Zustand** – State management with persistence
- **Framer Motion** – Smooth page transitions and micro‑interactions
- **Tailwind CSS v4** – Utility‑first styling + custom gradients
- **Vite** – Build tool with single‑file export plugin
- **UUID** – Unique identifiers for files, folders, and notifications

All user data (files, folders, links, notifications, users) is stored in the browser’s \`localStorage\`. The platform works offline after the first load.

---

## File Structure (as in the repository)

\`\`\`
nexvault/
├── index.html              # Main entry point
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration (single‑file build)
├── tsconfig.json           # TypeScript configuration
├── src/
│   ├── main.tsx            # React entry
│   ├── App.tsx             # Root component with routing
│   ├── store/
│   │   └── useStore.ts     # Zustand store (auth, files, folders, notifications)
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── Dashboard.tsx
│   │   ├── SectionPage.tsx
│   │   ├── FileCard.tsx
│   │   ├── FolderView.tsx
│   │   ├── LinksPage.tsx
│   │   ├── NotificationsPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── SendFileModal.tsx
│   │   └── GlobalNotificationPopup.tsx
│   ├── utils/
│   │   ├── helpers.ts      # fileToBase64, formatFileSize, formatDate, downloadFile
│   │   └── sound.ts        # playNotificationSound
│   └── types/
│       └── index.ts        # TypeScript interfaces (User, FileItem, Folder, Link, Notification)
└── public/                 # Static assets (optional)
\`\`\`

---

## How to Run Locally

1. **Clone the repository**  
   \`\`\`bash
   git clone https://github.com/yourusername/nexvault.git
   cd nexvault
   \`\`\`

2. **Install dependencies**  
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development server**  
   \`\`\`bash
   npm run dev
   \`\`\`
   The app will be available at \`http://localhost:5173\`.

4. **Build for production (single HTML file)**  
   \`\`\`bash
   npm run build
   \`\`\`
   The entire application is bundled into \`dist/index.html\` – you can host it anywhere.

---

## How to Deploy on GitHub Pages

1. Push the repository to GitHub.
2. In your repository, go to **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the branch \`main\` and folder \`/ (root)\`.
5. Click **Save**.
6. After a few minutes, your site will be live at:  
   \`https://<your-username>.github.io/<repository-name>/\`

> 💡 **Tip:** If you want the app to work offline, you can also download the \`dist/index.html\` file and open it directly in any modern browser.

---

## Privacy & Data Storage

- All user data (including uploaded files as Base64 strings) is stored in **\`localStorage\`** under the key \`nexvault-storage\`.
- No information is ever sent to an external server.
- Each user’s data is isolated by their unique email address.
- Clearing your browser’s local storage will remove all data – **no backup** is provided by the platform.

---

## Known Limitations

- File size is limited by the browser’s \`localStorage\` quota (usually 5–10 MB per origin). For larger files, consider splitting or using a native file system API (future enhancement).
- The current version does not support streaming or chunked uploads.
- \`.exe\` and \`.apk\` files are stored as Base64 but **cannot be executed** inside the browser – they can only be downloaded.
- VCF contacts are not parsed; they are stored as raw files.

---

## License & Credits

© 2026 **Kerolos Adly** – All rights reserved.  
Built with ❤️ using React, TypeScript, Tailwind CSS, and Framer Motion.

Icons and emojis are used for illustrative purposes. All uploaded content remains the property of its respective owner.

---

## Support

For questions, feature requests, or bug reports, please open an issue on the GitHub repository or contact the developer directly (email not provided in this README).

---

**NexVault** – Your vault, your rules. 🔐
`;
      const blob = new Blob([readmeContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'README.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  </script>
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

    // ---------- ZUSTAND STORE ----------
    const uuidv4 = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
    const { create } = window.zustand;
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

    const motion = window.framerMotion?.motion || { div: ({children, ...props}) => React.createElement('div', props, children), button: props => React.createElement('button', props) };
    const MotionDiv = motion.div;
    const MotionButton = motion.button;
    const MotionHeader = motion.header;
    
    function Header({ title }) {
      const { toggleSidebar, setActiveSection, getUnreadCount } = useStore();
      const unread = getUnreadCount();
      return React.createElement(MotionHeader, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5" },
        React.createElement("div", { className: "flex items-center gap-4" },
          React.createElement("button", { onClick: toggleSidebar, className: "lg:hidden w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all" }, "☰"),
          React.createElement("h2", { className: "text-xl font-bold text-white" }, title)),
        React.createElement("div", { className: "flex items-center gap-3" },
          React.createElement(MotionButton, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => setActiveSection('notifications'), className: "relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-yellow-400 transition-all" }, "🔔", unread > 0 && React.createElement("span", { className: "absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse" }, unread > 9 ? '9+' : unread))));
    }

    function FileCard({ file }) {
      const { deleteFile, getUserFolders, moveFileToFolder } = useStore();
      const [showSend, setShowSend] = React.useState(false);
      const [showMoveMenu, setShowMoveMenu] = React.useState(false);
      const [confirmDelete, setConfirmDelete] = React.useState(false);
      const folders = getUserFolders().filter(f => f.category === file.category);
      const isImage = file.type.startsWith('image/');
      const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|flac|ogg|aac|m4a)$/i.test(file.name);
      const isVideo = file.type.startsWith('video/');
      return React.createElement(React.Fragment, null,
        React.createElement(MotionDiv, { layout: true, initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, className: "bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:bg-white/8 transition-all group" },
          (isImage && React.createElement("div", { className: "aspect-video overflow-hidden" }, React.createElement("img", { src: file.data, alt: file.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }))) ||
          (isVideo && React.createElement("div", { className: "aspect-video overflow-hidden bg-black" }, React.createElement("video", { src: file.data, className: "w-full h-full object-contain", controls: true, preload: "metadata" }))) ||
          (isAudio && React.createElement("div", { className: "p-4 bg-gradient-to-br from-purple-900/40 to-violet-900/20" }, React.createElement("div", { className: "flex items-center justify-center h-16" }, React.createElement("div", { className: "text-4xl animate-pulse" }, "🎵"), React.createElement("audio", { src: file.data, controls: true, className: "w-full mt-2 h-8", preload: "metadata" })))) ||
          (!isImage && !isVideo && !isAudio && React.createElement("div", { className: "p-4 flex items-center justify-center h-24 bg-gradient-to-br from-slate-800/50 to-slate-700/20" }, React.createElement("span", { className: "text-4xl" }, file.category === 'contacts' ? '👤' : file.category === 'documents' ? '📄' : file.category === 'apk' ? '📱' : file.category === 'exe' ? '💻' : '📁'))),
          React.createElement("div", { className: "p-3" },
            React.createElement("p", { className: "text-white text-sm font-medium truncate" }, file.name),
            React.createElement("div", { className: "flex items-center justify-between mt-1" }, React.createElement("p", { className: "text-slate-500 text-xs" }, formatFileSize(file.size)), React.createElement("p", { className: "text-slate-600 text-xs" }, formatDate(file.uploadedAt).split(',')[0])),
            React.createElement("div", { className: "flex gap-1.5 mt-3" },
              React.createElement("button", { onClick: () => downloadFile(file.data, file.name, file.type), className: "flex-1 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-medium" }, "⬇️ Download"),
              React.createElement("button", { onClick: () => setShowSend(true), className: "flex-1 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium" }, "📤 Send"),
              React.createElement("button", { onClick: () => setConfirmDelete(true), className: "py-1.5 px-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs" }, "🗑️")))),
        confirmDelete && React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4", onClick: () => setConfirmDelete(false) }, React.createElement("div", { className: "w-full max-w-sm bg-[#141428] border border-white/10 rounded-3xl p-6", onClick: e => e.stopPropagation() }, React.createElement("h3", { className: "text-white font-bold text-center mb-5" }, "Delete file?"), React.createElement("div", { className: "flex gap-3" }, React.createElement("button", { onClick: () => setConfirmDelete(false), className: "flex-1 py-2 rounded-xl bg-white/10" }, "Cancel"), React.createElement("button", { onClick: () => { deleteFile(file.id); setConfirmDelete(false); }, className: "flex-1 py-2 rounded-xl bg-red-500/80" }, "Delete")))),
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
      return React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4", onClick: onClose }, React.createElement("div", { className: "w-full max-w-md bg-[#141428] border border-white/10 rounded-3xl p-6", onClick: e => e.stopPropagation() }, React.createElement("div", { className: "flex justify-between mb-4" }, React.createElement("h3", { className: "text-white font-bold" }, "Send File"), React.createElement("button", { onClick: onClose }, "✕")), React.createElement("input", { type: "email", placeholder: "recipient@email.com", value: toEmail, onChange: e => { setToEmail(e.target.value); setStatus(null); }, className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mb-3" }), status && React.createElement("div", { className: `p-2 rounded text-sm mb-2 ${status.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}` }, status.msg), React.createElement("button", { onClick: handleSend, className: "w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold" }, "📤 Send")));
    }

    function Dashboard() {
      const { currentUser, getUserFiles, getUnreadCount, setActiveSection } = useStore();
      const files = getUserFiles();
      const unread = getUnreadCount();
      const recent = [...files].sort((a,b)=>new Date(b.uploadedAt)-new Date(a.uploadedAt)).slice(0,5);
      return React.createElement("div", { className: "p-4 sm:p-6 space-y-8" }, 
        React.createElement(MotionDiv, { initial: { opacity:0,y:-20 }, animate:{opacity:1,y:0}, className:"relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/30 via-indigo-600/20 to-cyan-500/10 border border-white/10 p-6" }, React.createElement("div", { className:"relative" }, React.createElement("p", { className:"text-violet-300 text-sm mb-1" }, "Welcome back 👋"), React.createElement("h2", { className:"text-3xl font-black text-white mb-2" }, currentUser?.username), React.createElement("p", { className:"text-slate-400 text-sm" }, "Your vault is ready."), unread>0 && React.createElement("div", { className:"mt-3 flex items-center gap-2 bg-red-500/20 rounded-xl px-4 py-2 inline-flex" }, "🔔", React.createElement("span", null, unread," new notification")))),
        React.createElement("div", { className:"grid grid-cols-2 sm:grid-cols-4 gap-4" }, [{label:'Files',value:files.length,icon:'📁'},{label:'Storage',value:formatFileSize(files.reduce((a,b)=>a+b.size,0)),icon:'💾'}].map(s=>React.createElement("div", { className:"bg-white/5 border border-white/10 rounded-2xl p-4" }, React.createElement("div", { className:"text-3xl mb-2" }, s.icon), React.createElement("div", { className:"text-2xl font-black text-white" }, s.value), React.createElement("div", { className:"text-slate-500 text-xs" }, s.label)))),
        recent.length>0 && React.createElement("div", null, React.createElement("h3", { className:"text-white font-bold mb-4" }, "Recent"), recent.map(f=>React.createElement("div", { key:f.id, className:"flex gap-3 p-3 bg-white/5 rounded-xl mb-2" }, React.createElement("div", null, "📄"), React.createElement("div", { className:"flex-1" }, React.createElement("p", { className:"text-white truncate" }, f.name)), React.createElement("button", { onClick:()=>setActiveSection(f.category), className:"text-violet-400 text-xs" }, "View")))));
    }

    function SectionPage({ category, title, icon, acceptTypes, description, color }) {
      const { addFile, getUserFiles, addFolder } = useStore();
      const fileInput = React.useRef(null);
      const categoryFiles = getUserFiles().filter(f=>f.category===category && !f.folderId);
      const handleUpload = async (fileList) => { if(!fileList) return; for(let f of Array.from(fileList)) { const data=await fileToBase64(f); addFile({name:f.name,type:f.type,size:f.size,data,category}); } };
      return React.createElement("div", { className:"flex flex-col h-full" }, React.createElement(Header, { title: `${icon} ${title}` }), React.createElement("div", { className:"flex-1 overflow-y-auto p-4 space-y-6" }, 
        React.createElement("div", { className:"border-2 border-dashed border-white/10 rounded-3xl p-8 text-center cursor-pointer hover:border-white/30", onClick:()=>fileInput.current.click(), onDragOver:e=>e.preventDefault(), onDrop:e=>{e.preventDefault(); handleUpload(e.dataTransfer.files);} }, React.createElement("input", { ref:fileInput, type:"file", multiple:true, accept:acceptTypes, className:"hidden", onChange:e=>handleUpload(e.target.files) }), React.createElement("div", { className:`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl mb-4` }, icon), React.createElement("p", { className:"text-white font-semibold" }, `Upload ${title}`), React.createElement("p", { className:"text-slate-500 text-sm mt-1" }, description)),
        React.createElement("div", { className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" }, categoryFiles.map(f=>React.createElement(FileCard, { key:f.id, file:f }))))));
    }

    function LinksPage() { const { getUserLinks, addLink, deleteLink } = useStore(); const [title,setTitle]=React.useState(''); const [url,setUrl]=React.useState(''); const links = getUserLinks(); const handleAdd=()=>{if(title&&url) addLink(title,url.startsWith('http')?url:'https://'+url);}; return React.createElement("div", { className:"flex flex-col h-full" }, React.createElement(Header, { title:"🔗 Important Links" }), React.createElement("div", { className:"p-4 space-y-4" }, React.createElement("div", { className:"bg-white/5 p-4 rounded-2xl" }, React.createElement("input", { placeholder:"Title", className:"w-full bg-white/5 mb-2 p-2 rounded-xl text-white", value:title, onChange:e=>setTitle(e.target.value) }), React.createElement("input", { placeholder:"URL", className:"w-full bg-white/5 mb-2 p-2 rounded-xl text-white", value:url, onChange:e=>setUrl(e.target.value) }), React.createElement("button", { onClick:handleAdd, className:"w-full py-2 bg-indigo-600 rounded-xl text-white" }, "+ Add")), links.map(l=>React.createElement("div", { key:l.id, className:"bg-white/5 p-3 rounded-xl flex justify-between items-center" }, React.createElement("div", null, React.createElement("p", { className:"text-white font-medium" }, l.title), React.createElement("a", { href:l.url, target:"_blank", className:"text-indigo-400 text-xs" }, l.url)), React.createElement("button", { onClick:()=>deleteLink(l.id), className:"text-red-400" }, "🗑️"))))); }
    function NotificationsPage() { const { getUserNotifications, acceptNotification, deleteNotification, markNotificationRead } = useStore(); const notes = getUserNotifications().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)); return React.createElement("div", { className:"flex flex-col h-full" }, React.createElement(Header, { title:"🔔 Notifications" }), React.createElement("div", { className:"p-4 space-y-3" }, notes.length===0?React.createElement("div", { className:"text-center py-20 text-slate-500" }, "No notifications"):notes.map(n=>React.createElement("div", { key:n.id, className:`p-4 rounded-2xl border ${n.read?'bg-white/3':'bg-violet-500/10 border-violet-500/30'}` }, React.createElement("div", { className:"flex justify-between" }, React.createElement("span", { className:"text-white" }, n.fromUsername," sent a file"), React.createElement("button", { onClick:()=>deleteNotification(n.id) }, "✕")), React.createElement("p", { className:"text-sm text-slate-400" }, n.fileName), !n.accepted && React.createElement("div", { className:"flex gap-2 mt-3" }, React.createElement("button", { onClick:()=>acceptNotification(n.id), className:"px-3 py-1 bg-emerald-600 rounded-xl text-xs" }, "Accept"), React.createElement("button", { onClick:()=>markNotificationRead(n.id), className:"px-3 py-1 bg-white/10 rounded-xl text-xs" }, "Dismiss")))))); }
    function AboutPage() { return React.createElement("div", { className:"flex flex-col h-full" }, React.createElement(Header, { title:"✨ About NexVault" }), React.createElement("div", { className:"p-6 text-center space-y-4" }, React.createElement("div", { className:"w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-5xl" }, "🔐"), React.createElement("h1", { className:"text-4xl font-black text-white" }, "NexVault"), React.createElement("p", { className:"text-violet-300" }, "Personal Cloud Platform v1.0"), React.createElement("p", { className:"text-slate-400 max-w-md mx-auto" }, "Developed by Kerolos Adly"), React.createElement("div", { className:"bg-white/5 p-6 rounded-3xl mt-4" }, React.createElement("p", { className:"text-slate-500 text-sm" }, "© 2026 All rights reserved")))); }
    function Sidebar() { const { activeSection, setActiveSection, sidebarOpen, setSidebarOpen, currentUser, logout, getUnreadCount } = useStore(); const unread = getUnreadCount(); const nav = [['dashboard','🏠','Dashboard'],['photos','🖼️','Photos'],['music','🎵','Music'],['videos','🎬','Videos'],['documents','📄','Documents'],['links','🔗','Links'],['notifications','🔔','Notifications'],['about','✨','About']]; return React.createElement(React.Fragment, null, sidebarOpen && React.createElement("div", { className:"fixed inset-0 z-20 bg-black/60 lg:hidden", onClick:()=>setSidebarOpen(false) }), React.createElement("aside", { className:`fixed top-0 left-0 h-full w-72 z-30 flex flex-col bg-[#0d0d20] border-r border-white/5 lg:relative lg:translate-x-0 transition-transform duration-300 ${sidebarOpen?'translate-x-0':'-translate-x-full'} lg:translate-x-0` }, React.createElement("div", { className:"p-6 border-b border-white/5" }, React.createElement("div", { className:"flex items-center gap-3" }, React.createElement("div", { className:"w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-xl" }, "🔐"), React.createElement("h1", { className:"text-xl font-black text-white" }, "NexVault"))), React.createElement("div", { className:"mx-4 mt-4 p-3 rounded-2xl bg-white/5" }, React.createElement("p", { className:"text-white text-sm font-semibold" }, currentUser?.username), React.createElement("p", { className:"text-slate-500 text-xs truncate" }, currentUser?.email)), React.createElement("nav", { className:"flex-1 px-3 py-4 space-y-1" }, nav.map(([id,icon,label])=>React.createElement("button", { key:id, onClick:()=>{ setActiveSection(id); setSidebarOpen(false); }, className:`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm ${activeSection===id?'bg-gradient-to-r from-violet-600 to-cyan-500 text-white':'text-slate-400 hover:text-white hover:bg-white/5'}` }, React.createElement("span", null, icon), label, id==='notifications' && unread>0 && React.createElement("span", { className:"ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center" }, unread>9?'9+':unread)))), React.createElement("div", { className:"p-4 border-t border-white/5" }, React.createElement("button", { onClick:logout, className:"w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-red-400" }, "🚪 Sign Out")))); }
    function AuthPage() { const [mode,setMode]=React.useState('login'); const [email,setEmail]=React.useState(''); const [username,setUsername]=React.useState(''); const [password,setPassword]=React.useState(''); const [error,setError]=React.useState(''); const { login, register } = useStore(); const handleSubmit=(e)=>{ e.preventDefault(); if(mode==='login'){ const res=login(email,password,false); if(!res.success) setError(res.error); } else { if(username.length<3||password.length<6) setError('Username min 3, password min 6'); else { const res=register(username,email,password); if(res.success){ setMode('login'); setUsername(''); setPassword(''); setError(''); } else setError(res.error); } } }; return React.createElement("div", { className:"min-h-screen flex items-center justify-center bg-[#0a0a1a] p-4" }, React.createElement("div", { className:"w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8" }, React.createElement("div", { className:"text-center mb-6" }, React.createElement("div", { className:"w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-3xl" }, "🔐"), React.createElement("h1", { className:"text-3xl font-black text-white mt-3" }, "NexVault")), React.createElement("div", { className:"flex gap-2 mb-6" }, ['login','register'].map(t=>React.createElement("button", { key:t, onClick:()=>{ setMode(t); setError(''); }, className:`flex-1 py-2 rounded-xl ${mode===t?'bg-gradient-to-r from-violet-600 to-cyan-500 text-white':'text-slate-400'}` }, t==='login'?'Sign In':'Register'))), error && React.createElement("div", { className:"mb-4 p-2 bg-red-500/20 rounded-xl text-red-300 text-sm" }, error), React.createElement("form", { onSubmit:handleSubmit, className:"space-y-4" }, mode==='register' && React.createElement("input", { type:"text", placeholder:"Username", className:"w-full bg-white/5 border-white/10 border rounded-xl px-4 py-3 text-white", value:username, onChange:e=>setUsername(e.target.value) }), React.createElement("input", { type:"email", placeholder:"Email", className:"w-full bg-white/5 border-white/10 border rounded-xl px-4 py-3 text-white", value:email, onChange:e=>setEmail(e.target.value) }), React.createElement("input", { type:"password", placeholder:"Password", className:"w-full bg-white/5 border-white/10 border rounded-xl px-4 py-3 text-white", value:password, onChange:e=>setPassword(e.target.value) }), React.createElement("button", { type:"submit", className:"w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold" }, mode==='login'?'Sign In':'Create Account')))); }
    function GlobalNotificationPopup() { const { getUserNotifications, setActiveSection, markNotificationRead } = useStore(); const [popup,setPopup]=React.useState(null); const notes=getUserNotifications(); React.useEffect(()=>{ const newUnread = notes.filter(n=>!n.read && !n.accepted); if(newUnread.length){ setPopup(newUnread[newUnread.length-1]); const t=setTimeout(()=>setPopup(null),7000); return ()=>clearTimeout(t); } },[notes.length]); if(!popup) return null; return React.createElement("div", { className:"fixed bottom-6 right-6 z-[9999] max-w-sm w-full bg-[#141428] border border-violet-500/30 rounded-2xl p-4 shadow-2xl" }, React.createElement("div", { className:"flex gap-3" }, React.createElement("div", { className:"w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center" }, "📁"), React.createElement("div", { className:"flex-1" }, React.createElement("p", { className:"text-violet-300 text-xs" }, "New Notification"), React.createElement("p", { className:"text-white text-sm" }, popup.fromUsername," sent you a file")), React.createElement("button", { onClick:()=>{ setActiveSection('notifications'); markNotificationRead(popup.id); setPopup(null); }, className:"text-xs bg-violet-600 px-3 py-1 rounded-xl" }, "View"))); }
    function App() {
      const { currentUser, activeSection } = useStore();
      if (!currentUser) return React.createElement(AuthPage, null);
      const sectionMap = { dashboard: React.createElement(Dashboard, null), photos: React.createElement(SectionPage, { category:"photos", title:"Photos", icon:"🖼️", acceptTypes:"image/*", description:"Upload images", color:"from-pink-600 to-rose-600" }), music: React.createElement(SectionPage, { category:"music", title:"Music", icon:"🎵", acceptTypes:"audio/*", description:"Audio files", color:"from-purple-600 to-violet-600" }), videos: React.createElement(SectionPage, { category:"videos", title:"Videos", icon:"🎬", acceptTypes:"video/*", description:"Video files", color:"from-blue-600 to-cyan-600" }), documents: React.createElement(SectionPage, { category:"documents", title:"Documents", icon:"📄", acceptTypes:".pdf,.doc,.docx,.txt", description:"PDF, Word, Text", color:"from-amber-600 to-orange-600" }), links: React.createElement(LinksPage, null), notifications: React.createElement(NotificationsPage, null), about: React.createElement(AboutPage, null) };
      const content = sectionMap[activeSection] || React.createElement(Dashboard, null);
      return React.createElement("div", { className:"flex h-screen overflow-hidden bg-[#0a0a1a]" }, React.createElement(Sidebar, null), React.createElement("main", { className:"flex-1 overflow-y-auto" }, content, React.createElement(GlobalNotificationPopup, null)));
    }
    ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App, null));
  </script>
</body>
</html>
