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

         
