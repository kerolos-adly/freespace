export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  avatar?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // base64
  uploadedAt: string;
  category: 'photos' | 'music' | 'contacts' | 'videos' | 'documents' | 'apk' | 'exe' | 'other';
  folderId?: string;
  userId: string;
}

export interface Folder {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  userId: string;
}

export interface Link {
  id: string;
  title: string;
  url: string;
  createdAt: string;
  userId: string;
}

export interface Notification {
  id: string;
  toUserId: string;
  fromUserId: string;
  fromUsername: string;
  fileId: string;
  fileName: string;
  fileType: string;
  fileData: string;
  fileCategory: string;
  fileSize: number;
  message: string;
  read: boolean;
  accepted: boolean;
  createdAt: string;
}

export type ActiveSection =
  | 'dashboard'
  | 'photos'
  | 'music'
  | 'contacts'
  | 'videos'
  | 'documents'
  | 'apk'
  | 'exe'
  | 'links'
  | 'notifications'
  | 'about';
