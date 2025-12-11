import { CONFIG } from './config.js';

export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const units = ['Bytes', 'KB', 'MB', 'GB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
}

export function isValidFileType(file) {
    const fileName = file.name.toLowerCase();
    return CONFIG.SUPPORTED_EXTENSIONS.some(ext => fileName.endsWith(ext));
}

export function generateDownloadName(originalName) {
    return originalName.replace(/\.(afphoto|afdesign|afpub|af)$/i, '_thumbnail.png');
}

export function bytesMatch(arr1, arr2, offset = 0) {
    for (let i = 0; i < arr2.length; i++) {
        if (arr1[offset + i] !== arr2[i]) return false;
    }
    return true;
}
