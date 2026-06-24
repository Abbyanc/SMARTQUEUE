/* ==========================================================================
   SmartQueue - User Dashboard View (userDashboard.js)
   ========================================================================== */

import { State } from '../state.js';
import { renderNavbar } from '../components/navbar.js';

export function render(container) {
    const isLoggedIn = !!State.currentUser;
    if (!isLoggedIn) {
        window.location.hash = '#login';
        return;
    }

    const userName = State.currentUser.name;
    const active = State.activeTurn;

    // Helper to calculate progress percentage based on people ahead
    let progressPercent = 0;
    if (active) {
        if (active.status === 'Llamado') {
            progressPercent = 100;
        } else {
            // Formula: starting from an arbitrary max of 10 people
            const people = active.peopleAhead || 0;
            progressPercent = Math.max(10, Math.min(95, 100 - (people * 12)));
        }
    }

    let activeTurnSection = '';
    if (!active) {
        activeTurnSection = `
            <div class="card card-glow text-center" style="padding: 3rem 2rem;">
                <div style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1.5rem;">
                    <i class="fas fa-ticket-alt"></i>
                </div>
                <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">No tienes turnos activos</h3>
                <p class="text-muted" style="max-width: 450px; margin: 0 auto 2rem auto; font-size: 0.95rem;">
                    Únete a una fila virtual escaneando un código QR en el establecimiento o busca en nuestra lista de locales disponibles.
                </p>
                <div class="flex flex-center gap-1">
                    <a href="#queues" class="btn btn-primary">
                        <i class="fas fa-search"></i> Buscar Establecimientos
                    </a>
                    <a href="#join-queue" class="btn btn-secondary">
                        <i class="fas fa-qrcode"></i> Escanear Código QR
                    </a>
                </div>
            </div>
        `;
    } else {
        // Status Badge Style
        let statusBadge = '';
        if (active.status === 'Esperando') {
            statusBadge = '<span class="badge badge-warning"><i class="fas fa-hourglass-half"></i> En Espera</span>';
        } else if (active.status === 'Llamado') {
            statusBadge = '<span class="badge badge-success" style="animation: pulse 1.5s infinite;"><i class="fas fa-bullhorn"></i> ¡Tu Turno! Acércate</span>';
        }

        activeTurnSection = `
            <div class="card card-glow card-glass" style="border-color: var(--accent-primary);">
                <!-- Header of active card -->
                <div class="flex flex-between" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.5rem;">
                    <div>
                        <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--accent-primary); letter-spacing: 0.05em;">Fila Activa</span>
                        <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-top: 0.15rem;">${active.establishmentName}</h3>
                        <p class="text-muted" style="font-size: 0.85rem;">Servicio: ${active.queueName}</p>
                    </div>
                    <div>
                        ${statusBadge}
                    </div>
                </div>

                <!-- Core Queue Data -->
                <div class="grid grid-cols-3 gap-1 text-center" style="margin-bottom: 2rem;">
                    <div style="background-color: var(--bg-tertiary); padding: 1.25rem; border-radius: var(--border-radius-md); border: 1px solid var(--border-color);">
                        <div class="text-muted" style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Código de Turno</div>
                        <div style="font-size: 2.25rem; font-weight: 900; color: var(--accent-primary); margin-top: 0.25rem; letter-spacing: -0.02em;">
                            ${active.turnCode}
                        </div>
                    </div>
                    <div style="background-color: var(--bg-tertiary); padding: 1.25rem; border-radius: var(--border-radius-md); border: 1px solid var(--border-color);">
                        <div class="text-muted" style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Personas Delante</div>
                        <div style="font-size: 2.25rem; font-weight: 900; color: var(--text-primary); margin-top: 0.25rem;">
                            ${active.peopleAhead}
                        </div>
                    </div>
                    <div style="background-color: var(--bg-tertiary); padding: 1.25rem; border-radius: var(--border-radius-md); border: 1px solid var(--border-color);">
                        <div class="text-muted" style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Espera Estimada</div>
                        <div style="font-size: 2.25rem; font-weight: 900; color: ${active.estimatedWait > 5 ? 'var(--status-warning)' : 'var(--status-success)'}; margin-top: 0.25rem;">
                            ~${active.estimatedWait} <span style="font-size: 1rem; font-weight: 500;">min</span>
                        </div>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div style="margin-bottom: 2rem;">
                    <div class="flex flex-between" style="font-size: 0.8rem; margin-bottom: 0.5rem; font-weight: 600;">
                        <span class="text-muted">Progreso de la fila</span>
                        <span>${progressPercent}%</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
                    </div>
                    ${active.status === 'Llamado' ? `
                        <p class="text-success text-center" style="font-size: 0.85rem; font-weight: 600; margin-top: 0.75rem; animation: pulse 1s infinite;">
                            🎯 Por favor dirígete a la ventanilla asignada ahora mismo.
                        </p>
                    ` : `
                        <p class="text-muted" style="font-size: 0.75rem; margin-top: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
                            <i class="fas fa-info-circle text-primary-color"></i> La predicción de tiempo se ajusta dinámicamente según la velocidad de atención.
                        </p>
                    `}
                </div>

                <!-- Actions -->
                <div class="flex flex-between" style="border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
                    <a href="#tracking" class="btn btn-secondary">
                        <i class="fas fa-expand-alt"></i> Pantalla Completa
                    </a>
                    <button class="btn btn-danger" id="cancel-turn-btn">
                        <i class="fas fa-times-circle"></i> Cancelar Turno
                    </button>
                </div>
            </div>
        `;
    }

    // Build history rows
    const historyRows = State.history.map(item => `
        <tr>
            <td>
                <div style="font-weight: 600; color: var(--text-primary);">${item.establishmentName}</div>
                <div style="font-size: 0.75rem;" class="text-muted">${item.queueName}</div>
            </td>
            <td><strong class="text-primary-color">${item.turnCode}</strong></td>
            <td>${item.date}</td>
            <td>
                <span class="badge ${item.status === 'Atendido' ? 'badge-success' : 'badge-danger'}">
                    ${item.status}
                </span>
            </td>
        </tr>
    `).join('');

    // Build notifications feed
    const notificationItems = State.notifications.slice(0, 4).map(item => {
        let typeIcon = 'fa-info-circle text-primary-color';
        if (item.type === 'success') typeIcon = 'fa-check-circle text-success';
        if (item.type === 'warning') typeIcon = 'fa-exclamation-circle text-warning';
        if (item.type === 'danger') typeIcon = 'fa-times-circle text-danger';

        return `
            <div class="flex gap-1" style="padding: 0.75rem 0; border-bottom: 1px solid var(--border-color); font-size: 0.85rem;">
                <div style="font-size: 1.1rem; margin-top: 0.15rem;">
                    <i class="fas ${typeIcon}"></i>
                </div>
                <div style="flex-grow: 1;">
                    <div style="font-weight: 600; color: var(--text-primary);">${item.title}</div>
                    <div class="text-muted" style="margin-top: 0.1rem; font-size: 0.8rem;">${item.message}</div>
                    <div class="text-muted" style="font-size: 0.75rem; margin-top: 0.25rem;">${item.time}</div>
                </div>
            </div>
        `;
    }).join('') || '<div class="text-muted text-center" style="padding: 1.5rem 0;">No tienes alertas recientes.</div>';

    // Outer shell
    const navbar = renderNavbar('user-dashboard');
    const mainWrapper = document.createElement('div');
    mainWrapper.className = 'w-full';

    mainWrapper.innerHTML = `
        <div class="container" style="padding: 2.5rem 1.5rem;">
            <!-- Welcome Header -->
            <div class="flex flex-between" style="margin-bottom: 2.5rem;">
                <div>
                    <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-primary);">¡Hola, ${userName}!</h2>
                    <p class="text-muted">Aquí tienes el estado de tu fila virtual en tiempo real.</p>
                </div>
                <div class="flex gap-05">
                    <a href="#queues" class="btn btn-secondary">
                        <i class="fas fa-list-ul"></i> Explorar Locales
                    </a>
                </div>
            </div>

            <!-- Two-column grid -->
            <div class="grid grid-cols-3 gap-2">
                <!-- Left 2 Cols: Active turn / History -->
                <div style="grid-column: span 2;" class="flex flex-col gap-2">
                    ${activeTurnSection}

                    <!-- Turn History Card -->
                    <div class="card">
                        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary);">Historial de Turnos Recientes</h3>
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Establecimiento</th>
                                        <th>Turno</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${historyRows || '<tr><td colspan="4" class="text-center text-muted">Aún no tienes turnos registrados.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Right Col: Alerts & Proximity Settings Quick info -->
                <div class="flex flex-col gap-2">
                    <div class="card">
                        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary);">Notificaciones Recientes</h3>
                        <div class="flex flex-col">
                            ${notificationItems}
                        </div>
                        <a href="#notifications" class="text-primary-color" style="font-size: 0.8rem; font-weight: 600; display: block; margin-top: 1rem; text-align: center;">
                            Ver todas las alertas <i class="fas fa-chevron-right" style="font-size: 0.75rem;"></i>
                        </a>
                    </div>

                    <!-- WhatsApp Notification Ad -->
                    <div class="card card-glow" style="border-color: rgba(16, 185, 129, 0.2); background-color: rgba(16, 185, 129, 0.02);">
                        <div class="flex gap-1 align-items-center" style="margin-bottom: 0.75rem;">
                            <i class="fab fa-whatsapp" style="font-size: 1.5rem; color: var(--status-success);"></i>
                            <h4 style="font-weight: 700; font-size: 0.95rem;">Alertas por WhatsApp</h4>
                        </div>
                        <p class="text-muted" style="font-size: 0.8rem; line-height: 1.45;">
                            SmartQueue te envía notificaciones automáticas para evitar que pierdas tu turno. Puedes habilitar o deshabilitar esto en tu configuración de perfil.
                        </p>
                        <a href="#profile" class="btn btn-secondary btn-sm btn-full" style="margin-top: 1rem;">
                            Configurar Preferencias
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Clear and rebuild container with navbar
    container.innerHTML = '';
    container.appendChild(navbar);
    container.appendChild(mainWrapper);

    // Bind Cancel Turn
    const cancelBtn = container.querySelector('#cancel-turn-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas cancelar tu turno activo? Perderás tu lugar en la fila.')) {
                State.cancelTurn();
            }
        });
    }

    // Add pulse keyframes dynamically if not present
    if (!document.getElementById('pulse-keyframes')) {
        const style = document.createElement('style');
        style.id = 'pulse-keyframes';
        style.innerHTML = `
            @keyframes pulse {
                0% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.8; transform: scale(0.98); }
                100% { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
}
