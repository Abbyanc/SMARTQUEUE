/* ==========================================================================
   SmartQueue - Notification Center View (notifications.js)
   ========================================================================== */

import { State } from '../state.js';
import { renderNavbar } from '../components/navbar.js';

export function render(container) {
    const isLoggedIn = !!State.currentUser;
    if (!isLoggedIn) {
        window.location.hash = '#login';
        return;
    }

    const notifications = State.notifications;

    const notifItemsHTML = notifications.map(item => {
        let iconClass = 'fa-info-circle text-primary-color';
        let bgStyle = 'background-color: var(--bg-secondary);';
        
        if (item.type === 'success') iconClass = 'fa-check-circle text-success';
        if (item.type === 'warning') iconClass = 'fa-exclamation-circle text-warning';
        if (item.type === 'danger') iconClass = 'fa-times-circle text-danger';

        // Highlight unread notifications
        if (!item.read) {
            bgStyle = 'background-color: var(--bg-tertiary); border-left: 4px solid var(--accent-primary);';
            item.read = true; // Mark as read once they view this screen
        } else {
            bgStyle = 'background-color: var(--bg-secondary); border-left: 4px solid transparent;';
        }

        return `
            <div class="card" style="padding: 1.25rem; ${bgStyle} margin-bottom: 0.75rem; transition: transform var(--transition-fast);">
                <div class="flex gap-1 align-items-start">
                    <div style="font-size: 1.35rem; margin-top: 0.15rem;">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div style="flex-grow: 1;">
                        <div class="flex flex-between">
                            <h4 style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">${item.title}</h4>
                            <span class="text-muted" style="font-size: 0.75rem;">${item.time}</span>
                        </div>
                        <p class="text-secondary" style="font-size: 0.85rem; margin-top: 0.25rem; line-height: 1.4;">${item.message}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('') || `
        <div class="card text-center" style="padding: 4rem 2rem;">
            <div style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;">
                <i class="fas fa-bell-slash"></i>
            </div>
            <h4 style="font-weight: 700; color: var(--text-primary);">No tienes notificaciones</h4>
            <p class="text-muted" style="font-size: 0.85rem; margin-top: 0.25rem;">Las alertas de tus turnos aparecerán en este lugar.</p>
        </div>
    `;

    const navbar = renderNavbar('user-dashboard');
    const mainWrapper = document.createElement('div');
    mainWrapper.className = 'w-full';

    mainWrapper.innerHTML = `
        <div class="container" style="padding: 2.5rem 1.5rem;">
            <!-- Header -->
            <div class="flex flex-between" style="margin-bottom: 2.5rem;">
                <div>
                    <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-primary);">Centro de Notificaciones</h2>
                    <p class="text-muted">Historial de avisos de turnos y alertas operativas.</p>
                </div>
                <div class="flex gap-05">
                    <button class="btn btn-secondary btn-sm" id="clear-notif-btn">
                        <i class="fas fa-trash"></i> Limpiar Todo
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-2">
                <!-- Notifications list (Left 2 cols) -->
                <div style="grid-column: span 2;" id="notif-list-container">
                    ${notifItemsHTML}
                </div>

                <!-- Settings Shortcuts (Right col) -->
                <div class="flex flex-col gap-2">
                    <div class="card">
                        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary);">Ajustes de Alertas</h3>
                        <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 1.25rem; line-height: 1.4;">
                            Configura cómo quieres que SmartQueue se comunique contigo cuando estés en una fila.
                        </p>
                        
                        <div class="flex flex-col gap-1">
                            <div class="flex-between" style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
                                <div>
                                    <div style="font-size: 0.85rem; font-weight: 600;">Notificaciones Push</div>
                                    <div style="font-size: 0.7rem; color: var(--text-muted);">Avisos directos en el navegador</div>
                                </div>
                                <input type="checkbox" id="push-toggle-shortcut" ${State.settings.notifications.pushEnabled ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--accent-primary); cursor: pointer;">
                            </div>

                            <div class="flex-between" style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
                                <div>
                                    <div style="font-size: 0.85rem; font-weight: 600;">Alertas por WhatsApp</div>
                                    <div style="font-size: 0.7rem; color: var(--text-muted);">Avisos en tu celular</div>
                                </div>
                                <input type="checkbox" id="wa-toggle-shortcut" ${State.settings.notifications.waEnabled ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--accent-primary); cursor: pointer;">
                            </div>
                        </div>

                        <a href="#profile" class="btn btn-secondary btn-sm btn-full" style="margin-top: 1.5rem;">
                            Administrar Configuración
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = '';
    container.appendChild(navbar);
    container.appendChild(mainWrapper);

    // Save initial read status updates immediately to local storage
    State.saveToStorage();

    // Bind Clear Button
    const clearBtn = container.querySelector('#clear-notif-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas limpiar todo tu historial de notificaciones?')) {
                State.clearNotifications();
                render(container); // Re-render
            }
        });
    }

    // Bind Toggle Shortcuts
    const pushToggle = container.querySelector('#push-toggle-shortcut');
    if (pushToggle) {
        pushToggle.addEventListener('change', (e) => {
            State.settings.notifications.pushEnabled = e.target.checked;
            State.notify();
        });
    }

    const waToggle = container.querySelector('#wa-toggle-shortcut');
    if (waToggle) {
        waToggle.addEventListener('change', (e) => {
            State.settings.notifications.waEnabled = e.target.checked;
            State.notify();
        });
    }
}
