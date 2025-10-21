# Finca San Luis - Registro de Actividades

Aplicación web progresiva (PWA) para registrar actividades diarias en la finca San Luis con funcionalidad offline completa.

## Características

- Registro de actividades por lotes (1-13, plátanos, piñas)
- Selección múltiple de lotes
- Adjunto de fotos desde galería
- Historial con filtros por fechas y lotes
- Generación de reportes en JPG para WhatsApp
- Exportación de datos en JSON
- Exportación de reportes en PDF
- Funcionalidad completamente offline con Service Worker
- PWA instalable en dispositivos móviles

## Instalación en GitHub Pages

Para que esta aplicación funcione correctamente en GitHub Pages:

1. Mover todos los archivos de la carpeta `FINCA_SAN_LUIS` a la raíz del repositorio
2. Asegurarse de que la siguiente estructura exista en la raíz:
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
3. Activar GitHub Pages en la configuración del repositorio
   - Rama: main o master
   - Carpeta: /(raíz)

## Tecnologías utilizadas

- HTML5, CSS3, JavaScript
- Service Worker para funcionalidad offline
- Web App Manifest para instalación como PWA
- jsPDF para generación de PDFs
- html2canvas para captura de imágenes