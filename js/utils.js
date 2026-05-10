// ==========================================================
// UTILIDADES COMPARTIDAS - RENTO
// ==========================================================

// Obtener usuario actual con su perfil
async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error || !user) return null;

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error cargando perfil:', profileError);
      return { user, profile: null };
    }

    return { user, profile };
  } catch (err) {
    console.error('Error en getCurrentUser:', err);
    return null;
  }
}

// Cerrar sesión
async function signOut() {
  await supabaseClient.auth.signOut();
  window.location.href = 'index.html';
}

// Redireccionar si no está logueado
async function requireAuth() {
  const result = await getCurrentUser();
  if (!result || !result.user) {
    window.location.href = 'login.html';
    return null;
  }
  return result;
}

// Redireccionar si YA está logueado (para login/register)
async function redirectIfAuthenticated() {
  const result = await getCurrentUser();
  if (result && result.user) {
    window.location.href = 'dashboard.html';
  }
}

// Mostrar mensaje de error en el formulario
function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden');
}

function hideError(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.classList.add('hidden');
}

// Validar email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Formatear precio en Lempiras
function formatPrice(amount) {
  return `L ${amount.toLocaleString('es-HN')}`;
}

// Iniciales del nombre
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Capitalizar primera letra
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Mostrar/ocultar loading
function showLoading() {
  let loader = document.getElementById('loading-overlay');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'loading-overlay';
    loader.className = 'loading-overlay';
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);
  }
}

function hideLoading() {
  const loader = document.getElementById('loading-overlay');
  if (loader) loader.remove();
}

// ==========================================================
// HEADER COMPONENT - Renderizar header en cualquier página
// ==========================================================

function renderHeader(currentUser = null) {
  const isAuthenticated = currentUser && currentUser.user;
  const profile = currentUser?.profile;

  const navLinks = `
    <a href="propiedades.html" class="nav-link">Explorar</a>
    ${isAuthenticated && profile?.role === 'owner' ? 
      '<a href="publicar.html" class="nav-link">Publicar propiedad</a>' : ''}
  `;

  const navActions = isAuthenticated ? `
    <a href="dashboard.html" class="user-info">
      <i data-lucide="user" style="width:18px;height:18px"></i>
      <span class="user-name">${profile?.full_name || profile?.email || 'Mi cuenta'}</span>
    </a>
    <button onclick="signOut()" class="nav-mobile-toggle" title="Cerrar sesión" style="color:#6B7280">
      <i data-lucide="log-out" style="width:20px;height:20px"></i>
    </button>
  ` : `
    <a href="login.html" class="btn btn-outline">Iniciar sesión</a>
    <a href="registro.html" class="btn btn-primary">Registrarse</a>
  `;

  const mobileNav = `
    <a href="propiedades.html">Explorar</a>
    ${isAuthenticated && profile?.role === 'owner' ? 
      '<a href="publicar.html">Publicar propiedad</a>' : ''}
    ${isAuthenticated ? `
      <a href="dashboard.html">Mi panel</a>
      <button onclick="signOut()" style="color:#DC2626">Cerrar sesión</button>
    ` : `
      <a href="login.html">Iniciar sesión</a>
      <a href="registro.html" style="color:var(--primary);font-weight:600">Registrarse</a>
    `}
  `;

  return `
    <header class="header">
      <div class="header-content">
        <a href="index.html" class="logo">
          <div class="logo-icon">
            <i data-lucide="home" style="width:22px;height:22px"></i>
          </div>
          <span class="logo-text">RENTO</span>
        </a>
        
        <nav class="nav-desktop">
          ${navLinks}
        </nav>
        
        <div class="nav-actions">
          ${navActions}
        </div>
        
        <button class="nav-mobile-toggle" onclick="toggleMobileNav()" aria-label="Menú">
          <i data-lucide="menu" style="width:24px;height:24px"></i>
        </button>
      </div>
      
      <nav class="nav-mobile" id="nav-mobile">
        ${mobileNav}
      </nav>
    </header>
  `;
}

function toggleMobileNav() {
  const nav = document.getElementById('nav-mobile');
  if (nav) nav.classList.toggle('open');
}

// ==========================================================
// FOOTER COMPONENT
// ==========================================================

function renderFooter() {
  return `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">
              <div class="logo-icon">
                <i data-lucide="home" style="width:22px;height:22px"></i>
              </div>
              <span class="logo-text">RENTO</span>
            </div>
            <p class="footer-description">
              La plataforma líder para encontrar tu hogar ideal en Honduras. 
              Conectamos dueños y rentadores de forma segura y transparente.
            </p>
          </div>
          
          <div>
            <h4 class="footer-heading">Enlaces</h4>
            <ul class="footer-list">
              <li><a href="propiedades.html">Explorar propiedades</a></li>
              <li><a href="registro.html">Registrarse</a></li>
              <li><a href="login.html">Iniciar sesión</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="footer-heading">Contacto</h4>
            <ul class="footer-list">
              <li>
                <i data-lucide="mail" style="width:16px;height:16px"></i>
                <a href="mailto:hola@rento.hn">hola@rento.hn</a>
              </li>
              <li>
                <i data-lucide="phone" style="width:16px;height:16px"></i>
                <span>+504 9876-5432</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>© ${new Date().getFullYear()} RENTO. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  `;
}

// ==========================================================
// AUTO-INICIALIZAR header y footer si existen los slots
// ==========================================================

async function initLayout() {
  const headerSlot = document.getElementById('header-slot');
  const footerSlot = document.getElementById('footer-slot');

  if (headerSlot) {
    const currentUser = await getCurrentUser();
    headerSlot.innerHTML = renderHeader(currentUser);
  }

  if (footerSlot) {
    footerSlot.innerHTML = renderFooter();
  }

  // Inicializar iconos de Lucide después de insertar HTML
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Constantes
const CITY_NAMES = {
  choloma: 'Choloma',
  sps: 'San Pedro Sula',
  tegucigalpa: 'Tegucigalpa',
  la_ceiba: 'La Ceiba',
  comayagua: 'Comayagua',
  tela: 'Tela',
};

const PROPERTY_TYPE_NAMES = {
  house: 'Casa',
  apartment: 'Apartamento',
  room: 'Habitación',
  studio: 'Estudio',
};

const STATUS_LABELS = {
  pending: { label: 'En revisión', class: 'badge-pending', icon: 'clock' },
  active: { label: 'Publicada', class: 'badge-active', icon: 'check-circle-2' },
  rejected: { label: 'Rechazada', class: 'badge-rejected', icon: 'x-circle' },
  paused: { label: 'Pausada', class: 'badge-paused', icon: 'pause-circle' },
  rented: { label: 'Rentada', class: 'badge-rented', icon: 'home' },
  archived: { label: 'Archivada', class: 'badge-paused', icon: 'archive' },
};

const AMENITIES_LIST = [
  { id: 'wifi', label: 'WiFi incluido' },
  { id: 'ac', label: 'Aire acondicionado' },
  { id: 'kitchen', label: 'Cocina equipada' },
  { id: 'parking', label: 'Estacionamiento' },
  { id: 'security', label: 'Seguridad 24/7' },
  { id: 'pool', label: 'Piscina' },
  { id: 'gym', label: 'Gimnasio' },
  { id: 'laundry', label: 'Lavandería' },
  { id: 'water_tank', label: 'Cisterna de agua' },
  { id: 'garden', label: 'Jardín' },
  { id: 'balcony', label: 'Balcón' },
  { id: 'cable_tv', label: 'TV por cable' },
];

// ==========================================================
// FUNCIONES DE UPLOAD MOVIDAS A storage.js
// ==========================================================
// Las siguientes funciones están en storage.js:
// - uploadFile, deleteFile
// - validateImageFile, validateDocumentFile
// - setupFileUpload, formatFileSize, getWhatsAppLink
// ==========================================================

// Mostrar toast/notificación temporal
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? '#059669' : '#DC2626'};
    color: white;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    font-weight: 500;
    animation: slideUp 0.3s ease;
    max-width: 400px;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Formatear fecha
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-HN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
