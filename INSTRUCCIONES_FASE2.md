# 🚀 RENTO - FASE 2 - Guía de Instalación y Pruebas

> **Esta es la FASE 2.** Asume que ya completaste la FASE 1 con éxito.

---

## ✅ ¿QUÉ INCLUYE ESTA FASE 2?

**5 nuevas páginas:**

```
✨ verificacion.html     → Subir DNI, selfie, comprobante de ingresos
✨ publicar.html         → Formulario completo para publicar propiedad
✨ mis-propiedades.html  → Lista de propiedades del dueño con gestión
✨ propiedades.html      → Búsqueda pública con filtros
✨ propiedad.html        → Detalle de propiedad con galería + solicitar contacto
✨ solicitudes.html      → Solicitudes de contacto (rentadores y dueños)
```

**Funcionalidades implementadas:**
- 📸 Subida de DNI y selfie (verificación manual por admin)
- 🏠 Publicación de propiedades con hasta 10 fotos
- 🔍 Búsqueda con filtros (ciudad, tipo, precio, habitaciones)
- 💬 Sistema de solicitudes de contacto
- 📱 Botón de WhatsApp directo cuando se acepta la solicitud
- ⏸️ Pausar/reactivar/eliminar propiedades
- 👀 Contador de vistas y contactos

---

## 📋 INSTRUCCIONES PASO A PASO

### **PASO 1: Reemplazar archivos**

1. Descomprime `rento-html-fase2.zip`
2. Copia todo el contenido **REEMPLAZANDO** los archivos anteriores
3. ⚠️ **IMPORTANTE:** No borres tu archivo `js/config.js` con tus credenciales — los nuevos archivos lo respetan

> 💡 **Tip:** Si quieres, antes de copiar haz una copia de seguridad de tu carpeta actual.

### **PASO 2: Verificar Storage Buckets en Supabase**

Los buckets ya deberían estar creados desde FASE 1. Verifica:

1. Ve a Supabase → **Storage**
2. Confirma que existen estos 3 buckets:
   - ✅ `property-images` (público)
   - ✅ `verification-docs` (privado)
   - ✅ `avatars` (público)

Si no existen, ejecuta este SQL en el SQL Editor de Supabase:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('property-images', 'property-images', true),
  ('verification-docs', 'verification-docs', false),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
```

### **PASO 3: Probar localmente con Live Server**

1. Abre la carpeta en VS Code
2. Click derecho en `index.html` → **"Open with Live Server"**

---

## 🧪 FLUJO DE PRUEBAS COMPLETAS

Sigue este orden exacto para probar todo el flujo de FASE 2:

### **📋 PRUEBA 1: Verificación de Identidad**

1. Inicia sesión como **Dueño** (cuenta creada en FASE 1)
2. En el dashboard verás "Verificación pendiente"
3. Click en **"Verificar ahora"**
4. En verificacion.html:
   - Ingresa un DNI de prueba (13 dígitos): `0801199512345`
   - Sube una imagen cualquiera como "frente del DNI"
   - Sube otra como "reverso del DNI"
   - Sube una tercera como "selfie con DNI"
5. Click **"Enviar para verificación"**
6. ✅ Deberías ver el mensaje "En revisión"

> 💡 Las imágenes pueden ser cualquier foto, ya que en V1 la verificación es manual.

### **📋 PRUEBA 2: Aprobar la Verificación (como Admin)**

Como aún no creamos el panel de admin, hazlo manualmente desde Supabase:

1. Ve a Supabase → **Table Editor** → `profiles`
2. Encuentra tu cuenta de Dueño
3. Edita la fila:
   - `verification_status` → `verified`
   - `verified_at` → `now()` (escribe la fecha actual)
4. Guarda

### **📋 PRUEBA 3: Publicar una Propiedad**

1. Recarga el dashboard (debería decir "Cuenta verificada ✓")
2. Click en **"Publicar nueva propiedad"**
3. Llena el formulario:
   - **Título:** `Casa moderna en Choloma con jardín`
   - **Descripción:** Cualquier texto largo
   - **Tipo:** Casa
   - **Ciudad:** Choloma
   - **Colonia:** `Residencial Las Brisas`
   - **Dirección:** `Calle Principal #123`
   - **Habitaciones:** 3
   - **Baños:** 2
   - **Precio:** 12000
   - **Depósito:** 12000
   - **Fotos:** Sube **5 fotos** mínimo (cualquier imagen)
   - Selecciona algunas amenidades
4. Click **"Publicar propiedad"**
5. ✅ Te redirige a `mis-propiedades.html` con badge "En revisión"

### **📋 PRUEBA 4: Aprobar la Propiedad (como Admin)**

1. Ve a Supabase → **Table Editor** → `properties`
2. Encuentra tu propiedad recién creada
3. Edita:
   - `status` → `active`
   - `is_verified` → `true`
   - `verified_at` → `now()`
   - `published_at` → `now()`
4. Guarda

### **📋 PRUEBA 5: Buscar y Ver Propiedades (como Rentador)**

1. **Cierra sesión** del dueño
2. Inicia sesión como **Rentador** (otra cuenta creada en FASE 1)
3. Verifica al rentador igual que hiciste con el dueño (Prueba 2)
4. Ve a **Explorar** o `propiedades.html`
5. ✅ Deberías ver tu propiedad publicada
6. Prueba los filtros: ciudad = Choloma
7. Click en la propiedad
8. ✅ Verás la galería de imágenes y todos los detalles
9. Click en **"Solicitar contacto"**
10. Escribe un mensaje de prueba
11. Click **"Enviar solicitud"**
12. ✅ Debería decir "Solicitud enviada - Esperando respuesta"

### **📋 PRUEBA 6: Aceptar Solicitud (como Dueño)**

1. **Cierra sesión** del rentador
2. Inicia sesión como **Dueño** otra vez
3. Ve al dashboard, deberías ver una notificación de solicitud (no hay panel aún, pero...)
4. Ve a **Mis solicitudes** o `solicitudes.html`
5. ✅ Verás la solicitud pendiente
6. Click **"Aceptar"**
7. ✅ Aparecerá un botón verde de **WhatsApp**
8. Click en el botón → Se abre WhatsApp con un mensaje pre-armado

### **📋 PRUEBA 7: Verificar como Rentador**

1. Cierra sesión, inicia como rentador
2. Ve a `solicitudes.html`
3. ✅ Verás la solicitud aceptada con botón de WhatsApp
4. ✅ El nombre del dueño aparece visible

---

## 🎯 CHECKLIST FINAL FASE 2

Marca lo que ya funciona:

```
[ ] Pude subir DNI y selfie en verificacion.html
[ ] Después de aprobar manualmente, el dashboard muestra "Verificada"
[ ] Pude publicar una propiedad con 5+ fotos
[ ] Mi propiedad aparece en mis-propiedades.html con badge "En revisión"
[ ] Después de aprobarla, aparece como "Activa"
[ ] La propiedad aparece en propiedades.html (vista pública)
[ ] Los filtros funcionan correctamente
[ ] La galería de imágenes funciona en propiedad.html
[ ] El botón de "Solicitar contacto" abre el modal
[ ] La solicitud se guarda en Supabase (tabla contact_requests)
[ ] El dueño ve la solicitud en solicitudes.html
[ ] Al aceptar, aparece el botón de WhatsApp
[ ] El rentador ve la solicitud aceptada
```

---

## 🐛 PROBLEMAS COMUNES Y SOLUCIONES

### "Error al subir imagen"
**Causa:** Storage bucket no existe o RLS muy restrictivo.

**Solución:**
1. Ve a Supabase → Storage → Verifica que existan los 3 buckets
2. Si están, revisa Storage → Policies que tengan permisos correctos

### "No se ven las propiedades en el listado"
**Causa:** La propiedad está en estado `pending` (no `active`).

**Solución:** Cambia el status a `active` y `is_verified = true` en Supabase.

### "Error al solicitar contacto: Row Level Security"
**Causa:** El rentador no está verificado.

**Solución:** En Supabase → profiles → cambiar `verification_status` a `verified`.

### Las fotos no se cargan en propiedades.html
**Causa:** Las URLs de imágenes guardadas no son públicas.

**Solución:** Verifica que el bucket `property-images` esté marcado como **público** en Supabase.

### "Error al solicitar contacto: duplicate key"
**Causa:** Ya existe una solicitud para esa propiedad.

**Solución:** Solo puede haber UNA solicitud por (propiedad, rentador). Cancela la existente o usa otra cuenta.

### El WhatsApp no abre con el número correcto
**Causa:** El teléfono del usuario no tiene el formato correcto.

**Solución:** En `profiles`, edita el campo `phone` y asegúrate que tenga 8 dígitos (Honduras). El sistema le agrega `504` automáticamente.

---

## 🔐 IMPORTANTE: SEGURIDAD

Las RLS (Row Level Security) protegen tu base de datos:

- ✅ Solo dueños verificados pueden publicar propiedades
- ✅ Solo rentadores verificados pueden enviar solicitudes
- ✅ Solo el dueño y el rentador ven cada solicitud
- ✅ Los DNIs y documentos están en bucket privado
- ✅ Solo admins pueden cambiar verification_status

Sin embargo, en V1 **el admin eres tú manualmente**. En FASE 3 crearemos el panel de admin separado (`admin/`).

---

## 🚀 SUBIR A GITHUB PAGES (Producción)

Si ya tienes el repo en GitHub:

```bash
# En la carpeta del proyecto
git add .
git commit -m "Fase 2: verificación, propiedades y solicitudes"
git push origin main
```

GitHub Pages se actualiza automáticamente.

⚠️ **Recuerda:** Después de desplegar, en Supabase → Authentication → URL Configuration agrega:
```
https://somarexpress.github.io/rentando/**
```

---

## 🎯 ¿QUÉ SIGUE?

**FASE 3: Panel de Admin** (en otra subcarpeta `admin/`)
- Login solo para admins
- Lista de verificaciones pendientes
- Lista de propiedades pendientes de aprobación
- Ver/aprobar/rechazar con un click
- Métricas básicas (usuarios, propiedades, solicitudes)
- Gestión de usuarios

Cuando todo en FASE 2 funcione, dime **"Fase 2 lista"** y arrancamos con FASE 3. 🚀
