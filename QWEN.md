# Finca San Luis - Registro de Actividades - QWEN Context

## Project Overview

This is a Progressive Web Application (PWA) called "Finca San Luis - Registro de Actividades" built with HTML5, CSS3, and JavaScript. The application is designed for registering daily activities in San Luis Farm with complete offline functionality.

### Key Features
- Registration of activities by lots (1-13, plantains, pineapples)
- Multiple lot selection capability
- Photo attachment from gallery
- History with date and lot filters
- Report generation in JPG format for WhatsApp sharing
- Data export in JSON format
- Report export in PDF format
- Complete offline functionality with Service Worker
- Installable PWA for mobile devices

### Project Structure
- `index.html` - Main application structure and UI
- `styles.css` - Styling and responsive design
- `script.js` - Core application logic and functionality
- `README.md` - Documentation and GitHub Pages setup instructions
- `manifest.json` - Web app manifest (referenced but not found in current directory)
- `sw.js` - Service worker for PWA functionality (referenced but not found in current directory)
- `jspdf.umd.min.js` - Library for PDF generation (referenced but not found in current directory)
- `html2canvas.min.js` - Library for HTML to image conversion (referenced but not found in current directory)
- `icon-192.png`, `icon-512.png` - App icons for PWA
- `.nojekyll` - Configuration file for GitHub Pages to prevent Jekyll processing

## Building and Running

This is a client-side application that can be run directly in a browser:

1. Open `index.html` in a web browser, or
2. Host the application on a web server or GitHub Pages

### GitHub Pages Deployment
According to the README, for the application to work correctly on GitHub Pages:
1. Move all files from the `FINCA_SAN_LUIS` folder to the repository root
2. Ensure the following structure exists at the root:
   - index.html
   - styles.css
   - script.js
   - sw.js
   - manifest.json
   - jspdf.umd.min.js
   - html2canvas.min.js
   - icon-192.png
   - icon-512.png
   - CNAME
   - .nojekyll
3. Enable GitHub Pages in repository settings with the root folder selected

## Development Conventions

### Code Structure
- The application uses vanilla JavaScript with no external frameworks
- Data is stored in browser's localStorage
- Responsive design with mobile-first approach
- Clean, semantic HTML structure

### Functionality
- Activity registration with multiple lot selection
- Photo attachment capability
- Date filtering and reporting
- Edit and delete functionality for registered activities
- PDF and JPG report generation
- JSON data export

### Storage
- All data is stored locally in the browser's localStorage
- No backend or database required

### Technologies Used
- HTML5, CSS3, JavaScript
- Service Worker for offline functionality
- Web App Manifest for PWA installation
- jsPDF for PDF generation
- html2canvas for image capture