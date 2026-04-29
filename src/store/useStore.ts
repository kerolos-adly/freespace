import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { User, FileItem, Folder, Link, Notification, ActiveSection } from '../types';

interface AppState {
  // Auth
  users: User[];
  currentUser: User | null;
  rememberMe: boolean;

  // Data
  files: FileItem[];
  folders: Folder[];
  links: Link[];
  notifications: Notification[];

  // UI
  activeSection: ActiveSection;
  sidebarOpen: boolean;

  // Auth actions
  register: (username: string, email: string, password: string) => { success: boolean; error?: string };
  login: (email: string, password: string, remember: boolean) => { success: boolean; error?: string };
  logout: () => void;

  // File actions
  addFile: (file: Omit<FileItem, 'id' | 'uploadedAt'>) => void;
  deleteFile: (id: string) => void;
  moveFileToFolder: (fileId: string, folderId: string | undefined) => void;

  // Folder actions
  addFolder: (name: string, category: string) => void;
  deleteFolder: (id: string) => void;

  // Link actions
  addLink: (title: string, url: string) => void;
  deleteLink: (id: string) => void;

  // Notification actions
  sendFile: (toEmail: string, fileId: string) => { success: boolean; error?: string };
  markNotificationRead: (id: string) => void;
  acceptNotification: (id: string) => void;
  deleteNotification: (id: string) => void;

  // UI actions
  setActiveSection: (section: ActiveSection) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Getters
  getUserFiles: () => FileItem[];
  getUserFolders: () => Folder[];
  getUserLinks: () => Link[];
  getUserNotifications: () => Notification[];
  getUnreadCount: () => number;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
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
        if (users.find(u => u.email.toLowerCase() === emailLower)) {
          return { success: false, error: 'This email is already registered. Each email can only be used once.' };
        }
        if (users.find(u => u.username.toLowerCase() === username.toLowerCase().trim())) {
          return { success: false, error: 'This username is already taken.' };
        }
        const newUser: User = {
          id: uuidv4(),
          username: username.trim(),
          email: emailLower,
          password,
          createdAt: new Date().toISOString(),
        };
        set({ users: [...users, newUser] });
        return { success: true };
      },

      login: (email, password, remember) => {
        const { users } = get();
        const user = users.find(
          u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
        );
        if (!user) {
          return { success: false, error: 'Invalid email or password.' };
        }
        set({ currentUser: user, rememberMe: remember });
        return { success: true };
      },

      logout: () => {
        set({ currentUser: null, activeSection: 'dashboard', sidebarOpen: true });
      },

      addFile: (file) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const newFile: FileItem = {
          ...file,
          id: uuidv4(),
          uploadedAt: new Date().toISOString(),
          userId: file.userId || currentUser.id,
        };
        set(state => ({ files: [...state.files, newFile] }));
      },

      deleteFile: (id) => {
        set(state => ({ files: state.files.filter(f => f.id !== id) }));
      },

      moveFileToFolder: (fileId, folderId) => {
        set(state => ({
          files: state.files.map(f => f.id === fileId ? { ...f, folderId } : f),
        }));
      },

      addFolder: (name, category) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const newFolder: Folder = {
          id: uuidv4(),
          name,
          category,
          createdAt: new Date().toISOString(),
          userId: currentUser.id,
        };
        set(state => ({ folders: [...state.folders, newFolder] }));
      },

      deleteFolder: (id) => {
        set(state => ({
          folders: state.folders.filter(f => f.id !== id),
          files: state.files.map(f => f.folderId === id ? { ...f, folderId: undefined } : f),
        }));
      },

      addLink: (title, url) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const newLink: Link = {
          id: uuidv4(),
          title,
          url,
          createdAt: new Date().toISOString(),
          userId: currentUser.id,
        };
        set(state => ({ links: [...state.links, newLink] }));
      },

      deleteLink: (id) => {
        set(state => ({ links: state.links.filter(l => l.id !== id) }));
      },

      sendFile: (toEmail, fileId) => {
        const { currentUser, users, files } = get();
        if (!currentUser) return { success: false, error: 'Not logged in.' };
        const recipient = users.find(u => u.email.toLowerCase() === toEmail.toLowerCase().trim());
        if (!recipient) return { success: false, error: 'No user found with that email address.' };
        if (recipient.id === currentUser.id) return { success: false, error: 'You cannot send a file to yourself.' };
        const file = files.find(f => f.id === fileId && f.userId === currentUser.id);
        if (!file) return { success: false, error: 'File not found.' };
        const notification: Notification = {
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
          message: `You received a file from ${currentUser.username}`,
          read: false,
          accepted: false,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ notifications: [...state.notifications, notification] }));
        return { success: true };
      },

      markNotificationRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      acceptNotification: (id) => {
        const { notifications, currentUser } = get();
        const notif = notifications.find(n => n.id === id);
        if (!notif || !currentUser) return;

        // Add file to user's library
        const newFile: FileItem = {
          id: uuidv4(),
          name: notif.fileName,
          type: notif.fileType,
          size: notif.fileSize,
          data: notif.fileData,
          uploadedAt: new Date().toISOString(),
          category: notif.fileCategory as FileItem['category'],
          userId: currentUser.id,
        };

        set(state => ({
          files: [...state.files, newFile],
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, accepted: true, read: true } : n
          ),
        }));
      },

      deleteNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },

      setActiveSection: (section) => set({ activeSection: section }),
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      getUserFiles: () => {
        const { files, currentUser } = get();
        if (!currentUser) return [];
        return files.filter(f => f.userId === currentUser.id);
      },

      getUserFolders: () => {
        const { folders, currentUser } = get();
        if (!currentUser) return [];
        return folders.filter(f => f.userId === currentUser.id);
      },

      getUserLinks: () => {
        const { links, currentUser } = get();
        if (!currentUser) return [];
        return links.filter(l => l.userId === currentUser.id);
      },

      getUserNotifications: () => {
        const { notifications, currentUser } = get();
        if (!currentUser) return [];
        return notifications.filter(n => n.toUserId === currentUser.id);
      },

      getUnreadCount: () => {
        const { notifications, currentUser } = get();
        if (!currentUser) return 0;
        return notifications.filter(n => n.toUserId === currentUser.id && !n.read).length;
      },
    }),
    {
      name: 'nexvault-storage',
      partialize: (state) => ({
        users: state.users,
        currentUser: state.rememberMe ? state.currentUser : null,
        rememberMe: state.rememberMe,
        files: state.files,
        folders: state.folders,
        links: state.links,
        notifications: state.notifications,
      }),
    }
  )
);
