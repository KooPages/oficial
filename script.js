/**
 * KOOPAGES - Script Principal
 * Funcionalidades optimizadas con seguridad, accesibilidad y rendimiento
 */

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Verificar que las dependencias están cargadas
    if (typeof CONFIG === 'undefined' || typeof Utils === 'undefined') {
        console.error('Error: Dependencias no cargadas correctamente');
        return;
    }
    
    try {
        initializeApp();
    } catch (error) {
        Utils.handleError(error, 'Inicialización');
        showNotification('Error al inicializar la aplicación', 'error');
    }
});

/**
 * Inicializa la aplicación
 */
function initializeApp() {
    // Elementos de navegación
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');
    const searchInput = document.getElementById('searchInput');
    
    // Validar elementos críticos
    if (!navLinks.length || !sections.length || !menuToggle || !nav) {
        throw new Error('Elementos críticos del DOM no encontrados');
    }
    
    // Inicializar módulos
    initNavigation(navLinks, sections, menuToggle, nav);
    initSearch(searchInput);
    initWebs();
    initBrowserHistory();
    initAccessibility();
    
    // Log de inicialización exitosa
    if (CONFIG.development.debug) {
        console.log('KOOPAGES inicializado correctamente');
    }
}

/**
 * Inicializa el sistema de navegación
 */
function initNavigation(navLinks, sections, menuToggle, nav) {
    // Navegación por secciones
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            try {
                const targetId = this.getAttribute('href').substring(1);
                navigateToSection(targetId, navLinks, sections, nav, menuToggle);
            } catch (error) {
                Utils.handleError(error, 'Navegación');
            }
        });
    });
    
    // Toggle del menú móvil
    menuToggle.addEventListener('click', function() {
        toggleMobileMenu(this, nav);
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
            closeMobileMenu(nav, menuToggle);
        }
    });
    
    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeMobileMenu(nav, menuToggle);
            menuToggle.focus();
        }
    });
}

/**
 * Navega a una sección específica
 */
function navigateToSection(targetId, navLinks, sections, nav, menuToggle) {
    // Validar targetId
    if (!targetId || !CONFIG.navigation.sections.includes(targetId)) {
        console.warn(`Sección inválida: ${targetId}`);
        return;
    }
    
    // Actualizar navegación activa
    navLinks.forEach(l => {
        l.classList.remove('active');
        l.removeAttribute('aria-current');
    });
    
    const activeLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
    }
    
    // Mostrar sección correspondiente
    sections.forEach(section => {
        section.classList.remove('active');
        section.setAttribute('aria-hidden', 'true');
        
        if (section.id === targetId) {
            section.classList.add('active');
            section.setAttribute('aria-hidden', 'false');
            
            // Enfocar el heading de la sección para accesibilidad
            const heading = section.querySelector('h2');
            if (heading) {
                heading.setAttribute('tabindex', '-1');
                setTimeout(() => heading.focus(), 100);
            }
        }
    });
    
    // Cerrar menú móvil si está abierto
    if (nav.classList.contains('active')) {
        closeMobileMenu(nav, menuToggle);
    }
    
    // Actualizar URL sin recargar la página
    if (CONFIG.navigation.updateURL && window.history && window.history.pushState) {
        history.pushState(null, null, `#${targetId}`);
    }
}

/**
 * Toggle del menú móvil
 */
function toggleMobileMenu(menuToggle, nav) {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    nav.classList.toggle('active');
    
    // Enfocar el primer enlace del menú cuando se abre
    if (!isExpanded) {
        const firstNavLink = nav.querySelector('.nav-link');
        if (firstNavLink) {
            setTimeout(() => firstNavLink.focus(), CONFIG.animations.focusDelay);
        }
    }
}

/**
 * Cierra el menú móvil
 */
function closeMobileMenu(nav, menuToggle) {
    nav.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
}

/**
 * Inicializa el sistema de búsqueda
 */
function initSearch(searchInput) {
    if (!searchInput) {
        console.warn('Input de búsqueda no encontrado');
        return;
    }
    
    // Búsqueda con debounce
    const debouncedSearch = Utils.debounce((searchTerm) => {
        try {
            filterWebs(searchTerm);
        } catch (error) {
            Utils.handleError(error, 'Búsqueda');
        }
    }, CONFIG.search.debounceDelay);
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim();
        debouncedSearch(searchTerm);
    });
    
    // Limpiar búsqueda con Escape
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && this.value) {
            this.value = '';
            filterWebs('');
            this.focus();
        }
    });
}

/**
 * Filtra las webs según el término de búsqueda
 */
function filterWebs(searchTerm) {
    const webCards = document.querySelectorAll('.web-card');
    const normalizedSearch = Utils.normalizeString(searchTerm);
    let visibleCount = 0;
    
    webCards.forEach(card => {
        try {
            const titleElement = card.querySelector('h3');
            const descElement = card.querySelector('p');
            
            if (!titleElement || !descElement) {
                console.warn('Elementos de tarjeta incompletos');
                return;
            }
            
            const title = Utils.normalizeString(titleElement.textContent);
            const description = Utils.normalizeString(descElement.textContent);
            const category = Utils.normalizeString(card.getAttribute('data-category') || '');
            
            const matches = normalizedSearch === '' || 
                          title.includes(normalizedSearch) || 
                          description.includes(normalizedSearch) ||
                          category.includes(normalizedSearch);
            
            if (matches) {
                card.style.display = 'block';
                card.removeAttribute('aria-hidden');
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.setAttribute('aria-hidden', 'true');
            }
        } catch (error) {
            Utils.handleError(error, 'Filtrado de tarjeta');
        }
    });
    
    // Mostrar mensaje si no hay resultados
    updateNoResultsMessage(visibleCount, searchTerm);
    
    // Anunciar resultados para lectores de pantalla
    announceSearchResults(visibleCount, searchTerm);
}

/**
 * Actualiza el mensaje de "sin resultados"
 */
function updateNoResultsMessage(visibleCount, searchTerm) {
    const container = document.getElementById('websContainer');
    if (!container) return;
    
    let noResultsMsg = container.querySelector('.no-results');
    
    if (visibleCount === 0 && searchTerm !== '') {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.setAttribute('role', 'status');
            noResultsMsg.setAttribute('aria-live', 'polite');
            
            const sanitizedTerm = Utils.escapeHTML(searchTerm);
            noResultsMsg.innerHTML = `
                <p>No se encontraron negocios que coincidan con "<strong>${sanitizedTerm}</strong>"</p>
                <button id="clearSearch" class="web-card-link" type="button">
                    ${CONFIG.messages.clearSearch}
                </button>
            `;
            container.appendChild(noResultsMsg);
            
            // Agregar evento al botón de limpiar
            const clearBtn = document.getElementById('clearSearch');
            if (clearBtn) {
                clearBtn.addEventListener('click', function() {
                    const searchInput = document.getElementById('searchInput');
                    if (searchInput) {
                        searchInput.value = '';
                        filterWebs('');
                        searchInput.focus();
                    }
                });
            }
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

/**
 * Anuncia resultados de búsqueda para lectores de pantalla
 */
function announceSearchResults(count, searchTerm) {
    const container = document.getElementById('websContainer');
    if (!container) return;
    
    let announcement = container.querySelector('.search-announcement');
    
    if (!announcement) {
        announcement = document.createElement('div');
        announcement.className = 'sr-only search-announcement';
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        container.insertBefore(announcement, container.firstChild);
    }
    
    if (searchTerm) {
        announcement.textContent = `${count} negocio${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
    } else {
        announcement.textContent = '';
    }
}

/**
 * Inicializa y carga las webs
 */
function initWebs() {
    if (typeof webs !== 'undefined' && Array.isArray(webs)) {
        try {
            loadWebs(webs);
        } catch (error) {
            Utils.handleError(error, 'Carga de webs');
            showNotification('Error al cargar los negocios', 'error');
        }
    } else {
        console.warn('Array de webs no encontrado o inválido');
        const container = document.getElementById('websContainer');
        if (container) {
            container.innerHTML = '<p class="no-webs">No hay negocios disponibles en este momento.</p>';
        }
    }
}

/**
 * Carga las webs en el contenedor
 */
function loadWebs(websArray) {
    const container = document.getElementById('websContainer');
    
    if (!container) {
        throw new Error('Contenedor de webs no encontrado');
    }
    
    container.innerHTML = '';
    
    if (!Array.isArray(websArray) || websArray.length === 0) {
        container.innerHTML = '<p class="no-webs">No hay negocios disponibles en este momento.</p>';
        return;
    }
    
    // Crear fragmento para mejor rendimiento
    const fragment = document.createDocumentFragment();
    
    websArray.forEach((web, index) => {
        try {
            // Validar datos del negocio
            const validation = Utils.validateWeb(web);
            if (!validation.valid) {
                console.warn(`Web inválida en índice ${index}:`, validation.errors);
                return;
            }
            
            const webCard = createWebCard(web, index);
            fragment.appendChild(webCard);
        } catch (error) {
            Utils.handleError(error, `Creación de tarjeta ${index}`);
        }
    });
    
    container.appendChild(fragment);
    
    // Inicializar lazy loading si está habilitado
    if (CONFIG.performance.enableLazyLoading && Utils.supportsFeature('intersectionObserver')) {
        initLazyLoading();
    }
}

/**
 * Crea una tarjeta de negocio
 */
function createWebCard(web, index) {
    const webCard = document.createElement('article');
    webCard.className = 'web-card';
    webCard.setAttribute('role', 'listitem');
    webCard.setAttribute('data-category', Utils.sanitizeHTML(web.category));
    
    // Sanitizar datos
    const title = Utils.escapeHTML(web.title);
    const description = Utils.escapeHTML(web.description);
    const url = Utils.isValidURL(web.url) ? web.url : '#';
    const image = Utils.escapeHTML(web.image);
    
    webCard.innerHTML = `
        <img 
            src="${image}" 
            alt="${title} - Vista previa del negocio" 
            loading="lazy"
            width="320"
            height="180"
            onerror="this.src='${CONFIG.images.defaultPlaceholder}'; this.onerror=null;">
        <div class="web-card-content">
            <h3>${title}</h3>
            <p>${description}</p>
            <a href="${url}" 
               class="web-card-link" 
               target="_blank" 
               rel="noopener noreferrer"
               aria-label="Visitar ${title} (se abre en nueva ventana)">
                Visitar sitio
                <svg class="icon" width="16" height="16" aria-hidden="true" focusable="false">
                    <use xlink:href="icons.svg#external-link"></use>
                </svg>
            </a>
        </div>
    `;
    
    return webCard;
}

/**
 * Inicializa lazy loading para imágenes
 */
function initLazyLoading() {
    const images = document.querySelectorAll('.web-card img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // El navegador soporta lazy loading nativo
        return;
    }
    
    // Fallback con Intersection Observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Agrega una nueva web al listado
 */
function addWeb(title, description, url, image, category = 'general') {
    if (typeof webs === 'undefined') {
        console.error('Array de webs no disponible');
        return false;
    }
    
    try {
        const newWeb = {
            title: Utils.sanitizeHTML(title),
            description: Utils.sanitizeHTML(description),
            url,
            image: Utils.sanitizeHTML(image),
            category: Utils.sanitizeHTML(category)
        };
        
        // Validar el nuevo negocio
        const validation = Utils.validateWeb(newWeb);
        if (!validation.valid) {
            console.error('Validación fallida:', validation.errors);
            showNotification('Error: Datos inválidos', 'error');
            return false;
        }
        
        webs.push(newWeb);
        loadWebs(webs);
        showNotification(`"${title}" ${CONFIG.messages.addedSuccessfully}`, 'success');
        return true;
    } catch (error) {
        Utils.handleError(error, 'Agregar web');
        showNotification('Error al agregar el negocio', 'error');
        return false;
    }
}

/**
 * Filtra webs por categoría
 */
function filterWebsByCategory(category) {
    if (typeof webs === 'undefined') {
        console.error('Array de webs no disponible');
        return;
    }
    
    try {
        const filteredWebs = category === 'all' 
            ? webs 
            : webs.filter(web => web.category === category);
        
        loadWebs(filteredWebs);
        
        // Actualizar interfaz para mostrar categoría activa
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === category) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.setAttribute('aria-pressed', 'false');
            }
        });
    } catch (error) {
        Utils.handleError(error, 'Filtrado por categoría');
    }
}

/**
 * Muestra una notificación
 */
function showNotification(message, type = 'info') {
    try {
        const notification = createNotification(message, type);
        document.body.appendChild(notification);
        
        // Animación de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-eliminar después del tiempo configurado
        const autoClose = setTimeout(() => {
            closeNotification(notification);
        }, CONFIG.notifications.duration);
        
        // Botón de cerrar
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                clearTimeout(autoClose);
                closeNotification(notification);
            });
        }
    } catch (error) {
        Utils.handleError(error, 'Notificación');
        console.error('Error al mostrar notificación:', message);
    }
}

/**
 * Crea el elemento de notificación
 */
function createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.setAttribute('aria-atomic', 'true');
    
    const config = CONFIG.notifications.types[type] || CONFIG.notifications.types.info;
    const sanitizedMessage = Utils.escapeHTML(message);
    
    notification.innerHTML = `
        <svg class="icon" width="20" height="20" aria-hidden="true" focusable="false">
            <use xlink:href="icons.svg#${config.icon}"></use>
        </svg>
        <span>${sanitizedMessage}</span>
        <button class="notification-close" aria-label="Cerrar notificación" type="button">
            <svg class="icon" width="16" height="16" aria-hidden="true" focusable="false">
                <use xlink:href="icons.svg#close"></use>
            </svg>
        </button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.25rem;
        background: ${config.color};
        color: white;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow-lg);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
        transform: translateX(calc(100% + 20px));
        transition: transform 0.3s ease;
    `;
    
    return notification;
}

/**
 * Cierra una notificación
 */
function closeNotification(notification) {
    if (!notification || !notification.parentNode) return;
    
    notification.style.transform = 'translateX(calc(100% + 20px))';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

/**
 * Inicializa el manejo del historial del navegador
 */
function initBrowserHistory() {
    window.addEventListener('popstate', function() {
        try {
            const hash = window.location.hash.substring(1) || CONFIG.navigation.defaultSection;
            const targetLink = document.querySelector(`.nav-link[href="#${hash}"]`);
            
            if (targetLink) {
                targetLink.click();
            }
        } catch (error) {
            Utils.handleError(error, 'Historial del navegador');
        }
    });
    
    // Cargar sección inicial desde URL
    const initialHash = window.location.hash.substring(1);
    if (initialHash && CONFIG.navigation.sections.includes(initialHash)) {
        const initialLink = document.querySelector(`.nav-link[href="#${initialHash}"]`);
        if (initialLink) {
            setTimeout(() => initialLink.click(), 100);
        }
    }
}

/**
 * Inicializa mejoras de accesibilidad
 */
function initAccessibility() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    // Mejorar focus visible en elementos interactivos
    document.querySelectorAll('a, button, input, select, textarea').forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('has-focus');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('has-focus');
        });
    });
}

// Exportar funciones públicas para uso externo
if (typeof window !== 'undefined') {
    window.KooPages = {
        filterWebs,
        filterWebsByCategory,
        addWeb,
        showNotification,
        loadWebs
    };
}
