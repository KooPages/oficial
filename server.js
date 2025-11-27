const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            frameSrc: ["'self'", "https:", "http:"],
            connectSrc: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// Compresión GZIP
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 requests por IP
    message: 'Demasiadas solicitudes desde esta IP'
});
app.use(limiter);

// Servir archivos estáticos con cache headers
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d',
    etag: false
}));

// Cache para archivos específicos
const staticCacheOptions = {
    maxAge: '7d',
    etag: false
};

app.use('/icons.svg', express.static(path.join(__dirname, 'public/icons.svg'), staticCacheOptions));
app.use('/styles-lite.css', express.static(path.join(__dirname, 'public/styles-lite.css'), staticCacheOptions));
app.use('/script.js', express.static(path.join(__dirname, 'public/script.js'), staticCacheOptions));

// Rutas principales
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

// API endpoints
app.get('/api/websites', (req, res) => {
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
    
    res.json({
        success: true,
        data: websites,
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor KooPages ejecutándose en puerto ${PORT}`);
    console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;