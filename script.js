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
    // Elementos de navegación
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');

    
    // Validar elementos críticos
    if (!navLinks.length || !sections.length || !menuToggle || !nav) {
        throw new Error('Elementos críticos del DOM no encontrados');
    }
    
    // Inicializar módulos
    initNavigation(navLinks, sections, menuToggle, nav);
    initWebs();
    initBrowserHistory();
    initAccessibility();
    
    // Log de inicialización exitosa
    if (CONFIG.development.debug) {
        console.log('KOOPAGES inicializado correctamente');
    }
}

/**
 * Inicializa la solicitud de permisos (Almacenamiento, Ubicación, Notificaciones)
 */

/**
 * Solicita permiso para almacenamiento persistente
 */
async function requestPersistentStorage() {
    if (!navigator.storage || !navigator.storage.persist) {
        if (CONFIG.development.debug) {
            console.warn('API de Storage Manager no soportada o persistencia no disponible.');
        }
        return;
    }

    try {
        const isPersisted = await navigator.storage.persisted();
        if (isPersisted) {
            if (CONFIG.development.debug) {
                console.log('Almacenamiento ya es persistente.');
            }
            return;
        }

        const persistenceGranted = await navigator.storage.persist();
        if (persistenceGranted) {
            showNotification('Almacenamiento persistente activado.', 'success');
        } else {
            if (CONFIG.development.debug) {
                console.warn('Permiso de almacenamiento persistente denegado por el usuario o el navegador.');
            }
        }
    } catch (error) {
        Utils.handleError(error, 'Almacenamiento Persistente');
    }
}

/**
 * Solicita permiso para Notificaciones
 */

/**
 * Solicita permiso para Ubicación (Llamada nativa)
 */

/**
 * Muestra un mensaje previo (pre-permission prompt) antes de la solicitud nativa.
 * @param {string} type - 'notification' o 'location'
 */

/**
 * Inicializa los botones de solicitud de permisos en la interfaz
 */

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

/**
 * Filtra las webs según el término de búsqueda
 */

/**
 * Actualiza el mensaje de "sin resultados"
 */

/**
 * Anuncia resultados de búsqueda para lectores de pantalla
 */

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
        loadWebs,
        // Exportar las nuevas funciones para posibles llamadas externas
        showPermissionPrompt,
        requestNotificationPermissionNative,
        requestLocationPermissionNative
    };
}
