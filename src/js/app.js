import { CONFIG, ERROR_MESSAGES } from './config.js';
import { AppState } from './state.js';
import { PNGExtractor } from './png-extractor.js';
import { Toast } from './toast.js';
import { formatFileSize, isValidFileType, generateDownloadName } from './utils.js';

export class AffinityThumbnailExtractor {
    constructor() {
        this.state = new AppState();
        this.elements = {};
        
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.state.subscribe(this.render.bind(this));
        Toast.init();
    }
    
    cacheElements() {
        this.elements = {
            dropzone: document.getElementById('dropzone'),
            dropzoneContent: document.getElementById('dropzoneContent'),
            fileInput: document.getElementById('fileInput'),
            loadingState: document.getElementById('loadingState'),
            fileInfo: document.getElementById('fileInfo'),
            fileName: document.getElementById('fileName'),
            fileSize: document.getElementById('fileSize'),
            removeFile: document.getElementById('removeFile'),
            resultSection: document.getElementById('resultSection'),
            previewImage: document.getElementById('previewImage'),
            imageMeta: document.getElementById('imageMeta'),
            downloadBtn: document.getElementById('downloadBtn'),
            copyBtn: document.getElementById('copyBtn'),
            errorSection: document.getElementById('errorSection'),
            errorMessage: document.getElementById('errorMessage'),
            retryBtn: document.getElementById('retryBtn'),
        };
    }
    
    bindEvents() {
        const { dropzone, fileInput, removeFile, copyBtn, retryBtn } = this.elements;
        
        dropzone.addEventListener('click', (e) => {
            if (e.target !== fileInput) {
                fileInput.click();
            }
        });
        dropzone.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInput.click();
            }
        });
        
        dropzone.addEventListener('dragover', this.handleDragOver.bind(this));
        dropzone.addEventListener('dragleave', this.handleDragLeave.bind(this));
        dropzone.addEventListener('drop', this.handleDrop.bind(this));
        
        fileInput.addEventListener('click', (e) => e.stopPropagation());
        fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        
        removeFile.addEventListener('click', this.handleRemoveFile.bind(this));
        copyBtn.addEventListener('click', this.handleCopyToClipboard.bind(this));
        retryBtn.addEventListener('click', this.handleRetry.bind(this));
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        this.elements.dropzone.classList.add('dropzone--active');
    }
    
    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        this.elements.dropzone.classList.remove('dropzone--active');
    }
    
    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.elements.dropzone.classList.remove('dropzone--active');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }
    
    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }
    
    handleRemoveFile(e) {
        e.stopPropagation();
        this.state.reset();
        this.elements.fileInput.value = '';
    }
    
    handleRetry() {
        this.state.reset();
        this.elements.fileInput.value = '';
    }
    
    async handleCopyToClipboard() {
        const { imageBlob } = this.state.state;
        
        if (!imageBlob) return;
        
        try {
            if (!navigator.clipboard || !navigator.clipboard.write) {
                throw new Error(ERROR_MESSAGES.CLIPBOARD_NOT_SUPPORTED);
            }
            
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': imageBlob })
            ]);
            
            Toast.show('Image copied to clipboard!', 'success');
        } catch (error) {
            console.error('Clipboard error:', error);
            Toast.show(ERROR_MESSAGES.CLIPBOARD_ERROR, 'error');
        }
    }
    
    async processFile(file) {
        if (!isValidFileType(file)) {
            this.showError(ERROR_MESSAGES.INVALID_FILE_TYPE);
            return;
        }
        
        if (file.size > CONFIG.MAX_FILE_SIZE) {
            this.showError(ERROR_MESSAGES.FILE_TOO_LARGE);
            return;
        }
        
        this.state.update({
            currentFile: file,
            isProcessing: true,
            hasError: false,
            extractedImage: null,
            imageBlob: null,
        });
        
        try {
            const arrayBuffer = await file.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);
            
            const images = PNGExtractor.extractAll(data);
            
            if (images.length === 0) {
                throw new Error(ERROR_MESSAGES.NO_PNG_FOUND);
            }
            
            const selectedImage = PNGExtractor.selectBest(images);
            
            if (!selectedImage) {
                throw new Error(ERROR_MESSAGES.NO_PNG_FOUND);
            }
            
            const blob = new Blob([selectedImage], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(blob);
            
            this.state.update({
                isProcessing: false,
                extractedImage: imageUrl,
                imageBlob: blob,
            });
            
        } catch (error) {
            console.error('Processing error:', error);
            this.showError(error.message || ERROR_MESSAGES.READ_ERROR);
        }
    }
    
    showError(message) {
        this.state.update({
            isProcessing: false,
            hasError: true,
            extractedImage: null,
            imageBlob: null,
        });
        this.elements.errorMessage.textContent = message;
    }
    
    render(state) {
        const { currentFile, extractedImage, isProcessing, hasError } = state;
        
        this.elements.loadingState.hidden = !isProcessing;
        this.elements.dropzoneContent.hidden = isProcessing;
        
        if (currentFile && !hasError) {
            this.elements.fileInfo.hidden = false;
            this.elements.fileName.textContent = currentFile.name;
            this.elements.fileSize.textContent = formatFileSize(currentFile.size);
        } else {
            this.elements.fileInfo.hidden = true;
        }
        
        if (extractedImage) {
            this.elements.resultSection.hidden = false;
            this.elements.previewImage.src = extractedImage;
            this.elements.downloadBtn.href = extractedImage;
            this.elements.downloadBtn.download = generateDownloadName(currentFile.name);
            
            this.elements.previewImage.onload = () => {
                const { naturalWidth, naturalHeight } = this.elements.previewImage;
                this.elements.imageMeta.textContent = `${naturalWidth} × ${naturalHeight} px`;
            };
        } else {
            this.elements.resultSection.hidden = true;
        }
        
        this.elements.errorSection.hidden = !hasError;
        
        if (hasError) {
            this.elements.dropzone.classList.add('dropzone--error');
        } else {
            this.elements.dropzone.classList.remove('dropzone--error');
        }
    }
}
