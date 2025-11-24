// Lista de sitios web
const websites = [
    {
        name: "Google",
        url: "https://www.google.com",
        description: "El motor de búsqueda más popular del mundo.",
        previewColor: "#4285F4",
        icon: "google"
    },
    {
        name: "YouTube",
        url: "https://www.youtube.com",
        description: "Plataforma de videos más grande del mundo.",
        previewColor: "#FF0000",
        icon: "youtube"
    },
    {
        name: "Wikipedia",
        url: "https://www.wikipedia.org",
        description: "La enciclopedia libre más grande del mundo.",
        previewColor: "#636466",
        icon: "wikipedia"
    },
    {
        name: "GitHub",
        url: "https://github.com",
        description: "Plataforma de desarrollo colaborativo para alojar proyectos.",
        previewColor: "#24292e",
        icon: "github"
    },
    {
        name: "Twitter",
        url: "https://twitter.com",
        description: "Red social de microblogging para compartir pensamientos.",
        previewColor: "#1DA1F2",
        icon: "twitter"
    },
    {
        name: "Netflix",
        url: "https://www.netflix.com",
        description: "Servicio de streaming de películas y series.",
        previewColor: "#E50914",
        icon: "netflix"
    },
    {
        name: "Amazon",
        url: "https://www.amazon.com",
        description: "Tienda en línea y plataforma de servicios en la nube.",
        previewColor: "#FF9900",
        icon: "amazon"
    },
    {
        name: "LinkedIn",
        url: "https://www.linkedin.com",
        description: "Red social orientada a negocios y empleo.",
        previewColor: "#0077B5",
        icon: "linkedin"
    },
    {
        name: "Instagram",
        url: "https://www.instagram.com",
        description: "Plataforma para compartir fotos y videos.",
        previewColor: "#E4405F",
        icon: "instagram"
    },
    {
        name: "Spotify",
        url: "https://www.spotify.com",
        description: "Servicio de música, podcasts y videos digitales.",
        previewColor: "#1DB954",
        icon: "spotify"
    }
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

// Cargar los sitios web en la cuadrícula
function loadWebsites() {
    websites.forEach(site => {
        const card = document.createElement('div');
        card.className = 'website-card';
        
        card.innerHTML = `
            <div class="website-preview" style="background-color: ${site.previewColor};">
                <svg class="website-icon" viewBox="0 0 24 24">
                    <use href="icons.svg#${site.icon}"></use>
                </svg>
            </div>
            <div class="website-info">
                <h3 class="website-name">
                    <svg class="icon" viewBox="0 0 24 24">
                        <use href="icons.svg#${site.icon}"></use>
                    </svg>
                    ${site.name}
                </h3>
                <p class="website-description">${site.description}</p>
                <a href="${site.url}" target="_blank" class="website-link">
                    <svg class="icon" viewBox="0 0 24 24">
                        <use href="icons.svg#external"></use>
                    </svg>
                    Visitar sitio
                </a>
            </div>
        `;
        
        // Añadir evento para mostrar vista previa
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('website-link') && 
                !e.target.closest('.website-link')) {
                showPreview(site);
            }
        });
        
        websitesGrid.appendChild(card);
    });
}

// Mostrar vista previa del sitio
function showPreview(site) {
    currentSite = site;
    previewTitle.textContent = `Vista previa: ${site.name}`;
    previewModal.style.display = 'flex';
    previewLoading.style.display = 'flex';
    previewFrame.style.display = 'none';
    
    // Cargar la URL en el iframe
    previewFrame.src = site.url;
    
    // Mostrar el iframe cuando se cargue
    previewFrame.onload = () => {
        previewLoading.style.display = 'none';
        previewFrame.style.display = 'block';
    };
    
    // Manejar errores de carga
    previewFrame.onerror = () => {
        previewLoading.innerHTML = `
            <svg class="icon" viewBox="0 0 24 24" style="width: 50px; height: 50px; fill: #e74c3c; margin-bottom: 15px;">
                <use href="icons.svg#error"></use>
            </svg>
            <p>Error al cargar la vista previa. El sitio puede tener restricciones.</p>
        `;
    };
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
        window.open(currentSite.url, '_blank');
    }
}

// Cerrar vista previa
function closePreviewModal() {
    previewModal.style.display = 'none';
    previewFrame.src = 'about:blank';
    currentSite = null;
}

// Event listeners
closePreview.addEventListener('click', closePreviewModal);
refreshPreview.addEventListener('click', refreshPreviewFrame);
openExternal.addEventListener('click', openSiteInNewTab);

previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
        closePreviewModal();
    }
});

// Cerrar con tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && previewModal.style.display === 'flex') {
        closePreviewModal();
    }
});

// Inicializar
document.addEventListener('DOMContentLoaded', loadWebsites);