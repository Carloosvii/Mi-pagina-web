let profileData = {
    name: 'Carlos López Estrada',
    title: 'Computer Engineering Student',
    description: 'I\'m a passionate Computer Engineering student...',
    email: 'carlos.lopez@email.com',
    phone: '+1 (555) 123-4567',
    location: 'Mexico City, Mexico',
    projects: [
        { id: 1, title: 'E-Commerce Platform', desc: 'A full-stack e-commerce application...', tags: 'React · Node.js · MongoDB', image: '' },
        { id: 2, title: 'Task Management App', desc: 'A collaborative task management tool...', tags: 'Vue.js · Firebase · TypeScript', image: '' }
    ],
    hobbies: [
        { id: 1, icon: '📷', title: 'Photography', desc: 'Capturing moments...', count: 42, image: '' },
        { id: 2, icon: '🎮', title: 'Gaming', desc: 'Enjoying immersive worlds...', count: 56, image: '' }
    ]
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
    updateUI();
    
    // Smooth scroll para nav
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('http')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
});

// ===== CARGAR DATOS =====
function loadProfileData() {
    const saved = localStorage.getItem('portfolio_data');
    if (saved) {
        Object.assign(profileData, JSON.parse(saved));
    }
}

// ===== ACTUALIZAR UI =====
function updateUI() {
    const nameParts = profileData.name.split(' ');
    const firstName = nameParts[0];
    const restName = nameParts.slice(1).join(' ');
    
    document.getElementById('hero-name').innerHTML = `${firstName}<br>${restName}`;
    document.getElementById('hero-title').textContent = profileData.title;
    document.getElementById('hero-desc').textContent = profileData.description;
    document.getElementById('about-text').textContent = profileData.description;
    document.getElementById('info-email').textContent = profileData.email;
    document.getElementById('info-location').textContent = profileData.location;
    document.getElementById('contact-email').textContent = profileData.email;
    document.getElementById('contact-email').href = `mailto:${profileData.email}`;
    document.getElementById('contact-location').textContent = profileData.location;
}

// ===== MODO EDICIÓN =====
function toggleEditMode() {
    const password = prompt('Ingresa contraseña para editar:');
    if (password === 'admin123') {
        openEditPanel();
    } else if (password !== null) {
        alert('Contraseña incorrecta');
    }
}

function openEditPanel() {
    document.getElementById('edit-panel').style.display = 'flex';
    document.getElementById('edit-name').value = profileData.name;
    document.getElementById('edit-title').value = profileData.title;
    document.getElementById('edit-desc').value = profileData.description;
    document.getElementById('edit-email').value = profileData.email;
    document.getElementById('edit-phone').value = profileData.phone;
    document.getElementById('edit-location').value = profileData.location;
    document.body.style.overflow = 'hidden';
}

function closeEditPanel() {
    document.getElementById('edit-panel').style.display = 'none';
    document.body.style.overflow = '';
}

function saveProfile() {
    profileData.name = document.getElementById('edit-name').value;
    profileData.title = document.getElementById('edit-title').value;
    profileData.description = document.getElementById('edit-desc').value;
    profileData.email = document.getElementById('edit-email').value;
    profileData.phone = document.getElementById('edit-phone').value;
    profileData.location = document.getElementById('edit-location').value;
    
    localStorage.setItem('portfolio_data', JSON.stringify(profileData));
    updateUI();
    closeEditPanel();
    
    // Notificación sutil
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: linear-gradient(135deg, #7c5cff, #4fc3f7);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(124, 92, 255, 0.3);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = '✅ Cambios guardados exitosamente';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}


// Animaciones CSS dinámicas
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
function updateUI() {
    // Info básica (Nombre, Título, etc.)
    const nameParts = profileData.name.split(' ');
    document.getElementById('hero-name').innerHTML = `${nameParts[0]}<br>${nameParts.slice(1).join(' ')}`;
    document.getElementById('hero-title').textContent = profileData.title;
    document.getElementById('hero-desc').textContent = profileData.description;
    document.getElementById('about-text').textContent = profileData.description;
    document.getElementById('info-email').textContent = profileData.email;
    document.getElementById('info-location').textContent = profileData.location;

    // ACTUALIZACIÓN DE PROYECTOS
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
        projectsGrid.innerHTML = profileData.projects.map(p => `
            <div class="project-card">
                <div class="project-icon">${p.title[0]}</div>
                <h3>${p.title}</h3>
                <p>${p.desc}</p>
                <div class="project-tags">${p.tags}</div>
                <button class="delete-btn" onclick="deleteItem('projects', ${p.id})">×</button>
            </div>
        `).join('') + `
            <div class="project-card add-card" onclick="addItem('projects')">
                <div class="add-icon">+</div>
                <p>Añadir Proyecto</p>
            </div>`;
    }

    // ACTUALIZACIÓN DE HOBBIES
    const hobbiesGrid = document.getElementById('hobbies-grid');
    if (hobbiesGrid) {
        hobbiesGrid.innerHTML = profileData.hobbies.map(h => `
            <div class="hobby-card">
                <div class="hobby-icon">${h.icon}</div>
                <h3>${h.title}</h3>
                <p>${h.desc}</p>
                <span class="hobby-count">${h.count}</span>
                <button class="delete-btn" onclick="deleteItem('hobbies', ${h.id})">×</button>
            </div>
        `).join('') + `
            <div class="hobby-card add-card" onclick="addItem('hobbies')">
                <div class="add-icon">+</div>
                <p>Añadir Hobby</p>
            </div>`;
    }
}

// Funciones para añadir/eliminar
function addItem(type) {
    const title = prompt(`Nombre del ${type === 'projects' ? 'Proyecto' : 'Hobby'}:`);
    if (!title) return;
    
    const desc = prompt("Descripción:");
    const newItem = {
        id: Date.now(),
        title: title,
        desc: desc,
        tags: type === 'projects' ? prompt("Tags (separados por puntos):") : "",
        icon: type === 'hobbies' ? prompt("Emoji (ej: 🚀):") : "",
        count: type === 'hobbies' ? prompt("Cantidad/Nivel:") : 0
    };

    profileData[type].push(newItem);
    saveAndRefresh();
}

function deleteItem(type, id) {
    profileData[type] = profileData[type].filter(item => item.id !== id);
    saveAndRefresh();
}

function saveAndRefresh() {
    localStorage.setItem('portfolio_data', JSON.stringify(profileData));
    updateUI();
}