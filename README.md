# Affinity Thumbnail Extractor 🖼️✨

A modern, client-side web application for extracting PNG thumbnails from Affinity design files. Built with vanilla JavaScript and optimized for performance and accessibility.

## 🎯 Overview

Extract embedded PNG thumbnails from Affinity Photo (.afphoto), Affinity Designer (.afdesign), Affinity Publisher (.afpub), and Affinity 2 (.af) files directly in your browser. No server uploads, no data tracking: everything happens locally on your device. 🔒

## ✨ Features

### 🚀 Core Functionality
- **Multi-format Support**: Works with `.afphoto`, `.afdesign`, `.afpub`, and `.af` files
- **Instant Processing** ⚡: Fast extraction using optimized binary parsing
- **Local Processing** 🔐: All operations run client-side; files never leave your device
- **PNG Export** 💾: Download extracted thumbnails instantly
- **Clipboard Support** 📋: Copy thumbnails directly to clipboard

### 🎨 User Experience
- **Drag & Drop** 🖱️: Drop files directly onto the interface
- **Animated Background** 🌈: Smooth gradient animation with interactive particles
- **Responsive Design** 📱: Optimized for desktop and mobile devices
- **Toast Notifications** 🔔: Clear feedback for all actions
- **Accessibility** ♿: Full keyboard navigation and screen reader support
- **Reduced Motion** 🎬: Respects user motion preferences

### ⚙️ Technical Features
- Zero dependencies (vanilla JavaScript) 🚫📦
- Hardware-accelerated canvas rendering 🎮
- High-DPI display support 🖥️
- File size validation (up to 500MB) 📏
- Efficient memory management 🧠

## 🌐 Demo

**[✨ Try it live →](https://omega-slender.github.io/affinity-thumbnail-extractor/)**

## 🛠️ Usage

1. **Open the application** in any modern web browser 🌍
2. **Select or drag** your Affinity file (`.afphoto`, `.afdesign`, `.afpub`, `.af`) 📂
3. **View** the extracted thumbnail preview 👀
4. **Download** as PNG or **copy** to clipboard 💾

## 🌍 Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

## 🔧 Technical Details

### 🔍 PNG Extraction
The application searches for PNG signatures within the binary data of Affinity files and extracts complete PNG images. It automatically selects the smallest PNG (typically the thumbnail) for display.

## 💖 Credits

This project was inspired by [v_kyr's Python implementation](https://forum.affinity.serif.com/index.php?/topic/180457-afthumbs-extracting-png-thumbnails-from-afphoto-and-afdesign-files/) for extracting PNG thumbnails from Affinity files.

## 👨‍💻 Author

Created by **Omega Slender**

💬 Connect with me:  
[🌳 Linktree](https://linktr.ee/omega_slender) • [💻 GitHub](https://github.com/Omega-Slender)

---

⭐ If you find this tool useful, consider giving it a star on GitHub!
