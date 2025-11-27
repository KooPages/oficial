class KooPagesApp {
    constructor() {
        this.websites = [
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

        this.currentSite = null;
        this.isModalOpen = false;
        this.cache = new Map();
        
        this.init();
    }

    init() {
        this.websitesGrid = document.getElementById('websitesGrid');
        this.previewModal = document.getElementById('previewModal');
        this.previewFrame = document.getElementById('previewFrame');
        this.previewTitle = document.getElementById('previewTitle');
        this.closePreview = document.getElementById('closePreview');
        this.refreshPreview = document.getElementById('refreshPreview');
        this.openExternal = document.getElementById('openExternal');
        this.previewLoading = document.getElementById('previewLoading');

        this.bindEvents();
        this.loadWebsites();
        this.initServiceWorker();
    }

    bindEvents() {
        this.closePreview.addEventListener('click', () => this.closePreviewModal());
        this.refreshPreview.addEventListener('click', () => this.refreshPreviewFrame());
        this.openExternal.addEventListener('click', () => this.openSiteInNewTab());

        this.previewModal.addEventListener('click', (e) => {
            if (e.target === this.previewModal) {
                this.closePreviewModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen) {
                this.closePreviewModal();
            }
        });

        window.addEventListener('resize', () => {
            if (this.isModalOpen) {
                this.adjustPreviewSize();
            }
        });
    }

    loadWebsites() {
        this.websitesGrid.innerHTML = '';
        
        this.websites.forEach(site => {
            const card = this.createWebsiteCard(site);
            this.websitesGrid.appendChild(card);
        });

        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
    }

    createWebsiteCard(site) {
        const card = document.createElement('div');
        card.className = 'website-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Abrir vista previa de ${site.name}`);
        
        card.innerHTML = `
            <div class="website-preview" style="background: linear-gradient(135deg, ${site.previewColor} 0%, ${this.darkenColor(site.previewColor, 20)} 100%);">
                <img src="${site.icon}" alt="${site.name}" class="website-icon" loading="lazy" />
            </div>
            <div class="website-info">
                <h3 class="website-name">
                    <img src="${site.icon}" alt="${site.name}" style="width: 20px; height: 20px;" loading="lazy" />
                    ${site.name}
                </h3>
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
        
        this.bindCardEvents(card, site);
        return card;
    }

    bindCardEvents(card, site) {
        const previewTrigger = card.querySelector('.preview-trigger');
        const externalLink = card.querySelector('.external-link');
        
        previewTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showPreview(site);
        });
        
        card.addEventListener('click', () => {
            this.showPreview(site);
        });
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.showPreview(site);
            }
        });
        
        externalLink.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!this.protectLink(site.url)) {
                e.preventDefault();
            }
        });
    }

    darkenColor(color, percent) {
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

    showPreview(site) {
        if (!this.validateUrl(site.url)) {
            this.showError('Enlace no válido');
            return;
        }
        
        this.currentSite = site;
        this.isModalOpen = true;
        
        this.previewTitle.textContent = `Vista Previa: ${site.name}`;
        this.previewModal.style.display = 'flex';
        this.previewModal.setAttribute('aria-hidden', 'false');
        this.previewLoading.style.display = 'flex';
        this.previewFrame.style.display = 'none';
        
        document.body.style.overflow = 'hidden';
        
        this.loadPreview(site.url);
    }

    async loadPreview(url) {
        const cacheKey = `preview-${btoa(url)}`;
        
        if (this.cache.has(cacheKey)) {
            this.displayCachedPreview(this.cache.get(cacheKey));
            return;
        }

        const loadTimeout = setTimeout(() => {
            this.handlePreviewError();
        }, 15000);
        
        try {
            this.previewFrame.src = url;
            
            this.previewFrame.onload = () => {
                clearTimeout(loadTimeout);
                this.previewLoading.style.display = 'none';
                this.previewFrame.style.display = 'block';
                this.cache.set(cacheKey, { loaded: true, timestamp: Date.now() });
            };
            
            this.previewFrame.onerror = () => {
                clearTimeout(loadTimeout);
                this.handlePreviewError();
            };
        } catch (error) {
            console.error('Error loading preview:', error);
            this.handlePreviewError();
        }
    }

    displayCachedPreview(cacheData) {
        this.previewLoading.style.display = 'none';
        this.previewFrame.style.display = 'block';
    }

    handlePreviewError() {
        this.previewLoading.innerHTML = `
            <svg class="icon" viewBox="0 0 24 24" style="width: 64px; height: 64px; fill: #e53e3e; margin-bottom: 1rem;">
                <use href="icons.svg#error"></use>
            </svg>
            <h3 style="color: #2d3748; margin-bottom: 0.5rem;">No se pudo cargar la vista previa</h3>
            <p style="color: #718096; text-align: center; margin-bottom: 1.5rem;">
                El sitio puede tener restricciones de seguridad que impiden la visualización integrada.
            </p>
            <button class="website-link" onclick="app.openSiteInNewTab()" style="margin: 0 auto;">
                <svg class="icon" viewBox="0 0 24 24">
                    <use href="icons.svg#external"></use>
                </svg>
                Abrir en nueva pestaña
            </button>
        `;
    }

    refreshPreviewFrame() {
        if (this.currentSite) {
            const cacheKey = `preview-${btoa(this.currentSite.url)}`;
            this.cache.delete(cacheKey);
            
            this.previewLoading.style.display = 'flex';
            this.previewFrame.style.display = 'none';
            this.previewFrame.src = this.currentSite.url;
        }
    }

    openSiteInNewTab() {
        if (this.currentSite && this.validateUrl(this.currentSite.url)) {
            window.open(this.currentSite.url, '_blank', 'noopener,noreferrer');
        }
    }

    closePreviewModal() {
        this.previewModal.style.display = 'none';
        this.previewModal.setAttribute('aria-hidden', 'true');
        this.previewFrame.src = 'about:blank';
        this.currentSite = null;
        this.isModalOpen = false;
        document.body.style.overflow = '';
    }

    protectLink(url) {
        if (!this.validateUrl(url)) {
            this.showError('Enlace no válido');
            return false;
        }
        
        const confirmed = confirm(`¿Está seguro de que desea visitar:\n${url}?`);
        return confirmed;
    }

    validateUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    }

    adjustPreviewSize() {
        const previewContent = document.querySelector('.preview-content');
        if (previewContent) {
            previewContent.style.maxHeight = `${window.innerHeight * 0.9}px`;
        }
    }

    showError(message) {
        // Implementación básica de notificación de error
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e53e3e;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 3000);
    }

    initServiceWorker() {
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
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new KooPagesApp();
});