/**
 * Script de validación para KOOPAGES
 * Verifica la integridad y calidad del código
 */

const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(description, fn) {
    totalTests++;
    try {
        fn();
        passedTests++;
        console.log(`${colors.green}✓${colors.reset} ${description}`);
        return true;
    } catch (error) {
        failedTests++;
        console.log(`${colors.red}✗${colors.reset} ${description}`);
        console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
        return false;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

console.log(`${colors.blue}=== Validación de KOOPAGES ===${colors.reset}\n`);

// Test 1: Verificar que existen archivos esenciales
test('Archivos esenciales existen', () => {
    const requiredFiles = [
        'index.html',
        'script.js',
        'styles-lite.css',
        'webs.js',
        'config.js',
        'utils.js',
        'icons.svg',
        'README.md',
        '.gitignore',
        'LICENSE',
        'CONTRIBUTING.md',
        'robots.txt'
    ];
    
    requiredFiles.forEach(file => {
        assert(fs.existsSync(file), `Falta el archivo: ${file}`);
    });
});

// Test 2: Validar estructura HTML
test('HTML tiene estructura válida', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    assert(html.includes('<!DOCTYPE html>'), 'Falta DOCTYPE');
    assert(html.includes('<html lang="es">'), 'Falta atributo lang');
    assert(html.includes('<meta charset="UTF-8">'), 'Falta charset');
    assert(html.includes('<meta name="viewport"'), 'Falta viewport');
    assert(html.includes('<title>'), 'Falta título');
});

// Test 3: Validar meta tags SEO
test('Meta tags SEO están presentes', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    assert(html.includes('meta name="description"'), 'Falta meta description');
    assert(html.includes('meta name="keywords"'), 'Falta meta keywords');
    assert(html.includes('meta property="og:'), 'Faltan Open Graph tags');
    assert(html.includes('meta name="twitter:'), 'Faltan Twitter Card tags');
    assert(html.includes('link rel="canonical"'), 'Falta canonical URL');
});

// Test 4: Validar accesibilidad
test('Atributos de accesibilidad presentes', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    assert(html.includes('role='), 'Faltan roles ARIA');
    assert(html.includes('aria-label'), 'Faltan aria-labels');
    assert(html.includes('aria-hidden'), 'Faltan aria-hidden');
    assert(html.includes('skip-link'), 'Falta skip link');
});

// Test 5: Validar configuración
test('Archivo de configuración es válido', () => {
    const config = fs.readFileSync('config.js', 'utf8');
    assert(config.includes('const CONFIG'), 'Falta objeto CONFIG');
    assert(config.includes('Object.freeze(CONFIG)'), 'CONFIG no está congelado');
    assert(config.includes('site:'), 'Falta configuración de sitio');
    assert(config.includes('search:'), 'Falta configuración de búsqueda');
});

// Test 6: Validar utilidades
test('Funciones de utilidad están definidas', () => {
    const utils = fs.readFileSync('utils.js', 'utf8');
    assert(utils.includes('sanitizeHTML'), 'Falta función sanitizeHTML');
    assert(utils.includes('escapeHTML'), 'Falta función escapeHTML');
    assert(utils.includes('isValidURL'), 'Falta función isValidURL');
    assert(utils.includes('validateWeb'), 'Falta función validateWeb');
});

// Test 7: Validar datos de webs
test('Datos de webs tienen estructura correcta', () => {
    const websContent = fs.readFileSync('webs.js', 'utf8');
    assert(websContent.includes('const webs'), 'Falta array webs');
    assert(websContent.includes('title:'), 'Falta campo title');
    assert(websContent.includes('description:'), 'Falta campo description');
    assert(websContent.includes('url:'), 'Falta campo url');
    assert(websContent.includes('category:'), 'Falta campo category');
});

// Test 8: Validar CSS
test('CSS tiene variables y estructura correcta', () => {
    const css = fs.readFileSync('styles-lite.css', 'utf8');
    assert(css.includes(':root'), 'Faltan variables CSS');
    assert(css.includes('--primary-color'), 'Falta color primario');
    assert(css.includes('@media'), 'Faltan media queries');
    assert(css.includes('.skip-link'), 'Falta estilo para skip link');
});

// Test 9: Validar JavaScript principal
test('Script principal tiene funciones requeridas', () => {
    const script = fs.readFileSync('script.js', 'utf8');
    assert(script.includes('DOMContentLoaded'), 'Falta event listener DOMContentLoaded');
    assert(script.includes('filterWebs'), 'Falta función filterWebs');
    assert(script.includes('loadWebs'), 'Falta función loadWebs');
    assert(script.includes('showNotification'), 'Falta función showNotification');
    assert(script.includes("'use strict'"), 'Falta modo estricto');
});

// Test 10: Validar documentación
test('README tiene contenido completo', () => {
    const readme = fs.readFileSync('README.md', 'utf8');
    assert(readme.length > 500, 'README muy corto');
    assert(readme.includes('KOOPAGES'), 'Falta nombre del proyecto');
    assert(readme.includes('Instalación'), 'Falta sección de instalación');
    assert(readme.includes('Características'), 'Falta sección de características');
});

// Test 11: Validar .gitignore
test('.gitignore tiene entradas necesarias', () => {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    assert(gitignore.includes('node_modules'), 'Falta node_modules');
    assert(gitignore.includes('.env'), 'Falta .env');
    assert(gitignore.includes('.DS_Store'), 'Falta .DS_Store');
});

// Test 12: Validar robots.txt
test('robots.txt está configurado', () => {
    const robots = fs.readFileSync('robots.txt', 'utf8');
    assert(robots.includes('User-agent:'), 'Falta User-agent');
    assert(robots.includes('Allow:'), 'Falta Allow');
});

// Test 13: Validar iconos SVG
test('Iconos SVG están definidos', () => {
    const icons = fs.readFileSync('icons.svg', 'utf8');
    assert(icons.includes('<svg'), 'No es un archivo SVG válido');
    assert(icons.includes('symbol id='), 'Faltan symbols');
    assert(icons.includes('logo'), 'Falta icono logo');
    assert(icons.includes('menu'), 'Falta icono menu');
    assert(icons.includes('search'), 'Falta icono search');
});

// Test 14: Validar tamaños de archivos
test('Archivos tienen tamaños razonables', () => {
    const maxSizes = {
        'index.html': 50000,
        'script.js': 100000,
        'styles-lite.css': 50000,
        'config.js': 20000,
        'utils.js': 50000
    };
    
    Object.entries(maxSizes).forEach(([file, maxSize]) => {
        const stats = fs.statSync(file);
        assert(stats.size < maxSize, `${file} es demasiado grande (${stats.size} bytes)`);
        assert(stats.size > 0, `${file} está vacío`);
    });
});

// Test 15: Validar encoding UTF-8
test('Archivos usan encoding UTF-8', () => {
    const files = ['index.html', 'script.js', 'README.md'];
    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        assert(content.length > 0, `${file} no se pudo leer como UTF-8`);
    });
});

// Resumen
console.log(`\n${colors.blue}=== Resumen ===${colors.reset}`);
console.log(`Total de tests: ${totalTests}`);
console.log(`${colors.green}Pasados: ${passedTests}${colors.reset}`);
if (failedTests > 0) {
    console.log(`${colors.red}Fallidos: ${failedTests}${colors.reset}`);
}

if (failedTests === 0) {
    console.log(`\n${colors.green}✓ Todas las validaciones pasaron correctamente${colors.reset}`);
    process.exit(0);
} else {
    console.log(`\n${colors.red}✗ Algunas validaciones fallaron${colors.reset}`);
    process.exit(1);
}
