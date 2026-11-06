// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    setupScrollLinks();
    setupProjectAccordion();
});

// ===== NAVEGACIÓN SUAVE =====
function setupScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('http')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== ACORDEÓN DE PROYECTOS =====
function setupProjectAccordion() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => card.classList.toggle('open'));
    });
}
