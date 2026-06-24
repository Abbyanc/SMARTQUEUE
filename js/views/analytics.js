/* ==========================================================================
   SmartQueue - Analytics & AI Predictions View (analytics.js)
   ========================================================================== */

import { State } from '../state.js';
import { Simulator } from '../simulation.js';
import { renderSidebar } from '../components/sidebar.js';
import { renderLineChart } from '../components/chart.js';

export function render(container) {
    const isLoggedIn = !!State.currentUser;
    const isAdmin = isLoggedIn && State.currentUser.role === 'admin';

    if (!isAdmin) {
        window.location.hash = '#login';
        return;
    }

    const sidebar = renderSidebar('analytics');
    const mainSection = document.createElement('div');
    mainSection.className = 'dashboard-main';

    mainSection.innerHTML = `
        <!-- Dashboard Sub-Navbar -->
        <header class="dashboard-nav">
            <span style="font-size: 0.85rem; color: var(--text-muted);">Modelo Predictivo: <strong class="text-success"><i class="fas fa-brain"></i> Activo (LSTM V3)</strong></span>
            <div style="width: 1px; height: 20px; background-color: var(--border-color);"></div>
            <div class="user-profile-badge">
                <div class="avatar" style="background-color: var(--accent-primary);">RM</div>
                <div class="user-name" style="font-size: 0.85rem; font-weight: 600;">Rodrigo Mendoza</div>
            </div>
        </header>

        <!-- Content -->
        <div class="dashboard-content">
            <div class="flex flex-between" style="margin-bottom: 2rem;">
                <div>
                    <h2 style="font-size: 1.75rem; font-weight: 800; color: var(--text-primary);">Predicción de Demanda por IA</h2>
                    <p class="text-muted">Análisis estadístico e inteligencia predictiva de afluencia.</p>
                </div>
                <button class="btn btn-secondary" id="download-report-btn">
                    <i class="fas fa-file-download"></i> Descargar Reporte PDF
                </button>
            </div>

            <!-- Key metrics row -->
            <div class="grid grid-cols-4 gap-15" style="margin-bottom: 2.5rem;">
                <div class="card card-glow" style="padding: 1.25rem;">
                    <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700;">Precisión del Modelo</div>
                    <div style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">97.2%</div>
                    <div style="font-size: 0.75rem; color: var(--status-success); font-weight: 600; margin-top: 0.25rem;"><i class="fas fa-check"></i> Margen de error <3%</div>
                </div>
                <div class="card card-glow" style="padding: 1.25rem;">
                    <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700;">Tasa de Abandono</div>
                    <div style="font-size: 1.85rem; font-weight: 800; color: var(--status-success); margin-top: 0.25rem;">1.8%</div>
                    <div style="font-size: 0.75rem; color: var(--status-success); font-weight: 600; margin-top: 0.25rem;"><i class="fas fa-arrow-down"></i> -0.5% vs sem. pasada</div>
                </div>
                <div class="card card-glow" style="padding: 1.25rem;">
                    <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700;">Tiempo de Atención</div>
                    <div style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">3.2 <span style="font-size: 0.95rem; font-weight: 500;">min</span></div>
                    <div style="font-size: 0.75rem; color: var(--status-success); font-weight: 600; margin-top: 0.25rem;"><i class="fas fa-chevron-down"></i> Optimizado por IA</div>
                </div>
                <div class="card card-glow" style="padding: 1.25rem;">
                    <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700;">Proyección de Demanda</div>
                    <div style="font-size: 1.85rem; font-weight: 800; color: var(--status-warning); margin-top: 0.25rem;">Alta a las 12:00</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; margin-top: 0.25rem;">Pico habitual escolar/almuerzo</div>
                </div>
            </div>

            <!-- Charts & AI Recommendation layout -->
            <div class="grid grid-cols-3 gap-2" style="margin-bottom: 2.5rem;">
                
                <!-- SVG Line Chart (Actuals vs Predictions) - 2 Cols -->
                <div style="grid-column: span 2;" class="card">
                    <div class="flex flex-between" style="margin-bottom: 1.5rem;">
                        <h3 style="font-size: 1.1rem; font-weight: 700;">Curva de Demanda por Hora (Clientes / Hora)</h3>
                        <div class="flex gap-1" style="font-size: 0.75rem;">
                            <span class="flex gap-05 align-items-center"><span style="width: 10px; height: 10px; border-radius: 50%; background-color: var(--accent-primary);"></span> Actual hoy</span>
                            <span class="flex gap-05 align-items-center"><span style="width: 10px; height: 3px; background-color: var(--status-info); border-radius: 1px;"></span> Predicción IA (Futuro)</span>
                        </div>
                    </div>
                    <div class="chart-container" id="analytics-line-chart" style="height: 240px;"></div>
                </div>

                <!-- AI Recommendations Box (1 Col) -->
                <div class="card card-glow" style="border-color: rgba(59, 130, 246, 0.35); display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <h4 style="font-weight: 800; font-size: 1.15rem; color: var(--text-primary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-brain text-primary-color" style="animation: brain-pulse 2s infinite;"></i> Recomendaciones IA
                        </h4>
                        <div class="flex flex-col gap-1" style="font-size: 0.825rem; line-height: 1.45;">
                            <div style="background-color: var(--bg-tertiary); padding: 0.75rem; border-radius: var(--border-radius-sm); border-left: 3px solid var(--status-warning);">
                                <strong>Pico de Almuerzo Comedor:</strong> El modelo predice un alza de afluencia del 18% a las 12:00 debido a la salida del bloque universitario. Se aconseja habilitar 1 asesor adicional.
                            </div>
                            <div style="background-color: var(--bg-tertiary); padding: 0.75rem; border-radius: var(--border-radius-sm); border-left: 3px solid var(--status-success);">
                                <strong>Banco plataforma:</strong> Demanda baja proyectada para la tarde. Se sugiere transferir personal del módulo de plataforma a soporte telefónico.
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm btn-full" id="apply-ai-alloc-btn" style="margin-top: 1.5rem;">
                        <i class="fas fa-magic"></i> Automatizar Asignación
                    </button>
                </div>
            </div>

            <!-- Demographics and comparisons -->
            <div class="card">
                <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem;">Comparativa Histórica y Desempeño Operativo</h3>
                <div class="grid grid-cols-3 gap-2">
                    <div style="background-color: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--border-radius-md); border: 1px solid var(--border-color);">
                        <h4 style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--text-primary);">Afluencia Semanal</h4>
                        <div style="font-size: 1.85rem; font-weight: 800; color: var(--accent-primary);">3,480 <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">tickets</span></div>
                        <p class="text-muted" style="font-size: 0.75rem; margin-top: 0.25rem;">Un 12.4% más alto que el promedio del mes pasado.</p>
                    </div>
                    <div style="background-color: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--border-radius-md); border: 1px solid var(--border-color);">
                        <h4 style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--text-primary);">Tasa de Re-llamados</h4>
                        <div style="font-size: 1.85rem; font-weight: 800; color: var(--status-success);">1.2%</div>
                        <p class="text-muted" style="font-size: 0.75rem; margin-top: 0.25rem;">Clientes que no asistieron y fueron llamados nuevamente.</p>
                    </div>
                    <div style="background-color: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--border-radius-md); border: 1px solid var(--border-color);">
                        <h4 style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--text-primary);">Tiempo de Espera Físico Ahorrado</h4>
                        <div style="font-size: 1.85rem; font-weight: 800; color: var(--status-success);">8.4 días</div>
                        <p class="text-muted" style="font-size: 0.75rem; margin-top: 0.25rem;">Suma acumulada de horas de espera física ahorradas por usuarios.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = '';
    const containerWrapper = document.createElement('div');
    containerWrapper.className = 'dashboard-container';
    containerWrapper.appendChild(sidebar);
    containerWrapper.appendChild(mainSection);
    container.appendChild(containerWrapper);

    // Render Line Chart
    renderLineChart('analytics-line-chart', State.analyticsData.hourlyLoads);

    // Bind PDF Download Report Simulation
    const reportBtn = container.querySelector('#download-report-btn');
    if (reportBtn) {
        reportBtn.addEventListener('click', () => {
            reportBtn.disabled = true;
            reportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando PDF...';

            setTimeout(() => {
                reportBtn.disabled = false;
                reportBtn.innerHTML = '<i class="fas fa-file-download"></i> Descargar Reporte PDF';
                
                // Emulate file download trigger
                alert('Descarga exitosa: "Reporte_Demanda_IA_SmartQueue.pdf" ha sido descargado en tu dispositivo.');
                Simulator.showPushToast('Exportar Reporte', 'Reporte PDF descargado.', 'success');
            }, 1500);
        });
    }

    // Bind AI Apply Action
    const applyAiBtn = container.querySelector('#apply-ai-alloc-btn');
    if (applyAiBtn) {
        applyAiBtn.addEventListener('click', () => {
            applyAiBtn.disabled = true;
            applyAiBtn.innerHTML = '<i class="fas fa-check"></i> Asignación Aplicada';
            
            // Adjust setting counters in state
            State.settings.staff.activeCounters = 4; // Add 1 counter
            State.saveToStorage();

            Simulator.showPushToast(
                'Inteligencia Artificial', 
                'Personal redistribuido en base a la proyección: Comedor Universitario recibió 1 mostrador extra.', 
                'success'
            );

            setTimeout(() => {
                applyAiBtn.disabled = false;
                applyAiBtn.innerHTML = '<i class="fas fa-magic"></i> Automatizar Asignación';
            }, 3000);
        });
    }

    // Add brain-pulse animation details if not present
    if (!document.getElementById('brain-pulse-keyframes')) {
        const style = document.createElement('style');
        style.id = 'brain-pulse-keyframes';
        style.innerHTML = `
            @keyframes brain-pulse {
                0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(var(--accent-primary-rgb), 0.4)); }
                50% { transform: scale(1.08); filter: drop-shadow(0 0 8px rgba(var(--accent-primary-rgb), 0.6)); }
                100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(var(--accent-primary-rgb), 0.4)); }
            }
        `;
        document.head.appendChild(style);
    }
}
