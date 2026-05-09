# 🚀 RENTO - FASE 1 (HTML) - Guía de Uso

> **¡Sin instalaciones! Solo abres archivos HTML y funciona.** ✨

---

## 📂 ARCHIVOS QUE INCLUYE ESTA FASE 1

```
rento-html/
├── index.html          ← Página principal (Landing)
├── login.html          ← Iniciar sesión
├── registro.html       ← Crear cuenta con rol
├── dashboard.html      ← Panel del usuario
├── css/
│   └── styles.css      ← Estilos compartidos
└── js/
    ├── config.js       ← AQUÍ pones tus credenciales Supabase
    └── utils.js        ← Funciones compartidas
```

---

## ✅ PASOS PARA HACERLO FUNCIONAR

### **PASO 1: Descomprimir**

1. Descarga el archivo `rento-html.zip`
2. Descomprímelo donde quieras (ejemplo: `Documentos/rento`)

### **PASO 2: Ejecutar el SQL en Supabase**

> ⚠️ **Importante:** Si ya ejecutaste el SQL en sesiones anteriores, salta al PASO 3.

1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Click en **SQL Editor** (en el menú lateral)
3. Click en **"New query"**
4. Abre el archivo `01-database-schema.sql` (te lo di en mensajes anteriores)
5. Copia TODO el contenido y pégalo
6. Click en **"Run"** (o `Ctrl+Enter`)
7. ✅ Deberías ver: `Success. No rows returned`

### **PASO 3: Configurar tus credenciales de Supabase**

1. Abre la carpeta `rento-html` en VS Code
2. Abre el archivo `js/config.js`
3. Reemplaza estas dos líneas:

```javascript
const SUPABASE_CONFIG = {
  url: 'https://TU-PROYECTO.supabase.co',           // ← TU URL aquí
  anonKey: 'TU-ANON-KEY-AQUI',                       // ← TU anon key aquí
};
```

**¿Dónde encuentro mis credenciales?**
- Supabase → tu proyecto → **Settings** → **API**
- **Project URL** → va en `url`
- **anon public** key → va en `anonKey`

> 💡 **Ejemplo real:**
> ```javascript
> const SUPABASE_CONFIG = {
>   url: 'https://abcdefghijklmn.supabase.co',
>   anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...',
> };
> ```

4. Guarda el archivo (`Ctrl+S`)

### **PASO 4: Configurar URLs de redirect en Supabase**

Para que el email de confirmación funcione:

1. En Supabase → **Authentication** → **URL Configuration**
2. En **Site URL** pon: `http://localhost:5500` (o donde abrirás los HTMLs)
3. En **Redirect URLs** agrega (uno por línea):
```
http://localhost:5500/**
http://127.0.0.1:5500/**
http://localhost:3000/**
file:///**
```

> 💡 Cuando subas a Vercel, agregaremos también esa URL.

### **PASO 5: Abrir la app**

**Opción A: Live Server en VS Code (RECOMENDADO)** ⭐

1. Abre la carpeta `rento-html` en VS Code
2. Instala la extensión **"Live Server"** (de Ritwick Dey)
3. Click derecho en `index.html` → **"Open with Live Server"**
4. Se abrirá en `http://127.0.0.1:5500/index.html`

**Opción B: Abrir directamente**

- Doble clic en `index.html`
- Se abre en tu navegador
- ⚠️ **Limitación:** El email de confirmación no funcionará bien sin un servidor

> **Recomiendo MUY FUERTEMENTE Live Server** porque es gratis, fácil y necesario para que Supabase funcione bien.

---

## 🧪 PRUEBAS QUE DEBES HACER

### ✅ Test 1: Página principal carga
- Abres `index.html` (con Live Server)
- Ves el hero naranja "Encuentra tu hogar ideal en Honduras"
- Hay 3 cards de features
- Botones funcionan

### ✅ Test 2: Registro como Rentador
1. Click en **"Registrarse"** (header)
2. Selecciona **"Soy Rentador"**
3. Llena el formulario:
   - Nombre: `Juan Test`
   - Email: **un email REAL tuyo**
   - Teléfono: `9876-5432`
   - Contraseña: `123456` (mínimo 6 caracteres)
4. Click **"Crear cuenta"**
5. ✅ Aparece pantalla **"Revisa tu email"**
6. Revisa tu correo y haz clic en el link
7. Te lleva a login.html

### ✅ Test 3: Iniciar sesión
1. En login.html, usa el email y contraseña que creaste
2. ✅ Te redirige a dashboard.html
3. ✅ Ves "Hola, Juan!" con el banner de verificación pendiente

### ✅ Test 4: Registro como Dueño
- Repite el proceso pero selecciona **"Soy Dueño"**
- Usa un email **DIFERENTE**
- Verifica que el dashboard cambia ("Gestiona tus propiedades...")

### ✅ Test 5: Verificar en Supabase
1. Ve a **Table Editor** → `profiles`
2. ✅ Ves tus 2 usuarios
3. ✅ El campo `role` es correcto (renter/owner)
4. ✅ El campo `phone` tiene tu teléfono

---

## 🐛 ¿PROBLEMAS?

### "Configuración requerida" (pantalla roja)
- No editaste `js/config.js` correctamente
- Verifica que pegaste las credenciales reales

### "Invalid API key"
- Las credenciales están mal copiadas
- Asegúrate de copiar la **anon public** key (no la service_role)
- Reinicia Live Server (`Ctrl+Shift+P` → "Live Server: Restart")

### El email no llega
- Revisa SPAM/correo no deseado
- Supabase tiene límite de **4 emails/hora** en plan free
- Espera 15 minutos antes de reintentar

### "Email not confirmed" al hacer login
- Necesitas hacer clic en el link del correo primero
- Si no llega, ve a Supabase → Authentication → Users → click en el email → "Send password recovery"

### El dashboard se queda cargando
- Abre la consola del navegador (F12 → pestaña "Console")
- Si ves errores, comparte el mensaje exacto

---

## 🚀 SUBIR A VERCEL (cuando todo funcione)

1. Ve a [vercel.com](https://vercel.com) y crea cuenta gratis con GitHub
2. Click **"Add New..."** → **"Project"**
3. **"Continue with..."** o sube directamente la carpeta arrastrándola
4. Vercel detecta que es un sitio estático
5. Click **"Deploy"**
6. ✅ En 30 segundos tienes tu URL: `https://rento-hn-xxx.vercel.app`

> ⚠️ **Después de desplegar:** Vuelve a Supabase → Authentication → URL Configuration y agrega tu URL de Vercel a los redirect URLs.

---

## ✅ CHECKLIST FINAL FASE 1

Antes de pasar a FASE 2, verifica:

- [ ] La página index.html se ve bien
- [ ] Puedo registrarme como Rentador con email real
- [ ] Puedo registrarme como Dueño con otro email
- [ ] El email de confirmación llega
- [ ] Puedo iniciar sesión con ambas cuentas
- [ ] El dashboard muestra mi nombre correcto
- [ ] Aparece "Verificación pendiente"
- [ ] El botón de cerrar sesión funciona
- [ ] En Supabase veo mis usuarios en `profiles`
- [ ] Los roles (owner/renter) están correctos

---

## 🎯 ¿QUÉ SIGUE?

Cuando todo esto funcione, dime **"Fase 1 lista"** y continuamos con:

**FASE 2:**
- 📸 Página de verificación (subir DNI)
- 🏠 Formulario para publicar propiedad
- 📋 Lista de propiedades del dueño
- 🔍 Búsqueda y listado público de propiedades

---

## 💬 ¿NECESITAS AYUDA?

Si algo no funciona:
1. Abre la consola del navegador (F12)
2. Toma captura del error
3. Avísame y lo resolvemos

**¡No avances sin que esto funcione perfectamente!** 🚀
