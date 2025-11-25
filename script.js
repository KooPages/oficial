// Lista de sitios web actualizada
const websites = [
    {
        name: "Google",
        url: "https://www.google.com",
        description: "Motor de búsqueda líder mundial con tecnología de inteligencia artificial integrada.",
        previewColor: "#4285F4",
        icon: "google"
    },
    {
        name: "YouTube",
        url: "https://www.youtube.com",
        description: "Plataforma de video líder global con contenido diverso y herramientas para creadores.",
        previewColor: "#FF0000",
        icon: "youtube"
    },
    {
        name: "Wikipedia",
        url: "https://www.wikipedia.org",
        description: "Enciclopedia digital colaborativa más grande del mundo, de acceso libre.",
        previewColor: "#636466",
        icon: "wikipedia"
    },
    {
        name: "GitHub",
        url: "https://github.com",
        description: "Plataforma de desarrollo colaborativo para el control de versiones y colaboración.",
        previewColor: "#24292e",
        icon: "github"
    },
    {
        name: "Twitter",
        url: "https://twitter.com",
        description: "Red social de microblogging para conversaciones en tiempo real y noticias.",
        previewColor: "#1DA1F2",
        icon: "twitter"
    },
    {
        name: "Netflix",
        url: "https://www.netflix.com",
        description: "Servicio de streaming líder con contenido original y licenciado globalmente.",
        previewColor: "#E50914",
        icon: "netflix"
    },
];

// Elementos del DOM
const websitesGrid = document.getElementById('websitesGrid');
const previewModal = document.getElementById('previewModal');
const previewFrame = document.getElementById('previewFrame');
const previewTitle = document.getElementById('previewTitle');
const closePreview = document.getElementById('closePreview');
const refreshPreview = document.getElementById('refreshPreview');
const openExternal = document.getElementById('openExternal');
const previewLoading = document.getElementById('previewLoading');

// Variables de estado
let currentSite = null;
let isModalOpen = false;

// Cargar los sitios web en la cuadrícula
function loadWebsites() {
    websitesGrid.innerHTML = '';
    
    websites.forEach(site => {
        const card = document.createElement('div');
        card.className = 'website-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Abrir vista previa de ${site.name}`);
        
        card.innerHTML = `
            <div class="website-preview" style="background: linear-gradient(135deg, ${site.previewColor} 0%, ${darkenColor(site.previewColor, 20)} 100%);">
                <svg class="website-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <use href="icons.svg#${site.icon}"></use>
                </svg>
            </div>
            <div class="website-info">
                <h3 class="website-name">
                    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                        <use href="icons.svg#${site.icon}"></use>
                    </svg>
                    ${site.name}
                </h3>
                <p class="website-description">${site.description}</p>
                <div class="card-actions">
                    <button class="website-link preview-trigger" data-site="${site.name}">
                        <svg class="icon" viewBox="0 0 24 24">
                            <use href="icons.svg#external"></use>
                        </svg>
                        Vista Previa
                    </button>
                    <a href="${site.url}" target="_blank" rel="noopener noreferrer" class="website-link external-link">
                        <svg class="icon" viewBox="0 0 24 24">
                            <use href="icons.svg#external"></use>
                        </svg>
                        Visitar Sitio
                    </a>
                </div>
            </div>
        `;
        
        // Eventos para la tarjeta
        const previewTrigger = card.querySelector('.preview-trigger');
        const externalLink = card.querySelector('.external-link');
        
        // Vista previa al hacer clic en el botón o en la tarjeta
        previewTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            showPreview(site);
        });
        
        card.addEventListener('click', () => {
            showPreview(site);
        });
        
        // Navegación con teclado
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showPreview(site);
            }
        });
        
        // Prevenir la apertura del preview cuando se hace clic en el enlace externo
        externalLink.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        websitesGrid.appendChild(card);
    });
}

// Función para oscurecer colores (para gradientes)
function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (
        0x1000000 +
        (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
}

// Mostrar vista previa del sitio
function showPreview(site) {
    currentSite = site;
    isModalOpen = true;
    
    previewTitle.textContent = `Vista Previa: ${site.name}`;
    previewModal.style.display = 'flex';
    previewLoading.style.display = 'flex';
    previewFrame.style.display = 'none';
    
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    
    // Cargar la URL en el iframe con timeout
    const loadTimeout = setTimeout(() => {
        if (previewLoading.style.display !== 'none') {
            handlePreviewError();
        }
    }, 10000); // 10 segundos timeout
    
    previewFrame.src = site.url;
    
    // Mostrar el iframe cuando se cargue
    previewFrame.onload = () => {
        clearTimeout(loadTimeout);
        previewLoading.style.display = 'none';
        previewFrame.style.display = 'block';
    };
    
    // Manejar errores de carga
    previewFrame.onerror = () => {
        clearTimeout(loadTimeout);
        handlePreviewError();
    };
}

// Manejar errores de vista previa
function handlePreviewError() {
    previewLoading.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24" style="width: 64px; height: 64px; fill: #e53e3e; margin-bottom: 1rem;">
            <use href="icons.svg#error"></use>
        </svg>
        <h3 style="color: #2d3748; margin-bottom: 0.5rem;">No se pudo cargar la vista previa</h3>
        <p style="color: #718096; text-align: center; margin-bottom: 1.5rem;">
            El sitio puede tener restricciones de seguridad que impiden la visualización integrada.
        </p>
        <button class="website-link" onclick="openSiteInNewTab()" style="margin: 0 auto;">
            <svg class="icon" viewBox="0 0 24 24">
                <use href="icons.svg#external"></use>
            </svg>
            Abrir en nueva pestaña
        </button>
    `;
}

// Actualizar vista previa
function refreshPreviewFrame() {
    if (currentSite) {
        previewLoading.style.display = 'flex';
        previewFrame.style.display = 'none';
        previewFrame.src = currentSite.url;
    }
}

// Abrir sitio en nueva pestaña
function openSiteInNewTab() {
    if (currentSite) {
        window.open(currentSite.url, '_blank', 'noopener,noreferrer');
    }
}

// Cerrar vista previa
function closePreviewModal() {
    previewModal.style.display = 'none';
    previewFrame.src = 'about:blank';
    currentSite = null;
    isModalOpen = false;
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
}

// Event listeners
closePreview.addEventListener('click', closePreviewModal);
refreshPreview.addEventListener('click', refreshPreviewFrame);
openExternal.addEventListener('click', openSiteInNewTab);

// Cerrar modal al hacer clic fuera del contenido
previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
        closePreviewModal();
    }
});

// Cerrar con tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) {
        closePreviewModal();
    }
});

// Mejorar el manejo de redimensionamiento
window.addEventListener('resize', () => {
    if (isModalOpen) {
        // Ajustar el modal si es necesario
        const previewContent = document.querySelector('.preview-content');
        if (previewContent) {
            previewContent.style.maxHeight = `${window.innerHeight * 0.9}px`;
        }
    }
});

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    loadWebsites();
    
    // Añadir clase loaded para transiciones suaves después de la carga
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Service Worker para caché (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}