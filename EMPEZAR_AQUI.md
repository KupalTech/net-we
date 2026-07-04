# 🚀 EMPEZAR AQUÍ - Net-we

## ¡Bienvenido! Tu aplicación está 100% lista

Esta es tu guía rápida para poner en marcha Net-we en **menos de 1 hora**.

---

## 📋 Checklist de Configuración

### ✅ Paso 1: Verificar Requisitos (5 min)

- [ ] Tengo Node.js instalado (versión 16 o superior)
  - Verificar: Abre terminal y ejecuta `node --version`
  - Si no lo tienes: [Descargar Node.js](https://nodejs.org/)

- [ ] Tengo un editor de código (VS Code recomendado)
  - Si no lo tienes: [Descargar VS Code](https://code.visualstudio.com/)

- [ ] Tengo una cuenta de Google (para Firebase)
  - Si no la tienes: [Crear cuenta](https://accounts.google.com/signup)

---

### ✅ Paso 2: Instalar Dependencias (5 min)

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

**Espera a que termine** (puede tardar 2-3 minutos)

✅ Si ves "added XXX packages" → ¡Perfecto!
❌ Si ves errores → Verifica que Node.js esté instalado

---

### ✅ Paso 3: Configurar Firebase (15 min)

#### 3.1. Crear Proyecto
- [ ] Ir a [Firebase Console](https://console.firebase.google.com/)
- [ ] Clic en "Agregar proyecto"
- [ ] Nombre: **net-we** (o el que prefieras)
- [ ] Desactivar Google Analytics (opcional)
- [ ] Clic en "Crear proyecto"
- [ ] Esperar a que se cree

#### 3.2. Habilitar Authentication
- [ ] En el menú lateral: **Build → Authentication**
- [ ] Clic en "Comenzar"
- [ ] Clic en "Email/Password"
- [ ] Activar el switch "Habilitar"
- [ ] Clic en "Guardar"

#### 3.3. Crear Firestore Database
- [ ] En el menú lateral: **Build → Firestore Database**
- [ ] Clic en "Crear base de datos"
- [ ] Seleccionar **"Comenzar en modo de prueba"**
- [ ] Elegir ubicación (ej: southamerica-east1)
- [ ] Clic en "Habilitar"
- [ ] Esperar a que se cree

#### 3.4. Obtener Credenciales
- [ ] En el menú lateral: **Configuración del proyecto** (ícono ⚙️)
- [ ] Scroll hasta "Tus apps"
- [ ] Clic en el ícono **</>** (Web)
- [ ] Nombre de la app: **net-we-web**
- [ ] NO marcar "Firebase Hosting"
- [ ] Clic en "Registrar app"
- [ ] **COPIAR** el objeto `firebaseConfig` que aparece

---

### ✅ Paso 4: Configurar Variables de Entorno (5 min)

#### 4.1. Crear archivo .env
- [ ] En la raíz del proyecto, crear archivo `.env` (sin extensión)
- [ ] Copiar este contenido:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

#### 4.2. Completar con tus credenciales
- [ ] Reemplazar los valores vacíos con los de tu `firebaseConfig`

**Ejemplo:**
```env
VITE_FIREBASE_API_KEY=AIzaSyAbc123...
VITE_FIREBASE_AUTH_DOMAIN=net-we-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=net-we-12345
VITE_FIREBASE_STORAGE_BUCKET=net-we-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

- [ ] Guardar el archivo `.env`

---

### ✅ Paso 5: Ejecutar la Aplicación (2 min)

En la terminal, ejecuta:

```bash
npm run dev
```

- [ ] La aplicación se abre automáticamente en `http://localhost:3000`
- [ ] Ves la pantalla principal con el logo "Net-we"

✅ Si ves la pantalla → ¡Funciona!
❌ Si hay errores → Verifica el archivo `.env`

---

### ✅ Paso 6: Probar la Aplicación (10 min)

#### 6.1. Registrar Usuario 1
- [ ] Clic en "Registrarse"
- [ ] Completar formulario:
  - Email: `usuario1@test.com`
  - Nombre: `Juan`
  - Apellido: `Pérez`
  - Empresa: `Startup ABC`
  - Verticales: Seleccionar 2-3 (ej: Fintech, SaaS)
  - Rol: `CEO`
  - Password: `123456`
  - Confirmar Password: `123456`
  - Aceptar términos
- [ ] Clic en "Registrarse"
- [ ] Ver mensaje "Usuario dado de alta correctamente"
- [ ] Eres redirigido al Dashboard

#### 6.2. Registrar Usuario 2
- [ ] Clic en el avatar → "Cerrar Sesión"
- [ ] Clic en "Registrarse"
- [ ] Completar con datos diferentes:
  - Email: `usuario2@test.com`
  - Nombre: `María`
  - Apellido: `González`
  - Empresa: `Tech XYZ`
  - Verticales: Diferentes a Usuario 1
  - Rol: `Founder`
  - Password: `123456`
- [ ] Registrar y entrar al Dashboard

#### 6.3. Probar Solicitud de Reunión
- [ ] En el Dashboard, ver a "Juan Pérez" en la grilla
- [ ] Estado: "Sin Contacto"
- [ ] Clic en "Solicitar Reunión"
- [ ] Estado cambia a "Solicitud Enviada"

#### 6.4. Aceptar Solicitud
- [ ] Cerrar sesión
- [ ] Iniciar sesión como `usuario1@test.com`
- [ ] Ver modal con solicitud de María González
- [ ] Clic en "Aceptar"
- [ ] Estado cambia a "Contactado"
- [ ] Aparecen botones "Ver Perfil" y "Chat"

#### 6.5. Probar Chat
- [ ] Clic en "Chat" de María González
- [ ] Escribir mensaje: "Hola María!"
- [ ] Enviar
- [ ] Abrir ventana de incógnito
- [ ] Iniciar sesión como `usuario2@test.com`
- [ ] Ir a Chat con Juan Pérez
- [ ] Ver mensaje "Hola María!"
- [ ] Responder: "Hola Juan!"
- [ ] Volver a la primera ventana
- [ ] Ver respuesta en tiempo real

#### 6.6. Ver Perfil
- [ ] Clic en "Ver Perfil" de María
- [ ] Ver toda la información del usuario
- [ ] Volver al Dashboard

---

## 🎉 ¡Felicitaciones!

Si completaste todos los pasos, tu aplicación está **100% funcional**.

---

## 📚 ¿Qué Sigue?

### Para Desarrollo
- [ ] Leer `README.md` para entender la arquitectura
- [ ] Revisar `FIREBASE_SETUP.md` para reglas de seguridad en producción
- [ ] Explorar el código en `src/`

### Para Producción
- [ ] Leer `DEPLOYMENT.md` para deploy en Vercel
- [ ] Configurar dominio personalizado
- [ ] Cambiar reglas de Firebase a modo producción

### Para Personalización
- [ ] Cambiar colores en los archivos CSS
- [ ] Agregar tu logo en `public/`
- [ ] Personalizar textos y mensajes

---

## 🆘 ¿Problemas?

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Firebase configuration not found"
- Verifica que `.env` esté en la raíz del proyecto
- Verifica que todas las variables estén completas
- Reinicia el servidor: Ctrl+C y luego `npm run dev`

### Error: "Permission denied" en Firebase
- Ve a Firebase Console
- Firestore Database → Rules
- Verifica que esté en modo de prueba:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 12, 31);
    }
  }
}
```

### La grilla no muestra usuarios
- Verifica que hayas registrado más de un usuario
- Abre la consola del navegador (F12) y busca errores
- Verifica que Firestore esté creado en Firebase Console

### El chat no funciona
- El chat se guarda en Firestore (`chats/{chatId}/messages`), no requiere Realtime Database
- Verifica que ambos usuarios tengan estado "Contactado" (el chat solo se habilita después de aceptar una solicitud de reunión)
- Revisa las reglas de seguridad de Firestore en `FIREBASE_SETUP.md`

---

## 📞 Documentación Completa

- **QUICK_START.md** - Guía rápida de 5 pasos
- **INSTRUCCIONES_INICIALES.md** - Instrucciones detalladas
- **FIREBASE_SETUP.md** - Configuración completa de Firebase
- **DEPLOYMENT.md** - Guía de deployment a Vercel
- **RESUMEN_PROYECTO.md** - Resumen ejecutivo del proyecto
- **README.md** - Documentación técnica

---

## ✅ Checklist Final

Antes de considerar que todo está listo:

- [ ] Node.js instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Proyecto Firebase creado
- [ ] Authentication habilitado
- [ ] Firestore Database creado
- [ ] Archivo `.env` creado y configurado
- [ ] Aplicación corriendo (`npm run dev`)
- [ ] Puedo registrar usuarios
- [ ] Puedo iniciar sesión
- [ ] Veo el Dashboard
- [ ] Puedo enviar solicitudes
- [ ] Puedo aceptar solicitudes
- [ ] El chat funciona en tiempo real
- [ ] Puedo ver perfiles

---

## 🎯 Tiempo Estimado Total

- ⏱️ Instalación de Node.js: 5 min (si no lo tienes)
- ⏱️ Instalación de dependencias: 5 min
- ⏱️ Configuración de Firebase: 15 min
- ⏱️ Configuración de variables: 5 min
- ⏱️ Pruebas de funcionalidad: 10 min

**Total: ~40 minutos** ⚡

---

## 🚀 ¡Comienza Ahora!

**Paso 1:** Abre una terminal en esta carpeta
**Paso 2:** Ejecuta `npm install`
**Paso 3:** Sigue esta guía paso a paso

**¡Éxito con tu plataforma de networking!** 🎉
