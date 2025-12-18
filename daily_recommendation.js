/**
 * Lógica para el sistema de recomendación diaria aleatoria
 */

// Función para obtener el negocio recomendado del día
function getDailyRecommendation() {
    // 1. Obtener la fecha actual en formato YYYY-MM-DD
    const today = new Date().toISOString().slice(0, 10);
    const storageKey = 'dailyRecommendationDate';
    const recommendationKey = 'dailyRecommendationWeb';

    // 2. Obtener la última fecha de recomendación y el negocio recomendado del almacenamiento local
    const lastRecommendationDate = localStorage.getItem(storageKey);
    let recommendedWeb = JSON.parse(localStorage.getItem(recommendationKey));

    // 3. Verificar si la recomendación ya se hizo hoy
    if (lastRecommendationDate === today && recommendedWeb) {
        return recommendedWeb;
    }

    // 4. Si no se ha hecho hoy, seleccionar un nuevo negocio
    // Filtrar los negocios que están en la sección 'negocios' (asumiendo que todos en webs.js son 'negocios')
    // Excluir el negocio 'Proximamente'
    const businessWebs = webs.filter(web => web.title !== 'Proximamente');

    if (businessWebs.length === 0) {
        return null; // No hay negocios para recomendar
    }

    // Seleccionar un negocio aleatorio
    const randomIndex = Math.floor(Math.random() * businessWebs.length);
    recommendedWeb = businessWebs[randomIndex];

    // 5. Guardar la nueva recomendación y la fecha en el almacenamiento local
    localStorage.setItem(storageKey, today);
    localStorage.setItem(recommendationKey, JSON.stringify(recommendedWeb));

    return recommendedWeb;
}

// Función para mostrar la recomendación en el DOM
function displayDailyRecommendation() {
    const recommendation = getDailyRecommendation();
    const container = document.getElementById('dailyRecommendation');

    if (!container) {
        console.error('Contenedor de recomendación diaria no encontrado.');
        return;
    }

    if (recommendation) {
        // Crear la tarjeta de recomendación
        const cardHTML = `
            <div class="recommendation-card">
                <img src="${recommendation.image}" alt="Imagen de ${recommendation.title}" class="recommendation-img" onerror="this.src='${CONFIG.images.defaultPlaceholder}'; this.onerror=null;">
                <div class="recommendation-content">
                    <h4>${recommendation.title}</h4>
                    <p>${recommendation.description}</p>
                    <a href="${recommendation.url}" class="recommendation-link" target="_blank" rel="noopener noreferrer">
                        Visitar Negocio
                    </a>
                </div>
            </div>
        `;
        
        // Insertar el HTML después del encabezado H3
        const heading = container.querySelector('h3');
        if (heading) {
            heading.insertAdjacentHTML('afterend', cardHTML);
        } else {
            container.innerHTML += cardHTML;
        }
        


    } else {
        container.innerHTML += '<p>No hay negocios disponibles para recomendar hoy.</p>';
    }
}

// Asegurarse de que la función se ejecute después de que se carguen las webs
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un momento para asegurar que 'webs' esté disponible
    // En una aplicación real, esto se manejaría con promesas o un sistema de módulos
    setTimeout(displayDailyRecommendation, 500); 
});
