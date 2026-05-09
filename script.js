// ===== CREDENCIALES PARA PRUEBA =====
const validCredentials = [
    { email: 'carlos@test.com', password: 'pass123' },
    { email: 'usuario@test.com', password: 'password456' },
    { email: 'prueba@test.com', password: '123456' }
];

// ===== VARIABLES GLOBALES =====
let isLoggedIn = localStorage.getItem('user_logged_in') === 'true';

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
    // Verificar si el usuario está logueado
    if (isLoggedIn) {
        showMainContent();
    } else {
        showLoginForm();
    }
    
    // Manejar envío del formulario de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Manejar botón de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Agregar event listeners después de que se muestre el contenido principal
function addAdminListeners() {
    const adminBtn = document.getElementById('admin-btn');
    const closeAdminBtn = document.getElementById('close-admin-btn');
    const adminOverlay = document.getElementById('admin-overlay');
    const clearLogsBtn = document.getElementById('clear-logs-btn');
    
    if (adminBtn) {
        adminBtn.addEventListener('click', showAdminPanel);
    }
    
    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', closeAdminPanel);
    }
    
    if (adminOverlay) {
        adminOverlay.addEventListener('click', closeAdminPanel);
    }
    
    if (clearLogsBtn) {
        clearLogsBtn.addEventListener('click', clearLoginAttempts);
    }
}

// ===== FUNCIÓN DE LOGIN =====
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');
    
    // Validar credenciales
    const validUser = validCredentials.find(cred => 
        cred.email === email && cred.password === password
    );
    
    // Guardar intento de login en localStorage
    saveLoginAttempt(email, password, validUser ? 'EXITOSO' : 'FALLIDO');
    
    if (validUser) {
        // Guardar sesión en localStorage
        localStorage.setItem('user_logged_in', 'true');
        localStorage.setItem('user_email', email);
        isLoggedIn = true;
        
        // Mostrar contenido principal
        showMainContent();
        
        // Limpiar formulario
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        errorMsg.textContent = '';
    } else {
        // Mostrar error
        errorMsg.textContent = 'Email o contraseña incorrectos. Verifica las credenciales en credenciales.txt';
        errorMsg.style.display = 'block';
    }
}

// ===== GUARDAR INTENTO DE LOGIN =====
function saveLoginAttempt(email, password, resultado) {
    let logins = JSON.parse(localStorage.getItem('login_attempts')) || [];
    
    const now = new Date();
    const fecha = now.toLocaleDateString('es-ES');
    const hora = now.toLocaleTimeString('es-ES');
    
    logins.push({
        id: logins.length + 1,
        email: email,
        password: password,
        resultado: resultado,
        fecha: fecha,
        hora: hora
    });
    
    localStorage.setItem('login_attempts', JSON.stringify(logins));
}

// ===== MOSTRAR TABLA DE LOGINS =====
function showAdminPanel() {
    document.getElementById('admin-modal').style.display = 'flex';
    loadLoginTable();
}

// ===== CARGAR TABLA DE LOGINS =====
function loadLoginTable() {
    const tbody = document.getElementById('logins-tbody');
    const logins = JSON.parse(localStorage.getItem('login_attempts')) || [];
    
    tbody.innerHTML = '';
    
    if (logins.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">No hay registros</td></tr>';
        return;
    }
    
    logins.forEach(login => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${login.id}</td>
            <td>${login.email}</td>
            <td><code>${login.password}</code></td>
            <td><span class="status ${login.resultado === 'EXITOSO' ? 'success' : 'failed'}">${login.resultado}</span></td>
            <td>${login.fecha} ${login.hora}</td>
        `;
        tbody.appendChild(row);
    });
}

// ===== CERRAR ADMIN PANEL =====
function closeAdminPanel() {
    document.getElementById('admin-modal').style.display = 'none';
}

// ===== LIMPIAR REGISTRO DE LOGINS =====
function clearLoginAttempts() {
    if (confirm('¿Estás seguro de que quieres limpiar el registro?')) {
        localStorage.removeItem('login_attempts');
        loadLoginTable();
    }
}

// ===== FUNCIÓN DE LOGOUT =====
function handleLogout() {
    localStorage.removeItem('user_logged_in');
    localStorage.removeItem('user_email');
    isLoggedIn = false;
    showLoginForm();
}

// ===== MOSTRAR FORMULARIO DE LOGIN =====
function showLoginForm() {
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('main-content').style.display = 'none';
}

// ===== MOSTRAR CONTENIDO PRINCIPAL =====
function showMainContent() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    
    // Cargar datos del perfil
    loadProfileData();
    updateUI();
    
    // Agregar listeners para el panel admin
    addAdminListeners();
    
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
}

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
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('open');
    });
});
