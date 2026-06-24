/* ==========================================================================
   SmartQueue - User Profile View (profile.js)
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

    const user = State.currentUser;
    const isUserAdmin = user.role === 'admin';

    // Calculate savings
    const savedTimeMinutes = State.history.length * 15; // Estimate 15 mins saved per queue

    const navbar = renderNavbar('profile');
    const mainWrapper = document.createElement('div');
    mainWrapper.className = 'w-full';

    mainWrapper.innerHTML = `
        <div class="container" style="padding: 2.5rem 1.5rem;">
            
            <div style="margin-bottom: 2.5rem;">
                <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-primary);">Perfil de Usuario</h2>
                <p class="text-muted">Administra tus datos personales, preferencias de notificaciones y rol en el sistema.</p>
            </div>

            <div class="grid grid-cols-3 gap-2">
                <!-- Left 2 Cols: Profile Form & Notification settings -->
                <div style="grid-column: span 2;" class="flex flex-col gap-2">
                    
                    <!-- Profile Form Card -->
                    <form class="card" id="profile-details-form">
                        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem;">Datos Personales</h3>
                        
                        <div class="grid grid-cols-2 gap-1">
                            <div class="form-group">
                                <label for="prof-name">Nombre Completo</label>
                                <input type="text" id="prof-name" class="form-control" value="${user.name}" required>
                            </div>
                            <div class="form-group">
                                <label for="prof-email">Correo Electrónico</label>
                                <input type="email" id="prof-email" class="form-control" value="${user.email}" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="prof-role">Rol de Acceso (Modo Demo)</label>
                            <select id="prof-role" class="form-control" style="cursor: pointer;">
                                <option value="user" ${!isUserAdmin ? 'selected' : ''}>Cliente / Usuario de Fila</option>
                                <option value="admin" ${isUserAdmin ? 'selected' : ''}>Administrador de Establecimiento</option>
                            </select>
                            <p class="text-muted" style="font-size: 0.75rem; margin-top: 0.25rem;">
                                Cambia de rol para explorar el Dashboard del Cliente o la Consola de Administración en tiempo real.
                            </p>
                        </div>

                        <button type="submit" class="btn btn-primary" style="margin-top: 1rem;">
                            <i class="fas fa-save"></i> Guardar Cambios
                        </button>
                    </form>

                    <!-- Notifications Preference Card -->
                    <div class="card">
                        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem;">Configuración de Notificaciones</h3>
                        
                        <div class="flex flex-col gap-15">
                            <!-- Push Alert Toggle -->
                            <div class="flex-between">
                                <div>
                                    <div style="font-weight: 600; font-size: 0.95rem;">Notificaciones Push en Navegador</div>
                                    <p class="text-muted" style="font-size: 0.75rem; margin-top: 0.15rem; line-height: 1.35;">
                                        Envía alertas sonoras y banners visuales directamente cuando estés en la app.
                                    </p>
                                </div>
                                <input type="checkbox" id="pref-push-check" ${State.settings.notifications.pushEnabled ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--accent-primary); cursor: pointer;">
                            </div>

                            <!-- WhatsApp Alert Toggle -->
                            <div class="flex-between" style="border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
                                <div>
                                    <div style="font-weight: 600; font-size: 0.95rem;">Alertas automáticas por WhatsApp</div>
                                    <p class="text-muted" style="font-size: 0.75rem; margin-top: 0.15rem; line-height: 1.35;">
                                        Envía resúmenes del ticket y notificaciones de proximidad a tu WhatsApp simulado.
                                    </p>
                                </div>
                                <input type="checkbox" id="pref-wa-check" ${State.settings.notifications.waEnabled ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--status-success); cursor: pointer;">
                            </div>

                            <!-- Proximity Threshold slider -->
                            <div style="border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
                                <div class="flex-between" style="margin-bottom: 0.5rem;">
                                    <div>
                                        <div style="font-weight: 600; font-size: 0.95rem;">Umbral de Proximidad</div>
                                        <p class="text-muted" style="font-size: 0.75rem; margin-top: 0.15rem; line-height: 1.35;">
                                            Notificarme cuando falten esta cantidad de personas delante de mí.
                                        </p>
                                    </div>
                                    <span style="font-weight: 700; color: var(--accent-primary); font-size: 1.2rem;" id="threshold-val-display">
                                        ${State.settings.notifications.proximityThreshold}
                                    </span>
                                </div>
                                <input type="range" id="pref-proximity-slider" min="1" max="5" value="${State.settings.notifications.proximityThreshold}" style="width: 100%; accent-color: var(--accent-primary); cursor: pointer;">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Col: Personal Stats -->
                <div class="flex flex-col gap-2">
                    <div class="card card-glow" style="padding: 1.75rem;">
                        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem;">Estadísticas de Uso</h3>
                        
                        <div class="flex flex-col gap-15">
                            <div>
                                <span class="text-muted" style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Filas completadas</span>
                                <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary); margin-top: 0.15rem;">
                                    ${State.history.filter(h => h.status === 'Atendido').length}
                                </div>
                            </div>
                            
                            <div style="border-top: 1px solid var(--border-color); padding-top: 1rem;">
                                <span class="text-muted" style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Tiempo total ahorrado</span>
                                <div style="font-size: 2rem; font-weight: 800; color: var(--status-success); margin-top: 0.15rem;">
                                    ${savedTimeMinutes} <span style="font-size: 1rem; font-weight: 500; color: var(--text-muted);">minutos</span>
                                </div>
                                <p style="font-size: 0.7rem; margin-top: 0.25rem;" class="text-muted">Calculado contra el tiempo promedio de espera física.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;

    container.innerHTML = '';
    container.appendChild(navbar);
    container.appendChild(mainWrapper);

    // Bind slider display update
    const slider = container.querySelector('#pref-proximity-slider');
    const sliderVal = container.querySelector('#threshold-val-display');
    if (slider && sliderVal) {
        slider.addEventListener('input', (e) => {
            sliderVal.innerText = e.target.value;
            State.settings.notifications.proximityThreshold = parseInt(e.target.value);
            State.saveToStorage();
        });
    }

    // Bind form submission
    const profileForm = container.querySelector('#profile-details-form');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = container.querySelector('#prof-name').value;
            const email = container.querySelector('#prof-email').value;
            const role = container.querySelector('#prof-role').value;

            State.currentUser.name = name;
            State.currentUser.email = email;
            State.currentUser.role = role;

            State.saveToStorage();
            Simulator.showPushToast('Guardado', 'Cambios de perfil aplicados.', 'success');

            // If role changed, trigger a redirect
            if (role === 'admin') {
                window.location.hash = '#admin';
            } else {
                window.location.hash = '#user-dashboard';
            }
        });
    }

    // Bind immediate checks
    const pushCheck = container.querySelector('#pref-push-check');
    if (pushCheck) {
        pushCheck.addEventListener('change', (e) => {
            State.settings.notifications.pushEnabled = e.target.checked;
            State.notify();
        });
    }

    const waCheck = container.querySelector('#pref-wa-check');
    if (waCheck) {
        waCheck.addEventListener('change', (e) => {
            State.settings.notifications.waEnabled = e.target.checked;
            State.notify();
        });
    }
}
