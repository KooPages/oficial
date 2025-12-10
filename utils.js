/**
 * Utilidades y funciones auxiliares para KOOPAGES
 * Incluye sanitización, validación y helpers generales
 */

const Utils = {
    /**
     * Sanitiza una cadena HTML para prevenir XSS
     * @param {string} str - Cadena a sanitizar
     * @returns {string} Cadena sanitizada
     */
    sanitizeHTML(str) {
        if (!str) return '';
        
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },

    /**
     * Escapa caracteres especiales HTML
     * @param {string} str - Cadena a escapar
     * @returns {string} Cadena escapada
     */
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

    /**
     * Valida una URL
     * @param {string} url - URL a validar
     * @returns {boolean} true si es válida
     */
    isValidURL(url) {
        if (!url) return false;
        
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    },

    /**
     * Valida un email
     * @param {string} email - Email a validar
     * @returns {boolean} true si es válido
     */
    isValidEmail(email) {
        if (!email) return false;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Trunca un texto a una longitud específica
     * @param {string} text - Texto a truncar
     * @param {number} length - Longitud máxima
     * @param {string} suffix - Sufijo (por defecto '...')
     * @returns {string} Texto truncado
     */
    truncate(text, length = 100, suffix = '...') {
        if (!text || text.length <= length) return text;
        
        return text.substring(0, length).trim() + suffix;
    },

    /**
     * Debounce para optimizar eventos frecuentes
     * @param {Function} func - Función a ejecutar
     * @param {number} wait - Tiempo de espera en ms
     * @returns {Function} Función con debounce
     */
    debounce(func, wait = 300) {
        let timeout;
        
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle para limitar ejecución de funciones
     * @param {Function} func - Función a ejecutar
     * @param {number} limit - Límite de tiempo en ms
     * @returns {Function} Función con throttle
     */
    throttle(func, limit = 300) {
        let inThrottle;
        
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Formatea una fecha
     * @param {Date|string} date - Fecha a formatear
     * @param {string} locale - Locale (por defecto 'es-ES')
     * @returns {string} Fecha formateada
     */
    formatDate(date, locale = 'es-ES') {
        if (!date) return '';
        
        const dateObj = date instanceof Date ? date : new Date(date);
        
        if (isNaN(dateObj.getTime())) return '';
        
        return dateObj.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    /**
     * Genera un ID único
     * @param {string} prefix - Prefijo opcional
     * @returns {string} ID único
     */
    generateId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Obtiene un parámetro de la URL
     * @param {string} param - Nombre del parámetro
     * @returns {string|null} Valor del parámetro
     */
    getURLParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    /**
     * Establece un parámetro en la URL
     * @param {string} param - Nombre del parámetro
     * @param {string} value - Valor del parámetro
     */
    setURLParam(param, value) {
        const url = new URL(window.location);
        url.searchParams.set(param, value);
        window.history.pushState({}, '', url);
    },

    /**
     * Copia texto al portapapeles
     * @param {string} text - Texto a copiar
     * @returns {Promise<boolean>} true si se copió exitosamente
     */
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback para navegadores antiguos
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    return true;
                } finally {
                    document.body.removeChild(textArea);
                }
            }
        } catch (error) {
            console.error('Error al copiar al portapapeles:', error);
            return false;
        }
    },

    /**
     * Detecta si el usuario está en un dispositivo móvil
     * @returns {boolean} true si es móvil
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    },

    /**
     * Detecta si el navegador soporta una característica
     * @param {string} feature - Característica a verificar
     * @returns {boolean} true si es soportada
     */
    supportsFeature(feature) {
        const features = {
            localStorage: () => {
                try {
                    const test = '__test__';
                    localStorage.setItem(test, test);
                    localStorage.removeItem(test);
                    return true;
                } catch {
                    return false;
                }
            },
            serviceWorker: () => 'serviceWorker' in navigator,
            webp: () => {
                const canvas = document.createElement('canvas');
                return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            },
            intersectionObserver: () => 'IntersectionObserver' in window,
            customElements: () => 'customElements' in window
        };
        
        return features[feature] ? features[feature]() : false;
    },

    /**
     * Maneja errores de forma centralizada
     * @param {Error} error - Error a manejar
     * @param {string} context - Contexto del error
     */
    handleError(error, context = 'General') {
        if (typeof CONFIG !== 'undefined' && CONFIG.development.logErrors) {
            console.error(`[${context}]`, error);
        }
        
        // Aquí se podría enviar a un servicio de logging
        // como Sentry, LogRocket, etc.
    },

    /**
     * Normaliza una cadena para búsqueda
     * @param {string} str - Cadena a normalizar
     * @returns {string} Cadena normalizada
     */
    normalizeString(str) {
        if (!str) return '';
        
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
            .trim();
    },

    /**
     * Valida un objeto web según el esquema
     * @param {Object} web - Objeto web a validar
     * @returns {Object} { valid: boolean, errors: string[] }
     */
    validateWeb(web) {
        const errors = [];
        
        if (!web) {
            errors.push('El objeto web es requerido');
            return { valid: false, errors };
        }
        
        // Validar título
        if (!web.title || typeof web.title !== 'string') {
            errors.push('El título es requerido y debe ser una cadena');
        } else if (web.title.length < 3 || web.title.length > 100) {
            errors.push('El título debe tener entre 3 y 100 caracteres');
        }
        
        // Validar descripción
        if (!web.description || typeof web.description !== 'string') {
            errors.push('La descripción es requerida y debe ser una cadena');
        } else if (web.description.length < 10 || web.description.length > 500) {
            errors.push('La descripción debe tener entre 10 y 500 caracteres');
        }
        
        // Validar URL
        if (!web.url || !this.isValidURL(web.url)) {
            errors.push('La URL es requerida y debe ser válida');
        }
        
        // Validar imagen
        if (!web.image || typeof web.image !== 'string') {
            errors.push('La imagen es requerida y debe ser una cadena');
        }
        
        // Validar categoría
        if (!web.category || typeof web.category !== 'string') {
            errors.push('La categoría es requerida y debe ser una cadena');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    },

    /**
     * Crea un elemento DOM de forma segura
     * @param {string} tag - Etiqueta HTML
     * @param {Object} attributes - Atributos del elemento
     * @param {string|Node} content - Contenido del elemento
     * @returns {HTMLElement} Elemento creado
     */
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        // Establecer atributos
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else if (key === 'dataset') {
                Object.keys(attributes[key]).forEach(dataKey => {
                    element.dataset[dataKey] = attributes[key][dataKey];
                });
            } else if (key.startsWith('on')) {
                // Event listeners
                const eventName = key.substring(2).toLowerCase();
                element.addEventListener(eventName, attributes[key]);
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        // Establecer contenido
        if (typeof content === 'string') {
            element.textContent = content;
        } else if (content instanceof Node) {
            element.appendChild(content);
        }
        
        return element;
    },

    /**
     * Obtiene el contraste entre dos colores
     * @param {string} color1 - Color 1 en hex
     * @param {string} color2 - Color 2 en hex
     * @returns {number} Ratio de contraste
     */
    getContrastRatio(color1, color2) {
        const getLuminance = (color) => {
            const rgb = parseInt(color.slice(1), 16);
            const r = (rgb >> 16) & 0xff;
            const g = (rgb >> 8) & 0xff;
            const b = (rgb >> 0) & 0xff;
            
            const [rs, gs, bs] = [r, g, b].map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        };
        
        const lum1 = getLuminance(color1);
        const lum2 = getLuminance(color2);
        
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        
        return (brightest + 0.05) / (darkest + 0.05);
    }
};

// Congelar el objeto para evitar modificaciones
Object.freeze(Utils);

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
