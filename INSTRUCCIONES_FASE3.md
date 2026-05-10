# 🚀 RENTO - FASE 3 (Admin Panel) - Guía de Instalación

> **Esta es la FASE 3.** Incluye también la corrección del bug de la FASE 2.

---

## 🐛 BUG FIX INCLUIDO

**Error que reportaste:**
```
Uncaught SyntaxError: Identifier 'AMENITIES_LIST' has already been declared
```

**Causa:** Conflicto de nombres entre `js/utils.js` y `publicar.html`.

**Corregido en este zip:**
- ✅ `publicar.html` ahora usa `PROPERTY_AMENITIES` (renombrado)
- ✅ `propiedad.html` corrigió otro conflicto similar (`showError` → `showFullPageError`)
- ✅ Verificación cruzada hecha en TODOS los archivos

---

## ✅ ¿QUÉ INCLUYE FASE 3?

### **Panel de Admin Separado** (`admin/`)

```
admin/
├── index.html              → Login solo para administradores
├── dashboard.html          → Métricas y resumen
├── verificaciones.html     → Aprobar/rechazar identidades
├── propiedades.html        → Aprobar/rechazar propiedades
├── usuarios.html           → Ver todos los usuarios
├── solicitudes.html        → Ver todas las solicitudes
├── css/styles.css          → Diseño profesional admin
└── js/
    ├── config.js           → Tus credenciales (mismas que la app)
    └── utils.js            → Funciones del admin
```

### **Funcionalidades clave:**

- 🔐 **Login restringido** — Solo usuarios con `role = 'admin'` pueden entrar
- 📊 **Dashboard con métricas** — Usuarios, propiedades, solicitudes en tiempo real
- ✅ **Aprobar verificaciones con un click** — Ver DNI, selfie, comprobantes
- 🏠 **Aprobar propiedades** — Ver fotos, datos, documentos del dueño
- 👥 **Gestión de usuarios** — Buscar, filtrar, suspender
- 📝 **Audit log** — Cada acción del admin se registra en `admin_actions`
- 🔒 **URLs firmadas** — Documentos privados (DNI) se ven sin exponer URLs públicas
- 📱 **Responsive** — Funciona en móvil con sidebar plegable

---

## 📋 INSTALACIÓN PASO A PASO

### **PASO 1: Reemplazar archivos**

1. Descomprime `rento-fase3.zip`
2. Copia **TODO** el contenido reemplazando los archivos anteriores
3. ⚠️ **IMPORTANTE:** No borres tu `js/config.js` con tus credenciales

### **PASO 2: Configurar credenciales del admin**

El admin usa **las mismas credenciales de Supabase** pero en un archivo separado:

1. Abre `admin/js/config.js`
2. Reemplaza con tus credenciales (las mismas de la app principal):

```javascript
const SUPABASE_CONFIG = {
  url: 'https://TU-PROYECTO.supabase.co',
  anonKey: 'TU-ANON-KEY-AQUI',
};
```

### **PASO 3: Crear tu primer admin**

Como medida de seguridad, no hay forma de auto-asignarse rol de admin. Hazlo manualmente:

1. Ve a Supabase → **Table Editor** → `profiles`
2. Encuentra tu usuario (el que creaste en FASE 1)
3. Edita la fila:
   - `role` → cambia a `admin`
   - `verification_status` → cambia a `verified`
4. Guarda

### **PASO 4: Configurar URLs en Supabase**

En Supabase → **Authentication** → **URL Configuration**, agrega las URLs del admin:

```
Site URL: (lo que ya tienes)

Redirect URLs (agrega estas):
http://127.0.0.1:5500/**
http://127.0.0.1:5500/admin/**
https://somarexpress.github.io/rentando/**
https://somarexpress.github.io/rentando/admin/**
```

### **PASO 5: Acceder al admin**

**Localmente:**
```
http://127.0.0.1:5500/admin/index.html
```

**En producción (GitHub Pages):**
```
https://somarexpress.github.io/rentando/admin/
```

Inicia sesión con la cuenta que marcaste como `admin`.

---

## 🧪 PRUEBAS COMPLETAS

### **Test 1: Login del admin**
1. Abre `admin/index.html`
2. Inicia sesión con tu cuenta admin
3. ✅ Te lleva al dashboard del admin
4. Si intentas con una cuenta NO admin: te muestra error y cierra sesión

### **Test 2: Dashboard**
1. ✅ Ves 4 stat cards (usuarios, verificaciones pendientes, propiedades, solicitudes)
2. ✅ Si hay verificaciones pendientes, se muestran abajo
3. ✅ Si hay propiedades pendientes, se muestran abajo

### **Test 3: Aprobar Verificación**
1. Crea una cuenta nueva en la app principal
2. Esa cuenta sube su DNI en `verificacion.html`
3. En el admin → **Verificaciones** → Pendientes
4. Click **"Revisar"** en el usuario
5. ✅ Ves su DNI, selfie, comprobante de ingresos (si subió)
6. Click en cualquier imagen → se abre en nueva pestaña
7. Click **"Aprobar"** → ✅ El usuario ahora aparece como verificado
8. (O click **"Rechazar"** con una razón → el usuario verá esa razón)

### **Test 4: Aprobar Propiedad**
1. Como dueño verificado, publica una propiedad en la app principal
2. En el admin → **Propiedades** → Pendientes
3. Click **"Revisar"**
4. ✅ Ves todas las fotos, datos, documento del dueño
5. Click **"Aprobar y publicar"**
6. ✅ La propiedad ahora aparece pública en `propiedades.html`

### **Test 5: Búsqueda de usuarios**
1. En el admin → **Usuarios**
2. Filtra por rol "Dueño"
3. Filtra por verificación "Verificado"
4. Busca por nombre o email
5. ✅ Los filtros funcionan en tiempo real

### **Test 6: Ver Solicitudes**
1. En el admin → **Solicitudes**
2. ✅ Ves todas las solicitudes de contacto del sistema
3. Filtra por estado (pendientes, aceptadas, rechazadas)

---

## 🎯 CHECKLIST FINAL FASE 3

```
[ ] Bug de AMENITIES_LIST corregido (publicar.html funciona)
[ ] admin/js/config.js configurado con mis credenciales
[ ] Mi cuenta tiene role = 'admin' en Supabase
[ ] Puedo entrar a admin/index.html
[ ] El dashboard muestra métricas correctas
[ ] Puedo ver y aprobar verificaciones de identidad
[ ] Puedo ver imágenes privadas (DNI, selfie) en el modal
[ ] Puedo aprobar propiedades pendientes
[ ] Después de aprobar, la propiedad sale en propiedades.html (vista pública)
[ ] Puedo buscar y filtrar usuarios
[ ] Puedo suspender/reactivar usuarios
[ ] La tabla admin_actions registra mis acciones (verificable en Supabase)
```

---

## 🔐 SEGURIDAD - IMPORTANTE

### Cómo funciona el control de acceso:

1. **Frontend (admin/utils.js):** Verifica que `role === 'admin'` antes de mostrar el panel
2. **Backend (Row Level Security):** Las queries respetan las políticas RLS de Supabase

### ⚠️ Limitación a tener en cuenta:

El frontend SOLO oculta visualmente las páginas. Un usuario malicioso técnicamente podría intentar consultar la base de datos directamente. **La seguridad real está en RLS**.

Verifica que tus políticas RLS estén correctas en Supabase:

```sql
-- Solo admins pueden actualizar verification_status de cualquier perfil
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

Estas políticas YA estaban en el SQL original que ejecutaste.

---

## 🐛 PROBLEMAS COMUNES

### "No tengo permisos de admin"
- Verifica en Supabase → profiles que tu `role = 'admin'` (no 'admins' ni mayúsculas)
- Cierra sesión y vuelve a entrar

### Las imágenes de DNI no se ven en el admin
- **Causa:** El bucket `verification-docs` es privado
- **Solución:** El admin usa `getSignedUrl` que crea URLs temporales (1 hora)
- Si aún no funcionan, verifica que las políticas RLS de Storage permitan a admins leer

### "Foreign key not found" al cargar solicitudes
- **Causa:** Los nombres de las foreign keys generadas por Supabase pueden variar
- **Solución:** En Supabase → SQL Editor ejecuta:
```sql
SELECT conname FROM pg_constraint 
WHERE conrelid = 'public.contact_requests'::regclass 
AND contype = 'f';
```
- Si los nombres son diferentes a `contact_requests_renter_id_fkey` y `contact_requests_owner_id_fkey`, dímelos para ajustar

### El dashboard muestra "0" en todo
- Asegúrate que tu cuenta admin pueda leer las tablas
- Revisa la consola (F12) para ver errores específicos

---

## 🚀 SUBIR A PRODUCCIÓN

```bash
git add .
git commit -m "Fase 3: Admin panel + bugfix Fase 2"
git push origin main
```

GitHub Pages se actualiza automáticamente en 1-2 minutos.

---

## 🎉 ¡YA TIENES LA APP COMPLETA!

Con FASE 1, 2 y 3, tu plataforma RENTO ya tiene:

```
✅ Registro y login con roles (dueño, rentador, admin)
✅ Verificación de identidad manual
✅ Publicación de propiedades con fotos
✅ Búsqueda y filtros
✅ Sistema de solicitudes de contacto
✅ Integración con WhatsApp
✅ Panel de admin completo
✅ Audit log de acciones
```

**Próximos pasos sugeridos** (cuando quieras evolucionar):
- 💳 Integración con pagos (Stripe/Tigo Money)
- 📧 Emails automáticos (Resend.com)
- 🔔 Notificaciones in-app
- ⭐ Sistema de reseñas
- 📍 Mapa con propiedades
- 📱 PWA para instalar en móvil

Cuando quieras seguir, avísame qué priorizar. 🚀
