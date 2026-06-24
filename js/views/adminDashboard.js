/* ==========================================================================
   SmartQueue - Administrative Dashboard View (adminDashboard.js)
   ========================================================================== */

import { State } from '../state.js';
import { Simulator } from '../simulation.js';
import { renderSidebar } from '../components/sidebar.js';
import { renderBarChart } from '../components/chart.js';

export function render(container) {
    const isLoggedIn = !!State.currentUser;
    const isAdmin = isLoggedIn && State.currentUser.role === 'admin';

    if (!isAdmin) {
        window.location.hash = '#login';
        return;
    }

    // Main layout with Sidebar
    const sidebar = renderSidebar('admin');
    
    const mainSection = document.createElement('div');
    mainSection.className = 'dashboard-main';

    // 1. Build metrics
    const totalQueues = State.establishments.reduce((acc, est) => acc + est.queues.length, 0);
    const activeWait = State.analyticsData.avgWaitTime;
    const servedTodayCount = State.analyticsData.todayCount;
    const satisfaction = State.analyticsData.satisfactionRate;

    // 2. Build queues table (combining all establishments for global dashboard view)
    let queueRowsHTML = '';
    State.establishments.forEach(est => {
        est.queues.forEach(q => {
            const peopleWaiting = q.lastTurn - q.currentTurn;
            const avgWait = peopleWaiting * q.waitPerPerson;

            queueRowsHTML += `
                <tr>
                    <td>
                        <div style="font-weight: 600; color: var(--text-primary);">${est.name}</div>
                        <div style="font-size: 0.75rem;" class="text-muted">${q.name}</div>
                    </td>
                    <td><strong class="text-primary-color">${q.codePrefix}-${q.currentTurn}</strong></td>
                    <td><strong>${q.codePrefix}-${q.lastTurn}</strong></td>
                    <td>${peopleWaiting} en espera</td>
                    <td>~${Math.round(avgWait)} min</td>
                    <td>
                        <span class="badge ${q.active ? 'badge-success' : 'badge-danger'}">
                            ${q.active ? 'Habilitada' : 'Pausada'}
                        </span>
                    </td>
                    <td>
                        <div class="flex gap-05">
                            <button class="btn btn-primary btn-sm call-next-btn" data-est="${est.id}" data-queue="${q.id}" ${peopleWaiting === 0 ? 'disabled' : ''} title="Llamar al siguiente">
                                <i class="fas fa-bullhorn"></i> Llamar
                            </button>
                            <button class="btn btn-secondary btn-sm toggle-queue-btn" data-est="${est.id}" data-queue="${q.id}">
                                <i class="fas ${q.active ? 'fa-pause' : 'fa-play'}"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    });

    // 3. Build active users table
    // If the logged-in user is currently in a queue, show them first. Add a few mock entries too.
    let userRowsHTML = '';
    if (State.activeTurn && State.activeTurn.status === 'Esperando') {
        const at = State.activeTurn;
        userRowsHTML += `
            <tr style="background-color: var(--accent-light);">
                <td>
                    <div class="flex gap-05 align-items-center">
                        <div class="avatar" style="width: 1.75rem; height: 1.75rem; font-size: 0.75rem;">LG</div>
                        <div>
                            <div style="font-weight: 700; color: var(--text-primary);">${State.currentUser.name} (Tú)</div>
                            <div style="font-size: 0.7rem;" class="text-muted">${State.currentUser.email}</div>
                        </div>
                    </div>
                </td>
                <td><strong class="text-primary-color">${at.turnCode}</strong></td>
                <td>${at.queueName}</td>
                <td>Hace ~${Math.max(1, 10 - at.peopleAhead)} min</td>
                <td><span class="badge badge-warning">Esperando</span></td>
                <td>
                    <button class="btn btn-primary btn-sm direct-call-btn" data-est="${at.establishmentId}" data-queue="${at.queueId}">
                        <i class="fas fa-bullhorn"></i> Llamar
                    </button>
                </td>
            </tr>
        `;
    }

    // Append standard mock active users
    const mockUsers = [
        { name: 'Juan Flores', email: 'juan@gmail.com', turn: 'A-105', queue: 'Almuerzo General', joined: 'Hace 8 min', status: 'Esperando' },
        { name: 'Sofía Castro', email: 'sofia@yahoo.com', turn: 'C-286', queue: 'Caja General', joined: 'Hace 14 min', status: 'Esperando' },
        { name: 'Martín Paredes', email: 'martin@outlook.com', turn: 'M-57', queue: 'Triaje y Consultas', joined: 'Hace 3 min', status: 'Esperando' }
    ];

    mockUsers.forEach(u => {
        userRowsHTML += `
            <tr>
                <td>
                    <div class="flex gap-05 align-items-center">
                        <div class="avatar" style="width: 1.75rem; height: 1.75rem; font-size: 0.75rem; background-color: var(--bg-tertiary); color: var(--text-secondary); border: 1px solid var(--border-color);">${u.name.charAt(0)}${u.name.split(' ')[1].charAt(0)}</div>
                        <div>
                            <div style="font-weight: 600; color: var(--text-primary);">${u.name}</div>
                            <div style="font-size: 0.7rem;" class="text-muted">${u.email}</div>
                        </div>
                    </div>
                </td>
                <td><strong>${u.turn}</strong></td>
                <td>${u.queue}</td>
                <td>${u.joined}</td>
                <td><span class="badge badge-warning">${u.status}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm mock-call-btn" data-turn="${u.turn}">
                        <i class="fas fa-bullhorn"></i> Llamar
                    </button>
                </td>
            </tr>
        `;
    });

    mainSection.innerHTML = `
        <!-- Dashboard Sub-Navbar -->
        <header class="dashboard-nav">
            <span style="font-size: 0.85rem; color: var(--text-muted);">Establecimientos Totales: <strong>4 sucursales</strong></span>
            <div style="width: 1px; height: 20px; background-color: var(--border-color);"></div>
            <div class="user-profile-badge">
                <div class="avatar" style="background-color: var(--accent-primary);">RM</div>
                <div class="user-name" style="font-size: 0.85rem; font-weight: 600;">Rodrigo Mendoza</div>
            </div>
        </header>

        <!-- Dashboard Content -->
        <div class="dashboard-content">
            <div style="margin-bottom: 2rem;">
                <h2 style="font-size: 1.75rem; font-weight: 800; color: var(--text-primary);">Monitoreo en Vivo</h2>
                <p class="text-muted">Control centralizado de colas virtuales y atención de asesores.</p>
            </div>

            <!-- Key metrics grid -->
            <div class="grid grid-cols-4 gap-15" style="margin-bottom: 2rem;">
                <div class="card card-glow" style="padding: 1.25rem;">
                    <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700;">Espera Promedio</div>
                    <div style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">~${activeWait} <span style="font-size: 0.95rem; font-weight: 500;">min</span></div>
                    <div style="font-size: 0.75rem; color: var(--status-success); font-weight: 600; margin-top: 0.25rem;"><i class="fas fa-chevron-down"></i> 8.4% esta hora</div>
                </div>
                <div class="card card-glow" style="padding: 1.25rem;">
                    <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700;">Atendidos Hoy</div>
                    <div style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">${servedTodayCount} <span style="font-size: 0.95rem; font-weight: 500;">turnos</span></div>
                    <div style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 600; margin-top: 0.25rem;"><i class="fas fa-user-friends"></i> +45 en cola activa</div>
                </div>
                <div class="card card-glow" style="padding: 1.25rem;">
                    <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700;">Filas Configuradas</div>
                    <div style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">${totalQueues} <span style="font-size: 0.95rem; font-weight: 500;">filas</span></div>
                    <div style="font-size: 0.75rem; color: var(--status-success); font-weight: 600; margin-top: 0.25rem;"><i class="fas fa-check-circle"></i> Operativas al 100%</div>
                </div>
                <div class="card card-glow" style="padding: 1.25rem;">
                    <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700;">Índice Satisfacción</div>
                    <div style="font-size: 1.85rem; font-weight: 800; color: var(--status-success); margin-top: 0.25rem;">${satisfaction}%</div>
                    <div style="font-size: 0.75rem; color: var(--status-success); font-weight: 600; margin-top: 0.25rem;"><i class="fas fa-smile"></i> Nivel Excelente</div>
                </div>
            </div>

            <!-- Main grid -->
            <div class="grid grid-cols-3 gap-2" style="margin-bottom: 2rem;">
                
                <!-- Left 2 Cols: Queues list -->
                <div style="grid-column: span 2;" class="flex flex-col gap-2">
                    <div class="card">
                        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Consola de Filas en Sucursales</h3>
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Establecimiento / Fila</th>
                                        <th>Atendiendo</th>
                                        <th>Último Ticket</th>
                                        <th>Cola Activa</th>
                                        <th>Espera Aprox.</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${queueRowsHTML}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Right Col: SVG Chart for today traffic -->
                <div class="card">
                    <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Volumen de Tránsito Semanal</h3>
                    <div class="chart-container" id="admin-bar-chart"></div>
                </div>
            </div>

            <!-- Bottom: Active Clients List -->
            <div class="card">
                <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Próximos Clientes a Ser Atendidos</h3>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Ticket</th>
                                <th>Servicio</th>
                                <th>Tiempo Esperado</th>
                                <th>Estado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${userRowsHTML}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    // Clear and build layout container
    container.innerHTML = '';
    const containerWrapper = document.createElement('div');
    containerWrapper.className = 'dashboard-container';
    containerWrapper.appendChild(sidebar);
    containerWrapper.appendChild(mainSection);
    container.appendChild(containerWrapper);

    // Render Bar Chart (weekly performance)
    renderBarChart('admin-bar-chart', State.analyticsData.weeklyPerformance);

    // Bind Call Next Buttons
    const callBtns = container.querySelectorAll('.call-next-btn');
    callBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const estId = btn.getAttribute('data-est');
            const qId = btn.getAttribute('data-queue');
            
            const est = State.establishments.find(e => e.id === estId);
            const q = est ? est.queues.find(qu => qu.id === qId) : null;
            
            if (q && q.currentTurn < q.lastTurn) {
                q.currentTurn++;
                State.analyticsData.todayCount++;
                
                // If this is the user's queue, trigger check
                if (State.activeTurn && State.activeTurn.establishmentId === estId && State.activeTurn.queueId === qId) {
                    Simulator.tick();
                } else {
                    State.notify();
                }
                
                Simulator.showPushToast('Llamada Realizada', `Llamando al ticket ${q.codePrefix}-${q.currentTurn} en ${q.name}.`, 'success');
            }
        });
    });

    // Bind Direct Call (User)
    const directCallBtn = container.querySelector('.direct-call-btn');
    if (directCallBtn) {
        directCallBtn.addEventListener('click', () => {
            const estId = directCallBtn.getAttribute('data-est');
            const qId = directCallBtn.getAttribute('data-queue');
            const est = State.establishments.find(e => e.id === estId);
            const q = est ? est.queues.find(qu => qu.id === qId) : null;

            if (q) {
                const userTurnNum = parseInt(State.activeTurn.turnCode.split('-')[1]);
                q.currentTurn = userTurnNum; // Force call
                Simulator.tick();
                Simulator.showPushToast('Llamada Directa', `Has llamado al usuario ${State.currentUser.name} (${State.activeTurn.turnCode})`, 'success');
            }
        });
    }

    // Bind Toggle Queue
    const toggleBtns = container.querySelectorAll('.toggle-queue-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const estId = btn.getAttribute('data-est');
            const qId = btn.getAttribute('data-queue');
            
            const est = State.establishments.find(e => e.id === estId);
            const q = est ? est.queues.find(qu => qu.id === qId) : null;

            if (q) {
                q.active = !q.active;
                State.notify();
                Simulator.showPushToast('Fila Modificada', `La fila ${q.name} ha sido ${q.active ? 'habilitada' : 'pausada'}.`, 'info');
            }
        });
    });

    // Bind Mock Calls
    const mockCallBtns = container.querySelectorAll('.mock-call-btn');
    mockCallBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const turn = btn.getAttribute('data-turn');
            Simulator.showPushToast('Llamada Realizada', `Llamando al ticket simulado ${turn}.`, 'success');
        });
    });
}
