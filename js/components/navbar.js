/* ==========================================================================
   SmartQueue - Navigation Bar Component (navbar.js)
   ========================================================================== */

import { State } from '../state.js';

export function renderNavbar(activeViewId) {
    const header = document.createElement('header');
    header.className = 'landing-header';

    const isLoggedIn = !!State.currentUser;
    const isAdmin = isLoggedIn && State.currentUser.role === 'admin';
    const userName = isLoggedIn ? State.currentUser.name : '';
    const userInitial = isLoggedIn ? userName.charAt(0) : '';

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const themeIcon = currentTheme === 'dark' ? 'fa-sun' : 'fa-moon';
    const themeText = currentTheme === 'dark' ? 'Modo Claro' : 'Modo Oscuro';

    // Build nav links based on login state
    let navItems = '';
    if (!isLoggedIn) {
        navItems = `
            <ul class="nav-links">
                <li><a href="#landing" class="${activeViewId === 'landing' ? 'active' : ''}">Inicio</a></li>
                <li><a href="#landing-features">Beneficios</a></li>
                <li><a href="#landing-cases">Casos de Uso</a></li>
                <li><a href="#landing-pricing">Planes</a></li>
            </ul>
        `;
    } else {
        navItems = `
            <ul class="nav-links">
                <li><a href="#user-dashboard" class="${activeViewId === 'user-dashboard' ? 'active' : ''}">Mi Turno</a></li>
                <li><a href="#queues" class="${activeViewId === 'queues' ? 'active' : ''}">Buscar Filas</a></li>
                <li><a href="#join-queue" class="${activeViewId === 'join-queue' ? 'active' : ''}">Escanear QR</a></li>
                ${isAdmin ? `<li><a href="#admin" class="badge badge-info">Modo Admin</a></li>` : ''}
            </ul>
        `;
    }

    const authSection = !isLoggedIn ? `
        <div class="flex gap-1 align-items-center">
            <button class="btn-theme-toggle btn-icon" id="theme-toggle-btn" title="${themeText}">
                <i class="fas ${themeIcon}"></i>
            </button>
            <a href="#login" class="btn btn-secondary btn-sm">Iniciar Sesión</a>
            <a href="#register" class="btn btn-primary btn-sm">Registrarse</a>
        </div>
    ` : `
        <div class="flex gap-15 align-items-center">
            <button class="btn-theme-toggle btn-icon" id="theme-toggle-btn" title="${themeText}">
                <i class="fas ${themeIcon}"></i>
            </button>
            
            <a href="#notifications" class="btn-icon" style="position: relative;" title="Notificaciones">
                <i class="fas fa-bell"></i>
                ${State.notifications.filter(n => !n.read).length > 0 ? 
                    `<span class="badge-dot" style="position: absolute; top: 4px; right: 4px; width: 8px; height: 8px; background-color: var(--status-danger); border-radius: 50%;"></span>` : ''}
            </a>

            <div class="user-profile-badge" id="user-menu-trigger">
                <div class="avatar">${userInitial}</div>
                <div class="user-meta" style="display: none;">
                    <div class="user-name" style="font-size: 0.85rem; font-weight: 600;">${userName}</div>
                </div>
            </div>
            
            <button class="btn btn-secondary btn-sm" id="logout-btn" title="Cerrar Sesión">
                <i class="fas fa-sign-out-alt"></i> <span class="hide-mobile">Salir</span>
            </button>
        </div>
    `;

    header.innerHTML = `
        <div class="container flex-between w-full">
            <a href="#landing" class="logo">
                <i class="fas fa-layer-group"></i> SmartQueue
            </a>
            
            <nav class="hide-mobile">
                ${navItems}
            </nav>

            ${authSection}
        </div>
    `;

    // Bind theme toggler
    const themeBtn = header.querySelector('#theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', nextTheme);
            localStorage.setItem('smartqueue_theme', nextTheme);
            
            // Toggle icon classes
            const icon = themeBtn.querySelector('i');
            if (icon) {
                icon.className = nextTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
            State.notify();
        });
    }

    // Bind logout
    const logoutBtn = header.querySelector('#logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            State.logout();
            window.location.hash = '#landing';
        });
    }

    // Bind profile menu trigger
    const profileTrigger = header.querySelector('#user-menu-trigger');
    if (profileTrigger) {
        profileTrigger.addEventListener('click', () => {
            window.location.hash = '#profile';
        });
    }

    return header;
}
