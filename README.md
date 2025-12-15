# KOOPAGES - Plataforma de Negocios

![KOOPAGES](KOOPAGES.jpeg)

**KOOPAGES** es una plataforma web diseñada para mostrar y promover negocios patrocinados por **KOOWEXA**. La plataforma ofrece una interfaz moderna, accesible y optimizada para descubrir servicios profesionales, tiendas en línea y negocios certificados.

## 🚀 Características

- **Diseño Responsivo**: Adaptado para dispositivos móviles, tablets y escritorio
- **Accesibilidad WCAG 2.1**: Navegación por teclado, lectores de pantalla y alto contraste
- **Búsqueda en Tiempo Real**: Sistema de búsqueda con debounce para filtrar negocios
- **Navegación SPA**: Experiencia de Single Page Application sin recargas
- **Optimización SEO**: Meta tags, datos estructurados y semántica HTML5
- **Rendimiento Optimizado**: Lazy loading, animaciones suaves y código optimizado
- **Modo de Alto Contraste**: Soporte para preferencias de accesibilidad del usuario
- **Reducción de Movimiento**: Respeta las preferencias de animación del usuario

## 📋 Estructura del Proyecto

```
oficial/
├── index.html          # Página principal HTML5 semántica
├── script.js           # Lógica JavaScript modular
├── styles-lite.css     # Estilos CSS optimizados
├── webs.js             # Base de datos de negocios
├── icons.svg           # Sprite de iconos SVG
├── KOOPAGES.jpeg       # Logo/imagen principal
├── README.md           # Documentación del proyecto
├── .gitignore          # Archivos ignorados por Git
└── ANALISIS_MEJORAS.md # Análisis técnico de mejoras
```

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Variables CSS, Grid, Flexbox, animaciones
- **JavaScript ES6+**: Vanilla JS sin dependencias externas
- **SVG**: Iconos vectoriales escalables
- **ARIA**: Atributos de accesibilidad

## 📦 Instalación y Uso

### Opción 1: Servidor Local Simple

```bash
# Clonar el repositorio
git clone https://github.com/KooPages/oficial.git
cd oficial

# Abrir con un servidor local (Python)
python3 -m http.server 8000

# O con Node.js
npx serve
```

Luego abrir en el navegador: `http://localhost:8000`

### Opción 2: Abrir Directamente

Simplemente abre el archivo `index.html` en tu navegador web favorito.

## 🎨 Personalización

### Modificar Colores

Edita las variables CSS en `styles-lite.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e293b;
    --accent-color: #dc2626;
    /* ... más variables */
}
```

### Agregar Negocios

Edita el archivo `webs.js` y agrega objetos al array:

```javascript
const webs = [
    {
        title: "Nombre del Negocio",
        description: "Descripción breve del negocio",
        url: "https://ejemplo.com",
        image: "ruta/a/imagen.jpg",
        category: "categoria"
    },
    // ... más negocios
];
```

### Agregar Iconos

Agrega nuevos símbolos SVG en `icons.svg`:

```xml
<symbol id="nuevo-icono" viewBox="0 0 24 24">
    <path fill="currentColor" d="..."/>
</symbol>
```

## 🔧 Funcionalidades JavaScript

### Navegación entre Secciones

```javascript
// Cambiar de sección programáticamente
document.querySelector('.nav-link[href="#negocios"]').click();
```

### Filtrar Negocios

```javascript
// Filtrar por término de búsqueda
filterWebs('término de búsqueda');

// Filtrar por categoría
filterWebsByCategory('desarrollo');
```

### Agregar Negocios Dinámicamente

```javascript
addWeb(
    'Título',
    'Descripción',
    'https://url.com',
    'imagen.jpg',
    'categoría'
);
```

### Mostrar Notificaciones

```javascript
showNotification('Mensaje de éxito', 'success');
showNotification('Mensaje de error', 'error');
showNotification('Mensaje informativo', 'info');
```

## ♿ Accesibilidad

El proyecto implementa las siguientes características de accesibilidad:

- **Navegación por Teclado**: Todos los elementos interactivos son accesibles con Tab
- **Atributos ARIA**: Roles, labels y estados para lectores de pantalla
- **Contraste de Color**: Cumple con WCAG 2.1 nivel AA
- **Focus Visible**: Indicadores claros de enfoque para navegación por teclado
- **Textos Alternativos**: Todas las imágenes tienen descripciones apropiadas
- **Semántica HTML**: Uso correcto de elementos semánticos (header, nav, main, footer)
- **Semántica HTML**: Uso correcto de elementos semánticos (header, nav, main, footer)
- **Responsive Text**: Tamaños de fuente escalables y legibles

## 🚀 Optimizaciones de Rendimiento

- **Lazy Loading**: Imágenes cargadas bajo demanda
- **Debounce**: Búsqueda optimizada con retraso de 300ms
- **CSS Optimizado**: Uso de variables y selectores eficientes
- **Animaciones GPU**: Transformaciones aceleradas por hardware
- **Event Delegation**: Manejo eficiente de eventos
- **Código Minificable**: Estructura lista para minificación

## 📱 Compatibilidad

- **Navegadores Modernos**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Dispositivos Móviles**: iOS 14+, Android 8+
- **Tablets**: iPad OS 14+, Android tablets
- **Responsive**: Breakpoints en 480px, 768px, 1024px

## 🔐 Seguridad

### Mejoras Implementadas

- Validación de datos de entrada
- Sanitización de contenido HTML
- Uso de `rel="noopener noreferrer"` en enlaces externos
- Atributos de seguridad en formularios

### Recomendaciones Adicionales

Para producción, se recomienda:

- Implementar Content Security Policy (CSP)
- Usar HTTPS exclusivamente
- Implementar rate limiting en el servidor
- Validar datos en el backend

## 🌐 SEO

El proyecto incluye:

- Meta tags descriptivos y keywords
- Open Graph tags para redes sociales
- Estructura semántica HTML5
- URLs amigables con hash navigation
- Datos estructurados (Schema.org) - *próximamente*
- Sitemap.xml - *próximamente*

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es propiedad de **KOOPAGES** y **KOOWEXA**. Todos los derechos reservados © 2025.

## 📧 Contacto

Para más información sobre KOOPAGES y servicios de patrocinio:

- **Web**: [KOOWEXA](https://koowexa.com) *(ejemplo)*
- **Email**: info@koopages.com *(ejemplo)*

## 🗺️ Roadmap

### Próximas Funcionalidades

- [ ] Sistema de categorías con filtros visuales
- [ ] Modo oscuro (dark mode)
- [ ] PWA completa con service worker
- [ ] Sistema de favoritos con localStorage
- [ ] Compartir en redes sociales
- [ ] Ordenamiento de negocios (alfabético, fecha, popularidad)
- [ ] Paginación o scroll infinito
- [ ] Internacionalización (i18n) - Inglés, Portugués
- [ ] Backend con API REST
- [ ] Panel de administración
- [ ] Sistema de reviews y ratings
- [ ] Integración con Google Maps
- [ ] Analytics y estadísticas

## 📊 Análisis Técnico

Para un análisis detallado de mejoras implementadas y pendientes, consulta el archivo `ANALISIS_MEJORAS.md`.

## 🙏 Agradecimientos

Desarrollado con dedicación para promover negocios de calidad patrocinados por **KOOWEXA**.

---

**KOOPAGES** - Conectando negocios con oportunidades digitales 🚀

---
### 🛡️ Plataforma Asociada y Asesorada

Este proyecto está asociado y es asesorado por **[Koowexa Website](https://koowexa.com)**, garantizando la calidad y el cumplimiento de los estándares de desarrollo web.

---
