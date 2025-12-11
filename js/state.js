export class AppState {
    constructor() {
        this._state = {
            currentFile: null,
            extractedImage: null,
            imageBlob: null,
            isProcessing: false,
            hasError: false,
        };
        
        this._listeners = new Set();
    }
    
    get state() {
        return { ...this._state };
    }
    
    update(updates) {
        this._state = { ...this._state, ...updates };
        this._notify();
    }
    
    subscribe(listener) {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }
    
    _notify() {
        this._listeners.forEach(listener => listener(this.state));
    }
    
    reset() {
        if (this._state.extractedImage) {
            URL.revokeObjectURL(this._state.extractedImage);
        }
        
        this.update({
            currentFile: null,
            extractedImage: null,
            imageBlob: null,
            isProcessing: false,
            hasError: false,
        });
    }
}
