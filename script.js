// Funciones principales optimizadas de la plataforma KOOPAGES

// Navegación entre secciones
document.addEventListener('DOMContentLoaded', function() {
    // Elementos de navegación
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');
    
    // Navegación por secciones
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener el ID de la sección objetivo
            const targetId = this.getAttribute('href').substring(1);
            
            // Actualizar navegación activa
            navLinks.forEach(l => {
                l.classList.remove('active');
                l.removeAttribute('aria-current');
            });
            this.classList.add('active');
            this.setAttribute('aria-current', 'page');
            
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
                        heading.focus();
                    }
                }
            });
            
            // Cerrar menú móvil si está abierto
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
            
            // Actualizar URL sin recargar la página
            history.pushState(null, null, `#${targetId}`);
        });
    });
    
    // Toggle del menú móvil
    menuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('active');
        
        // Enfocar el primer enlace del menú cuando se abre
        if (!isExpanded) {
            const firstNavLink = nav.querySelector('.nav-link');
            if (firstNavLink) {
                setTimeout(() => firstNavLink.focus(), 100);
            }
        }
    });
    
    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.focus();
        }
    });
    
    // Funcionalidad de búsqueda con debounce
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.trim().toLowerCase();
                filterWebs(searchTerm);
            }, 300);
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
    
    // Cargar webs desde webs.js
    if (typeof webs !== 'undefined') {
        loadWebs(webs);
    }
    
    // Manejar navegación con botones de retroceso/avance
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1) || 'inicio';
        const targetLink = document.querySelector(`.nav-link[href="#${hash}"]`);
        
        if (targetLink) {
            targetLink.click();
        }
    });
    
    // Scroll suave para anclas
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Función para filtrar webs
function filterWebs(searchTerm) {
    const webCards = document.querySelectorAll('.web-card');
    let visibleCount = 0;
    
    webCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const category = card.getAttribute('data-category') || '';
        
        if (searchTerm === '' || 
            title.includes(searchTerm) || 
            description.includes(searchTerm) ||
            category.includes(searchTerm)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Mostrar mensaje si no hay resultados
    const container = document.getElementById('websContainer');
    let noResultsMsg = container.querySelector('.no-results');
    
    if (visibleCount === 0 && searchTerm !== '') {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.innerHTML = `
                <p>No se encontraron negocios que coincidan con "<strong>${searchTerm}</strong>"</p>
                <button id="clearSearch" class="web-card-link">Limpiar búsqueda</button>
            `;
            container.appendChild(noResultsMsg);
            
            // Agregar evento al botón de limpiar
            document.getElementById('clearSearch').addEventListener('click', function() {
                document.getElementById('searchInput').value = '';
                filterWebs('');
            });
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Función para cargar las webs en el contenedor
function loadWebs(websArray) {
    const container = document.getElementById('websContainer');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (websArray.length === 0) {
        container.innerHTML = '<p class="no-webs">No hay negocios disponibles en este momento.</p>';
        return;
    }
    
    websArray.forEach((web, index) => {
        const webCard = document.createElement('div');
        webCard.className = 'web-card';
        webCard.setAttribute('role', 'listitem');
        webCard.setAttribute('data-category', web.category);
        
        webCard.innerHTML = `
            <img src="${web.image}" alt="${web.title} - Vista previa" loading="lazy">
            <div class="web-card-content">
                <h3>${web.title}</h3>
                <p>${web.description}</p>
                <a href="${web.url}" class="web-card-link" target="_blank" rel="noopener noreferrer">
                    Visitar sitio
                    <svg class="icon" width="16" height="16" aria-hidden="true">
                        <use xlink:href="icons.svg#external-link"></use>
                    </svg>
                </a>
            </div>
        `;
        
        container.appendChild(webCard);
    });
}

// Función para agregar una nueva web al listado
function addWeb(title, description, url, image, category = 'general') {
    if (typeof webs === 'undefined') return;
    
    const newWeb = {
        title,
        description,
        url,
        image,
        category
    };
    
    webs.push(newWeb);
    loadWebs(webs);
    showNotification(`"${title}" ha sido agregado correctamente`, 'success');
}

// Función para filtrar webs por categoría
function filterWebsByCategory(category) {
    if (typeof webs === 'undefined') return;
    
    const filteredWebs = category === 'all' 
        ? webs 
        : webs.filter(web => web.category === category);
    
    loadWebs(filteredWebs);
    
    // Actualizar interfaz para mostrar categoría activa
    document.querySelectorAll('.category-filter').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    // Icono según el tipo
    let icon = '';
    switch(type) {
        case 'success':
            icon = '<svg class="icon" width="20" height="20" aria-hidden="true"><use xlink:href="icons.svg#feature1"></use></svg>';
            break;
        case 'error':
            icon = '<svg class="icon" width="20" height="20" aria-hidden="true"><use xlink:href="icons.svg#close"></use></svg>';
            break;
        default:
            icon = '<svg class="icon" width="20" height="20" aria-hidden="true"><use xlink:href="icons.svg#feature2"></use></svg>';
    }
    
    notification.innerHTML = `
        ${icon}
        <span>${message}</span>
        <button class="notification-close" aria-label="Cerrar notificación">
            <svg class="icon" width="16" height="16" aria-hidden="true">
                <use xlink:href="icons.svg#close"></use>
            </svg>
        </button>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.25rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow-lg);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Botón de cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto-eliminar después de 5 segundos
    const autoClose = setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Función para cerrar notificación
    function closeNotification(notif) {
        clearTimeout(autoClose);
        notif.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notif.parentNode) {
                notif.parentNode.removeChild(notif);
            }
        }, 300);
    }
}

// Utilidad para clase de solo lectura (accesibilidad)
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    
    .no-results {
        text-align: center;
        padding: 3rem 2rem;
        grid-column: 1 / -1;
    }
    
    .no-results p {
        margin-bottom: 1.5rem;
        font-size: 1.125rem;
    }
    
    .no-webs {
        text-align: center;
        padding: 3rem 2rem;
        color: var(--text-light);
        font-size: 1.125rem;
        grid-column: 1 / -1;
    }
`;
document.head.appendChild(style);