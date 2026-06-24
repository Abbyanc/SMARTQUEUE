/* ==========================================================================
   SmartQueue - Available Queues View (queues.js)
   ========================================================================== */

import { State } from '../state.js';
import { renderNavbar } from '../components/navbar.js';

export function render(container) {
    const isLoggedIn = !!State.currentUser;
    if (!isLoggedIn) {
        window.location.hash = '#login';
        return;
    }

    let selectedCategory = 'Todos';
    let searchQuery = '';

    function renderContent() {
        const filteredEsts = State.establishments.filter(est => {
            const matchesCategory = selectedCategory === 'Todos' || est.category === selectedCategory;
            const matchesSearch = est.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  est.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  est.queues.some(q => q.name.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });

        const estCards = filteredEsts.map(est => {
            const queueItems = est.queues.map(q => {
                const peopleWaiting = q.lastTurn - q.currentTurn;
                const estWait = peopleWaiting * q.waitPerPerson;

                // Color code wait time
                let waitBadgeClass = 'badge-success';
                if (estWait > 10) waitBadgeClass = 'badge-warning';
                if (estWait > 25) waitBadgeClass = 'badge-danger';

                return `
                    <div style="background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 1rem; display: flex; flex-direction: column; justify-content: space-between;">
                        <div class="flex gap-05 align-items-center" style="margin-bottom: 0.5rem;">
                            <div style="width: 1.75rem; height: 1.75rem; border-radius: var(--border-radius-sm); background-color: var(--accent-light); color: var(--accent-primary); display: flex; align-items: center; justify-content: center; font-size: 0.85rem;">
                                <i class="fas ${q.icon}"></i>
                            </div>
                            <h5 style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">${q.name}</h5>
                        </div>
                        
                        <div class="flex flex-col gap-05" style="margin-bottom: 1rem; font-size: 0.8rem; color: var(--text-secondary);">
                            <div class="flex-between">
                                <span>Turno actual:</span>
                                <strong class="text-primary-color">${q.codePrefix}-${q.currentTurn}</strong>
                            </div>
                            <div class="flex-between">
                                <span>Personas en cola:</span>
                                <strong>${peopleWaiting} en espera</strong>
                            </div>
                            <div class="flex-between">
                                <span>Tiempo de espera:</span>
                                <span class="badge ${waitBadgeClass}">~${Math.round(estWait)} min</span>
                            </div>
                        </div>

                        <button class="btn btn-primary btn-sm btn-full join-btn" data-est="${est.id}" data-queue="${q.id}">
                            <i class="fas fa-sign-in-alt"></i> Unirse a Fila
                        </button>
                    </div>
                `;
            }).join('');

            return `
                <div class="card" style="padding: 0; display: flex; flex-direction: column; overflow: hidden; height: 100%;">
                    <!-- Background image & Title banner -->
                    <div style="height: 140px; background-image: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.75)), url('${est.image}'); background-size: cover; background-position: center; position: relative; padding: 1.5rem; display: flex; flex-direction: column; justify-content: flex-end;">
                        <span class="badge badge-info" style="position: absolute; top: 1rem; right: 1rem; backdrop-filter: blur(8px); background-color: rgba(6, 182, 212, 0.45); color: #ffffff;">
                            ${est.category}
                        </span>
                        <h4 style="font-size: 1.2rem; font-weight: 800; color: #ffffff; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${est.name}</h4>
                        <p style="font-size: 0.75rem; color: #cbd5e1; display: flex; align-items: center; gap: 0.3rem; text-shadow: 0 1px 2px rgba(0,0,0,0.5); margin-top: 0.15rem;">
                            <i class="fas fa-map-marker-alt"></i> ${est.address}
                        </p>
                    </div>
                    
                    <!-- Queues Grid -->
                    <div style="padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
                        <div class="grid grid-cols-2 gap-1" style="width: 100%;">
                            ${queueItems}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const categories = ['Todos', 'Educación', 'Finanzas', 'Salud', 'Gobierno'];
        const filterChips = categories.map(cat => `
            <button class="btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'} cat-chip" data-cat="${cat}">
                ${cat}
            </button>
        `).join('');

        const navbar = renderNavbar('queues');
        const mainWrapper = document.createElement('div');
        mainWrapper.className = 'w-full';

        mainWrapper.innerHTML = `
            <div class="container" style="padding: 2.5rem 1.5rem;">
                <!-- Header -->
                <div style="margin-bottom: 2.5rem;">
                    <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-primary);">Filas Disponibles</h2>
                    <p class="text-muted">Explora y únete a una fila virtual en cualquiera de nuestros establecimientos autorizados.</p>
                </div>

                <!-- Search and Filters Bar -->
                <div class="card" style="padding: 1rem; margin-bottom: 2.5rem; display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;">
                    <!-- Filter Chips -->
                    <div class="flex gap-05 flex-wrap">
                        ${filterChips}
                    </div>

                    <!-- Search Input -->
                    <div style="position: relative; max-width: 320px; width: 100%;">
                        <i class="fas fa-search" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                        <input type="text" id="search-input" class="form-control" placeholder="Buscar establecimiento o fila..." style="padding-left: 2.5rem;" value="${searchQuery}">
                    </div>
                </div>

                <!-- Establishments Grid -->
                <div class="grid grid-cols-2 gap-2" id="establishments-grid">
                    ${estCards || '<div style="grid-column: span 2; padding: 4rem; text-align: center;" class="text-muted">No se encontraron establecimientos con ese criterio.</div>'}
                </div>
            </div>
        `;

        container.innerHTML = '';
        container.appendChild(navbar);
        container.appendChild(mainWrapper);

        // Bind Search Input
        const searchInput = container.querySelector('#search-input');
        if (searchInput) {
            searchInput.focus();
            // Put cursor at the end
            const val = searchInput.value;
            searchInput.value = '';
            searchInput.value = val;

            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                // De-bounce or simply re-render
                renderContent();
            });
        }

        // Bind Category Chips
        const chips = container.querySelectorAll('.cat-chip');
        chips.forEach(c => {
            c.addEventListener('click', () => {
                selectedCategory = c.getAttribute('data-cat');
                renderContent();
            });
        });

        // Bind Join Buttons
        const joinBtns = container.querySelectorAll('.join-btn');
        joinBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const estId = btn.getAttribute('data-est');
                const qId = btn.getAttribute('data-queue');
                
                // Redirect to join queue confirmation page with params
                window.location.hash = `#join-queue?est=${estId}&queue=${qId}`;
            });
        });
    }

    renderContent();
}
