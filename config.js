/**
 * Archivo de configuración centralizada para KOOPAGES
 * Contiene constantes, configuraciones y parámetros globales
 */

const CONFIG = {
    // Información del sitio
    site: {
        name: 'KOOPAGES',
        description: 'Plataforma de negocios patrocinados por KOOWEXA',
        url: 'https://koopages.com',
        author: 'KOOPAGES',
        year: 2025,
        version: '1.0.0'
    },

    // Configuración de búsqueda
    search: {
        debounceDelay: 300, // ms
        minCharacters: 1,
        placeholder: 'Buscar negocios por nombre o descripción...',
        noResultsMessage: 'No se encontraron negocios que coincidan con'
    },

    // Configuración de notificaciones
    notifications: {
        duration: 5000, // ms
        position: 'top-right',
        types: {
            success: {
                color: '#10b981',
                icon: 'feature1'
            },
            error: {
                color: '#ef4444',
                icon: 'close'
            },
            info: {
                color: '#3b82f6',
                icon: 'feature2'
            },
            warning: {
                color: '#f59e0b',
                icon: 'feature1'
            }
        }
    },

    // Configuración de animaciones
    animations: {
        fadeInDuration: 500, // ms
        slideDownDuration: 300, // ms
        hoverTransition: 300, // ms
        focusDelay: 100 // ms
    },

    // Configuración de imágenes
    images: {
        lazyLoad: true,
        defaultPlaceholder: 'https://via.placeholder.com/300x160/2563eb/FFFFFF?text=KOOPAGES',
        defaultAlt: 'Imagen de negocio',
        quality: 85,
        formats: ['webp', 'jpg', 'png']
    },

    // Configuración de categorías
    categories: {
        all: 'Todos',
        buscadores: 'Buscadores',
        entretenimiento: 'Entretenimiento',
        educacion: 'Educación',
        desarrollo: 'Desarrollo',
        musica: 'Música',
        social: 'Redes Sociales',
        general: 'General'
    },

    // Configuración de navegación
    navigation: {
        defaultSection: 'inicio',
        sections: ['inicio', 'negocios', 'info'],
        smoothScroll: true,
        updateURL: true
    },

    // Configuración de accesibilidad
    accessibility: {
        skipLinkText: 'Saltar al contenido principal',
        ariaLivePolite: true,
        focusManagement: true,
        keyboardNavigation: true
    },

    // Configuración de SEO
    seo: {
        titleTemplate: '%s | KOOPAGES',
        defaultTitle: 'KOOPAGES - Plataforma de Negocios',
        separator: ' | ',
        keywords: [
            'negocios',
            'patrocinio',
            'KOOWEXA',
            'servicios profesionales',
            'tiendas en línea',
            'comercio digital'
        ]
    },

    // Configuración de validación
    validation: {
        url: {
            pattern: /^https?:\/\/.+/,
            message: 'La URL debe comenzar con http:// o https://'
        },
        title: {
            minLength: 3,
            maxLength: 100,
            message: 'El título debe tener entre 3 y 100 caracteres'
        },
        description: {
            minLength: 10,
            maxLength: 500,
            message: 'La descripción debe tener entre 10 y 500 caracteres'
        }
    },

    // Configuración de rendimiento
    performance: {
        enableLazyLoading: true,
        enableDebounce: true,
        enableCaching: false, // Para futuras implementaciones
        cacheExpiration: 3600000 // 1 hora en ms
    },

    // Mensajes del sistema
    messages: {
        loading: 'Cargando...',
        error: 'Ha ocurrido un error',
        success: 'Operación exitosa',
        noData: 'No hay datos disponibles',
        addedSuccessfully: 'ha sido agregado correctamente',
        clearSearch: 'Limpiar búsqueda'
    },

    // Configuración de desarrollo
    development: {
        debug: false,
        logErrors: true,
        showWarnings: true
    },

    // Redes sociales (para futuras implementaciones)
    social: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: ''
    },

    // API endpoints (para futuras implementaciones)
    api: {
        baseURL: '',
        endpoints: {
            webs: '/api/webs',
            categories: '/api/categories',
            search: '/api/search'
        },
        timeout: 10000 // ms
    }
};

// Congelar el objeto para evitar modificaciones accidentales
Object.freeze(CONFIG);

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
