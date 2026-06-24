/* ==========================================================================
   SmartQueue - SPA Router & Main Entry Point (app.js)
   ========================================================================== */

import { State } from './state.js';
import { Simulator } from './simulation.js';

// Import Views
import * as LandingView from './views/landing.js';
import * as AuthView from './views/auth.js';
import * as UserDashboardView from './views/userDashboard.js';
import * as QueuesView from './views/queues.js';
import * as JoinQueueView from './views/joinQueue.js';
import * as TrackingView from './views/tracking.js';
import * as NotificationsView from './views/notifications.js';
import * as ProfileView from './views/profile.js';
import * as AdminDashboardView from './views/adminDashboard.js';
import * as AnalyticsView from './views/analytics.js';
import * as SettingsView from './views/settings.js';

const app = document.getElementById('app');

// Router configuration mapping hashes to view render functions and auth levels
const routes = {
    '': { render: (container) => LandingView.render(container), auth: false },
    '#landing': { render: (container) => LandingView.render(container), auth: false },
    '#login': { render: (container) => AuthView.render(container, 'login'), auth: false },
    '#register': { render: (container) => AuthView.render(container, 'register'), auth: false },
    '#user-dashboard': { render: (container) => UserDashboardView.render(container), auth: true },
    '#queues': { render: (container) => QueuesView.render(container), auth: true },
    '#join-queue': { render: (container) => JoinQueueView.render(container), auth: true },
    '#tracking': { render: (container) => TrackingView.render(container), auth: true },
    '#notifications': { render: (container) => NotificationsView.render(container), auth: true },
    '#profile': { render: (container) => ProfileView.render(container), auth: true },
    '#admin': { render: (container) => AdminDashboardView.render(container), auth: true, adminOnly: true },
    '#analytics': { render: (container) => AnalyticsView.render(container), auth: true, adminOnly: true },
    '#settings': { render: (container) => SettingsView.render(container), auth: true, adminOnly: true }
};

// Route matching and execution
function router() {
    // Extract base hash without query parameters (e.g. #join-queue?est=est-1 -> #join-queue)
    const rawHash = window.location.hash || '';
    const baseHash = rawHash.includes('?') ? rawHash.split('?')[0] : rawHash;

    const route = routes[baseHash];

    if (!route) {
        // Fallback to landing if route not found
        window.location.hash = '#landing';
        return;
    }

    const isLoggedIn = !!State.currentUser;
    const isAdmin = isLoggedIn && State.currentUser.role === 'admin';

    // Access guards
    if (route.auth && !isLoggedIn) {
        window.location.hash = '#login';
        return;
    }

    if (route.adminOnly && !isAdmin) {
        window.location.hash = '#user-dashboard';
        return;
    }

    // Render the view
    route.render(app);

    // Scroll to top on navigation
    window.scrollTo(0, 0);
}

// Reactive view updates on state change
// (Any state change re-renders the current view automatically)
State.subscribe(() => {
    router();
});

// App initialization
window.addEventListener('load', () => {
    // Apply initial theme settings from local storage or default to dark
    const storedTheme = localStorage.getItem('smartqueue_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', storedTheme);

    // Initialize router
    router();

    // Start real-time simulation background intervals
    Simulator.start();
});

// Hashchange handler
window.addEventListener('hashchange', () => {
    router();
});
