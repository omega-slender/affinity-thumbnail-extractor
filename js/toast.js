import { CONFIG } from './config.js';

export class Toast {
    static _element = null;
    static _messageElement = null;
    static _timeout = null;
    
    static init() {
        this._element = document.getElementById('toast');
        this._messageElement = document.getElementById('toastMessage');
    }
    
    static show(message, type = 'default', duration = CONFIG.TOAST_DURATION) {
        if (!this._element) this.init();
        
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
        
        this._element.classList.remove('toast--visible', 'toast--success', 'toast--error');
        
        this._messageElement.textContent = message;
        if (type !== 'default') {
            this._element.classList.add(`toast--${type}`);
        }
        
        this._element.hidden = false;
        void this._element.offsetWidth;
        this._element.classList.add('toast--visible');
        
        this._timeout = setTimeout(() => this.hide(), duration);
    }
    
    static hide() {
        if (!this._element) return;
        
        this._element.classList.remove('toast--visible');
        setTimeout(() => {
            this._element.hidden = true;
        }, 300);
    }
}
