import { AffinityThumbnailExtractor } from './app.js';

function initializeApp() {
    try {
        new AffinityThumbnailExtractor();
        console.log('Affinity Thumbnail Extractor initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
