/* === NexVault Main JS === */
/* Developer: Kerolos Adly | © 2026 */

// ========================
// STATE
// ========================
let currentUser = null;
let currentPage = 'dashboard';
let currentFolderSection = null;
let currentFolderName = null;
let pendingIncoming = null;
let audioTracks = [];
let audioIndex = 0;
let notifSoundEnabled = true;

// ========================
// LOCALSTORAGE HELPERS
// ========================
function db_get(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function db_set(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

// User registry: { email: { username, email, password, createdAt } }
function getUsers() { return db_get('nv_users') || {}; }
function saveUsers(u) { db_set('nv_users', u); }

// User data: files, folders, notifications, links
function getUserData(email) {
  return db_get('nv_data_' + email) || {
    photos: [], music: [], videos: [], contacts: [], documents: [], links: [],
    folders: { photos: [], music: [], videos: [], documents: [] },
    folderFiles: {},
    notifications: [],
    storageUsed: 0
  };
}
function saveUserData(email, data) { db_set('nv_data_' + email, data); }

function getUserDataForUser() { return getUserData(currentUser.email); }
function saveDataForUser(data) { saveUserData(currentUser.email, data); }

// ========================
// SPLASH
// ========================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash').style.display = 'none';
    checkAutoLogin();
  }, 2800);
});

function checkAutoLogin() {
  const saved = db_get('nv_session');
  if (saved && saved.email) {
    const users = getUsers();
    if (users[saved.email]) {
      currentUser = users[saved.email];
      launchApp();
      return;
    }
  }
  showAuth();
}

// ========================
// AUTH
// ========================
function showAuth() {
  document.getElementById('authPage').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
}

function switchTab(tab) {
  document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
  document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register');
  document.getElementById('loginTab').classList.toggle('active', tab === 'login');
  document.getElementById('registerTab').classList.toggle('active', tab === 'register');
  document.getElementById('loginError').classList.add('hidden');
  document.getElementById('registerError').classList.add('hidden');
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const remember = document.getElementById('rememberMe').checked;

  const users = getUsers();
  if (!users[email]) return showAuthError('loginError', 'No account found with this email.');
  if (users[email].password !== btoa(password)) return showAuthError('loginError', 'Incorrect password.');

  currentUser = users[email];
  if (remember) db_set('nv_session', { email });
  launchApp();
}

function handleRegister() {
  const username = document.getElementById('regUsername').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;

  if (!username || !email || !password) return showAuthError('registerError', 'All fields are required.');
  if (password !== confirm) return showAuthError('registerError', 'Passwords do not match.');
  if (password.length < 6) return showAuthError('registerError', 'Password must be at least 6 characters.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showAuthError('registerError', 'Enter a valid email address.');

  const users = getUsers();
  if (users[email]) return showAuthError('registerError', 'This email is already registered.');

  users[email] = { username, email, password: btoa(password), createdAt: new Date().toISOString() };
  saveUsers(users);
  currentUser = users[email];
  db_set('nv_session', { email });
  launchApp();
  showToast('Account created! Welcome, ' + username + ' 🎉');
}

function showAuthError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.remove('hidden');
}

function logout() {
  db_set('nv_session', null);
  currentUser = null;
  document.getElementById('app').classList.add('hidden');
  showAuth();
}

// ========================
// LAUNCH APP
// ========================
function launchApp() {
  document.getElementById('authPage').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('sidebarAvatar').textContent = currentUser.username.charAt(0).toUpperCase();
  document.getElementById('sidebarName').textContent = currentUser.username;
  document.getElementById('sidebarEmail').textContent = currentUser.email;
  showPage('dashboard', document.querySelector('[data-page="dashboard"]'));
  startNotifPoller();
}

// ========================
// NAVIGATION
// ========================
function showPage(page, btn) {
  document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.remove('hidden');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (btn) btn.classList.add('active');

  currentPage = page;
  const titles = {
    dashboard: 'Dashboard', photos: 'Photos', music: 'Music',
    videos: 'Videos', contacts: 'Contacts', documents: 'Documents',
    links: 'Links', transfer: 'Transfer Files', notifications: 'Notifications', folder: currentFolderName || 'Folder'
  };
  document.getElementById('topbarTitle').textContent = titles[page] || page;

  if (page === 'dashboard') renderDashboard();
  if (page === 'photos') renderSection('photos');
  if (page === 'music') renderSection('music');
  if (page === 'videos') renderSection('videos');
  if (page === 'contacts') renderSection('contacts');
  if (page === 'documents') renderSection('documents');
  if (page === 'links') renderLinks();
  if (page === 'transfer') renderTransfer();
  if (page === 'notifications') renderNotifications();

  // Close mobile sidebar
  closeMobileSidebar();
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
  let overlay = document.getElementById('sidebarOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'sidebarOverlay';
    overlay.onclick = closeMobileSidebar;
    document.body.appendChild(overlay);
  }
  overlay.classList.toggle('show', sidebar.classList.contains('open'));
}

function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  const o = document.getElementById('sidebarOverlay');
  if (o) o.classList.remove('show');
}

// ========================
// DASHBOARD
// ========================
function renderDashboard() {
  const data = getUserDataForUser();
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  document.getElementById('dashGreeting').textContent = greet + ', ' + currentUser.username + '!';

  const statsEl = document.getElementById('statsGrid');
  const counts = [
    { icon: '◫', label: 'Photos', num: data.photos.length },
    { icon: '◉', label: 'Music', num: data.music.length },
    { icon: '▷', label: 'Videos', num: data.videos.length },
    { icon: '◧', label: 'Documents', num: data.documents.length },
    { icon: '◎', label: 'Contacts', num: data.contacts.length },
    { icon: '⬡', label: 'Links', num: data.links.length },
  ];
  statsEl.innerHTML = counts.map(c => `
    <div class="stat-card">
      <div class="stat-icon">${c.icon}</div>
      <div class="stat-num">${c.num}</div>
      <div class="stat-label">${c.label}</div>
    </div>
  `).join('');

  // Recent files
  const all = [
    ...data.photos.map(f => ({...f, type:'photo'})),
    ...data.music.map(f => ({...f, type:'music'})),
    ...data.videos.map(f => ({...f, type:'video'})),
    ...data.documents.map(f => ({...f, type:'document'})),
  ].sort((a,b) => (b.addedAt||0) - (a.addedAt||0)).slice(0, 6);

  const recentEl = document.getElementById('recentFiles');
  recentEl.innerHTML = all.length ? all.map(f => `
    <div class="recent-item">
      <span class="ri-icon">${fileIcon(f.name, f.type)}</span>
      <span class="ri-name">${f.name}</span>
      <span class="ri-type">${f.type}</span>
    </div>
  `).join('') : '<p style="color:var(--text2);font-size:.85rem">No files yet</p>';

  // Notifications preview
  const unread = data.notifications.filter(n => !n.read).slice(0, 4);
  const dashNotifs = document.getElementById('dashNotifs');
  dashNotifs.innerHTML = unread.length ? unread.map(n => `
    <div class="notif-preview-item">
      <span>📬</span>
      <span>${n.title}</span>
    </div>
  `).join('') : '<p style="color:var(--text2);font-size:.85rem">No new notifications</p>';
}

// ========================
// FILE SECTIONS
// ========================
function renderSection(section) {
  const data = getUserDataForUser();
  const files = data[section] || [];
  const folders = (data.folders || {})[section] || [];

  if (section === 'contacts') {
    const el = document.getElementById('contacts-list');
    el.innerHTML = '';
    if (!files.length) { el.innerHTML = emptyState('No VCF files yet. Upload a .vcf contact file.'); return; }
    files.forEach((f, i) => {
      el.appendChild(makeFileRow(f, i, section, '◎'));
    });
    return;
  }

  // Folders
  const folderEl = document.getElementById(section + '-folders');
  if (folderEl) {
    folderEl.innerHTML = '';
    folders.forEach(fname => {
      const ffiles = (data.folderFiles || {})[section + '_' + fname] || [];
      const card = document.createElement('div');
      card.className = 'folder-card';
      card.innerHTML = `<span class="folder-icon">📁</span><div><div class="folder-name">${fname}</div><div class="folder-count">${ffiles.length} files</div></div>`;
      card.onclick = () => openFolder(section, fname);
      folderEl.appendChild(card);
    });
  }

  if (section === 'photos') {
    const grid = document.getElementById('photos-grid');
    grid.innerHTML = '';
    if (!files.length) { grid.innerHTML = emptyState('No photos yet. Upload an image.'); return; }
    files.forEach((f, i) => grid.appendChild(makeFileCard(f, i, 'photos')));
  }
  if (section === 'videos') {
    const grid = document.getElementById('videos-grid');
    grid.innerHTML = '';
    if (!files.length) { grid.innerHTML = emptyState('No videos yet.'); return; }
    files.forEach((f, i) => grid.appendChild(makeFileCard(f, i, 'videos')));
  }
  if (section === 'music') {
    const list = document.getElementById('music-list');
    list.innerHTML = '';
    audioTracks = files;
    if (!files.length) { list.innerHTML = emptyState('No music yet.'); return; }
    files.forEach((f, i) => {
      const row = makeFileRow(f, i, 'music', '♫');
      const playBtn = document.createElement('button');
      playBtn.className = 'file-action-btn';
      playBtn.textContent = '▶ Play';
      playBtn.onclick = (e) => { e.stopPropagation(); playTrack(i); };
      row.querySelector('.file-row-actions').prepend(playBtn);
      list.appendChild(row);
    });
  }
  if (section === 'documents') {
    const list = document.getElementById('documents-list');
    list.innerHTML = '';
    if (!files.length) { list.innerHTML = emptyState('No documents yet.'); return; }
    files.forEach((f, i) => list.appendChild(makeFileRow(f, i, 'documents', fileIcon(f.name, 'document'))));
  }
}

function makeFileCard(f, i, section) {
  const card = document.createElement('div');
  card.className = 'file-card';
  const isImg = section === 'photos';
  const isVid = section === 'videos';

  let thumb = '';
  if (isImg && f.data) thumb = `<img src="${f.data}" loading="lazy"/>`;
  else if (isVid && f.data) thumb = `<video src="${f.data}" muted></video>`;
  else thumb = fileIcon(f.name, section);

  card.innerHTML = `
    <div class="file-thumb">${thumb}</div>
    <div class="file-card-info">
      <div class="file-card-name" title="${f.name}">${f.name}</div>
      <div class="file-card-actions">
        <button class="file-action-btn" onclick="previewFile(event,${JSON.stringify(JSON.stringify(f))},${JSON.stringify(section)})">👁 View</button>
        <button class="file-action-btn" onclick="downloadFile(event,${JSON.stringify(JSON.stringify(f))})">⬇ Save</button>
        <button class="file-action-btn" onclick="openSendModal(event,${JSON.stringify(JSON.stringify(f))})">→ Send</button>
        <button class="file-action-btn del" onclick="deleteFile(event,${i},${JSON.stringify(section)})">✕ Del</button>
      </div>
    </div>
  `;
  return card;
}

function makeFileRow(f, i, section, icon) {
  const row = document.createElement('div');
  row.className = 'file-row';
  row.innerHTML = `
    <span class="file-row-icon">${icon}</span>
    <div class="file-row-info">
      <div class="file-row-name">${f.name}</div>
      <div class="file-row-meta">${formatSize(f.size)} · ${timeAgo(f.addedAt)}</div>
    </div>
    <div class="file-row-actions">
      <button class="file-action-btn" onclick="downloadFile(event,${JSON.stringify(JSON.stringify(f))})">⬇ Download</button>
      <button class="file-action-btn" onclick="openSendModal(event,${JSON.stringify(JSON.stringify(f))})">→ Send</button>
      <button class="file-action-btn del" onclick="deleteFile(event,${i},${JSON.stringify(section)})">✕ Delete</button>
    </div>
  `;
  return row;
}

// ========================
// UPLOAD
// ========================
function handleUpload(event, section) {
  const files = Array.from(event.target.files);
  if (!files.length) return;
  const data = getUserDataForUser();
  let count = 0;

  const processFile = (file, idx) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const entry = {
        name: file.name,
        size: file.size,
        type: file.type,
        data: e.target.result,
        addedAt: Date.now(),
        id: Date.now() + '_' + idx
      };
      data[section].push(entry);
      count++;
      if (count === files.length) {
        saveDataForUser(data);
        renderSection(section);
        showToast(count + ' file' + (count > 1 ? 's' : '') + ' uploaded ✓');
        renderDashboard();
      }
    };
    reader.readAsDataURL(file);
  };

  files.forEach((f, i) => processFile(f, i));
  event.target.value = '';
}

// ========================
// DELETE FILE
// ========================
function deleteFile(event, index, section, folderKey) {
  event.stopPropagation();
  if (!confirm('Delete this file?')) return;
  const data = getUserDataForUser();
  if (folderKey) {
    data.folderFiles[folderKey].splice(index, 1);
  } else {
    data[section].splice(index, 1);
  }
  saveDataForUser(data);
  if (folderKey) renderFolderFiles();
  else renderSection(section);
  showToast('File deleted');
}

// ========================
// PREVIEW
// ========================
function previewFile(event, fStr, section) {
  event.stopPropagation();
  const f = JSON.parse(fStr);
  const modal = document.getElementById('previewModal');
  const content = document.getElementById('previewContent');
  const isImg = f.type && f.type.startsWith('image');
  const isVid = f.type && f.type.startsWith('video');
  const isAud = f.type && f.type.startsWith('audio');

  if (isImg) content.innerHTML = `<img src="${f.data}" alt="${f.name}"/>`;
  else if (isVid) content.innerHTML = `<video src="${f.data}" controls autoplay style="width:100%;border-radius:10px"></video>`;
  else if (isAud) content.innerHTML = `<div style="padding:30px;text-align:center"><div style="font-size:3rem;margin-bottom:16px">🎵</div><div style="font-weight:600;margin-bottom:16px">${f.name}</div><audio src="${f.data}" controls style="width:100%"></audio></div>`;
  else content.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text2)"><div style="font-size:4rem;margin-bottom:16px">${fileIcon(f.name,'document')}</div><div>${f.name}</div><br><a href="${f.data}" download="${f.name}" style="color:var(--accent)">Download file</a></div>`;

  document.getElementById('modalOverlay').classList.remove('hidden');
  modal.classList.remove('hidden');
}

function downloadFile(event, fStr) {
  event.stopPropagation();
  const f = JSON.parse(fStr);
  const a = document.createElement('a');
  a.href = f.data;
  a.download = f.name;
  a.click();
}

// ========================
// SEND FILE
// ========================
let pendingSendFile = null;

function openSendModal(event, fStr) {
  event.stopPropagation();
  pendingSendFile = JSON.parse(fStr);
  const email = prompt('Enter recipient email address (must be a NexVault user):');
  if (!email) return;
  sendFileTo(email.trim().toLowerCase(), pendingSendFile);
}

function sendFileTo(toEmail, file) {
  const users = getUsers();
  if (!users[toEmail]) { showToast('User not found on NexVault'); return; }
  if (toEmail === currentUser.email) { showToast('Cannot send to yourself'); return; }

  const recipientData = getUserData(toEmail);
  if (!recipientData.notifications) recipientData.notifications = [];

  const notif = {
    id: Date.now(),
    from: currentUser.username,
    fromEmail: currentUser.email,
    toEmail: toEmail,
    file: { name: file.name, size: file.size, type: file.type, data: file.data },
    title: 'You received a file from ' + currentUser.username,
    body: file.name,
    read: false,
    accepted: false,
    time: Date.now()
  };

  recipientData.notifications.push(notif);
  saveUserData(toEmail, recipientData);
  showToast('File sent to ' + users[toEmail].username + ' ✓');
}

// ========================
// NOTIFICATIONS
// ========================
function renderNotifications() {
  const data = getUserDataForUser();
  const notifs = (data.notifications || []).reverse();
  const list = document.getElementById('notif-list');
  list.innerHTML = '';
  updateNotifBadge();

  if (!notifs.length) {
    list.innerHTML = emptyState('No notifications yet');
    return;
  }

  notifs.forEach((n, i) => {
    const item = document.createElement('div');
    item.className = 'notif-item' + (!n.read ? ' unread' : '');
    const accepted = n.accepted;
    item.innerHTML = `
      <div class="notif-icon">📬</div>
      <div class="notif-body">
        <div class="notif-title">${n.title || 'Notification'}</div>
        <div class="notif-sub">${n.body || ''}</div>
        <div class="notif-time">${timeAgo(n.time)}</div>
        ${!accepted ? `<div class="notif-actions">
          <button class="btn-sm" onclick="acceptNotifFile(${JSON.stringify(i)})">Accept & Download ✓</button>
          <button class="btn-sm danger" onclick="dismissNotif(${JSON.stringify(i)})">Dismiss</button>
        </div>` : `<div style="font-size:0.78rem;color:var(--success);margin-top:6px">✓ File accepted & saved</div>`}
      </div>
      <button class="btn-sm danger" style="align-self:flex-start" onclick="deleteNotif(${JSON.stringify(i)})">✕</button>
    `;
    list.appendChild(item);
  });
}

function acceptNotifFile(revIdx) {
  const data = getUserDataForUser();
  const notifs = [...data.notifications].reverse();
  const notif = notifs[revIdx];
  if (!notif || !notif.file) return;

  const f = notif.file;
  const section = detectSection(f);
  const entry = { name: f.name, size: f.size, type: f.type, data: f.data, addedAt: Date.now(), id: Date.now() };
  data[section].push(entry);

  // Mark read & accepted (find in original array)
  const origIdx = data.notifications.length - 1 - revIdx;
  data.notifications[origIdx].read = true;
  data.notifications[origIdx].accepted = true;

  saveDataForUser(data);
  renderNotifications();
  showToast('File saved to ' + section + ' ✓');
}

function dismissNotif(revIdx) {
  const data = getUserDataForUser();
  const origIdx = data.notifications.length - 1 - revIdx;
  data.notifications[origIdx].read = true;
  saveDataForUser(data);
  renderNotifications();
}

function deleteNotif(revIdx) {
  const data = getUserDataForUser();
  const origIdx = data.notifications.length - 1 - revIdx;
  data.notifications.splice(origIdx, 1);
  saveDataForUser(data);
  renderNotifications();
}

function clearAllNotifications() {
  if (!confirm('Clear all notifications?')) return;
  const data = getUserDataForUser();
  data.notifications = [];
  saveDataForUser(data);
  renderNotifications();
}

function updateNotifBadge() {
  const data = getUserDataForUser();
  const unread = (data.notifications || []).filter(n => !n.read).length;
  const badge = document.getElementById('notifBadge');
  badge.textContent = unread;
  badge.classList.toggle('hidden', unread === 0);
}

function detectSection(f) {
  const t = (f.type || '').toLowerCase();
  const n = (f.name || '').toLowerCase();
  if (t.startsWith('image')) return 'photos';
  if (t.startsWith('audio')) return 'music';
  if (t.startsWith('video')) return 'videos';
  if (n.endsWith('.vcf')) return 'contacts';
  return 'documents';
}

// ========================
// NOTIFICATION POLLER (checks for incoming)
// ========================
function startNotifPoller() {
  setInterval(() => {
    updateNotifBadge();
    checkIncomingFiles();
  }, 3000);
}

let lastNotifCount = 0;
function checkIncomingFiles() {
  const data = getUserDataForUser();
  const unread = (data.notifications || []).filter(n => !n.read);
  if (unread.length > lastNotifCount) {
    const newest = unread[unread.length - 1];
    showIncomingPopup(newest);
    playNotifSound();
    lastNotifCount = unread.length;
  } else {
    lastNotifCount = unread.length;
  }
  updateNotifBadge();
}

function showIncomingPopup(notif) {
  pendingIncoming = notif;
  document.getElementById('popupSender').textContent = notif.from || 'Someone';
  document.getElementById('popupMessage').textContent = ' sent you: ' + (notif.body || 'a file');
  document.getElementById('incomingPopup').classList.remove('hidden');
  setTimeout(() => dismissPopup(), 12000);
}

function dismissPopup() {
  document.getElementById('incomingPopup').classList.add('hidden');
}

function acceptFile() {
  dismissPopup();
  showPage('notifications', null);
}

function playNotifSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch(e) {}
}

// ========================
// FOLDERS
// ========================
function createFolder(section) {
  const name = prompt('Enter folder name:');
  if (!name || !name.trim()) return;
  const data = getUserDataForUser();
  if (!data.folders) data.folders = {};
  if (!data.folders[section]) data.folders[section] = [];
  if (data.folders[section].includes(name.trim())) { showToast('Folder already exists'); return; }
  data.folders[section].push(name.trim());
  saveDataForUser(data);
  renderSection(section);
  showToast('Folder "' + name + '" created ✓');
}

function openFolder(section, folderName) {
  currentFolderSection = section;
  currentFolderName = folderName;

  const prevPage = currentPage;
  showPage('folder', null);
  document.getElementById('folderViewTitle').textContent = '📁 ' + folderName;
  document.getElementById('topbarTitle').textContent = folderName;

  const delBtn = document.getElementById('deleteFolderBtn');
  delBtn.onclick = () => deleteFolder(section, folderName);

  const uploadInput = document.getElementById('folderUploadInput');
  uploadInput.accept = section === 'photos' ? 'image/*' : section === 'music' ? 'audio/*' : section === 'videos' ? 'video/*' : '*';

  renderFolderFiles();
}

function renderFolderFiles() {
  const data = getUserDataForUser();
  const key = currentFolderSection + '_' + currentFolderName;
  const files = (data.folderFiles || {})[key] || [];
  const grid = document.getElementById('folder-files');
  grid.innerHTML = '';

  if (!files.length) { grid.innerHTML = emptyState('Folder is empty. Add files using the button above.'); return; }

  files.forEach((f, i) => {
    const isImg = (f.type||'').startsWith('image');
    const isVid = (f.type||'').startsWith('video');
    let thumb = isImg && f.data ? `<img src="${f.data}" loading="lazy"/>` : isVid && f.data ? `<video src="${f.data}" muted></video>` : fileIcon(f.name, currentFolderSection);

    const card = document.createElement('div');
    card.className = 'file-card';
    card.innerHTML = `
      <div class="file-thumb">${thumb}</div>
      <div class="file-card-info">
        <div class="file-card-name">${f.name}</div>
        <div class="file-card-actions">
          <button class="file-action-btn" onclick="downloadFile(event,${JSON.stringify(JSON.stringify(f))})">⬇ Save</button>
          <button class="file-action-btn" onclick="openSendModal(event,${JSON.stringify(JSON.stringify(f))})">→ Send</button>
          <button class="file-action-btn del" onclick="deleteFolderFile(event,${i})">✕ Del</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function handleFolderUpload(event) {
  const files = Array.from(event.target.files);
  if (!files.length) return;
  const data = getUserDataForUser();
  const key = currentFolderSection + '_' + currentFolderName;
  if (!data.folderFiles) data.folderFiles = {};
  if (!data.folderFiles[key]) data.folderFiles[key] = [];

  let count = 0;
  files.forEach((file, idx) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      data.folderFiles[key].push({ name: file.name, size: file.size, type: file.type, data: e.target.result, addedAt: Date.now(), id: Date.now() + '_' + idx });
      count++;
      if (count === files.length) {
        saveDataForUser(data);
        renderFolderFiles();
        showToast(count + ' file(s) added to folder ✓');
        // Update folder count display
        document.querySelector('.folder-count') && (document.querySelector('.folder-count').textContent = data.folderFiles[key].length + ' files');
      }
    };
    reader.readAsDataURL(file);
  });
  event.target.value = '';
}

function deleteFolderFile(event, i) {
  event.stopPropagation();
  if (!confirm('Delete this file?')) return;
  const data = getUserDataForUser();
  const key = currentFolderSection + '_' + currentFolderName;
  data.folderFiles[key].splice(i, 1);
  saveDataForUser(data);
  renderFolderFiles();
  showToast('File deleted');
}

function deleteFolder(section, folderName) {
  if (!confirm('Delete folder "' + folderName + '" and all its files?')) return;
  const data = getUserDataForUser();
  data.folders[section] = data.folders[section].filter(f => f !== folderName);
  delete (data.folderFiles || {})[section + '_' + folderName];
  saveDataForUser(data);
  closeFolder();
  showToast('Folder deleted');
}

function closeFolder() {
  currentFolderSection = null;
  currentFolderName = null;
  showPage(currentPage === 'folder' ? 'dashboard' : currentPage, null);
}

// ========================
// LINKS
// ========================
function renderLinks() {
  const data = getUserDataForUser();
  const links = data.links || [];
  const el = document.getElementById('links-list');
  el.innerHTML = '';
  if (!links.length) { el.innerHTML = emptyState('No links saved yet.'); return; }
  links.forEach((l, i) => {
    const card = document.createElement('div');
    card.className = 'link-card';
    card.innerHTML = `
      <div class="link-card-icon">🔗</div>
      <div class="link-card-name">${l.name}</div>
      <div class="link-card-url">${l.url}</div>
      <div class="link-card-actions">
        <a href="${l.url}" target="_blank" rel="noopener">Open →</a>
        <a href="#" onclick="deleteLink(event,${i})">Delete</a>
      </div>
    `;
    el.appendChild(card);
  });
}

function showAddLink() {
  document.getElementById('addLinkModal').classList.remove('hidden');
  document.getElementById('modalOverlay').classList.remove('hidden');
  document.getElementById('linkName').value = '';
  document.getElementById('linkUrl').value = '';
}

function addLink() {
  const name = document.getElementById('linkName').value.trim();
  const url = document.getElementById('linkUrl').value.trim();
  if (!name || !url) { showToast('Please fill both fields'); return; }
  const data = getUserDataForUser();
  if (!data.links) data.links = [];
  data.links.push({ name, url, addedAt: Date.now() });
  saveDataForUser(data);
  closeModal();
  renderLinks();
  showToast('Link added ✓');
}

function deleteLink(event, i) {
  event.preventDefault();
  if (!confirm('Remove this link?')) return;
  const data = getUserDataForUser();
  data.links.splice(i, 1);
  saveDataForUser(data);
  renderLinks();
  showToast('Link removed');
}

// ========================
// TRANSFER
// ========================
function renderTransfer() {
  const data = getUserDataForUser();
  const all = [
    ...data.photos.map(f => ({ ...f, _section: 'photos' })),
    ...data.music.map(f => ({ ...f, _section: 'music' })),
    ...data.videos.map(f => ({ ...f, _section: 'videos' })),
    ...data.documents.map(f => ({ ...f, _section: 'documents' })),
    ...data.contacts.map(f => ({ ...f, _section: 'contacts' })),
  ];
  const sel = document.getElementById('transferFile');
  sel.innerHTML = '<option value="">— Choose a file —</option>';
  all.forEach((f, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = '[' + f._section + '] ' + f.name;
    opt.dataset.file = JSON.stringify(f);
    sel.appendChild(opt);
  });
}

function sendTransfer() {
  const email = document.getElementById('transferEmail').value.trim().toLowerCase();
  const sel = document.getElementById('transferFile');
  const opt = sel.options[sel.selectedIndex];
  if (!email) { showToast('Enter recipient email'); return; }
  if (!opt || !opt.dataset.file) { showToast('Select a file'); return; }
  const f = JSON.parse(opt.dataset.file);
  sendFileTo(email, f);
  document.getElementById('transferEmail').value = '';
  sel.selectedIndex = 0;
}

// ========================
// UTILS
// ========================
function emptyState(msg) {
  return `<div class="empty-state"><div class="es-icon">☁</div><p>${msg}</p></div>`;
}

function fileIcon(name, section) {
  const n = (name || '').toLowerCase();
  if (n.endsWith('.pdf')) return '📄';
  if (n.endsWith('.doc') || n.endsWith('.docx')) return '📝';
  if (n.endsWith('.xls') || n.endsWith('.xlsx')) return '📊';
  if (n.endsWith('.txt')) return '📃';
  if (n.endsWith('.apk')) return '🤖';
  if (n.endsWith('.exe')) return '🖥';
  if (n.endsWith('.vcf')) return '👤';
  if (n.endsWith('.mp3') || n.endsWith('.wav') || n.endsWith('.flac') || n.endsWith('.ogg')) return '🎵';
  if (n.endsWith('.mp4') || n.endsWith('.mov') || n.endsWith('.avi') || n.endsWith('.mkv')) return '🎬';
  if (section === 'photos') return '🖼';
  if (section === 'music') return '🎵';
  if (section === 'videos') return '🎬';
  return '📁';
}

function formatSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + 'KB';
  if (bytes < 1024*1024*1024) return (bytes/(1024*1024)).toFixed(1) + 'MB';
  return (bytes/(1024*1024*1024)).toFixed(1) + 'GB';
}

function timeAgo(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return Math.floor(diff/60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff/3600000) + 'h ago';
  return Math.floor(diff/86400000) + 'd ago';
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(t._timeout);
  t._timeout = setTimeout(() => t.classList.add('hidden'), 3000);
}

function togglePass(id, btn) {
  const input = document.getElementById(id);
  const isText = input.type === 'text';
  input.type = isText ? 'password' : 'text';
  btn.textContent = isText ? '👁' : '🙈';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  const prev = document.getElementById('previewContent');
  if (prev) prev.innerHTML = '';
}

// ========================
// MUSIC PLAYER
// ========================
function playTrack(index) {
  audioIndex = index;
  const f = audioTracks[index];
  if (!f || !f.data) return;
  const audio = document.getElementById('audioPlayer');
  audio.src = f.data;
  audio.play();
  document.getElementById('playerTitle').textContent = f.name;
  document.getElementById('playerBar').classList.remove('hidden');
  document.getElementById('playPauseBtn').textContent = '⏸';
}

function togglePlay() {
  const audio = document.getElementById('audioPlayer');
  const btn = document.getElementById('playPauseBtn');
  if (audio.paused) { audio.play(); btn.textContent = '⏸'; }
  else { audio.pause(); btn.textContent = '▶'; }
}

function prevTrack() {
  if (!audioTracks.length) return;
  audioIndex = (audioIndex - 1 + audioTracks.length) % audioTracks.length;
  playTrack(audioIndex);
}

function nextTrack() {
  if (!audioTracks.length) return;
  audioIndex = (audioIndex + 1) % audioTracks.length;
  playTrack(audioIndex);
}

// ========================
// KEYBOARD SHORTCUTS
// ========================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ========================
// SIDEBAR OVERLAY INJECT
// ========================
(function injectSidebarOverlay() {
  const o = document.createElement('div');
  o.id = 'sidebarOverlay';
  o.onclick = closeMobileSidebar;
  document.body.appendChild(o);
})();

console.log('%c NexVault v1.0 | Developer: Kerolos Adly © 2026 ', 'background:#6c63ff;color:#fff;font-size:14px;padding:8px 16px;border-radius:6px;');
