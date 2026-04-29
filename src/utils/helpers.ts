export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getFileCategory(file: File): string {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  if (type.startsWith('image/')) return 'photos';
  if (type.startsWith('audio/') || name.endsWith('.mp3') || name.endsWith('.wav') || name.endsWith('.flac') || name.endsWith('.ogg') || name.endsWith('.aac') || name.endsWith('.m4a')) return 'music';
  if (type.startsWith('video/') || name.endsWith('.mp4') || name.endsWith('.mkv') || name.endsWith('.avi') || name.endsWith('.mov') || name.endsWith('.webm')) return 'videos';
  if (name.endsWith('.vcf')) return 'contacts';
  if (name.endsWith('.apk')) return 'apk';
  if (name.endsWith('.exe')) return 'exe';
  if (
    type === 'application/pdf' ||
    type.includes('word') ||
    type.includes('excel') ||
    type.includes('spreadsheet') ||
    type.includes('document') ||
    name.endsWith('.pdf') ||
    name.endsWith('.doc') ||
    name.endsWith('.docx') ||
    name.endsWith('.xls') ||
    name.endsWith('.xlsx') ||
    name.endsWith('.txt') ||
    name.endsWith('.csv')
  ) return 'documents';

  return 'other';
}

export function downloadFile(data: string, name: string, _type?: string) {
  const link = document.createElement('a');
  link.href = data;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    photos: '🖼️',
    music: '🎵',
    contacts: '👤',
    videos: '🎬',
    documents: '📄',
    apk: '📱',
    exe: '💻',
    links: '🔗',
    other: '📁',
  };
  return icons[category] || '📁';
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    photos: 'from-pink-500 to-rose-500',
    music: 'from-purple-500 to-violet-500',
    contacts: 'from-emerald-500 to-teal-500',
    videos: 'from-blue-500 to-cyan-500',
    documents: 'from-amber-500 to-orange-500',
    apk: 'from-green-500 to-emerald-500',
    exe: 'from-slate-500 to-gray-500',
    links: 'from-indigo-500 to-blue-500',
    other: 'from-gray-400 to-slate-400',
  };
  return colors[category] || 'from-gray-400 to-slate-400';
}
