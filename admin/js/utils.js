// ==========================================================
// UTILIDADES - PANEL DE ADMIN
// ==========================================================

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

const ROLE_NAMES = {
  admin: 'Administrador',
  owner: 'Dueño',
  renter: 'Rentador',
};

// Obtener admin actual (verifica que sea admin)
async function getCurrentAdmin() {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return null;
    }

    return { user, profile };
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}

// Requerir admin (redirige a login si no lo es)
async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    window.location.href = 'index.html';
    return null;
  }
  return admin;
}

async function adminSignOut() {
  await supabaseClient.auth.signOut();
  window.location.href = 'index.html';
}

// Helpers
function formatPrice(amount) {
  return `L ${amount.toLocaleString('es-HN')}`;
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-HN', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function timeAgo(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) return 'hace un momento';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days} día${days > 1 ? 's' : ''}`;
  return formatDate(dateStr);
}

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

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 9999;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? '#059669' : '#DC2626'};
    color: white; border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    font-weight: 500; animation: slideIn 0.3s ease;
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

// Obtener URL firmada para archivos privados (verification-docs)
async function getSignedUrl(path, expiresIn = 3600) {
  const { data, error } = await supabaseClient.storage
    .from('verification-docs')
    .createSignedUrl(path, expiresIn);
  
  if (error) {
    console.error('Error obteniendo URL firmada:', error);
    return null;
  }
  return data.signedUrl;
}

// Sidebar / Layout
function renderAdminSidebar(profile, currentPage) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', href: 'dashboard.html' },
    { id: 'verificaciones', label: 'Verificaciones', icon: 'shield-check', href: 'verificaciones.html' },
    { id: 'propiedades', label: 'Propiedades', icon: 'building-2', href: 'propiedades.html' },
    { id: 'usuarios', label: 'Usuarios', icon: 'users', href: 'usuarios.html' },
    { id: 'solicitudes', label: 'Solicitudes', icon: 'message-square', href: 'solicitudes.html' },
  ];

  return `
    <aside class="admin-sidebar" id="admin-sidebar">
      <div class="admin-sidebar-header">
        <div class="admin-logo">
          <div class="admin-logo-icon">
            <i data-lucide="shield" style="width:22px;height:22px"></i>
          </div>
          <div>
            <div class="admin-logo-text">RENTO</div>
            <div class="admin-logo-subtitle">Admin Panel</div>
          </div>
        </div>
        <button class="admin-sidebar-close" onclick="toggleSidebar()">
          <i data-lucide="x" style="width:20px;height:20px"></i>
        </button>
      </div>

      <nav class="admin-nav">
        ${items.map(item => `
          <a href="${item.href}" class="admin-nav-item ${currentPage === item.id ? 'active' : ''}">
            <i data-lucide="${item.icon}" style="width:20px;height:20px"></i>
            <span>${item.label}</span>
          </a>
        `).join('')}
      </nav>

      <div class="admin-sidebar-footer">
        <div class="admin-user">
          <div class="admin-user-avatar">${(profile.full_name || 'A')[0].toUpperCase()}</div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;font-size:0.875rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${profile.full_name || 'Admin'}</div>
            <div style="color:var(--text-light);font-size:0.75rem">Administrador</div>
          </div>
          <button onclick="adminSignOut()" class="admin-icon-btn" title="Cerrar sesión">
            <i data-lucide="log-out" style="width:18px;height:18px"></i>
          </button>
        </div>
      </div>
    </aside>
  `;
}

function renderAdminHeader() {
  return `
    <header class="admin-topbar">
      <button class="admin-menu-btn" onclick="toggleSidebar()">
        <i data-lucide="menu" style="width:22px;height:22px"></i>
      </button>
      <div class="admin-logo" style="font-size:0.9375rem">
        <div class="admin-logo-icon" style="width:32px;height:32px">
          <i data-lucide="shield" style="width:18px;height:18px"></i>
        </div>
        <div class="admin-logo-text" style="font-size:1.125rem">RENTO</div>
      </div>
    </header>
  `;
}

function toggleSidebar() {
  const sidebar = document.getElementById('admin-sidebar');
  if (sidebar) sidebar.classList.toggle('open');
}

async function initAdminLayout(currentPage) {
  const admin = await requireAdmin();
  if (!admin) return null;

  const sidebarSlot = document.getElementById('sidebar-slot');
  const topbarSlot = document.getElementById('topbar-slot');

  if (sidebarSlot) sidebarSlot.innerHTML = renderAdminSidebar(admin.profile, currentPage);
  if (topbarSlot) topbarSlot.innerHTML = renderAdminHeader();

  if (typeof lucide !== 'undefined') lucide.createIcons();

  return admin;
}

// Registrar acción en audit log
async function logAdminAction(adminId, actionType, targetType, targetId, details = null) {
  await supabaseClient
    .from('admin_actions')
    .insert({
      admin_id: adminId,
      action_type: actionType,
      target_type: targetType,
      target_id: targetId,
      details,
    });
}
