# 📝 Instrucciones Iniciales - Net-we

## ¡Bienvenido a Net-we!

Esta aplicación está **100% completa y lista para usar**. Solo necesitas configurar Firebase y ejecutarla.

---

## 🎯 Lo que está implementado

### ✅ Todas las funcionalidades solicitadas:

1. **Pantalla Principal** con logo y botones de Registrarse/Ingresar
2. **Registro de Usuario** con:
   - Formulario completo con validaciones
   - 26 verticales de negocio (selección múltiple)
   - 12 roles de empresa (selección única)
   - Bio opcional
   - Validación de contraseñas
   - Términos y condiciones
   - Mensajes de éxito/error

3. **Login** con:
   - Autenticación email/password
   - Validación de credenciales
   - Mensajes de error apropiados

4. **Dashboard Principal** con:
   - Navbar con avatar y menú desplegable
   - Grilla de usuarios con todos los datos
   - Estados de contacto (Sin Contacto, Solicitud Enviada, Contactado)
   - Botones dinámicos según estado

5. **Sistema de Solicitudes de Reunión** con:
   - Envío de solicitudes
   - Modal de solicitudes pendientes
   - Aceptar/Rechazar solicitudes
   - Actualización automática de estados

6. **Chat en Tiempo Real** con:
   - Mensajería instantánea
   - Solo disponible para usuarios contactados
   - Interfaz moderna y responsive

7. **Perfil de Usuario** con:
   - Vista de perfil propio y de otros
   - Toda la información del usuario
   - Diseño profesional

---

## 🚀 Pasos para Ejecutar (Primera Vez)

### Paso 1: Instalar Node.js
Si no lo tienes instalado, descarga Node.js desde: https://nodejs.org/

### Paso 2: Instalar Dependencias
Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto instalará todas las dependencias necesarias.

### Paso 3: Configurar Firebase

#### 3.1. Crear Proyecto Firebase
1. Ve a https://console.firebase.google.com/
2. Haz clic en "Agregar proyecto"
3. Nombre del proyecto: **net-we** (o el que prefieras)
4. Acepta los términos y crea el proyecto

#### 3.2. Habilitar Authentication
1. En el menú lateral: **Build > Authentication**
2. Clic en "Comenzar"
3. Habilita **Email/Password**
4. Guarda

#### 3.3. Crear Firestore Database
1. En el menú lateral: **Build > Firestore Database**
2. Clic en "Crear base de datos"
3. Selecciona **"Comenzar en modo de prueba"** (para desarrollo)
4. Elige la ubicación más cercana
5. Habilitar

#### 3.4. Obtener Credenciales
1. En el menú lateral: **Configuración del proyecto** (ícono engranaje)
2. En "Tus apps", clic en **</>** (Web)
3. Registra la app: nombre "net-we-web"
4. **Copia las credenciales** que aparecen en `firebaseConfig`

### Paso 4: Configurar Variables de Entorno

1. En la raíz del proyecto, crea un archivo llamado `.env` (sin extensión)
2. Copia este contenido y reemplaza con tus credenciales:

```env
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

**IMPORTANTE:** Reemplaza todos los valores con los de tu proyecto Firebase.

### Paso 5: Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación se abrirá automáticamente en http://localhost:3000

---

## 🧪 Prueba la Aplicación

### 1. Registrar Primer Usuario
1. En la pantalla principal, clic en "Registrarse"
2. Completa el formulario:
   - Email: tu@email.com
   - Nombre: Juan
   - Apellido: Pérez
   - Empresa: Mi Startup
   - Verticales: Selecciona una o más (ej: Fintech, SaaS)
   - Rol: CEO
   - Bio: (opcional)
   - Password: 123456
   - Confirmar Password: 123456
   - Acepta términos y condiciones
3. Clic en "Registrarse"
4. Deberías ver el mensaje "Usuario dado de alta correctamente"
5. Serás redirigido al Dashboard

### 2. Registrar Segundo Usuario
1. Abre una ventana de incógnito o cierra sesión
2. Registra otro usuario con datos diferentes
3. Inicia sesión con el segundo usuario

### 3. Probar Solicitud de Reunión
1. En el Dashboard, verás al primer usuario en la grilla
2. Clic en "Solicitar Reunión"
3. El estado cambiará a "Solicitud Enviada"

### 4. Aceptar Solicitud
1. Cierra sesión e inicia con el primer usuario
2. Verás un modal con la solicitud pendiente
3. Clic en "Aceptar"
4. El estado cambiará a "Contactado"

### 5. Probar Chat
1. Con el estado "Contactado", clic en "Chat"
2. Envía mensajes
3. Abre otra ventana con el otro usuario
4. Verás los mensajes en tiempo real

### 6. Ver Perfil
1. Clic en "Ver Perfil" de un usuario contactado
2. Verás toda su información

---

## 📱 Diseño Responsive

La aplicación es completamente responsive y funciona perfectamente en:
- 📱 Móviles
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktops

---

## 🌐 Deploy a Producción

Cuando estés listo para publicar:

### Opción 1: Vercel (Recomendado - Gratis)

1. Crea cuenta en https://vercel.com
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno
4. Deploy automático

**Ver guía completa:** `DEPLOYMENT.md`

### Opción 2: Netlify, Firebase Hosting, etc.

La aplicación es compatible con cualquier servicio de hosting estático.

---

## 🔒 Seguridad en Producción

**IMPORTANTE:** Antes de ir a producción:

1. Cambia las reglas de Firebase del modo de prueba a producción
2. Configura reglas de seguridad apropiadas
3. Ver detalles en: `FIREBASE_SETUP.md`

---

## 📚 Documentación Adicional

- **README.md** - Documentación general del proyecto
- **QUICK_START.md** - Guía rápida de inicio
- **FIREBASE_SETUP.md** - Configuración detallada de Firebase
- **DEPLOYMENT.md** - Guía completa de deployment

---

## 🆘 Problemas Comunes

### "Cannot find module..."
```bash
# Reinstalar dependencias
rm -rf node_modules
npm install
```

### "Firebase configuration not found"
- Verifica que el archivo `.env` esté en la raíz del proyecto
- Verifica que todas las variables estén configuradas
- Reinicia el servidor de desarrollo

### "Permission denied" en Firebase
- Verifica que las reglas de Firestore estén en modo de prueba (o revisa `FIREBASE_SETUP.md` si ya estás en modo producción)

### La página se recarga y pierde la ruta
- Esto es normal en desarrollo
- En producción, `vercel.json` maneja las rutas correctamente

---

## ✅ Checklist de Verificación

Antes de considerar que todo funciona:

- [ ] `npm install` ejecutado sin errores
- [ ] Proyecto Firebase creado
- [ ] Authentication habilitado
- [ ] Firestore Database creado
- [ ] Archivo `.env` creado con credenciales
- [ ] `npm run dev` ejecutado sin errores
- [ ] Aplicación abre en el navegador
- [ ] Puedo registrar un usuario
- [ ] Puedo iniciar sesión
- [ ] Veo el Dashboard con la grilla
- [ ] Puedo enviar solicitud de reunión
- [ ] Puedo aceptar/rechazar solicitudes
- [ ] Puedo chatear con usuarios contactados
- [ ] Puedo ver perfiles

---

## 🎉 ¡Todo Listo!

Si completaste todos los pasos, tu aplicación de networking está funcionando perfectamente.

**Próximos pasos sugeridos:**
1. Personalizar colores y logo
2. Agregar más usuarios de prueba
3. Probar todas las funcionalidades
4. Preparar para producción
5. Deploy a Vercel

---

## 💬 Contacto

Para soporte o consultas sobre el proyecto, revisa la documentación o contacta al equipo de desarrollo.

**¡Éxito con tu plataforma de networking!** 🚀
