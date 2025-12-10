# Guía de Contribución a KOOPAGES

¡Gracias por tu interés en contribuir a KOOPAGES! Este documento proporciona pautas y mejores prácticas para contribuir al proyecto.

## Tabla de Contenidos

1. [Código de Conducta](#código-de-conducta)
2. [Cómo Contribuir](#cómo-contribuir)
3. [Proceso de Desarrollo](#proceso-de-desarrollo)
4. [Estándares de Código](#estándares-de-código)
5. [Commits y Pull Requests](#commits-y-pull-requests)
6. [Reportar Bugs](#reportar-bugs)
7. [Sugerir Mejoras](#sugerir-mejoras)

## Código de Conducta

Este proyecto se adhiere a un código de conducta profesional. Al participar, se espera que mantengas un ambiente respetuoso y colaborativo.

### Nuestros Estándares

- Usar lenguaje acogedor e inclusivo
- Respetar diferentes puntos de vista y experiencias
- Aceptar críticas constructivas de manera profesional
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros de la comunidad

## Cómo Contribuir

### Reportar Bugs

Si encuentras un bug, por favor abre un issue en GitHub con:

- Descripción clara del problema
- Pasos para reproducir el bug
- Comportamiento esperado vs comportamiento actual
- Capturas de pantalla (si aplica)
- Información del navegador y sistema operativo
- Versión del proyecto

### Sugerir Mejoras

Para sugerir nuevas características:

1. Verifica que la funcionalidad no exista ya
2. Abre un issue describiendo la mejora propuesta
3. Explica por qué sería útil para el proyecto
4. Proporciona ejemplos de uso si es posible

### Contribuir con Código

1. **Fork del repositorio**
   ```bash
   git clone https://github.com/KooPages/oficial.git
   cd oficial
   ```

2. **Crear una rama para tu feature**
   ```bash
   git checkout -b feature/nombre-descriptivo
   ```

3. **Hacer tus cambios**
   - Sigue los estándares de código
   - Añade comentarios cuando sea necesario
   - Actualiza la documentación si es relevante

4. **Commit de tus cambios**
   ```bash
   git add .
   git commit -m "feat: descripción breve del cambio"
   ```

5. **Push a tu fork**
   ```bash
   git push origin feature/nombre-descriptivo
   ```

6. **Abrir un Pull Request**
   - Describe los cambios realizados
   - Referencia issues relacionados
   - Incluye capturas de pantalla si hay cambios visuales

## Proceso de Desarrollo

### Configuración del Entorno

```bash
# Clonar el repositorio
git clone https://github.com/KooPages/oficial.git
cd oficial

# Abrir con un servidor local
python3 -m http.server 8000
# O
npx serve
```

### Estructura del Proyecto

```
oficial/
├── index.html          # HTML principal
├── script.js           # Lógica JavaScript
├── styles-lite.css     # Estilos CSS
├── webs.js             # Datos de negocios
├── config.js           # Configuración
├── utils.js            # Utilidades
├── icons.svg           # Iconos SVG
└── README.md           # Documentación
```

## Estándares de Código

### HTML

- Usar HTML5 semántico
- Incluir atributos ARIA para accesibilidad
- Validar con [W3C Validator](https://validator.w3.org/)
- Usar indentación de 4 espacios

### CSS

- Usar variables CSS para valores reutilizables
- Seguir la metodología BEM cuando sea posible
- Ordenar propiedades alfabéticamente dentro de cada regla
- Usar unidades relativas (rem, em, %) cuando sea apropiado
- Incluir media queries para responsive design

### JavaScript

- Usar ES6+ cuando sea posible
- Documentar funciones con comentarios JSDoc
- Validar y sanitizar todas las entradas de usuario
- Manejar errores con try-catch
- Usar `const` y `let`, evitar `var`
- Seguir el estilo de código existente

#### Ejemplo de Función Documentada

```javascript
/**
 * Filtra las webs según el término de búsqueda
 * @param {string} searchTerm - Término de búsqueda
 * @returns {void}
 */
function filterWebs(searchTerm) {
    // Implementación
}
```

### Accesibilidad

- Cumplir con WCAG 2.1 nivel AA mínimo
- Incluir textos alternativos en imágenes
- Asegurar navegación por teclado
- Usar atributos ARIA apropiados
- Mantener contraste de color adecuado
- Probar con lectores de pantalla

### Rendimiento

- Optimizar imágenes antes de subirlas
- Usar lazy loading para recursos pesados
- Minimizar reflows y repaints
- Implementar debounce/throttle en eventos frecuentes
- Evitar código bloqueante

## Commits y Pull Requests

### Formato de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<alcance>): <descripción>

[cuerpo opcional]

[footer opcional]
```

#### Tipos de Commit

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (espacios, punto y coma, etc.)
- `refactor`: Refactorización de código
- `perf`: Mejoras de rendimiento
- `test`: Añadir o modificar tests
- `chore`: Cambios en build, herramientas, etc.

#### Ejemplos

```bash
feat(search): agregar filtro por categoría
fix(navigation): corregir bug en menú móvil
docs(readme): actualizar instrucciones de instalación
style(css): mejorar espaciado en tarjetas
refactor(utils): simplificar función de validación
perf(images): implementar lazy loading
```

### Pull Requests

Un buen Pull Request debe:

- Tener un título descriptivo
- Describir qué cambios se hicieron y por qué
- Referenciar issues relacionados (#123)
- Incluir capturas de pantalla para cambios visuales
- Pasar todas las verificaciones (si hay CI/CD)
- Estar actualizado con la rama principal

#### Template de Pull Request

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## ¿Cómo se ha probado?
Describe las pruebas realizadas

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He revisado mi propio código
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevos warnings
- [ ] He probado en diferentes navegadores
```

## Testing

Antes de enviar un Pull Request:

1. **Prueba en múltiples navegadores**
   - Chrome/Edge (últimas 2 versiones)
   - Firefox (últimas 2 versiones)
   - Safari (si es posible)

2. **Prueba en dispositivos móviles**
   - iOS Safari
   - Chrome Android

3. **Verifica accesibilidad**
   - Navegación por teclado
   - Lector de pantalla
   - Contraste de colores

4. **Valida el código**
   - HTML: [W3C Validator](https://validator.w3.org/)
   - CSS: [CSS Validator](https://jigsaw.w3.org/css-validator/)
   - JavaScript: Verificar en consola sin errores

## Reportar Bugs

### Template de Bug Report

```markdown
**Descripción del bug**
Descripción clara y concisa del problema

**Pasos para reproducir**
1. Ir a '...'
2. Hacer clic en '...'
3. Scroll hasta '...'
4. Ver error

**Comportamiento esperado**
Descripción de lo que debería suceder

**Capturas de pantalla**
Si aplica, añadir capturas

**Entorno:**
 - OS: [ej. Windows 10]
 - Navegador: [ej. Chrome 90]
 - Versión: [ej. 1.0.0]

**Contexto adicional**
Cualquier otra información relevante
```

## Sugerir Mejoras

### Template de Feature Request

```markdown
**¿Tu solicitud está relacionada con un problema?**
Descripción clara del problema

**Describe la solución que te gustaría**
Descripción clara de lo que quieres que suceda

**Describe alternativas consideradas**
Otras soluciones o funcionalidades consideradas

**Contexto adicional**
Cualquier otra información o capturas
```

## Preguntas

Si tienes preguntas sobre cómo contribuir, puedes:

- Abrir un issue con la etiqueta "question"
- Contactar al equipo en info@koopages.com

## Licencia

Al contribuir a KOOPAGES, aceptas que tus contribuciones serán licenciadas bajo la misma licencia del proyecto.

---

¡Gracias por contribuir a KOOPAGES! 🚀
