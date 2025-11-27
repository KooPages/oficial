class KooPagesAPI {
    constructor() {
        this.baseURL = '/api';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
    }

    async fetchWebsites() {
        const cacheKey = 'websites';
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        try {
            const response = await fetch(`${this.baseURL}/websites`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                this.cache.set(cacheKey, {
                    data: data.data,
                    timestamp: Date.now()
                });
                return data.data;
            } else {
                throw new Error('API response indicates failure');
            }
        } catch (error) {
            console.error('Error fetching websites:', error);
            // Fallback a datos locales
            return this.getFallbackWebsites();
        }
    }

    getFallbackWebsites() {
        return [
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
    }

    async checkWebsiteStatus(url) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const response = await fetch(url, {
                method: 'HEAD',
                mode: 'no-cors',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            return true;
        } catch (error) {
            console.warn(`Website status check failed for ${url}:`, error);
            return false;
        }
    }

    async getWebsiteAnalytics(websiteId) {
        try {
            const response = await fetch(`${this.baseURL}/analytics/${websiteId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching analytics:', error);
            return null;
        }
    }

    async logPreviewView(websiteName) {
        try {
            // Enviar datos de analytics de forma asíncrona
            navigator.sendBeacon(`${this.baseURL}/analytics/preview`, JSON.stringify({
                website: websiteName,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            }));
        } catch (error) {
            console.warn('Failed to log preview view:', error);
        }
    }

    async validateUrl(url) {
        try {
            const response = await fetch(`${this.baseURL}/validate-url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.valid;
        } catch (error) {
            console.error('Error validating URL:', error);
            // Fallback a validación local
            return this.localUrlValidation(url);
        }
    }

    localUrlValidation(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    }

    clearCache() {
        this.cache.clear();
    }

    setCacheTimeout(timeout) {
        this.cacheTimeout = timeout;
    }
}

// Exportar para uso en navegador
if (typeof window !== 'undefined') {
    window.KooPagesAPI = KooPagesAPI;
}

// Exportar para uso en Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KooPagesAPI;
}