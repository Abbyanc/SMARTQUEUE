/* ==========================================================================
   SmartQueue - Admin Sidebar Component (sidebar.js)
   ========================================================================== */

import { State } from '../state.js';
import { Simulator } from '../simulation.js';

export function renderSidebar(activeViewId) {
    const aside = document.createElement('aside');
    aside.className = 'sidebar';

    const isLoggedIn = !!State.currentUser;
    const userName = isLoggedIn ? State.currentUser.name : 'Administrador';
    const userEmail = isLoggedIn ? State.currentUser.email : 'admin@smartqueue.com';

    aside.innerHTML = `
        <div class="sidebar-brand">
            <a href="#landing" class="logo">
                <i class="fas fa-layer-group"></i> SmartQueue
            </a>
            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; color: var(--accent-primary); margin-top: 0.25rem;">
                Consola Admin
            </div>
        </div>

        <ul class="sidebar-menu">
            <li class="sidebar-item ${activeViewId === 'admin' ? 'active' : ''}">
                <a href="#admin">
                    <i class="fas fa-chart-line"></i> Control en Vivo
                </a>
            </li>
            <li class="sidebar-item ${activeViewId === 'analytics' ? 'active' : ''}">
                <a href="#analytics">
                    <i class="fas fa-brain"></i> Predicción IA & Analítica
                </a>
            </li>
            <li class="sidebar-item ${activeViewId === 'settings' ? 'active' : ''}">
                <a href="#settings">
                    <i class="fas fa-sliders-h"></i> Reglas de Fila
                </a>
            </li>
            <li class="sidebar-item" style="margin-top: auto; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                <a href="#user-dashboard">
                    <i class="fas fa-user"></i> Vista de Cliente
                </a>
            </li>
        </ul>

        <!-- Demo Control Panel (Extremely useful for review) -->
        <div class="card-glass" style="padding: 1rem; margin-top: 1rem; border-radius: var(--border-radius-md); font-size: 0.8rem; border: 1px solid var(--accent-light);">
            <div style="font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
                <span>Simulador de Colas</span>
                <span class="badge badge-success" style="padding: 0.1rem 0.4rem; font-size: 0.65rem;">Activo</span>
            </div>
            <p class="text-muted" style="font-size: 0.75rem; margin-bottom: 0.75rem; line-height: 1.3;">
                El simulador avanza las colas de forma automática. Usa los botones para acelerar o alterar el flujo.
            </p>
            <div class="flex flex-col gap-05">
                <button class="btn btn-primary btn-sm btn-full" id="sim-tick-btn">
                    <i class="fas fa-forward"></i> Forzar Atención (+1)
                </button>
                <button class="btn btn-secondary btn-sm btn-full" id="sim-join-btn">
                    <i class="fas fa-user-plus"></i> Forzar Cliente Nuevo
                </button>
            </div>
        </div>

        <div class="sidebar-footer">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div class="avatar" style="background-color: var(--accent-primary); width: 2rem; height: 2rem; font-size: 0.85rem;">RM</div>
                <div style="overflow: hidden;">
                    <div style="font-size: 0.8rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${userName}</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${userEmail}</div>
                </div>
            </div>
        </div>
    `;

    // Bind simulator buttons
    const tickBtn = aside.querySelector('#sim-tick-btn');
    if (tickBtn) {
        tickBtn.addEventListener('click', () => {
            Simulator.forceTick();
            Simulator.showPushToast('Simulador', 'Llamada forzada al siguiente cliente.', 'info');
        });
    }

    const joinBtn = aside.querySelector('#sim-join-btn');
    if (joinBtn) {
        joinBtn.addEventListener('click', () => {
            // Pick Comedor Universitario as default simulator target
            const comedor = State.establishments[0];
            const queue = comedor.queues[0];
            Simulator.forceJoinMock(comedor.id, queue.id);
            Simulator.showPushToast('Simulador', `Un nuevo cliente simulado se unió a ${queue.name}.`, 'info');
        });
    }

    return aside;
}
