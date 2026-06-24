/* ==========================================================================
   SmartQueue - Landing Page View (landing.js)
   ========================================================================== */

import { State } from '../state.js';
import { Simulator } from '../simulation.js';

export function render(container) {
    container.innerHTML = `
        <!-- Hero Section -->
        <section class="grid-bg section-padding" style="position: relative; overflow: hidden; border-bottom: 1px solid var(--border-color);">
            <div class="container text-center" style="position: relative; z-index: 10;">
                <div class="badge badge-secondary" style="margin-bottom: 1.5rem; border: 1px solid var(--accent-light); padding: 0.4rem 1rem;">
                    🚀 Plataforma V2.4 - Inteligencia Artificial en Cola
                </div>
                
                <h1 style="font-size: 3.5rem; font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary); max-width: 800px; margin: 0 auto 1.5rem auto;">
                    Gestiona filas virtuales con <span class="text-primary-color" style="background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Predicción por IA</span>
                </h1>
                
                <p class="text-muted" style="font-size: 1.2rem; max-width: 600px; margin: 0 auto 2.5rem auto; line-height: 1.6;">
                    Reduce los tiempos de espera y descongestiona tus salas de atención física. Tus clientes esperan cómodamente desde su celular mediante notificaciones por WhatsApp.
                </p>
                
                <div class="flex flex-center gap-1">
                    <a href="#queues" class="btn btn-accent btn-lg">
                        <i class="fas fa-search"></i> Ver Filas Disponibles
                    </a>
                    <a href="#login" class="btn btn-secondary btn-lg" id="demo-admin-shortcut">
                        <i class="fas fa-desktop"></i> Demo Administrativa
                    </a>
                </div>

                <!-- Floating Platform Showcase Card -->
                <div class="card-glass" style="max-width: 850px; margin: 4rem auto 0 auto; padding: 1.25rem; text-align: left; border: 1px solid var(--border-color);">
                    <div class="flex flex-between" style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem; margin-bottom: 1rem;">
                        <div class="flex gap-05">
                            <span style="width: 12px; height: 12px; border-radius: 50%; background-color: #ef4444;"></span>
                            <span style="width: 12px; height: 12px; border-radius: 50%; background-color: #f59e0b;"></span>
                            <span style="width: 12px; height: 12px; border-radius: 50%; background-color: #10b981;"></span>
                        </div>
                        <div class="text-muted" style="font-size: 0.8rem; font-weight: 600;">Panel Consola - SmartQueue</div>
                    </div>
                    <div class="grid grid-cols-3 gap-1">
                        <div class="card" style="padding: 1rem; background-color: var(--bg-tertiary);">
                            <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700;">Comedor Universitario</div>
                            <div style="font-size: 1.5rem; font-weight: 800; margin-top: 0.25rem; display: flex; align-items: baseline; gap: 0.25rem;">
                                <span>~4 min</span>
                                <span style="font-size: 0.75rem; color: var(--status-success); font-weight: 600;"><i class="fas fa-caret-down"></i> 12%</span>
                            </div>
                            <p style="font-size: 0.75rem; margin-top: 0.25rem;" class="text-muted">Espera promedio actual</p>
                        </div>
                        <div class="card" style="padding: 1rem; background-color: var(--bg-tertiary);">
                            <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700;">Banco Caja General</div>
                            <div style="font-size: 1.5rem; font-weight: 800; margin-top: 0.25rem; display: flex; align-items: baseline; gap: 0.25rem;">
                                <span>16 pers.</span>
                                <span style="font-size: 0.75rem; color: var(--status-warning); font-weight: 600;">+3 / hr</span>
                            </div>
                            <p style="font-size: 0.75rem; margin-top: 0.25rem;" class="text-muted">Gente en cola activa</p>
                        </div>
                        <div class="card" style="padding: 1rem; background-color: var(--bg-tertiary);">
                            <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700;">Tasa de Atención</div>
                            <div style="font-size: 1.5rem; font-weight: 800; margin-top: 0.25rem; display: flex; align-items: baseline; gap: 0.25rem;">
                                <span>98.4%</span>
                                <span style="font-size: 0.75rem; color: var(--status-success); font-weight: 600;">Excelente</span>
                            </div>
                            <p style="font-size: 0.75rem; margin-top: 0.25rem;" class="text-muted">Satisfacción general</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="position: absolute; top: -10%; left: -10%; width: 40%; height: 60%; background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%); pointer-events: none; filter: blur(40px);"></div>
            <div style="position: absolute; bottom: -10%; right: -10%; width: 40%; height: 60%; background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%); pointer-events: none; filter: blur(40px);"></div>
        </section>

        <!-- Features / Benefits -->
        <section id="landing-features" class="section-padding" style="background-color: var(--bg-secondary);">
            <div class="container">
                <div class="text-center" style="margin-bottom: 4rem;">
                    <h2 style="font-size: 2.25rem; font-weight: 800; color: var(--text-primary);">Tus clientes merecen una espera moderna</h2>
                    <p class="text-muted" style="max-width: 600px; margin: 0.5rem auto 0 auto;">Diseñado para eliminar el aburrimiento y la aglomeración de las salas de espera tradicionales.</p>
                </div>

                <div class="grid grid-cols-3 gap-2">
                    <div class="card card-glow" style="padding: 2rem;">
                        <div style="width: 3.5rem; height: 3.5rem; border-radius: var(--border-radius-md); background-color: var(--accent-light); color: var(--accent-primary); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1.5rem;">
                            <i class="fas fa-layer-group"></i>
                        </div>
                        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem;">Filas Virtuales Simples</h3>
                        <p class="text-muted" style="font-size: 0.95rem; line-height: 1.6;">
                            El usuario escanea un QR físico en el local o ingresa vía web para tomar un turno digital. No requiere descargar apps pesadas.
                        </p>
                    </div>

                    <div class="card card-glow" style="padding: 2rem;">
                        <div style="width: 3.5rem; height: 3.5rem; border-radius: var(--border-radius-md); background-color: rgba(6, 182, 212, 0.15); color: var(--status-info); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1.5rem;">
                            <i class="fas fa-brain"></i>
                        </div>
                        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem;">Cálculo de Tiempos por IA</h3>
                        <p class="text-muted" style="font-size: 0.95rem; line-height: 1.6;">
                            Algoritmo inteligente que analiza la velocidad de atención histórica, hora del día y asesores disponibles para estimar tiempos precisos.
                        </p>
                    </div>

                    <div class="card card-glow" style="padding: 2rem;">
                        <div style="width: 3.5rem; height: 3.5rem; border-radius: var(--border-radius-md); background-color: rgba(16, 185, 129, 0.15); color: var(--status-success); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1.5rem;">
                            <i class="fab fa-whatsapp"></i>
                        </div>
                        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem;">Notificación de WhatsApp</h3>
                        <p class="text-muted" style="font-size: 0.95rem; line-height: 1.6;">
                            Envío automático de mensajes cuando el turno está próximo y cuando es llamado, permitiendo salir a pasear o esperar cerca sin perder su lugar.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Use Cases -->
        <section id="landing-cases" class="section-padding">
            <div class="container">
                <div class="text-center" style="margin-bottom: 4rem;">
                    <h2 style="font-size: 2.25rem; font-weight: 800; color: var(--text-primary);">Adaptable a múltiples industrias</h2>
                    <p class="text-muted" style="max-width: 600px; margin: 0.5rem auto 0 auto;">Una solución versátil que unifica la experiencia en cualquier centro de atención presencial.</p>
                </div>

                <div class="grid grid-cols-4 gap-15">
                    <div class="interactive-card card" style="padding: 1.25rem;">
                        <div style="height: 120px; border-radius: var(--border-radius-md); background-image: url('https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=300'); background-size: cover; margin-bottom: 1rem;"></div>
                        <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem;">Comedores</h4>
                        <p class="text-muted" style="font-size: 0.8rem;">Estudiantes universitarios reservan su turno de almuerzo y evitan colas de más de 45 minutos bajo el sol.</p>
                    </div>
                    <div class="interactive-card card" style="padding: 1.25rem;">
                        <div style="height: 120px; border-radius: var(--border-radius-md); background-image: url('https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=300'); background-size: cover; margin-bottom: 1rem;"></div>
                        <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem;">Bancos</h4>
                        <p class="text-muted" style="font-size: 0.8rem;">Segmenta colas VIP, atención preferente y cajeros rápidos disminuyendo la sensación de espera del cliente.</p>
                    </div>
                    <div class="interactive-card card" style="padding: 1.25rem;">
                        <div style="height: 120px; border-radius: var(--border-radius-md); background-image: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300'); background-size: cover; margin-bottom: 1rem;"></div>
                        <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem;">Municipalidades</h4>
                        <p class="text-muted" style="font-size: 0.8rem;">Organiza las gestiones de licencias, catastros y pagos con tableros de información digital.</p>
                    </div>
                    <div class="interactive-card card" style="padding: 1.25rem;">
                        <div style="height: 120px; border-radius: var(--border-radius-md); background-image: url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300'); background-size: cover; margin-bottom: 1rem;"></div>
                        <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem;">Centros Médicos</h4>
                        <p class="text-muted" style="font-size: 0.8rem;">Gestiona citas rápidas de triaje y recojo de recetas en farmacia evitando contagios en salas cerradas.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonials -->
        <section class="section-padding" style="background-color: var(--bg-secondary);">
            <div class="container">
                <div class="text-center" style="margin-bottom: 4rem;">
                    <h2 style="font-size: 2.25rem; font-weight: 800;">Historias de Éxito</h2>
                    <p class="text-muted">Lo que dicen los directores que implementaron SmartQueue en sus organizaciones.</p>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div class="card" style="padding: 2rem;">
                        <p style="font-style: italic; font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;" class="text-secondary">
                            "Implementamos SmartQueue en el comedor central universitario. Logramos eliminar las colas kilométricas y los estudiantes están mucho más contentos porque saben exactamente cuándo llegar a comer sin perder clases."
                        </p>
                        <div class="flex gap-1 align-items-center">
                            <div class="avatar">MA</div>
                            <div>
                                <h5 style="font-weight: 700; font-size: 0.95rem;">Dr. Marcos Alvarado</h5>
                                <p class="text-muted" style="font-size: 0.75rem;">Director de Bienestar - Universidad Nacional</p>
                            </div>
                        </div>
                    </div>
                    <div class="card" style="padding: 2rem;">
                        <p style="font-style: italic; font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;" class="text-secondary">
                            "El soporte de notificaciones por WhatsApp cambió las reglas del juego. Los clientes de nuestro banco toman el turno y esperan en el café de al lado, lo que descongestionó nuestra oficina en un 60%."
                        </p>
                        <div class="flex gap-1 align-items-center">
                            <div class="avatar" style="background-color: var(--accent-secondary);">VH</div>
                            <div>
                                <h5 style="font-weight: 700; font-size: 0.95rem;">Valeria Herrera</h5>
                                <p class="text-muted" style="font-size: 0.75rem;">Gte. de Operaciones - Banco Financiero</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Subscription Plans -->
        <section id="landing-pricing" class="section-padding">
            <div class="container">
                <div class="text-center" style="margin-bottom: 4rem;">
                    <h2 style="font-size: 2.25rem; font-weight: 800;">Planes de Suscripción</h2>
                    <p class="text-muted">Elige el plan ideal para modernizar tus puntos de atención.</p>
                </div>
                <div class="grid grid-cols-3 gap-2">
                    <!-- Basic -->
                    <div class="card flex flex-col" style="padding: 2.5rem 2rem;">
                        <h3 style="font-size: 1.25rem; font-weight: 700;">Piloto Inicial</h3>
                        <p class="text-muted" style="font-size: 0.85rem; margin-top: 0.25rem;">Para pequeños locales o pruebas de concepto.</p>
                        <div style="font-size: 2.5rem; font-weight: 800; margin: 1.5rem 0;">
                            $0 <span style="font-size: 1rem; color: var(--text-muted); font-weight: 400;">/ mes</span>
                        </div>
                        <ul class="flex flex-col gap-1 text-secondary" style="list-style: none; margin-bottom: 2.5rem; font-size: 0.9rem;">
                            <li><i class="fas fa-check text-success"></i> 1 Establecimiento</li>
                            <li><i class="fas fa-check text-success"></i> Hasta 2 filas virtuales</li>
                            <li><i class="fas fa-check text-success"></i> 100 turnos por mes</li>
                            <li><i class="fas fa-times text-danger"></i> Notificaciones por WhatsApp</li>
                            <li><i class="fas fa-times text-danger"></i> Predicción IA avanzada</li>
                        </ul>
                        <a href="#register" class="btn btn-secondary btn-full" style="margin-top: auto;">Empezar Gratis</a>
                    </div>
                    <!-- Pro -->
                    <div class="card card-glow flex flex-col" style="padding: 2.5rem 2rem; border-color: var(--accent-primary);">
                        <div style="position: absolute; top: 1rem; right: 1rem;" class="badge badge-info">Recomendado</div>
                        <h3 style="font-size: 1.25rem; font-weight: 700;">Smart Pro</h3>
                        <p class="text-muted" style="font-size: 0.85rem; margin-top: 0.25rem;">Ideal para bancos, comedores y clínicas medianas.</p>
                        <div style="font-size: 2.5rem; font-weight: 800; margin: 1.5rem 0;">
                            $99 <span style="font-size: 1rem; color: var(--text-muted); font-weight: 400;">/ mes</span>
                        </div>
                        <ul class="flex flex-col gap-1 text-secondary" style="list-style: none; margin-bottom: 2.5rem; font-size: 0.9rem;">
                            <li><i class="fas fa-check text-success"></i> Hasta 5 sucursales</li>
                            <li><i class="fas fa-check text-success"></i> Filas ilimitadas</li>
                            <li><i class="fas fa-check text-success"></i> Notificaciones Push e Emails ilimitados</li>
                            <li><i class="fas fa-check text-success"></i> 1,500 Notificaciones WhatsApp</li>
                            <li><i class="fas fa-check text-success"></i> Predicción IA de demanda básica</li>
                            <li><i class="fas fa-check text-success"></i> Dashboard de analíticas semanales</li>
                        </ul>
                        <a href="#register" class="btn btn-primary btn-full" style="margin-top: auto;">Probar 14 Días Gratis</a>
                    </div>
                    <!-- Enterprise -->
                    <div class="card flex flex-col" style="padding: 2.5rem 2rem;">
                        <h3 style="font-size: 1.25rem; font-weight: 700;">Enterprise</h3>
                        <p class="text-muted" style="font-size: 0.85rem; margin-top: 0.25rem;">Para universidades grandes o gobiernos regionales.</p>
                        <div style="font-size: 2.5rem; font-weight: 800; margin: 1.5rem 0;">
                            Personalizado
                        </div>
                        <ul class="flex flex-col gap-1 text-secondary" style="list-style: none; margin-bottom: 2.5rem; font-size: 0.9rem;">
                            <li><i class="fas fa-check text-success"></i> Sucursales y Filas Ilimitadas</li>
                            <li><i class="fas fa-check text-success"></i> Notificaciones WhatsApp ilimitadas</li>
                            <li><i class="fas fa-check text-success"></i> SLA de soporte 99.9%</li>
                            <li><i class="fas fa-check text-success"></i> Integración API personalizada</li>
                            <li><i class="fas fa-check text-success"></i> Predicción IA avanzada</li>
                            <li><i class="fas fa-check text-success"></i> Reportes PDF automatizados</li>
                        </ul>
                        <a href="#contact" class="btn btn-secondary btn-full" style="margin-top: auto;">Contactar Ventas</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="section-padding" style="background-color: var(--bg-secondary); border-top: 1px solid var(--border-color);">
            <div class="container" style="max-width: 600px;">
                <div class="text-center" style="margin-bottom: 2.5rem;">
                    <h2 style="font-size: 2.25rem; font-weight: 800;">Contacta con Nosotros</h2>
                    <p class="text-muted">¿Tienes dudas sobre cómo implementar SmartQueue en tu local? Nuestro equipo te asesora de inmediato.</p>
                </div>
                <form id="contact-form" class="card" style="padding: 2rem;">
                    <div class="form-group">
                        <label for="c-name">Nombre Completo</label>
                        <input type="text" id="c-name" class="form-control" placeholder="Ej. Carlos Mendoza" required>
                    </div>
                    <div class="form-group">
                        <label for="c-email">Correo Institucional / Corporativo</label>
                        <input type="email" id="c-email" class="form-control" placeholder="Ej. carlos@empresa.com" required>
                    </div>
                    <div class="form-group">
                        <label for="c-org">Organización / Entidad</label>
                        <input type="text" id="c-org" class="form-control" placeholder="Ej. Universidad Central" required>
                    </div>
                    <div class="form-group">
                        <label for="c-msg">Mensaje / Requerimiento</label>
                        <textarea id="c-msg" class="form-control" rows="4" placeholder="Cuéntanos sobre tus puntos de atención y el volumen de filas..." required style="resize:none; font-family:inherit;"></textarea>
                    </div>
                    <button type="submit" class="btn btn-accent btn-full" style="margin-top: 1rem;">
                        <i class="fas fa-paper-plane"></i> Enviar Mensaje
                    </button>
                </form>
            </div>
        </section>

        <!-- Footer -->
        <footer style="padding: 3rem 0; border-top: 1px solid var(--border-color); text-align: center; font-size: 0.85rem;" class="text-muted">
            <div class="container flex-between">
                <div>&copy; 2026 SmartQueue SaaS. Desarrollado con excelencia visual para optimización de filas.</div>
                <div class="flex gap-1">
                    <a href="#landing-features">Beneficios</a> &middot;
                    <a href="#landing-pricing">Planes</a> &middot;
                    <a href="#landing">Privacidad</a>
                </div>
            </div>
        </footer>
    `;

    // Bind Contact Form Submission
    const contactForm = container.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = container.querySelector('#c-name').value;
            
            // Trigger toast
            Simulator.showPushToast(
                'Mensaje Recibido', 
                `Gracias ${name}. Un asesor se pondrá en contacto contigo en los próximos 15 minutos.`, 
                'success'
            );
            
            // Clear inputs
            contactForm.reset();
        });
    }

    // Demo shortcut click: Automatically logs in as admin for review speed
    const demoShortcut = container.querySelector('#demo-admin-shortcut');
    if (demoShortcut) {
        demoShortcut.addEventListener('click', (e) => {
            e.preventDefault();
            State.login('admin@smartqueue.com', 'admin123', 'admin');
            window.location.hash = '#admin';
        });
    }
}
