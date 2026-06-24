/* ==========================================================================
   SmartQueue - Queue Tracking View (tracking.js)
   ========================================================================== */

import { State } from '../state.js';
import { Simulator } from '../simulation.js';
import { renderNavbar } from '../components/navbar.js';

export function render(container) {
    const isLoggedIn = !!State.currentUser;
    if (!isLoggedIn) {
        window.location.hash = '#login';
        return;
    }

    const active = State.activeTurn;

    // If no active turn, redirect to user dashboard
    if (!active) {
        window.location.hash = '#user-dashboard';
        return;
    }

    const est = State.establishments.find(e => e.id === active.establishmentId);
    const queue = est ? est.queues.find(q => q.id === active.queueId) : null;

    // Calculate progress
    let progressPercent = 0;
    if (active.status === 'Llamado') {
        progressPercent = 100;
    } else {
        const people = active.peopleAhead || 0;
        progressPercent = Math.max(10, Math.min(95, 100 - (people * 12)));
    }

    // SVG Circle Math: radius=70, circumference = 2 * PI * r = 439.82 (~440)
    const circumference = 440;
    const offset = circumference - (progressPercent / 100) * circumference;

    // Build the visual queue board (mock physical ticket display)
    let queueBoardHTML = '';
    if (queue) {
        const currentNum = queue.currentTurn;
        // Generate list of 4 recently called turns
        const recentlyCalled = [];
        for (let i = 3; i > 0; i--) {
            if (currentNum - i > 0) {
                recentlyCalled.push(`${queue.codePrefix}-${currentNum - i}`);
            }
        }

        queueBoardHTML = `
            <div class="card" style="padding: 1.5rem;">
                <h4 style="font-weight: 700; font-size: 0.95rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; text-align: center;">
                    Pantalla de Llamados en Sala
                </h4>
                <div class="grid grid-cols-4 gap-1 text-center" style="margin-bottom: 1.5rem;">
                    <div style="background-color: var(--bg-tertiary); padding: 0.75rem; border-radius: var(--border-radius-md);">
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Llamado hace poco</div>
                        <div style="font-size: 1.1rem; font-weight: 700; margin-top: 0.25rem; color: var(--text-secondary); text-decoration: line-through;">
                            ${recentlyCalled[0] || '---'}
                        </div>
                    </div>
                    <div style="background-color: var(--bg-tertiary); padding: 0.75rem; border-radius: var(--border-radius-md);">
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Llamado hace poco</div>
                        <div style="font-size: 1.1rem; font-weight: 700; margin-top: 0.25rem; color: var(--text-secondary); text-decoration: line-through;">
                            ${recentlyCalled[1] || '---'}
                        </div>
                    </div>
                    <div style="background-color: var(--bg-tertiary); padding: 0.75rem; border-radius: var(--border-radius-md);">
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Llamado anterior</div>
                        <div style="font-size: 1.1rem; font-weight: 700; margin-top: 0.25rem; color: var(--text-secondary); text-decoration: line-through;">
                            ${recentlyCalled[2] || '---'}
                        </div>
                    </div>
                    <!-- ACTIVE CURRENT CALL -->
                    <div style="background-color: var(--accent-light); border: 1px solid var(--accent-primary); padding: 0.75rem; border-radius: var(--border-radius-md); animation: board-pulse 2s infinite;">
                        <div style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 700;">Atendiendo Ahora</div>
                        <div style="font-size: 1.1rem; font-weight: 800; margin-top: 0.25rem; color: var(--text-primary);">
                            ${queue.codePrefix}-${currentNum}
                        </div>
                    </div>
                </div>
                <div class="text-center" style="font-size: 0.85rem; color: var(--text-secondary);">
                    📌 Tu ticket es el <strong class="text-primary-color" style="font-size: 0.95rem;">${active.turnCode}</strong>.
                    ${active.status === 'Llamado' ? 
                        '<span class="text-success" style="font-weight: 700; display: block; margin-top: 0.5rem;"><i class="fas fa-bullhorn"></i> ¡ES TU TURNO! ACÉRCATE DE INMEDIATO</span>' : 
                        `Faltan <strong>${active.peopleAhead}</strong> personas antes de llamarte.`
                    }
                </div>
            </div>
        `;
    }

    const navbar = renderNavbar('user-dashboard');
    const mainWrapper = document.createElement('div');
    mainWrapper.className = 'w-full';

    mainWrapper.innerHTML = `
        <div class="container" style="padding: 2.5rem 1.5rem;">
            
            <a href="#user-dashboard" style="font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; color: var(--text-muted); margin-bottom: 2rem;" class="nav-back-link">
                <i class="fas fa-arrow-left"></i> Panel de Control
            </a>

            <div class="grid grid-cols-3 gap-2 align-items-start">
                
                <!-- Left 2 Cols: Interactive Circular Gauge & Details -->
                <div style="grid-column: span 2;" class="flex flex-col gap-2">
                    <div class="card card-glass card-glow flex flex-col align-items-center" style="padding: 3rem 2.5rem; text-align: center; border-color: ${active.status === 'Llamado' ? 'var(--status-success)' : 'var(--border-color)'};">
                        
                        <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem;">${active.establishmentName}</h2>
                        <p class="text-muted" style="font-size: 0.9rem; margin-bottom: 2.5rem;">Fila: ${active.queueName}</p>

                        <!-- Circular Progress Gauge -->
                        <div class="circular-progress" style="margin-bottom: 2.5rem;">
                            <svg viewBox="0 0 160 160">
                                <circle class="bg-circle" cx="80" cy="80" r="70"></circle>
                                <circle class="fg-circle" cx="80" cy="80" r="70" 
                                    style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset}; stroke: ${active.status === 'Llamado' ? 'var(--status-success)' : 'var(--accent-primary)'};">
                                </circle>
                            </svg>
                            <div class="circular-progress-text">
                                <span class="circular-progress-val" style="color: ${active.status === 'Llamado' ? 'var(--status-success)' : 'var(--text-primary)'};">${active.turnCode}</span>
                                <span class="circular-progress-label">${active.status === 'Llamado' ? 'Llamado' : 'Tu Turno'}</span>
                            </div>
                        </div>

                        <!-- Statistics Details -->
                        <div class="flex gap-3 justify-content-center w-full" style="border-top: 1px solid var(--border-color); padding-top: 2rem; margin-bottom: 2rem;">
                            <div>
                                <div class="text-muted" style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Estado</div>
                                <div style="font-size: 1.25rem; font-weight: 700; margin-top: 0.25rem;" class="${active.status === 'Llamado' ? 'text-success' : 'text-warning'}">
                                    ${active.status}
                                </div>
                            </div>
                            <div style="width: 1px; background-color: var(--border-color); align-self: stretch;"></div>
                            <div>
                                <div class="text-muted" style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Personas Delante</div>
                                <div style="font-size: 1.25rem; font-weight: 700; margin-top: 0.25rem; color: var(--text-primary);">
                                    ${active.peopleAhead}
                                </div>
                            </div>
                            <div style="width: 1px; background-color: var(--border-color); align-self: stretch;"></div>
                            <div>
                                <div class="text-muted" style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Espera Aprox.</div>
                                <div style="font-size: 1.25rem; font-weight: 700; margin-top: 0.25rem; color: var(--text-primary);">
                                    ~${active.estimatedWait} min
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex gap-1 justify-content-center w-full">
                            <button class="btn btn-danger" id="track-cancel-btn">
                                <i class="fas fa-times-circle"></i> Cancelar Turno
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Right Col: Live Board & Simulation Acceleration -->
                <div class="flex flex-col gap-2">
                    ${queueBoardHTML}

                    <!-- Demo Speed Up Panel -->
                    <div class="card card-glow" style="border-color: rgba(59, 130, 246, 0.25); background-color: rgba(59, 130, 246, 0.02);">
                        <h4 style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-magic text-primary-color"></i> Acelerar Fila (Control Demo)
                        </h4>
                        <p class="text-muted" style="font-size: 0.75rem; line-height: 1.45; margin-bottom: 1.25rem;">
                            Normalmente las filas avanzan solas de forma automática. Haz clic aquí para llamar al siguiente turno de forma inmediata y ver cómo cambia tu estado.
                        </p>
                        <button class="btn btn-primary btn-sm btn-full" id="track-sim-advance-btn">
                            <i class="fas fa-step-forward"></i> Simular Llamada (+1)
                        </button>
                    </div>
                </div>

            </div>
        </div>
    `;

    container.innerHTML = '';
    container.appendChild(navbar);
    container.appendChild(mainWrapper);

    // Bind Cancel
    const cancelBtn = container.querySelector('#track-cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm('¿Deseas cancelar tu turno y salir de la fila virtual?')) {
                State.cancelTurn();
            }
        });
    }

    // Bind Sim Advance
    const simBtn = container.querySelector('#track-sim-advance-btn');
    if (simBtn) {
        simBtn.addEventListener('click', () => {
            Simulator.forceTick();
        });
    }

    // Add board pulsing keyframes if not present
    if (!document.getElementById('board-keyframes')) {
        const style = document.createElement('style');
        style.id = 'board-keyframes';
        style.innerHTML = `
            @keyframes board-pulse {
                0% { border-color: var(--accent-primary); box-shadow: 0 0 0 0 rgba(var(--accent-primary-rgb), 0.4); }
                70% { border-color: var(--accent-primary); box-shadow: 0 0 0 6px rgba(var(--accent-primary-rgb), 0); }
                100% { border-color: var(--accent-primary); box-shadow: 0 0 0 0 rgba(var(--accent-primary-rgb), 0); }
            }
        `;
        document.head.appendChild(style);
    }
}
