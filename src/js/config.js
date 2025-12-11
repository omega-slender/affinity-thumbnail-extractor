export const CONFIG = Object.freeze({
    SUPPORTED_EXTENSIONS: ['.afphoto', '.afdesign', '.afpub', '.af'],
    MAX_FILE_SIZE: 500 * 1024 * 1024,
    PNG_SIGNATURE: new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    PNG_IEND: new Uint8Array([0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82]),
    TOAST_DURATION: 3000,
    SELECTION_STRATEGY: 'smallest',
});

export const ERROR_MESSAGES = Object.freeze({
    INVALID_FILE_TYPE: 'Please select a valid Affinity file (.afphoto, .afdesign, .afpub or .af).',
    FILE_TOO_LARGE: 'File is too large. Maximum size is 500MB.',
    NO_PNG_FOUND: 'No PNG thumbnails found in this file.',
    READ_ERROR: 'Failed to read the file. Please try again.',
    CLIPBOARD_ERROR: 'Failed to copy image to clipboard.',
    CLIPBOARD_NOT_SUPPORTED: 'Clipboard API is not supported in your browser.',
});
