/* ==========================================================================
   SmartQueue - Global State Manager (state.js)
   ========================================================================== */

class GlobalState {
    constructor() {
        this.listeners = [];
        this.init();
    }

    init() {
        // Mock Initial Establishments
        this.establishments = [
            {
                id: 'est-1',
                name: 'Comedor Universitario Central',
                category: 'Educación',
                address: 'Av. Universitaria 1801, Ciudad Universitaria',
                image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&auto=format&fit=crop&q=60',
                queues: [
                    { id: 'q-1-1', name: 'Almuerzo General', codePrefix: 'A', waitPerPerson: 1.5, currentTurn: 104, lastTurn: 118, icon: 'fa-hamburger', active: true },
                    { id: 'q-1-2', name: 'Plato Vegetariano', codePrefix: 'V', waitPerPerson: 2.0, currentTurn: 42, lastTurn: 48, icon: 'fa-carrot', active: true }
                ]
            },
            {
                id: 'est-2',
                name: 'Banco Tecnológico (Sede Principal)',
                category: 'Finanzas',
                address: 'Av. Las Flores 450, Centro Financiero',
                image: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=400&auto=format&fit=crop&q=60',
                queues: [
                    { id: 'q-2-1', name: 'Caja General', codePrefix: 'C', waitPerPerson: 3.5, currentTurn: 285, lastTurn: 301, icon: 'fa-money-bill-wave', active: true },
                    { id: 'q-2-2', name: 'Plataforma / Asesoría', codePrefix: 'P', waitPerPerson: 8.0, currentTurn: 14, lastTurn: 19, icon: 'fa-user-tie', active: true }
                ]
            },
            {
                id: 'est-3',
                name: 'Municipalidad (Atención Ciudadana)',
                category: 'Gobierno',
                address: 'Plaza de Armas 100, Centro Histórico',
                image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=60',
                queues: [
                    { id: 'q-3-1', name: 'Trámites y Licencias', codePrefix: 'T', waitPerPerson: 5.0, currentTurn: 89, lastTurn: 98, icon: 'fa-file-signature', active: true },
                    { id: 'q-3-2', name: 'Pago de Tributos', codePrefix: 'R', waitPerPerson: 2.5, currentTurn: 154, lastTurn: 161, icon: 'fa-cash-register', active: true }
                ]
            },
            {
                id: 'est-4',
                name: 'Centro Médico Estudiantil',
                category: 'Salud',
                address: 'Av. Medicina S/N, Campus Oeste',
                image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&auto=format&fit=crop&q=60',
                queues: [
                    { id: 'q-4-1', name: 'Triaje y Consultas', codePrefix: 'M', waitPerPerson: 4.0, currentTurn: 56, lastTurn: 64, icon: 'fa-heartbeat', active: true },
                    { id: 'q-4-2', name: 'Farmacia', codePrefix: 'F', waitPerPerson: 2.0, currentTurn: 112, lastTurn: 122, icon: 'fa-pills', active: true }
                ]
            }
        ];

        // Active Turn of the logged-in user
        this.activeTurn = null;

        // User Settings
        this.settings = {
            notifications: {
                waEnabled: true,
                pushEnabled: true,
                proximityThreshold: 3 // Notify when only 3 people are in front
            },
            attentionRules: {
                maxPerPerson: 10,
                autoCallNext: false
            },
            staff: {
                activeCounters: 3,
                names: ['Carlos Pérez', 'Ana Gómez', 'Luis Martínez']
            }
        };

        // User History
        this.history = [
            { id: 'h-1', establishmentName: 'Comedor Universitario Central', queueName: 'Almuerzo General', turnCode: 'A-98', date: '2026-06-22', status: 'Atendido' },
            { id: 'h-2', establishmentName: 'Banco Tecnológico', queueName: 'Caja General', turnCode: 'C-251', date: '2026-06-18', status: 'Atendido' },
            { id: 'h-3', establishmentName: 'Municipalidad', queueName: 'Pago de Tributos', turnCode: 'R-142', date: '2026-06-10', status: 'Cancelado' }
        ];

        // System Notifications Log
        this.notifications = [
            { id: 'n-1', title: 'Registro Exitoso', message: '¡Bienvenido a SmartQueue! Tu cuenta ha sido activada.', time: 'Hace 2 días', read: true }
        ];

        // Session information (defaults to null, initialized when logged in)
        this.currentUser = null;

        // Mock Admin Metric History (for Admin & Analytics charts)
        this.analyticsData = {
            todayCount: 847,
            avgWaitTime: 4.8, // minutes
            avgAttentionTime: 3.5, // minutes
            satisfactionRate: 94.6, // percentage
            hourlyLoads: [
                { label: '08:00', value: 12, predicted: 15 },
                { label: '10:00', value: 45, predicted: 40 },
                { label: '12:00', value: 85, predicted: 90 }, // Peak hour
                { label: '14:00', value: 65, predicted: 68 },
                { label: '16:00', value: 30, predicted: 35 },
                { label: '18:00', value: 15, predicted: 10 }
            ],
            weeklyPerformance: [
                { label: 'Lun', value: 420 },
                { label: 'Mar', value: 480 },
                { label: 'Mié', value: 510 },
                { label: 'Jue', value: 490 },
                { label: 'Vie', value: 550 },
                { label: 'Sáb', value: 210 }
            ]
        };

        // Try to load state from localStorage if available
        this.loadFromStorage();
    }

    // Subscribe to state changes
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    // Notify all subscribers of a change
    notify() {
        this.listeners.forEach(callback => callback(this));
        this.saveToStorage();
    }

    saveToStorage() {
        localStorage.setItem('smartqueue_user', JSON.stringify(this.currentUser));
        localStorage.setItem('smartqueue_active_turn', JSON.stringify(this.activeTurn));
        localStorage.setItem('smartqueue_history', JSON.stringify(this.history));
        localStorage.setItem('smartqueue_notifications', JSON.stringify(this.notifications));
        localStorage.setItem('smartqueue_settings', JSON.stringify(this.settings));
        localStorage.setItem('smartqueue_establishments', JSON.stringify(this.establishments));
    }

    loadFromStorage() {
        try {
            if (localStorage.getItem('smartqueue_user')) {
                this.currentUser = JSON.parse(localStorage.getItem('smartqueue_user'));
            }
            if (localStorage.getItem('smartqueue_active_turn')) {
                this.activeTurn = JSON.parse(localStorage.getItem('smartqueue_active_turn'));
            }
            if (localStorage.getItem('smartqueue_history')) {
                this.history = JSON.parse(localStorage.getItem('smartqueue_history'));
            }
            if (localStorage.getItem('smartqueue_notifications')) {
                this.notifications = JSON.parse(localStorage.getItem('smartqueue_notifications'));
            }
            if (localStorage.getItem('smartqueue_settings')) {
                this.settings = JSON.parse(localStorage.getItem('smartqueue_settings'));
            }
            if (localStorage.getItem('smartqueue_establishments')) {
                this.establishments = JSON.parse(localStorage.getItem('smartqueue_establishments'));
            }
        } catch (e) {
            console.error('Error loading state from localStorage:', e);
        }
    }

    // Action Methods
    login(email, password, role = 'user') {
        const name = role === 'admin' ? 'Rodrigo Mendoza' : 'Laura Gómez';
        this.currentUser = {
            id: role === 'admin' ? 'usr-admin' : 'usr-1',
            name: name,
            email: email,
            role: role
        };
        this.addNotification('Inicio de Sesión', `Has iniciado sesión correctamente como ${name}.`, 'success');
        this.notify();
    }

    loginWithGoogle(role = 'user') {
        const name = role === 'admin' ? 'Rodrigo Mendoza (Google)' : 'Laura Gómez (Google)';
        this.currentUser = {
            id: role === 'admin' ? 'usr-admin' : 'usr-1',
            name: name,
            email: role === 'admin' ? 'rodrigo.admin@gmail.com' : 'laura.gomez@gmail.com',
            role: role
        };
        this.addNotification('Autenticación Google', 'Acceso concedido mediante Google OAuth.', 'success');
        this.notify();
    }

    register(name, email, password) {
        this.currentUser = {
            id: 'usr-' + Math.floor(Math.random() * 1000),
            name: name,
            email: email,
            role: 'user'
        };
        this.addNotification('Registro Exitoso', `¡Hola ${name}! Tu cuenta ha sido creada.`, 'success');
        this.notify();
    }

    logout() {
        this.currentUser = null;
        this.activeTurn = null;
        this.notify();
    }

    joinQueue(establishmentId, queueId) {
        if (this.activeTurn) {
            this.addNotification('Error al unirse', 'Ya tienes un turno activo. Debes cancelarlo o ser atendido antes de unirte a otra fila.', 'danger');
            return false;
        }

        const est = this.establishments.find(e => e.id === establishmentId);
        const queue = est.queues.find(q => q.id === queueId);

        if (!queue) return false;

        queue.lastTurn++;
        const myTurnCode = `${queue.codePrefix}-${queue.lastTurn}`;
        const peopleAhead = queue.lastTurn - queue.currentTurn - 1;
        const estWaitTime = Math.max(0, peopleAhead * queue.waitPerPerson);

        this.activeTurn = {
            establishmentId: est.id,
            establishmentName: est.name,
            queueId: queue.id,
            queueName: queue.name,
            turnCode: myTurnCode,
            joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'Esperando',
            peopleAhead: peopleAhead,
            estimatedWait: Math.round(estWaitTime)
        };

        this.addNotification('Turno Asignado', `Te has unido a la fila ${queue.name} en ${est.name}. Tu turno es ${myTurnCode}.`, 'success');
        this.notify();
        return true;
    }

    cancelTurn() {
        if (!this.activeTurn) return;

        this.history.unshift({
            id: 'h-' + Math.floor(Math.random() * 1000),
            establishmentName: this.activeTurn.establishmentName,
            queueName: this.activeTurn.queueName,
            turnCode: this.activeTurn.turnCode,
            date: new Date().toISOString().split('T')[0],
            status: 'Cancelado'
        });

        this.addNotification('Turno Cancelado', `Has cancelado tu turno ${this.activeTurn.turnCode}.`, 'warning');
        this.activeTurn = null;
        this.notify();
    }

    addNotification(title, message, type = 'info') {
        const timeStr = 'Ahora';
        this.notifications.unshift({
            id: 'n-' + Math.floor(Math.random() * 1000),
            title: title,
            message: message,
            time: timeStr,
            read: false,
            type: type
        });
        
        // Limit notification count
        if (this.notifications.length > 20) {
            this.notifications.pop();
        }
    }

    clearNotifications() {
        this.notifications = [];
        this.notify();
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.notify();
    }
}

export const State = new GlobalState();
window.State = State; // Expose to window for testing / simulation
