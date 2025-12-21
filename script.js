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
        smoothScroll: true,
        updateURL: true
    }
};

const webs = [
    {
        title: "Suri Nails",
        description: "Especialistas en manicura, pedicura y uñas acrílicas.",
        url: "https://spoo.me/suri_nails",
        image: "https://github.com/KooPages/suri_nails/raw/refs/heads/main/logo.jpg",
        category: "Servicio"
    },
    {
        title: "Tienda Iyawo",
        description: "Artículos religiosos y esotéricos para la Santería.",
        url: "https://spoo.me/tienda_iyawo",
        image: "https://github.com/KooPages/tienda_iyawo/raw/refs/heads/main/logo.jpg",
        category: "Tienda"
    },
    {
        title: "Aly Salon",
        description: "Servicios profesionales de peluquería y estilismo.",
        url: "https://spoo.me/aly_salon",
        image: "https://github.com/KooPages/aly_salon/raw/refs/heads/main/logo.jpg",
        category: "Servicio"
    },
    {
        title: "Carnicos Habana",
        description: "Variedad de cárnicos importados de primera calidad.",
        url: "https://spoo.me/carnicos_habana",
        image: "https://github.com/KooPages/carnicos_habana/raw/refs/heads/main/logo.jpg",
        category: "Servicio"
    },
    {
        title: "Tienda De Todo Un Poco",
        description: "Comercio de variedades en Santa Clara.",
        url: "https://spoo.me/de_todo_un_poco",
        image: "https://github.com/KooPages/tienda_de_todo_un_poco/raw/refs/heads/main/logo.png",
        category: "Tienda"
    },
    {
        title: "Dulceria Lisst",
        description: "Repostería artesanal y dulces por encargo.",
        url: "https://spoo.me/dulceria_lisset",
        image: "https://github.com/KooPages/dulceria_lisset/raw/refs/heads/main/logo.jpg",
        category: "Servicio"
    },
    {
        title: "Vitivo Shop",
        description: "Tienda de productos variados, especializada en alimentos.",
        url: "https://spoo.me/vitico_shop",
        image: "https://github.com/KooPages/vitico_shop/raw/refs/heads/main/logo.jpg",
        category: "Tienda"
    }
];

const Utils = {
    escapeHTML(str) {
        if (!str) return '';
        const htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };
        return str.replace(/[&<>"'/]/g, (char) => htmlEscapes[char]);
    },

    isValidURL(url) {
        if (!url) return false;
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    },

    truncate(text, length = 50, suffix = '...') {
        if (!text || text.length <= length) return text;
        return text.substring(0, length).trim() + suffix;
    }
};

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
        const title = Utils.escapeHTML(recommendation.title);
        const url = Utils.isValidURL(recommendation.url) ? recommendation.url : '#';
        const image = recommendation.image || 'https://via.placeholder.com/300x300/1A237E/FFFFFF?text=KOOPAGES';
        
        const cardHTML = `
            <div class="recommendation-card">
                <img src="${image}" alt="${title}" class="recommendation-img" 
                     onerror="this.src='https://via.placeholder.com/300x300/1A237E/FFFFFF?text=KOOPAGES'; this.onerror=null;">
                <div class="recommendation-content">
                    <h4>${title}</h4>
                    <a href="${url}" class="recommendation-link" target="_blank" rel="noopener noreferrer">
                        <svg width="20" height="20" style="margin-right: 8px;">
                            <use xlink:href="#external-link"></use>
                        </svg>
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

function loadWebs() {
    const container = document.getElementById('websContainer');
    if (!container) return;

    container.innerHTML = '';
    
    if (!Array.isArray(webs) || webs.length === 0) {
        container.innerHTML = '<p>No hay negocios disponibles en este momento.</p>';
        return;
    }

    const fragment = document.createDocumentFragment();
    
    webs.forEach((web) => {
        if (!web.title || web.url === '#') return;
        
        const title = Utils.escapeHTML(web.title);
        const url = Utils.isValidURL(web.url) ? web.url : '#';
        const image = web.image || 'https://via.placeholder.com/150x150/1A237E/FFFFFF?text=KOOPAGES';
        
        const webCard = document.createElement('article');
        webCard.className = 'web-card';
        
        webCard.innerHTML = `
            <img src="${image}" alt="${title}" loading="lazy" width="100" height="100"
                 onerror="this.src='https://via.placeholder.com/150x150/1A237E/FFFFFF?text=KOOPAGES'; this.onerror=null;">
            <h3>${title}</h3>
            <a href="${url}" class="web-card-link" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18">
                    <use xlink:href="#external-link"></use>
                </svg>
                Visitar Plataforma
            </a>
        `;
        
        fragment.appendChild(webCard);
    });
    
    container.appendChild(fragment);
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');

    if (!navLinks.length || !sections.length || !menuToggle || !nav) return;

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            navigateToSection(targetId, navLinks, sections, nav, menuToggle);
        });
    });

    menuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.focus();
        }
    });

    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1) || CONFIG.navigation.defaultSection;
        const targetLink = document.querySelector(`.nav-link[href="#${hash}"]`);
        if (targetLink) targetLink.click();
    });

    const initialHash = window.location.hash.substring(1);
    if (initialHash && CONFIG.navigation.sections.includes(initialHash)) {
        const initialLink = document.querySelector(`.nav-link[href="#${initialHash}"]`);
        if (initialLink) setTimeout(() => initialLink.click(), 100);
    }
}

function navigateToSection(targetId, navLinks, sections, nav, menuToggle) {
    if (!targetId || !CONFIG.navigation.sections.includes(targetId)) return;

    navLinks.forEach(l => {
        l.classList.remove('active');
        l.removeAttribute('aria-current');
    });

    const activeLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
    }

    sections.forEach(section => {
        section.classList.remove('active');
        section.setAttribute('aria-hidden', 'true');
        
        if (section.id === targetId) {
            section.classList.add('active');
            section.setAttribute('aria-hidden', 'false');
            
            const heading = section.querySelector('h2');
            if (heading) {
                heading.setAttribute('tabindex', '-1');
                setTimeout(() => heading.focus(), 100);
            }
        }
    });

    if (nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    if (CONFIG.navigation.updateURL && window.history && window.history.pushState) {
        history.pushState(null, null, `#${targetId}`);
    }
}

function initializeApp() {
    try {
        initNavigation();
        displayDailyRecommendation();
        loadWebs();
        
        document.documentElement.style.setProperty('--scroll-padding', '85px');
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);