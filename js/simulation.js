/* ==========================================================================
   SmartQueue - Real-time Queue Simulator & Alerts (simulation.js)
   ========================================================================== */

import { State } from './state.js';

class QueueSimulator {
    constructor() {
        this.intervalId = null;
        this.notifiedProximity = false;
        this.notifiedCalled = false;
        this.whatsappBadgeCount = 0;
        this.simulationSpeedSeconds = 12; // 12 seconds in real life = 1 cycle (e.g. represents a few minutes)
    }

    start() {
        if (this.intervalId) return;

        // Start interval
        this.intervalId = setInterval(() => {
            this.tick();
        }, this.simulationSpeedSeconds * 1000);

        this.initWhatsAppWidget();
        console.log('Simulador de filas iniciado.');
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    tick() {
        let stateChanged = false;

        // 1. Simulate general progression for all queues
        State.establishments.forEach(est => {
            est.queues.forEach(queue => {
                if (!queue.active) return;

                // Probability of serving someone (increment currentTurn)
                // Default box is 55% chance
                if (Math.random() < 0.55) {
                    if (queue.currentTurn < queue.lastTurn) {
                        queue.currentTurn++;
                        stateChanged = true;

                        // Add to today count in analytics
                        State.analyticsData.todayCount++;
                    }
                }

                // Probability of someone else joining the queue (increment lastTurn)
                // Default box is 40% chance
                if (Math.random() < 0.40) {
                    queue.lastTurn++;
                    stateChanged = true;
                }
            });
        });

        // 2. Track user's active turn
        if (State.activeTurn) {
            const active = State.activeTurn;
            const est = State.establishments.find(e => e.id === active.establishmentId);
            const queue = est ? est.queues.find(q => q.id === active.queueId) : null;

            if (queue) {
                const userTurnNum = parseInt(active.turnCode.split('-')[1]);
                const diff = userTurnNum - queue.currentTurn;

                if (diff > 0) {
                    const peopleAhead = diff - 1;
                    const estimatedWait = Math.round(peopleAhead * queue.waitPerPerson);

                    if (active.peopleAhead !== peopleAhead || active.estimatedWait !== estimatedWait) {
                        active.peopleAhead = peopleAhead;
                        active.estimatedWait = estimatedWait;
                        stateChanged = true;
                    }

                    // Check proximity threshold (e.g. 3 people ahead)
                    const threshold = State.settings.notifications.proximityThreshold;
                    if (peopleAhead <= threshold && !this.notifiedProximity) {
                        this.triggerProximityNotification(active, peopleAhead);
                        this.notifiedProximity = true;
                    }
                } else if (diff === 0) {
                    if (active.status !== 'Llamado') {
                        active.status = 'Llamado';
                        active.peopleAhead = 0;
                        active.estimatedWait = 0;
                        this.triggerCalledNotification(active);
                        this.notifiedCalled = true;
                        stateChanged = true;
                    }
                } else if (diff < 0) {
                    // User was served/completed
                    active.status = 'Atendido';
                    this.triggerServedNotification(active);
                    
                    // Push to history
                    State.history.unshift({
                        id: 'h-' + Math.floor(Math.random() * 1000),
                        establishmentName: active.establishmentName,
                        queueName: active.queueName,
                        turnCode: active.turnCode,
                        date: new Date().toISOString().split('T')[0],
                        status: 'Atendido'
                    });

                    State.activeTurn = null;
                    this.notifiedProximity = false;
                    this.notifiedCalled = false;
                    stateChanged = true;
                }
            }
        }

        if (stateChanged) {
            State.notify();
        }
    }

    // Force progress a single step manually (for demo/admin buttons)
    forceTick() {
        // Force the active queue to progress
        if (State.activeTurn) {
            const active = State.activeTurn;
            const est = State.establishments.find(e => e.id === active.establishmentId);
            const queue = est ? est.queues.find(q => q.id === active.queueId) : null;
            if (queue && queue.currentTurn < queue.lastTurn) {
                queue.currentTurn++;
                State.analyticsData.todayCount++;
                State.notify();
                this.tick(); // Trigger immediate check
            }
        } else {
            // Force a random queue to progress
            const randomEst = State.establishments[Math.floor(Math.random() * State.establishments.length)];
            const randomQueue = randomEst.queues[Math.floor(Math.random() * randomEst.queues.length)];
            if (randomQueue.currentTurn < randomQueue.lastTurn) {
                randomQueue.currentTurn++;
                State.analyticsData.todayCount++;
                State.notify();
            }
        }
    }

    // Force mock user to join current active queue (for admin simulation)
    forceJoinMock(establishmentId, queueId) {
        const est = State.establishments.find(e => e.id === establishmentId);
        const queue = est ? est.queues.find(q => q.id === queueId) : null;
        if (queue) {
            queue.lastTurn++;
            State.notify();
        }
    }

    triggerProximityNotification(active, peopleAhead) {
        const title = 'Fila en movimiento';
        const msg = `¡Tu turno está muy cerca! Hay solo ${peopleAhead} ${peopleAhead === 1 ? 'persona' : 'personas'} delante de ti para el turno ${active.turnCode}.`;

        if (State.settings.notifications.pushEnabled) {
            this.showPushToast(title, msg, 'warning');
        }

        if (State.settings.notifications.waEnabled) {
            this.sendWhatsAppMessage(
                `⚠️ *Alerta SmartQueue* ⚠️\n\nHola ${State.currentUser ? State.currentUser.name : 'Usuario'},\n\nTu turno *${active.turnCode}* en *${active.establishmentName}* (${active.queueName}) está muy cerca.\n\n👤 *Personas delante*: ${peopleAhead}\n⏰ *Tiempo estimado*: ${active.estimatedWait} min.\n\nPor favor, ve acercándote al área de atención.`
            );
        }
    }

    triggerCalledNotification(active) {
        const title = '¡Es tu turno!';
        const msg = `Turno ${active.turnCode} llamado. Acércate al mostrador asignado en ${active.establishmentName}.`;

        if (State.settings.notifications.pushEnabled) {
            this.showPushToast(title, msg, 'success');
            this.playNotificationSound();
        }

        if (State.settings.notifications.waEnabled) {
            this.sendWhatsAppMessage(
                `🔔 *¡Tu Turno ha sido Llamado!* 🔔\n\nTurno: *${active.turnCode}*\nFila: *${active.queueName}*\nEstablecimiento: *${active.establishmentName}*\n\nPor favor, dirígete de inmediato a la ventanilla de atención.`
            );
        }
    }

    triggerServedNotification(active) {
        const title = 'Atención Finalizada';
        const msg = `Has sido atendido en ${active.establishmentName}. ¡Gracias por usar SmartQueue!`;

        if (State.settings.notifications.pushEnabled) {
            this.showPushToast(title, msg, 'info');
        }

        if (State.settings.notifications.waEnabled) {
            this.sendWhatsAppMessage(
                `✅ *Atención Finalizada* ✅\n\nTu turno *${active.turnCode}* ha sido marcado como completado.\n\n¡Gracias por tu paciencia! Valora tu experiencia en la plataforma.`
            );
        }
    }

    // Triggered when user joins queue
    triggerWelcomeQueueNotification(active) {
        const title = 'Ingreso a Fila Confirmado';
        const msg = `Tu turno es el ${active.turnCode}. Tiempo estimado: ${active.estimatedWait} min.`;

        if (State.settings.notifications.pushEnabled) {
            this.showPushToast(title, msg, 'info');
        }

        if (State.settings.notifications.waEnabled) {
            this.sendWhatsAppMessage(
                `📲 *Confirmación de Turno - SmartQueue* 📲\n\nTe has unido con éxito a la fila virtual.\n\n🏢 *Establecimiento*: ${active.establishmentName}\n🎫 *Fila*: ${active.queueName}\n🔢 *Turno*: *${active.turnCode}*\n👤 *Personas por delante*: ${active.peopleAhead}\n⏰ *Tiempo de espera*: ~${active.estimatedWait} minutos.\n\nTe avisaremos cuando sea tu momento.`
            );
        }
    }

    showPushToast(title, message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'warning') icon = 'fa-exclamation-circle';
        if (type === 'danger') icon = 'fa-times-circle';

        toast.innerHTML = `
            <div class="toast-icon"><i class="fas ${icon}"></i></div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;

        toast.addEventListener('click', () => {
            toast.remove();
        });

        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.style.animation = 'slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards';
            setTimeout(() => toast.remove(), 300);
        }, 5000);

        // Add to state notifications list
        State.addNotification(title, message, type);
    }

    sendWhatsAppMessage(text) {
        const chatContainer = document.getElementById('whatsapp-chat');
        const widget = document.getElementById('whatsapp-widget');
        const badge = document.getElementById('wa-badge');
        
        if (!chatContainer) return;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const msgNode = document.createElement('div');
        msgNode.className = 'whatsapp-msg whatsapp-msg-in';
        msgNode.innerHTML = `
            ${text.replace(/\n/g, '<br>')}
            <span class="whatsapp-time">${timeStr}</span>
        `;

        chatContainer.appendChild(msgNode);
        
        // Auto scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // If collapsed, increment badge
        if (widget && widget.classList.contains('collapsed')) {
            this.whatsappBadgeCount++;
            if (badge) {
                badge.innerText = this.whatsappBadgeCount;
                badge.style.display = 'block';
            }
        }
    }

    initWhatsAppWidget() {
        const toggle = document.getElementById('whatsapp-toggle');
        const widget = document.getElementById('whatsapp-widget');
        const badge = document.getElementById('wa-badge');

        if (toggle && widget) {
            toggle.addEventListener('click', () => {
                widget.classList.toggle('collapsed');
                const isCollapsed = widget.classList.contains('collapsed');
                
                // Toggle Chevron Icon
                const icon = toggle.querySelector('.toggle-icon');
                if (icon) {
                    if (isCollapsed) {
                        icon.className = 'fas fa-chevron-up toggle-icon';
                    } else {
                        icon.className = 'fas fa-chevron-down toggle-icon';
                        // Clear badge
                        this.whatsappBadgeCount = 0;
                        if (badge) badge.style.display = 'none';
                    }
                }
            });
        }
    }

    playNotificationSound() {
        try {
            // Emulate alert sound using Web Audio API so it works without loading audio files
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
            osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
            osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.30); // G5
            
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.6);
        } catch (e) {
            console.log('Audio Context error (usual if user hasn\'t interacted with page yet):', e);
        }
    }
}

export const Simulator = new QueueSimulator();
window.Simulator = Simulator; // Expose globally for access
