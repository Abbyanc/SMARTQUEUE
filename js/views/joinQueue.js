/* ==========================================================================
   SmartQueue - Join Queue View with QR Scanner Simulation (joinQueue.js)
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

    // Parse URL parameters (e.g., #join-queue?est=est-1&queue=q-1-1)
    const hash = window.location.hash;
    const paramStr = hash.includes('?') ? hash.split('?')[1] : '';
    const params = new URLSearchParams(paramStr);
    
    const estId = params.get('est');
    const queueId = params.get('queue');

    let selectedEst = null;
    let selectedQueue = null;

    if (estId && queueId) {
        selectedEst = State.establishments.find(e => e.id === estId);
        selectedQueue = selectedEst ? selectedEst.queues.find(q => q.id === queueId) : null;
    }

    const navbar = renderNavbar('join-queue');
    const mainWrapper = document.createElement('div');
    mainWrapper.className = 'w-full';

    // If we have selected establishment and queue, render the confirmation page
    if (selectedEst && selectedQueue) {
        const peopleWaiting = selectedQueue.lastTurn - selectedQueue.currentTurn;
        const estWait = Math.round(peopleWaiting * selectedQueue.waitPerPerson);

        mainWrapper.innerHTML = `
            <div class="container flex-center" style="padding: 3rem 1.5rem; min-height: calc(100vh - 70px);">
                <div class="card card-glass card-glow" style="max-width: 500px; width: 100%; padding: 2.5rem; border-color: var(--accent-primary);">
                    
                    <a href="#queues" style="font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; color: var(--text-muted); margin-bottom: 1.5rem;" class="nav-back-link">
                        <i class="fas fa-arrow-left"></i> Cambiar establecimiento
                    </a>

                    <div class="text-center" style="margin-bottom: 2rem;">
                        <div style="font-size: 2.5rem; color: var(--accent-primary); margin-bottom: 0.75rem;">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">Confirmación de Ingreso</h3>
                        <p class="text-muted" style="font-size: 0.9rem;">Estás por unirte a la fila virtual</p>
                    </div>

                    <!-- Establishment Card Info -->
                    <div style="background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--border-radius-lg); padding: 1.25rem; margin-bottom: 1.5rem;">
                        <h4 style="font-weight: 700; font-size: 1.1rem; color: var(--text-primary); margin-bottom: 0.25rem;">${selectedEst.name}</h4>
                        <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 1rem;"><i class="fas fa-map-marker-alt"></i> ${selectedEst.address}</p>
                        
                        <div style="border-top: 1px solid var(--border-color); padding-top: 0.75rem;" class="flex-between">
                            <span class="text-muted" style="font-size: 0.85rem;">Servicio:</span>
                            <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${selectedQueue.name}</span>
                        </div>
                    </div>

                    <!-- Queue Load Stats -->
                    <div class="grid grid-cols-2 gap-1 text-center" style="margin-bottom: 2rem;">
                        <div style="background-color: rgba(59, 130, 246, 0.04); border: 1px solid var(--border-color); padding: 1rem; border-radius: var(--border-radius-md);">
                            <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700;">Cola de Espera</div>
                            <div style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">
                                ${peopleWaiting} <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">personas</span>
                            </div>
                        </div>
                        <div style="background-color: rgba(59, 130, 246, 0.04); border: 1px solid var(--border-color); padding: 1rem; border-radius: var(--border-radius-md);">
                            <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700;">Espera Estimada</div>
                            <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-primary); margin-top: 0.25rem;">
                                ~${estWait} <span style="font-size: 0.85rem; font-weight: 500;">minutos</span>
                            </div>
                        </div>
                    </div>

                    <!-- Options -->
                    <div class="form-group" style="margin-bottom: 2rem; display: flex; flex-direction: row; gap: 0.75rem; align-items: flex-start; justify-content: flex-start;">
                        <input type="checkbox" id="wa-notify-check" checked style="width: 18px; height: 18px; accent-color: var(--status-success); margin-top: 0.2rem; cursor: pointer;">
                        <label for="wa-notify-check" style="font-size: 0.825rem; color: var(--text-secondary); cursor: pointer; line-height: 1.45;">
                            Quiero recibir alertas y avisos del turno en tiempo real por <strong>WhatsApp</strong>.
                        </label>
                    </div>

                    <button class="btn btn-accent btn-lg btn-full" id="confirm-join-btn">
                        <i class="fas fa-ticket-alt"></i> Confirmar Turno Virtual
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = '';
        container.appendChild(navbar);
        container.appendChild(mainWrapper);

        // Bind Confirm Action
        const confirmBtn = container.querySelector('#confirm-join-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                const waChecked = container.querySelector('#wa-notify-check').checked;
                
                // Update temporary state setting for WhatsApp notifications
                State.settings.notifications.waEnabled = waChecked;
                
                const success = State.joinQueue(selectedEst.id, selectedQueue.id);
                
                if (success) {
                    // Trigger simulated WhatsApp welcome msg
                    Simulator.triggerWelcomeQueueNotification(State.activeTurn);
                    
                    // Redirect to tracking page
                    window.location.hash = '#tracking';
                } else {
                    // Redirect to dashboard (they already have a turn active)
                    window.location.hash = '#user-dashboard';
                }
            });
        }

    } else {
        // Render QR Code Scanner Simulation View
        mainWrapper.innerHTML = `
            <div class="container flex-center" style="padding: 3rem 1.5rem; min-height: calc(100vh - 70px);">
                <div class="card card-glass text-center" style="max-width: 480px; width: 100%; padding: 2.5rem;">
                    
                    <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">Unirse por Código QR</h3>
                    <p class="text-muted" style="font-size: 0.9rem; margin-bottom: 2rem;">Apunta tu cámara al código QR impreso en el establecimiento para tomar tu turno de inmediato.</p>

                    <!-- Futuristic Scanner Box -->
                    <div style="position: relative; width: 240px; height: 240px; margin: 0 auto 2.5rem auto; border-radius: var(--border-radius-lg); overflow: hidden; background-color: rgba(255,255,255,0.02); border: 2px dashed rgba(255,255,255,0.15);" class="scanner-box-wrapper">
                        
                        <!-- Grid Lines inside scanner -->
                        <div class="grid-bg" style="position: absolute; top:0; left:0; width:100%; height:100%; opacity: 0.1;"></div>
                        
                        <!-- Laser line animation -->
                        <div class="laser-scanner-line"></div>
                        
                        <!-- Corner borders -->
                        <span style="position: absolute; top: 12px; left: 12px; width: 24px; height: 24px; border-top: 4px solid var(--accent-primary); border-left: 4px solid var(--accent-primary); border-top-left-radius: 4px;"></span>
                        <span style="position: absolute; top: 12px; right: 12px; width: 24px; height: 24px; border-top: 4px solid var(--accent-primary); border-right: 4px solid var(--accent-primary); border-top-right-radius: 4px;"></span>
                        <span style="position: absolute; bottom: 12px; left: 12px; width: 24px; height: 24px; border-bottom: 4px solid var(--accent-primary); border-left: 4px solid var(--accent-primary); border-bottom-left-radius: 4px;"></span>
                        <span style="position: absolute; bottom: 12px; right: 12px; width: 24px; height: 24px; border-bottom: 4px solid var(--accent-primary); border-right: 4px solid var(--accent-primary); border-bottom-right-radius: 4px;"></span>

                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.15; font-size: 5rem;" class="text-primary-color">
                            <i class="fas fa-qrcode"></i>
                        </div>
                    </div>

                    <!-- Trigger buttons -->
                    <div class="flex flex-col gap-05">
                        <button class="btn btn-accent btn-full" id="scan-simulation-btn">
                            <i class="fas fa-camera"></i> Simular Escaneo de QR
                        </button>
                        <a href="#queues" class="btn btn-secondary btn-full">
                            Buscar Fila de forma manual
                        </a>
                    </div>

                </div>
            </div>
        `;

        container.innerHTML = '';
        container.appendChild(navbar);
        container.appendChild(mainWrapper);

        // Bind Scan Action Simulation
        const scanBtn = container.querySelector('#scan-simulation-btn');
        if (scanBtn) {
            scanBtn.addEventListener('click', () => {
                scanBtn.disabled = true;
                scanBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Escaneando código...';
                
                // Add red laser animation details or custom class
                const box = container.querySelector('.scanner-box-wrapper');
                if (box) box.style.borderColor = 'var(--status-success)';

                setTimeout(() => {
                    // Choose Comedor Central general queue as the default QR target
                    const defaultEst = State.establishments[0];
                    const defaultQueue = defaultEst.queues[0];

                    Simulator.showPushToast('Lector QR', 'Código QR reconocido con éxito.', 'success');
                    
                    // Redirect to confirmation params
                    window.location.hash = `#join-queue?est=${defaultEst.id}&queue=${defaultQueue.id}`;
                }, 1200);
            });
        }

        // Add CSS keyframes for laser animation if not present
        if (!document.getElementById('laser-keyframes')) {
            const style = document.createElement('style');
            style.id = 'laser-keyframes';
            style.innerHTML = `
                .laser-scanner-line {
                    position: absolute;
                    left: 12px;
                    width: calc(100% - 24px);
                    height: 3px;
                    background-color: var(--accent-primary);
                    box-shadow: 0 0 10px var(--accent-primary), 0 0 20px var(--accent-primary);
                    animation: laserMove 2.5s infinite linear;
                    z-index: 2;
                }
                @keyframes laserMove {
                    0% { top: 15px; }
                    50% { top: 220px; }
                    100% { top: 15px; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}
