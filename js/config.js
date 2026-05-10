// ==========================================================
// CONFIGURACIÓN DE SUPABASE
// ==========================================================
// IMPORTANTE: Reemplaza estos valores con los tuyos de Supabase
//
// Para obtenerlos:
// 1. Ve a tu proyecto en supabase.com
// 2. Settings → API
// 3. Copia "Project URL" y "anon public" key
// ==========================================================

const SUPABASE_CONFIG = {
  url: 'https://mmcdgfkyhvqznfnrxvmn.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tY2RnZmt5aHZxem5mbnJ4dm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMzE2MzQsImV4cCI6MjA5MzYwNzYzNH0.YvrOU0TS0l38iHzi3B4BIYCfz4_GiNgwFMXC_Fi6TUg',
};

// WhatsApp del negocio (para contacto)
const WHATSAPP_BUSINESS = '+50498765432';

// URL del panel de admin (separado)
const ADMIN_URL = 'admin/index.html';

// ==========================================================
// NO MODIFIQUES NADA DEBAJO DE ESTA LÍNEA
// ==========================================================

// Validar que las credenciales estén configuradas
if (SUPABASE_CONFIG.url.includes('TU-PROYECTO') || SUPABASE_CONFIG.anonKey.includes('TU-ANON-KEY')) {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;background:#FDF8F3;font-family:system-ui;">
        <div style="background:white;padding:2rem;border-radius:1rem;max-width:600px;border:2px solid #FECACA;box-shadow:0 8px 24px rgba(0,0,0,0.1);">
          <h1 style="color:#DC2626;margin-bottom:1rem;font-size:1.5rem;">⚠️ Configuración requerida</h1>
          <p style="color:#374151;margin-bottom:1rem;line-height:1.6;">
            Necesitas configurar tus credenciales de Supabase antes de usar la aplicación.
          </p>
          <ol style="color:#374151;margin-left:1.5rem;line-height:1.8;">
            <li>Abre el archivo <code style="background:#F3F4F6;padding:2px 6px;border-radius:4px;">js/config.js</code></li>
            <li>Reemplaza <code style="background:#F3F4F6;padding:2px 6px;border-radius:4px;">TU-PROYECTO</code> con tu URL real</li>
            <li>Reemplaza <code style="background:#F3F4F6;padding:2px 6px;border-radius:4px;">TU-ANON-KEY-AQUI</code> con tu anon key</li>
            <li>Guarda el archivo y recarga esta página</li>
          </ol>
          <p style="color:#6B7280;margin-top:1rem;font-size:0.875rem;">
            Las credenciales las encuentras en: Supabase → Settings → API
          </p>
        </div>
      </div>
    `;
  });
  throw new Error('Supabase no configurado');
}

// Crear cliente Supabase global
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
