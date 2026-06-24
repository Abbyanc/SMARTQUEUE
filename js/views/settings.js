/* ==========================================================================
   SmartQueue - Administrative Settings View (settings.js)
   ========================================================================== */

import { State } from '../state.js';
import { Simulator } from '../simulation.js';
import { renderSidebar } from '../components/sidebar.js';

export function render(container) {
    const isLoggedIn = !!State.currentUser;
    const isAdmin = isLoggedIn && State.currentUser.role === 'admin';

    if (!isAdmin) {
        window.location.hash = '#login';
        return;
    }

    const sidebar = renderSidebar('settings');
    const mainSection = document.createElement('div');
    mainSection.className = 'dashboard-main';

    mainSection.innerHTML = `
        <!-- Dashboard Sub-Navbar -->
        <header class="dashboard-nav">
            <span style="font-size: 0.85rem; color: var(--text-muted);">Configuración Global</span>
            <div style="width: 1px; height: 20px; background-color: var(--border-color);"></div>
            <div class="user-profile-badge">
                <div class="avatar" style="background-color: var(--accent-primary);">RM</div>
                <div class="user-name" style="font-size: 0.85rem; font-weight: 600;">Rodrigo Mendoza</div>
            </div>
        </header>

        <!-- Content -->
        <div class="dashboard-content">
            <div style="margin-bottom: 2.5rem;">
                <h2 style="font-size: 1.75rem; font-weight: 800; color: var(--text-primary);">Configuración del Establecimiento</h2>
                <p class="text-muted">Personaliza horarios, reglas de atención y asesores de tu sede.</p>
            </div>

            <form id="admin-settings-form" class="grid grid-cols-3 gap-2">
                
                <!-- Left 2 columns (Main Configs) -->
                <div style="grid-column: span 2;" class="flex flex-col gap-2">
                    
                    <!-- Operating Hours -->
                    <div class="card">
                        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem;"><i class="far fa-clock text-primary-color"></i> Horarios de Atención</h3>
                        
                        <div class="grid grid-cols-2 gap-1" style="margin-bottom: 1rem;">
                            <div class="form-group">
                                <label>Apertura (Lunes a Viernes)</label>
                                <input type="time" class="form-control" value="08:00">
                            </div>
                            <div class="form-group">
                                <label>Cierre (Lunes a Viernes)</label>
                                <input type="time" class="form-control" value="18:00">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-1">
                            <div class="form-group">
                                <label>Apertura (Sábados)</label>
                                <input type="time" class="form-control" value="09:00">
                            </div>
                            <div class="form-group">
                                <label>Cierre (Sábados)</label>
                                <input type="time" class="form-control" value="13:00">
                            </div>
                        </div>
                    </div>

                    <!-- Staff & Counter Config -->
                    <div class="card">
                        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem;"><i class="fas fa-users text-primary-color"></i> Módulos y Personal</h3>
                        
                        <div class="form-group" style="margin-bottom: 1.5rem;">
                            <label for="set-counters">Ventanillas / Mostradores Activos</label>
                            <input type="number" id="set-counters" class="form-control" min="1" max="10" value="${State.settings.staff.activeCounters}" required>
                            <p class="text-muted" style="font-size: 0.75rem; margin-top: 0.25rem;">
                                Número total de terminales físicas llamando personas de forma paralela. Afecta el cálculo del tiempo estimado de espera.
                            </p>
                        </div>

                        <div class="form-group">
                            <label>Asesores Asignados Hoy</label>
                            <div class="flex flex-col gap-05" style="background-color: var(--bg-tertiary); padding: 1rem; border-radius: var(--border-radius-md); border: 1px solid var(--border-color);">
                                <div class="flex-between" style="font-size: 0.85rem;">
                                    <span>Ventanilla 1: <strong>Carlos Pérez</strong></span>
                                    <span class="badge badge-success">Activo</span>
                                </div>
                                <div class="flex-between" style="font-size: 0.85rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;">
                                    <span>Ventanilla 2: <strong>Ana Gómez</strong></span>
                                    <span class="badge badge-success">Activo</span>
                                </div>
                                <div class="flex-between" style="font-size: 0.85rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;">
                                    <span>Ventanilla 3: <strong>Luis Martínez</strong></span>
                                    <span class="badge badge-success">Activo</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Business Rules -->
                    <div class="card">
                        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem;"><i class="fas fa-tasks text-primary-color"></i> Reglas de Fila</h3>
                        
                        <div class="flex flex-col gap-15">
                            <!-- Toggle auto call -->
                            <div class="flex-between">
                                <div>
                                    <div style="font-weight: 600; font-size: 0.95rem;">Llamada automática al siguiente</div>
                                    <p class="text-muted" style="font-size: 0.75rem; margin-top: 0.15rem; line-height: 1.35;">
                                        Llama automáticamente al siguiente cliente de la fila cuando una ventanilla finalice.
                                    </p>
                                </div>
                                <input type="checkbox" id="set-auto-call" ${State.settings.attentionRules.autoCallNext ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--accent-primary); cursor: pointer;">
                            </div>

                            <!-- Max capacity limit -->
                            <div class="form-group" style="border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
                                <label for="set-max-capacity">Límite Máximo de Cola Activa</label>
                                <input type="number" id="set-max-capacity" class="form-control" value="100" min="10">
                                <p class="text-muted" style="font-size: 0.75rem; margin-top: 0.25rem;">
                                    Los usuarios no podrán ingresar a la cola virtual por QR si se sobrepasa este límite.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column (Global Channels Config & Save Button) -->
                <div class="flex flex-col gap-2">
                    
                    <!-- Alert Channels config -->
                    <div class="card">
                        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem;"><i class="fas fa-paper-plane text-primary-color"></i> Canales de Comunicación</h3>
                        
                        <div class="flex flex-col gap-1">
                            <div class="flex-between" style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
                                <div>
                                    <div style="font-size: 0.85rem; font-weight: 600;">Notificaciones WhatsApp</div>
                                    <div style="font-size: 0.7rem; color: var(--text-muted);">Habilitar canal global Twilio/WhatsApp</div>
                                </div>
                                <input type="checkbox" checked style="width: 16px; height: 16px; accent-color: var(--accent-primary); cursor: pointer;">
                            </div>

                            <div class="flex-between" style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
                                <div>
                                    <div style="font-size: 0.85rem; font-weight: 600;">Alertas SMS</div>
                                    <div style="font-size: 0.7rem; color: var(--text-muted);">Mensajes de texto de contingencia</div>
                                </div>
                                <input type="checkbox" style="width: 16px; height: 16px; accent-color: var(--accent-primary); cursor: pointer;">
                            </div>

                            <div class="flex-between">
                                <div>
                                    <div style="font-size: 0.85rem; font-weight: 600;">Alertas por Correo</div>
                                    <div style="font-size: 0.7rem; color: var(--text-muted);">Envío de comprobante PDF digital</div>
                                </div>
                                <input type="checkbox" checked style="width: 16px; height: 16px; accent-color: var(--accent-primary); cursor: pointer;">
                            </div>
                        </div>
                    </div>

                    <!-- Floating Action Card -->
                    <div class="card card-glow" style="border-color: var(--accent-primary);">
                        <h4 style="font-weight: 700; margin-bottom: 0.75rem;">Aplicar Configuración</h4>
                        <p class="text-muted" style="font-size: 0.75rem; margin-bottom: 1.5rem; line-height: 1.4;">
                            Los cambios afectarán el flujo del simulador y los tiempos estimados de espera de los clientes en fila inmediatamente.
                        </p>
                        <button type="submit" class="btn btn-accent btn-full">
                            <i class="fas fa-check-double"></i> Guardar Todo
                        </button>
                    </div>
                </div>

            </form>
        </div>
    `;

    // Clear and build Layout
    container.innerHTML = '';
    const containerWrapper = document.createElement('div');
    containerWrapper.className = 'dashboard-container';
    containerWrapper.appendChild(sidebar);
    containerWrapper.appendChild(mainSection);
    container.appendChild(containerWrapper);

    // Bind settings form submit
    const settingsForm = container.querySelector('#admin-settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const counters = parseInt(container.querySelector('#set-counters').value);
            const autoCall = container.querySelector('#set-auto-call').checked;

            State.settings.staff.activeCounters = counters;
            State.settings.attentionRules.autoCallNext = autoCall;

            State.saveToStorage();
            Simulator.showPushToast('Guardado', 'Reglas del establecimiento guardadas con éxito.', 'success');
        });
    }
}
