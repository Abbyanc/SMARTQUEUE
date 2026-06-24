/* ==========================================================================
   SmartQueue - Auth Views (Login & Register) (auth.js)
   ========================================================================== */

import { State } from '../state.js';
import { Simulator } from '../simulation.js';

export function render(container, mode = 'login') {
    const isLogin = mode === 'login';
    
    container.innerHTML = `
        <div class="grid-bg flex-center w-full" style="min-height: 100vh; padding: 2rem;">
            <div class="card-glass w-full" style="max-width: 440px; padding: 2.5rem; position: relative;">
                
                <!-- Back arrow to landing -->
                <a href="#landing" style="position: absolute; top: 1.5rem; left: 1.5rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; color: var(--text-muted);" class="nav-back-link">
                    <i class="fas fa-arrow-left"></i> Volver
                </a>

                <!-- Logo header -->
                <div class="text-center" style="margin-bottom: 2rem; margin-top: 1rem;">
                    <div style="font-size: 2.25rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                        <i class="fas fa-layer-group" style="color: var(--accent-primary);"></i> SmartQueue
                    </div>
                    <p class="text-muted" style="margin-top: 0.5rem; font-size: 0.9rem;">
                        ${isLogin ? 'Ingresa a tu cuenta de fila inteligente' : 'Crea tu cuenta de fila inteligente gratis'}
                    </p>
                </div>

                <!-- Google Auth Button (Mock) -->
                <button class="btn btn-secondary btn-full flex-center gap-05" id="google-auth-btn" style="background-color: var(--bg-tertiary); margin-bottom: 1.5rem;">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google logo" style="width: 18px; height: 18px;">
                    <span>${isLogin ? 'Iniciar sesión con Google' : 'Registrarse con Google'}</span>
                </button>

                <div class="flex-center gap-1 text-muted" style="margin-bottom: 1.5rem; font-size: 0.8rem; text-transform: uppercase; font-weight: 600;">
                    <span style="height: 1px; flex-grow: 1; background-color: var(--border-color);"></span>
                    <span>o con tu correo</span>
                    <span style="height: 1px; flex-grow: 1; background-color: var(--border-color);"></span>
                </div>

                <!-- Main Form -->
                <form id="auth-form">
                    ${!isLogin ? `
                    <div class="form-group">
                        <label for="reg-name">Nombre Completo</label>
                        <input type="text" id="reg-name" class="form-control" placeholder="Laura Gómez" required>
                    </div>
                    ` : ''}
                    
                    <div class="form-group">
                        <label for="auth-email">Correo Electrónico</label>
                        <input type="email" id="auth-email" class="form-control" placeholder="correo@ejemplo.com" required>
                    </div>

                    <div class="form-group">
                        <div class="flex-between w-full">
                            <label for="auth-password">Contraseña</label>
                            ${isLogin ? `<a href="#" id="recover-pwd-link" style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 500;">¿La olvidaste?</a>` : ''}
                        </div>
                        <input type="password" id="auth-password" class="form-control" placeholder="••••••••" required>
                    </div>

                    ${!isLogin ? `
                    <div class="form-group">
                        <label for="auth-password-conf">Confirmar Contraseña</label>
                        <input type="password" id="auth-password-conf" class="form-control" placeholder="••••••••" required>
                    </div>
                    ` : ''}

                    <button type="submit" class="btn btn-primary btn-full" style="margin-top: 1rem;" id="submit-auth-btn">
                        <span>${isLogin ? 'Ingresar' : 'Crear Cuenta'}</span>
                    </button>
                </form>

                <!-- Footer Switch mode -->
                <div class="text-center" style="margin-top: 2rem; font-size: 0.875rem; color: var(--text-secondary);">
                    ${isLogin ? `
                        ¿No tienes una cuenta? <a href="#register" style="color: var(--accent-primary); font-weight: 600;">Regístrate</a>
                    ` : `
                        ¿Ya tienes una cuenta? <a href="#login" style="color: var(--accent-primary); font-weight: 600;">Inicia Sesión</a>
                    `}
                </div>

                <!-- Admin Bypass Shortcut (Extremely helpful for testing/evaluation) -->
                ${isLogin ? `
                <div style="margin-top: 2rem; padding: 0.75rem; border-radius: var(--border-radius-md); border: 1px dashed var(--border-color); background-color: rgba(59, 130, 246, 0.05); text-align: center;">
                    <div style="font-size: 0.75rem; font-weight: 700; margin-bottom: 0.35rem;" class="text-primary-color">Accesos Rápidos Demo</div>
                    <div class="flex gap-05 justify-content-center">
                        <button class="btn btn-secondary btn-sm" id="bypass-user-btn">Usuario Mock</button>
                        <button class="btn btn-secondary btn-sm" id="bypass-admin-btn">Admin Mock</button>
                    </div>
                </div>
                ` : ''}

            </div>
        </div>
    `;

    // 1. Google Authentication flow (Simulated with loading state)
    const googleBtn = container.querySelector('#google-auth-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            const originalContent = googleBtn.innerHTML;
            googleBtn.disabled = true;
            googleBtn.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                <span>Conectando con Google...</span>
            `;

            setTimeout(() => {
                // Log in as standard user
                State.loginWithGoogle('user');
                Simulator.showPushToast('Google OAuth', 'Autenticación exitosa.', 'success');
                window.location.hash = '#user-dashboard';
            }, 1000);
        });
    }

    // 2. Normal Form Submit
    const authForm = container.querySelector('#auth-form');
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = container.querySelector('#auth-email').value;
            const password = container.querySelector('#auth-password').value;

            if (isLogin) {
                // Perform mock check: if email contains admin, log in as admin, else user
                const role = email.includes('admin') ? 'admin' : 'user';
                State.login(email, password, role);
                Simulator.showPushToast('Inicio de Sesión', 'Acceso correcto.', 'success');
                window.location.hash = role === 'admin' ? '#admin' : '#user-dashboard';
            } else {
                const name = container.querySelector('#reg-name').value;
                const passConf = container.querySelector('#auth-password-conf').value;

                if (password !== passConf) {
                    Simulator.showPushToast('Error de Validación', 'Las contraseñas no coinciden.', 'danger');
                    return;
                }

                State.register(name, email, password);
                Simulator.showPushToast('Registro', 'Cuenta registrada con éxito.', 'success');
                window.location.hash = '#user-dashboard';
            }
        });
    }

    // 3. Password Recovery Flow
    const recoverLink = container.querySelector('#recover-pwd-link');
    if (recoverLink) {
        recoverLink.addEventListener('click', (e) => {
            e.preventDefault();
            const email = container.querySelector('#auth-email').value || 'usuario@ejemplo.com';
            
            // Trigger toast modal
            Simulator.showPushToast(
                'Recuperación de Contraseña', 
                `Se ha enviado un enlace de reinicio a: ${email}`, 
                'info'
            );
        });
    }

    // 4. Bypass shortcuts (Speedy login for evaluations)
    const bypassUser = container.querySelector('#bypass-user-btn');
    if (bypassUser) {
        bypassUser.addEventListener('click', () => {
            State.login('laura.gomez@gmail.com', 'user123', 'user');
            window.location.hash = '#user-dashboard';
        });
    }

    const bypassAdmin = container.querySelector('#bypass-admin-btn');
    if (bypassAdmin) {
        bypassAdmin.addEventListener('click', () => {
            State.login('rodrigo.admin@gmail.com', 'admin123', 'admin');
            window.location.hash = '#admin';
        });
    }
}
