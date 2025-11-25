const websites = [
    {
        name: "TIENDA IYAWO",
        url: "https://spoo.me/sv1",
        previewColor: "#4285F4",
        icon: "https://via.placeholder.com/48/4285F4/FFFFFF?text=I"
    },
    {
        name: "ALY SALON",
        url: "https://spoo.me/sv2",
        previewColor: "#FF0000",
        icon: "https://via.placeholder.com/48/FF0000/FFFFFF?text=A"
    },
    {
        name: "TIENDA DE TODO UN POCO",
        url: "https://spoo.me/sv3",
        previewColor: "#636466",
        icon: "https://via.placeholder.com/48/636466/FFFFFF?text=T"
    },
    {
        name: "CARNICOS HABANA",
        url: "https://spoo.me/sv4",
        previewColor: "#24292e",
        icon: "https://via.placeholder.com/48/24292e/FFFFFF?text=C"
    },
    {
        name: "SURI NAILS",
        url: "https://spoo.me/sv5",
        previewColor: "#1DA1F2",
        icon: "https://via.placeholder.com/48/1DA1F2/FFFFFF?text=S"
    },
    {
        name: "TIENDA DE ELECTRODOMESTICOS",
        url: "https://spoo.me/sv6",
        previewColor: "#E50914",
        icon: "https://via.placeholder.com/48/E50914/FFFFFF?text=E"
    },
];

const websitesGrid = document.getElementById('websitesGrid');
const previewModal = document.getElementById('previewModal');
const previewFrame = document.getElementById('previewFrame');
const previewTitle = document.getElementById('previewTitle');
const closePreview = document.getElementById('closePreview');
const refreshPreview = document.getElementById('refreshPreview');
const openExternal = document.getElementById('openExternal');
const previewLoading = document.getElementById('previewLoading');

let currentSite = null;
let isModalOpen = false;

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
                <img src="${site.icon}" alt="${site.name}" class="website-icon" />
            </div>
            <div class="website-info">
                <h3 class="website-name">
                    <img src="${site.icon}" alt="${site.name}" style="width: 20px; height: 20px;" />
                    ${site.name}
                </h3>
                <div class="card-actions">
                    <button class="website-link preview-trigger" data-site="${site.name}">
                        <svg class="icon" viewBox="0 0 24 24">
                            <use href="icons.svg#external"></use>
                        </svg>
                        Vista Previa
                    </button>
                    <a href="${site.url}" target="_blank" rel="noopener noreferrer" class="website-link external-link" onclick="protectLink(event, '${site.url}')">
                        <svg class="icon" viewBox="0 0 24 24">
                            <use href="icons.svg#external"></use>
                        </svg>
                        Visitar Sitio
                    </a>
                </div>
            </div>
        `;
        
        const previewTrigger = card.querySelector('.preview-trigger');
        const externalLink = card.querySelector('.external-link');
        
        previewTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            showPreview(site);
        });
        
        card.addEventListener('click', () => {
            showPreview(site);
        });
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showPreview(site);
            }
        });
        
        externalLink.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        websitesGrid.appendChild(card);
    });
}

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

function showPreview(site) {
    if (!validateUrl(site.url)) {
        alert('Enlace no válido');
        return;
    }
    
    currentSite = site;
    isModalOpen = true;
    
    previewTitle.textContent = `Vista Previa: ${site.name}`;
    previewModal.style.display = 'flex';
    previewLoading.style.display = 'flex';
    previewFrame.style.display = 'none';
    
    document.body.style.overflow = 'hidden';
    
    const loadTimeout = setTimeout(() => {
        if (previewLoading.style.display !== 'none') {
            handlePreviewError();
        }
    }, 15000);
    
    previewFrame.src = site.url;
    
    previewFrame.onload = () => {
        clearTimeout(loadTimeout);
        previewLoading.style.display = 'none';
        previewFrame.style.display = 'block';
    };
    
    previewFrame.onerror = () => {
        clearTimeout(loadTimeout);
        handlePreviewError();
    };
}

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

function refreshPreviewFrame() {
    if (currentSite) {
        previewLoading.style.display = 'flex';
        previewFrame.style.display = 'none';
        previewFrame.src = currentSite.url;
    }
}

function openSiteInNewTab() {
    if (currentSite) {
        window.open(currentSite.url, '_blank', 'noopener,noreferrer');
    }
}

function closePreviewModal() {
    previewModal.style.display = 'none';
    previewFrame.src = 'about:blank';
    currentSite = null;
    isModalOpen = false;
    document.body.style.overflow = '';
}

function protectLink(event, url) {
    if (!validateUrl(url)) {
        event.preventDefault();
        alert('Enlace no válido');
        return false;
    }
    
    const confirmed = confirm(`¿Está seguro de que desea visitar:\n${url}?`);
    if (!confirmed) {
        event.preventDefault();
        return false;
    }
    
    return true;
}

function validateUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
}

closePreview.addEventListener('click', closePreviewModal);
refreshPreview.addEventListener('click', refreshPreviewFrame);
openExternal.addEventListener('click', openSiteInNewTab);

previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
        closePreviewModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) {
        closePreviewModal();
    }
});

window.addEventListener('resize', () => {
    if (isModalOpen) {
        const previewContent = document.querySelector('.preview-content');
        if (previewContent) {
            previewContent.style.maxHeight = `${window.innerHeight * 0.9}px`;
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadWebsites();
    
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

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