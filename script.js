// ========== CONFIGURACIÓN ==========
const CONFIG = {
    site: {
        name: 'KOOPAGES',
        description: 'Plataforma de negocios patrocinados',
        url: 'https://koopages.github.io/oficial/',
        author: 'KOOPAGES',
        year: 2025
    },
    navigation: {
        defaultSection: 'inicio',
        sections: ['inicio', 'negocios', 'info'],
        smoothScroll: false,
        updateURL: true
    }
};

// ========== DATOS DE NEGOCIOS ==========
const webs = [
    {
        title: "Suri Nails",
        description: "Especialistas en manicura, pedicura y uñas acrílicas.",
        url: "https://spoo.me/suri_nails",
        image: "https://github.com/KooPages/suri_nails/raw/refs/heads/main/logo.jpg",
        category: "Servicio",
        sponsored: true
    },
    {
        title: "Tienda Iyawo",
        description: "Equipos electrodomésticos verificados y con facturación al por mayor.",
        url: "https://spoo.me/tienda_iyawo",
        image: "https://github.com/KooPages/tienda_iyawo/raw/refs/heads/main/logo.jpg",
        category: "Tienda",
        sponsored: true
    },
    {
        title: "Aly Salon",
        description: "Servicios profesionales de peluquería y estilismo.",
        url: "https://spoo.me/aly_salon",
        image: "https://github.com/KooPages/aly_salon/raw/refs/heads/main/logo.jpg",
        category: "Servicio",
        sponsored: true
    },
    {
        title: "Carnicos Habana",
        description: "Variedad de cárnicos importados de primera calidad.",
        url: "https://spoo.me/carnicos_habana",
        image: "https://github.com/KooPages/carnicos_habana/raw/refs/heads/main/logo.jpg",
        category: "Servicio",
        sponsored: true
    },
    {
        title: "Tienda De Todo Un Poco",
        description: "Comercio de variedades en Santa Clara.",
        url: "https://spoo.me/de_todo_un_poco",
        image: "https://github.com/KooPages/tienda_de_todo_un_poco/raw/refs/heads/main/logo.png",
        category: "Tienda",
        sponsored: true
    },
    {
        title: "Dulceria Lisset",
        description: "Repostería artesanal y dulces por encargo.",
        url: "https://spoo.me/dulceria_lisset",
        image: "https://github.com/KooPages/dulceria_lisset/raw/refs/heads/main/logo.jpg",
        category: "Servicio",
        sponsored: true
    },
    {
        title: "Dulce Alegria",
        description: "Si buscas algo dulce entonces ven para que te alegres, a tu orden y a gusto",
        url: "https://spoo.me/Dulce_Alegria",
        image: "https://github.com/KooPages/dulce_alegria/raw/refs/heads/main/logo.jpg",
        category: "Tienda",
        sponsored: true
    },
];

// ========== FUNCIONES DE RECOMENDACIÓN ==========
function getDailyRecommendation() {
    const today = new Date().toISOString().slice(0, 10);
    const storageKey = 'dailyRecommendationDate';
    const recommendationKey = 'dailyRecommendationWeb';
    const lastRecommendationDate = localStorage.getItem(storageKey);
    let recommendedWeb = JSON.parse(localStorage.getItem(recommendationKey));

    if (lastRecommendationDate === today && recommendedWeb) {
        return recommendedWeb;
    }

    const businessWebs = webs.filter(web => web.title && web.url !== '#');
    if (businessWebs.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * businessWebs.length);
    recommendedWeb = businessWebs[randomIndex];
    
    localStorage.setItem(storageKey, today);
    localStorage.setItem(recommendationKey, JSON.stringify(recommendedWeb));
    
    return recommendedWeb;
}

function displayDailyRecommendation() {
    const recommendation = getDailyRecommendation();
    const container = document.getElementById('dailyRecommendation');
    
    if (!container) return;
    
    if (recommendation) {
        const title = recommendation.title;
        const url = recommendation.url;
        const image = recommendation.image || 'https://via.placeholder.com/300x300/1A237E/FFFFFF?text=KOOPAGES';
        const sponsoredStatus = recommendation.sponsored ? 
            '<span class="sponsored-badge active">✓ Está haciendo patrocinado</span>' : 
            '<span class="sponsored-badge inactive">✗ Ya no está haciendo patrocinado</span>';
        
        const cardHTML = `
            <div class="recommendation-card" itemscope itemtype="http://schema.org/LocalBusiness">
                <img src="${image}" alt="${title}" class="recommendation-img" itemprop="image" 
                     onerror="this.src='https://via.placeholder.com/300x300/1A237E/FFFFFF?text=KOOPAGES';">
                <div class="recommendation-content">
                    <h4 itemprop="name">${title}</h4>
                    ${sponsoredStatus}
                    <p itemprop="description">${recommendation.description || 'Negocio recomendado por KOOPAGES'}</p>
                    <a href="${url}" class="recommendation-link" target="_blank" rel="noopener noreferrer" itemprop="url">
                        Visitar Ahora
                    </a>
                </div>
            </div>
        `;
        
        container.innerHTML += cardHTML;
    } else {
        container.innerHTML += '<p>No hay negocios disponibles para recomendar hoy.</p>';
    }
}

// ========== FUNCIONES DE CARGA DE NEGOCIOS ==========
function loadWebs() {
    const container = document.getElementById('websContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!Array.isArray(webs) || webs.length === 0) {
        container.innerHTML = '<p>No hay negocios disponibles en este momento.</p>';
        return;
    }
    
    const fragment = document.createDocumentFragment();
    
    webs.forEach((web, index) => {
        if (!web.title || web.url === '#') return;
        
        const title = web.title;
        const url = web.url;
        const image = web.image || 'https://via.placeholder.com/150x150/1A237E/FFFFFF?text=KOOPAGES';
        const sponsoredStatus = web.sponsored ? 
            '<span class="sponsored-badge active">✓ Esta Patrocinado</span>' : 
            '<span class="sponsored-badge inactive">✗ Sin Patrocinio</span>';
        
        const webCard = document.createElement('article');
        webCard.className = 'web-card';
        webCard.setAttribute('itemscope', '');
        webCard.setAttribute('itemtype', 'http://schema.org/LocalBusiness');
        
        webCard.innerHTML = `
            <meta itemprop="position" content="${index + 1}">
            <img src="${image}" alt="${title}" loading="lazy" width="100" height="100" itemprop="image" 
                 onerror="this.src='https://via.placeholder.com/150x150/1A237E/FFFFFF?text=KOOPAGES';">
            <h3 itemprop="name">${title}</h3>
            ${sponsoredStatus}
            <p itemprop="description" style="display:none;">${web.description || 'Negocio patrocinado por KOOPAGES'}</p>
            <meta itemprop="category" content="${web.category}">
            <a href="${url}" class="web-card-link" target="_blank" rel="noopener noreferrer" itemprop="url">
                Visitar Plataforma
            </a>
        `;
        
        fragment.appendChild(webCard);
    });
    
    container.appendChild(fragment);
}

// ========== FUNCIONES DE NAVEGACIÓN ==========
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');
    
    if (!navLinks.length || !sections.length || !menuToggle || !nav) return;
    
    // Event listeners para enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            navigateToSection(targetId, navLinks, sections, nav, menuToggle);
        });
    });
    
    // Event listener para menú móvil
    menuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('active');
    });
    
    // Navegación inicial basada en hash
    const initialHash = window.location.hash.substring(1);
    if (initialHash && CONFIG.navigation.sections.includes(initialHash)) {
        const initialLink = document.querySelector(`.nav-link[href="#${initialHash}"]`);
        if (initialLink) setTimeout(() => initialLink.click(), 100);
    }
}

function navigateToSection(targetId, navLinks, sections, nav, menuToggle) {
    if (!targetId || !CONFIG.navigation.sections.includes(targetId)) return;
    
    // Actualizar enlaces activos
    navLinks.forEach(l => {
        l.classList.remove('active');
        l.removeAttribute('aria-current');
    });
    
    const activeLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
    }
    
    // Mostrar/ocultar secciones
    sections.forEach(section => {
        section.classList.remove('active');
        section.setAttribute('aria-hidden', 'true');
        
        if (section.id === targetId) {
            section.classList.add('active');
            section.setAttribute('aria-hidden', 'false');
        }
    });
    
    // Cerrar menú móvil si está abierto
    if (nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Actualizar URL
    if (CONFIG.navigation.updateURL && window.history && window.history.pushState) {
        history.pushState(null, null, `#${targetId}`);
    }
}

// ========== FUNCIONES DE WHATSAPP ==========
function initWhatsAppButton() {
    const whatsappBtn = document.getElementById('whatsappBtn');
    const whatsappNotification = document.getElementById('whatsappNotification');
    const closeNotification = document.getElementById('closeNotification');
    const whatsappGroupURL = 'https://chat.whatsapp.com/K0bZ1d1yySLL9qgBl3cZus';
    
    if (!whatsappBtn || !whatsappNotification) return;
    
    // Mostrar notificación después de 3 segundos
    setTimeout(() => {
        const notificationClosed = localStorage.getItem('whatsappNotificationClosed');
        if (!notificationClosed) {
            whatsappNotification.classList.add('show');
        }
    }, 3000);
    
    // Cerrar notificación
    if (closeNotification) {
        closeNotification.addEventListener('click', function(e) {
            e.stopPropagation();
            whatsappNotification.classList.remove('show');
            localStorage.setItem('whatsappNotificationClosed', 'true');
        });
    }
    
    // Abrir grupo de WhatsApp
    whatsappBtn.addEventListener('click', function() {
        whatsappNotification.classList.remove('show');
        localStorage.setItem('whatsappNotificationClosed', 'true');
        window.open(whatsappGroupURL, '_blank', 'noopener,noreferrer');
    });
}

// ========== INICIALIZACIÓN DE LA APLICACIÓN ==========
function initializeApp() {
    initNavigation();
    displayDailyRecommendation();
    loadWebs();
    initWhatsAppButton();
    
    // Registrar Service Worker si está disponible
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js');
        });
    }
}

// ========== EJECUCIÓN PRINCIPAL ==========
document.addEventListener('DOMContentLoaded', initializeApp);