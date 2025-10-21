// Variables globales
let actividades = JSON.parse(localStorage.getItem('actividades')) || [];
let currentImage = null;

// Definir lotes disponibles
const lotesDisponibles = [
    'Lote 1', 'Lote 2', 'Lote 3', 'Lote 4', 'Lote 5', 'Lote 6', 
    'Lote 7', 'Lote 8', 'Lote 9', 'Lote 10', 'Lote 11', 'Lote 12', 'Lote 13',
    'Plátanos', 'Piñas'
];

// Elementos del DOM
const currentDateElement = document.getElementById('current-date');
const currentTimeElement = document.getElementById('current-time');
const form = document.getElementById('activity-form');
const historialActividadesElement = document.getElementById('historial-actividades');
const fotoInput = document.getElementById('foto');
const fotoPreview = document.getElementById('foto-preview');
const navLinks = document.querySelectorAll('.nav-link');
const tabContents = document.querySelectorAll('.tab-content');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const aplicarFiltrosBtn = document.getElementById('aplicar-filtros');
const generarReporteBtn = document.getElementById('generar-reporte');
const exportarJsonBtn = document.getElementById('exportar-json');
const exportarPdfBtn = document.getElementById('exportar-pdf');
const loteSelect = document.getElementById('lote');
const filtroLoteSelect = document.getElementById('filtro-lote');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Agregar lotes al select de registro
    lotesDisponibles.forEach(lote => {
        const option = document.createElement('option');
        option.value = lote;
        option.textContent = lote;
        loteSelect.appendChild(option);
    });
    
    // Agregar lotes al select de filtro
    const filtroOption = document.createElement('option');
    filtroOption.value = '';
    filtroOption.textContent = 'Todos los lotes';
    filtroLoteSelect.appendChild(filtroOption);
    
    lotesDisponibles.forEach(lote => {
        const option = document.createElement('option');
        option.value = lote;
        option.textContent = lote;
        filtroLoteSelect.appendChild(option);
    });
    
    // Establecer la fecha actual como valor predeterminado en los campos de filtro
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('filtro-fecha-desde').value = hoy;
    document.getElementById('filtro-fecha-hasta').value = hoy;
    
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000); // Actualizar cada segundo
    
    // Event listeners para el formulario
    form.addEventListener('submit', registrarActividad);
    
    // Event listener para la imagen
    fotoInput.addEventListener('change', mostrarVistaPrevia);
    
    // Event listeners para las pestañas
    navLinks.forEach(link => {
        link.addEventListener('click', cambiarPestaña);
    });
    
    // Event listener para el menú hamburguesa
    menuToggle.addEventListener('click', toggleMenu);
    
    // Event listeners para filtros
    aplicarFiltrosBtn.addEventListener('click', filtrarActividades);
    
    // Event listener para generar reporte
    generarReporteBtn.addEventListener('click', generarReporte);
    
    // Event listener para exportar datos como JSON
    exportarJsonBtn.addEventListener('click', exportarDatosJson);
    
    // Event listener para exportar datos como PDF
    exportarPdfBtn.addEventListener('click', exportarPdf);
    
    // Cargar historial
    mostrarHistorial();
});

// Función para actualizar fecha y hora
function actualizarFechaHora() {
    const now = new Date();
    
    // Formato de fecha: DD/MM/AAAA
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    currentDateElement.textContent = now.toLocaleDateString('es-ES', dateOptions);
    
    // Formato de hora: HH:MM:SS
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    currentTimeElement.textContent = now.toLocaleTimeString('es-ES', timeOptions);
}

// Función para obtener la fecha y hora actual en formato ISO
function obtenerFechaHoraISO() {
    return new Date().toISOString();
}

// Función para formatear la fecha para mostrar
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Función para mostrar vista previa de la imagen
function mostrarVistaPrevia(e) {
    const file = e.target.files[0];
    if (file) {
        // Verificar que el archivo sea una imagen
        if (!file.type.match('image.*')) {
            alert('Por favor selecciona un archivo de imagen');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            fotoPreview.innerHTML = `<img src="${event.target.result}" alt="Vista previa de la foto">`;
            currentImage = event.target.result;
        }
        reader.readAsDataURL(file);
    } else {
        fotoPreview.innerHTML = '';
        currentImage = null;
    }
}

// Función para seleccionar imagen de la galería
function seleccionarDesdeGaleria() {
    // Limpiar el input file primero
    document.getElementById('foto').value = '';
    
    // Crear un input temporal para permitir seleccionar desde galería
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            // Verificar que el archivo sea una imagen
            if (!file.type.match('image.*')) {
                alert('Por favor selecciona un archivo de imagen');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(readerEvent) {
                fotoPreview.innerHTML = `<img src="${readerEvent.target.result}" alt="Vista previa de la foto">`;
                currentImage = readerEvent.target.result;
                
                // Actualizar el input original
                const dt = new DataTransfer();
                dt.items.add(file);
                document.getElementById('foto').files = dt.files;
            }
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// Función para registrar una nueva actividad
function registrarActividad(e) {
    e.preventDefault();
    
    // Verificar si estamos editando
    const editId = form.getAttribute('data-edit-id');
    
    if (editId) {
        // Actualizar la actividad existente
        const index = actividades.findIndex(item => item.id == editId);
        
        if (index !== -1) {
            // Obtener valores del formulario
            const loteSelect = document.getElementById('lote');
            const lotesSeleccionados = Array.from(loteSelect.selectedOptions).map(option => option.value);
            const descripcion = document.getElementById('descripcion').value;
            
            // Actualizar la actividad
            actividades[index] = {
                ...actividades[index],
                fecha: new Date().toISOString(),
                lotes: lotesSeleccionados,
                descripcion,
                foto: currentImage
            };
            
            // Guardar en localStorage
            localStorage.setItem('actividades', JSON.stringify(actividades));
            
            // Reiniciar el formulario
            form.reset();
            fotoPreview.innerHTML = '';
            currentImage = null;
            
            // Remover el ID de edición
            form.removeAttribute('data-edit-id');
            
            // Restaurar el texto del botón de submit
            const submitButton = form.querySelector('.btn-submit');
            submitButton.textContent = 'Registrar Actividad';
            
            // Mostrar mensaje de confirmación
            alert('Actividad actualizada correctamente');
            
            // Actualizar historial si estamos en la pestaña de historial
            if (document.querySelector('#historial.active')) {
                mostrarHistorial();
            }
        }
    } else {
        // Crear nueva actividad
        // Obtener valores del formulario
        const loteSelect = document.getElementById('lote');
        const lotesSeleccionados = Array.from(loteSelect.selectedOptions).map(option => option.value);
        const descripcion = document.getElementById('descripcion').value;
        const fecha = new Date().toISOString(); // Fecha y hora en formato ISO
        
        // Crear objeto de actividad
        const actividad = {
            id: Date.now(), // ID único basado en timestamp
            fecha,
            lotes: lotesSeleccionados, // Ahora es un array de lotes
            descripcion,
            foto: currentImage
        };
        
        // Agregar a la lista de actividades
        actividades.push(actividad);
        
        // Guardar en localStorage
        localStorage.setItem('actividades', JSON.stringify(actividades));
        
        // Reiniciar el formulario
        form.reset();
        fotoPreview.innerHTML = '';
        currentImage = null;
        
        // Mostrar mensaje de confirmación
        alert('Actividad registrada correctamente');
        
        // Actualizar historial si estamos en la pestaña de historial
        if (document.querySelector('#historial.active')) {
            mostrarHistorial();
        }
    }
}

// Función para cambiar entre pestañas
function cambiarPestaña(e) {
    e.preventDefault();
    
    const tabId = e.target.getAttribute('data-tab');
    
    // Actualizar enlaces de navegación
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Mostrar la pestaña seleccionada
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    
    // Si cambiamos a la pestaña de historial, actualizamos la vista
    if (tabId === 'historial') {
        mostrarHistorial();
    }
    
    // Cerrar el menú hamburguesa en dispositivos móviles
    navMenu.classList.remove('active');
}

// Función para mostrar el historial de actividades
function mostrarHistorial() {
    // Obtener filtros
    const filtroFechaDesde = document.getElementById('filtro-fecha-desde').value;
    const filtroFechaHasta = document.getElementById('filtro-fecha-hasta').value;
    const filtroLote = document.getElementById('filtro-lote').value;
    
    // Si no hay fechas seleccionadas, mostrar por defecto las actividades del día actual
    let mostrarPorDefecto = !filtroFechaDesde && !filtroFechaHasta;
    
    // Filtrar actividades
    let actividadesFiltradas = actividades;
    
    if (mostrarPorDefecto) {
        // Obtener la fecha actual en formato YYYY-MM-DD
        const fechaActual = new Date();
        const fechaActualISO = fechaActual.toISOString().split('T')[0];
        
        actividadesFiltradas = actividadesFiltradas.filter(actividad => 
            actividad.fecha.startsWith(fechaActualISO)
        );
    } else {
        // Filtrar por rango de fechas si están especificadas
        if (filtroFechaDesde) {
            actividadesFiltradas = actividadesFiltradas.filter(actividad => 
                new Date(actividad.fecha) >= new Date(filtroFechaDesde)
            );
        }
        
        if (filtroFechaHasta) {
            // Agregar un día a la fecha "hasta" para incluir actividades del día completo
            const fechaHasta = new Date(filtroFechaHasta);
            fechaHasta.setDate(fechaHasta.getDate() + 1);
            
            actividadesFiltradas = actividadesFiltradas.filter(actividad => 
                new Date(actividad.fecha) < fechaHasta
            );
        }
    }
    
    if (filtroLote) {
        actividadesFiltradas = actividadesFiltradas.filter(actividad => 
            Array.isArray(actividad.lotes) ? actividad.lotes.includes(filtroLote) : actividad.lotes === filtroLote
        );
    }
    
    // Ordenar por fecha (más reciente primero)
    actividadesFiltradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    // Generar HTML del historial
    if (actividadesFiltradas.length === 0) {
        historialActividadesElement.innerHTML = '<p>No hay actividades registradas.</p>';
        return;
    }
    
    let html = '';
    actividadesFiltradas.forEach(actividad => {
        const fechaFormateada = formatearFecha(actividad.fecha);
        
        // Convertir lotes a string para mostrar
        const lotesTexto = Array.isArray(actividad.lotes) ? actividad.lotes.join(', ') : actividad.lotes || '';
        
        html += `
            <div class="activity-item" data-id="${actividad.id}">
                <div class="activity-date">
                    <span>${fechaFormateada}</span>
                    <span>ID: ${actividad.id}</span>
                </div>
                <div class="activity-lote">Lotes: ${lotesTexto}</div>
                <div class="activity-descripcion">${actividad.descripcion}</div>
                ${actividad.foto ? `<div class="activity-foto"><img src="${actividad.foto}" alt="Foto de la actividad"></div>` : ''}
                <div class="activity-actions">
                    <button class="btn-edit" onclick="editarActividad(${actividad.id})">Editar</button>
                    <button class="btn-delete" onclick="eliminarActividad(${actividad.id})">Eliminar</button>
                </div>
            </div>
        `;
    });
    
    historialActividadesElement.innerHTML = html;
}

// Función para aplicar filtros
function filtrarActividades() {
    mostrarHistorial();
}

// Función para editar una actividad
function editarActividad(id) {
    // Buscar la actividad por ID
    const actividad = actividades.find(item => item.id === id);
    
    if (actividad) {
        // Cambiar a la pestaña de registro
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector('.nav-link[data-tab="registro"]').classList.add('active');
        
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById('registro').classList.add('active');
        
        // Rellenar el formulario con los datos de la actividad
        const loteSelect = document.getElementById('lote');
        const descripcionTextarea = document.getElementById('descripcion');
        
        // Seleccionar los lotes correspondientes
        Array.from(loteSelect.options).forEach(option => {
            option.selected = actividad.lotes.includes(option.value);
        });
        
        descripcionTextarea.value = actividad.descripcion;
        
        // Mostrar la imagen si existe
        if (actividad.foto) {
            fotoPreview.innerHTML = `<img src="${actividad.foto}" alt="Vista previa de la foto">`;
            currentImage = actividad.foto;
        }
        
        // Guardar el ID de la actividad que se está editando
        form.setAttribute('data-edit-id', actividad.id);
        
        // Cambiar el texto del botón de submit
        const submitButton = document.querySelector('.btn-submit');
        submitButton.textContent = 'Actualizar Actividad';
        
        // Hacer scroll al formulario
        document.querySelector('#registro').scrollIntoView({ behavior: 'smooth' });
    }
}

// Función para eliminar una actividad
function eliminarActividad(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
        // Filtrar la actividad por ID
        actividades = actividades.filter(actividad => actividad.id !== id);
        
        // Guardar en localStorage
        localStorage.setItem('actividades', JSON.stringify(actividades));
        
        // Actualizar el historial
        mostrarHistorial();
        
        alert('Actividad eliminada correctamente');
    }
}

// Función para generar reporte
async function generarReporte() {
    try {
        // Obtener fechas de filtro para incluirlas en el reporte
        const filtroFechaDesde = document.getElementById('filtro-fecha-desde').value;
        const filtroFechaHasta = document.getElementById('filtro-fecha-hasta').value;
        const filtroLote = document.getElementById('filtro-lote').value;
        
        // Filtrar actividades según los filtros aplicados
        let actividadesFiltradas = actividades;
        
        if (filtroFechaDesde) {
            actividadesFiltradas = actividadesFiltradas.filter(actividad => 
                new Date(actividad.fecha) >= new Date(filtroFechaDesde)
            );
        }
        
        if (filtroFechaHasta) {
            const fechaHasta = new Date(filtroFechaHasta);
            fechaHasta.setDate(fechaHasta.getDate() + 1);
            
            actividadesFiltradas = actividadesFiltradas.filter(actividad => 
                new Date(actividad.fecha) < fechaHasta
            );
        }
        
        if (filtroLote) {
            actividadesFiltradas = actividadesFiltradas.filter(actividad => 
                Array.isArray(actividad.lotes) ? actividad.lotes.includes(filtroLote) : actividad.lotes === filtroLote
            );
        }
        
        // Ordenar actividades por fecha (más reciente primero)
        actividadesFiltradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        if (actividadesFiltradas.length === 0) {
            alert('No hay actividades registradas con los filtros seleccionados.');
            return;
        }
        
        // Crear un contenedor para el reporte
        const reportContainer = document.createElement('div');
        reportContainer.className = 'report-content';
        reportContainer.style.position = 'fixed';
        reportContainer.style.left = '0';
        reportContainer.style.top = '0';
        reportContainer.style.width = '800px'; // Ancho fijo para mejor formato
        reportContainer.style.maxWidth = '100%';
        reportContainer.style.padding = '20px';
        reportContainer.style.backgroundColor = 'white';
        reportContainer.style.color = 'black';
        reportContainer.style.fontFamily = 'Arial, sans-serif';
        reportContainer.style.zIndex = '9999';
        reportContainer.style.overflow = 'hidden';
        
        // Formatear fechas para mostrar en el reporte
        const fechaDesdeTexto = filtroFechaDesde ? new Date(filtroFechaDesde).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) : 'Sin fecha';
        
        const fechaHastaTexto = filtroFechaHasta ? new Date(filtroFechaHasta).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) : 'Sin fecha';
        
        const loteTexto = filtroLote || 'Todos los lotes';
        
        // Contenido del reporte
        const fechaActual = new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        reportContainer.innerHTML = `
            <div class="report-header" style="text-align: center; border-bottom: 2px solid #2e7d32; padding-bottom: 10px; margin-bottom: 20px;">
                <div class="report-title" style="font-size: 1.5em; color: #2e7d32;">Finca San Luis</div>
                <div class="report-subtitle" style="font-size: 1.3em; color: #388e3c; margin: 10px 0;">Reporte de Actividades</div>
                <div class="report-date" style="font-size: 0.9em; color: #666; margin: 5px 0;">Fechas: ${fechaDesdeTexto} - ${fechaHastaTexto}</div>
                <div class="report-lote" style="font-size: 0.9em; color: #666;">Lote: ${loteTexto}</div>
                <div class="report-generado" style="font-size: 0.8em; color: #888;">Generado el: ${fechaActual}</div>
            </div>
            <div class="report-activities" style="margin-top: 20px;">
        `;
        
        // Agregar actividades al reporte
        actividadesFiltradas.forEach(actividad => {
            const fechaFormateada = formatearFecha(actividad.fecha);
            
            // Convertir lotes a string para mostrar en el reporte
            const lotesTexto = Array.isArray(actividad.lotes) ? actividad.lotes.join(', ') : actividad.lotes || '';
            
            reportContainer.innerHTML += `
                <div class="report-activity" style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed #ccc;">
                    <div class="report-activity-date" style="font-weight: bold; color: #2e7d32;">${fechaFormateada}</div>
                    <div class="report-activity-lote" style="font-weight: bold; color: #388e3c;">Lotes: ${lotesTexto}</div>
                    <div class="report-activity-descripcion">${actividad.descripcion}</div>
                </div>
            `;
        });
        
        reportContainer.innerHTML += '</div>';
        
        // Agregar el contenedor al body
        document.body.appendChild(reportContainer);
        
        // Esperar a que se renderice el contenido
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Usar html2canvas para capturar el contenido como imagen
        const canvas = await html2canvas(reportContainer, {
            backgroundColor: 'white',
            scale: 2, // Mejor resolución
            useCORS: true,
            logging: false,
            width: reportContainer.scrollWidth,
            height: reportContainer.scrollHeight
        });
        
        // Convertir canvas a blob y descargar como JPG
        canvas.toBlob(function(blob) {
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            // Generar nombre de archivo con fecha
            const fechaActual = new Date();
            const nombreArchivo = `Reporte_Finca_San_Luis_${fechaActual.getFullYear()}${(fechaActual.getMonth()+1).toString().padStart(2, '0')}${fechaActual.getDate().toString().padStart(2, '0')}.jpg`;
            
            link.href = url;
            link.download = nombreArchivo;
            document.body.appendChild(link);
            link.click();
            
            // Limpiar
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            document.body.removeChild(reportContainer);
            
            alert('El reporte ha sido descargado como imagen JPG. Puedes compartirlo en WhatsApp.');
        }, 'image/jpeg', 0.9); // Calidad JPEG 90%
        
    } catch (error) {
        console.error('Error al generar la imagen:', error);
        alert('Hubo un error al generar el reporte. Por favor intenta de nuevo.');
    }
}

// Función para exportar datos como JSON
function exportarDatosJson() {
    try {
        // Obtener fechas de filtro para aplicar al JSON exportado
        const filtroFechaDesde = document.getElementById('filtro-fecha-desde').value;
        const filtroFechaHasta = document.getElementById('filtro-fecha-hasta').value;
        const filtroLote = document.getElementById('filtro-lote').value;
        
        // Filtrar actividades según los filtros aplicados
        let actividadesFiltradas = actividades;
        
        if (filtroFechaDesde) {
            actividadesFiltradas = actividadesFiltradas.filter(actividad => 
                new Date(actividad.fecha) >= new Date(filtroFechaDesde)
            );
        }
        
        if (filtroFechaHasta) {
            const fechaHasta = new Date(filtroFechaHasta);
            fechaHasta.setDate(fechaHasta.getDate() + 1);
            
            actividadesFiltradas = actividadesFiltradas.filter(actividad => 
                new Date(actividad.fecha) < fechaHasta
            );
        }
        
        if (filtroLote) {
            actividadesFiltradas = actividadesFiltradas.filter(actividad => 
                Array.isArray(actividad.lotes) ? actividad.lotes.includes(filtroLote) : actividad.lotes === filtroLote
            );
        }
        
        // Ordenar actividades por fecha (más reciente primero)
        actividadesFiltradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        if (actividadesFiltradas.length === 0) {
            alert('No hay actividades registradas con los filtros seleccionados.');
            return;
        }
        
        // Crear objeto JSON con las actividades filtradas
        const datosExportar = {
            info: {
                titulo: "Datos de Actividades - Finca San Luis",
                fechaExportacion: new Date().toISOString(),
                totalRegistros: actividadesFiltradas.length,
                filtroFechaDesde: filtroFechaDesde || null,
                filtroFechaHasta: filtroFechaHasta || null,
                filtroLote: filtroLote || null
            },
            actividades: actividadesFiltradas
        };
        
        // Convertir a string JSON con formato
        const jsonString = JSON.stringify(datosExportar, null, 2);
        
        // Crear un blob con el contenido JSON
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // Crear un enlace para descargar el archivo
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        // Generar nombre de archivo con fecha
        const fechaActual = new Date();
        const nombreArchivo = `Finca_San_Luis_Datos_${fechaActual.getFullYear()}${(fechaActual.getMonth()+1).toString().padStart(2, '0')}${fechaActual.getDate().toString().padStart(2, '0')}.json`;
        
        link.href = url;
        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        
        // Limpiar
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert(`Datos exportados exitosamente. Se han exportado ${actividadesFiltradas.length} registros.`);
        
    } catch (error) {
        console.error('Error al exportar los datos:', error);
        alert('Hubo un error al exportar los datos. Por favor intenta de nuevo.');
    }
}

// Función para exportar datos como PDF
async function exportarPdf() {
    try {
        // Verificar que jsPDF esté disponible
        if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
            alert('La librería para generar PDF no está disponible. Asegúrate de tener conexión a internet para descargarla o actualiza la aplicación.');
            return;
        }
        
        // Obtener fechas de filtro para incluirlas en el PDF
        const filtroFechaDesde = document.getElementById('filtro-fecha-desde').value;
        const filtroFechaHasta = document.getElementById('filtro-fecha-hasta').value;
        const filtroLote = document.getElementById('filtro-lote').value;
        
        // Filtrar actividades según los filtros aplicados
        let actividadesFiltradas = actividades;
        
        if (filtroFechaDesde) {
            actividadesFiltradas = actividadesFiltradas.filter(actividad => 
                new Date(actividad.fecha) >= new Date(filtroFechaDesde)
            );
        }
        
        if (filtroFechaHasta) {
            const fechaHasta = new Date(filtroFechaHasta);
            fechaHasta.setDate(fechaHasta.getDate() + 1);
            
            actividadesFiltradas = actividadesFiltradas.filter(actividad => 
                new Date(actividad.fecha) < fechaHasta
            );
        }
        
        if (filtroLote) {
            actividadesFiltradas = actividadesFiltradas.filter(actividad => 
                Array.isArray(actividad.lotes) ? actividad.lotes.includes(filtroLote) : actividad.lotes === filtroLote
            );
        }
        
        // Ordenar actividades por fecha (más reciente primero)
        actividadesFiltradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        if (actividadesFiltradas.length === 0) {
            alert('No hay actividades registradas con los filtros seleccionados.');
            return;
        }
        
        // Crear instancia de jsPDF
        const doc = new window.jspdf.jsPDF();
        
        // Título del reporte
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Finca San Luis', 105, 10, null, null, 'center');
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.text('Reporte de Actividades', 105, 20, null, null, 'center');
        
        // Información de fechas
        const fechaDesdeTexto = filtroFechaDesde ? new Date(filtroFechaDesde).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) : 'Sin fecha';
        
        const fechaHastaTexto = filtroFechaHasta ? new Date(filtroFechaHasta).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) : 'Sin fecha';
        
        doc.setFontSize(12);
        doc.text(`Fechas: ${fechaDesdeTexto} - ${fechaHastaTexto}`, 20, 30);
        
        const loteTexto = filtroLote || 'Todos los lotes';
        doc.text(`Lote: ${loteTexto}`, 20, 38);
        
        const fechaActual = new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        doc.text(`Generado el: ${fechaActual}`, 20, 46);
        
        // Preparar datos para la tabla
        let y = 55;
        doc.setFontSize(10);
        
        // Cabeceras de la tabla
        doc.setFont('helvetica', 'bold');
        doc.text('Fecha', 15, y);
        doc.text('Lotes', 60, y);
        doc.text('Descripción', 120, y);
        doc.setFont('helvetica', 'normal');
        
        y += 8;
        
        // Agregar filas con las actividades
        for (const actividad of actividadesFiltradas) {
            // Verificar si necesitamos una nueva página
            if (y > 270) {
                doc.addPage();
                y = 20;
                
                // Agregar título en nueva página si es necesario
                doc.setFontSize(18);
                doc.setFont('helvetica', 'bold');
                doc.text('Finca San Luis', 105, 10, null, null, 'center');
                doc.setFontSize(16);
                doc.setFont('helvetica', 'normal');
                doc.text('Reporte de Actividades (continuación)', 105, 20, null, null, 'center');
                
                y = 35;
                
                // Cabeceras de la tabla
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text('Fecha', 15, y);
                doc.text('Lotes', 60, y);
                doc.text('Descripción', 120, y);
                doc.setFont('helvetica', 'normal');
                
                y += 8;
            }
            
            // Fecha
            const fechaFormateada = formatearFecha(actividad.fecha);
            doc.text(fechaFormateada, 15, y);
            
            // Lotes
            const lotesTexto = Array.isArray(actividad.lotes) ? actividad.lotes.join(', ') : actividad.lotes || '';
            doc.text(lotesTexto, 60, y);
            
            // Descripción (manejar texto largo)
            const descripcion = actividad.descripcion || '';
            const splitDescripcion = doc.splitTextToSize(descripcion, 70);
            doc.text(splitDescripcion, 120, y);
            
            y += Math.max(splitDescripcion.length * 7, 8); // Espaciado basado en el texto más largo
        }
        
        // Generar nombre de archivo con fecha
        const fechaActualNombre = new Date();
        const nombreArchivo = `Reporte_Finca_San_Luis_${fechaActualNombre.getFullYear()}${(fechaActualNombre.getMonth()+1).toString().padStart(2, '0')}${fechaActualNombre.getDate().toString().padStart(2, '0')}.pdf`;
        
        // Guardar el PDF
        doc.save(nombreArchivo);
        
        alert(`Reporte PDF generado exitosamente. Se han incluido ${actividadesFiltradas.length} registros.`);
        
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        alert('Hubo un error al generar el reporte PDF. Por favor intenta de nuevo.');
    }
}

// Función para alternar el menú hamburguesa
function toggleMenu() {
    navMenu.classList.toggle('active');
}

// Registrar Service Worker para funcionalidad offline
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registrado con éxito:', registration.scope);
            })
            .catch(function(error) {
                console.log('Error al registrar el ServiceWorker:', error);
            });
    });
}

// Agregar evento para detectar cambios de conectividad
window.addEventListener('load', function() {
    // Mostrar estado de conectividad
    const updateOnlineStatus = () => {
        const navOnline = navigator.onLine;
        console.log(`Estado de conexión: ${navOnline ? 'Online' : 'Offline'}`);
        
        // Podríamos mostrar una notificación visual al usuario aquí
        // Por ejemplo, un banner indicando el estado de conexión
    };
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Verificar estado inicial
    updateOnlineStatus();
});