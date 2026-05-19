// ─── CONFIGURACIÓN ───────────────────────────────────────────────────────────
const API = '';

// ─── SESIÓN ──────────────────────────────────────────────────────────────────
const Session = {
    guardar(usuario) {
        localStorage.setItem('carstoons_user', JSON.stringify(usuario));
    },
    obtener() {
        const raw = localStorage.getItem('carstoons_user');
        return raw ? JSON.parse(raw) : null;
    },
    cerrar() {
        localStorage.removeItem('carstoons_user');
    },
    requerirLogin() {
        if (!this.obtener()) {
            window.location.href = 'Login.html';
        }
    },
    redirigirSiLogueado() {
        if (this.obtener()) {
            window.location.href = 'dashboard.html';
        }
    }
};

// ─── FETCH HELPERS ───────────────────────────────────────────────────────────
async function apiGet(ruta) {
    const res = await fetch(API + ruta);
    return res.json();
}
async function apiPost(ruta, body) {
    const t = Date.now();
    const res = await fetch(API + ruta, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    console.log(`${ruta} tardó ${Date.now() - t}ms`);
    return { ok: res.ok, status: res.status, data: await res.json() };
}

// ─── FORMATO ─────────────────────────────────────────────────────────────────
function formatPeso(valor) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
}

function formatFecha(isoString) {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}