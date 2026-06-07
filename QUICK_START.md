# 🚀 Quick Start - Net-we

## Inicio Rápido en 5 Pasos

### 1️⃣ Instalar Dependencias

```bash
npm install
```

### 2️⃣ Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita **Authentication** (Email/Password)
3. Crea **Firestore Database** (modo prueba)
4. Crea **Realtime Database** (modo prueba)
5. Copia las credenciales de configuración

**Ver guía completa:** `FIREBASE_SETUP.md`

### 3️⃣ Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales de Firebase
```

### 4️⃣ Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 5️⃣ Deploy a Vercel

```bash
# Opción A: Conectar con GitHub (recomendado)
# - Sube el código a GitHub
# - Importa el repo en Vercel
# - Configura las variables de entorno
# - Deploy automático

# Opción B: Vercel CLI
npm install -g vercel
vercel
```

**Ver guía completa:** `DEPLOYMENT.md`

---

## 📋 Checklist de Configuración

- [ ] Proyecto Firebase creado
- [ ] Authentication habilitado (Email/Password)
- [ ] Firestore Database creado
- [ ] Realtime Database creado
- [ ] Variables de entorno configuradas en `.env`
- [ ] Dependencias instaladas (`npm install`)
- [ ] Aplicación corriendo localmente (`npm run dev`)
- [ ] Primer usuario registrado y funcionando
- [ ] Variables de entorno configuradas en Vercel
- [ ] Aplicación desplegada en producción

---

## 🎯 Casos de Uso Implementados

### ✅ Pantalla Principal
- Logo Net-we
- Botones de Registrarse e Ingresar

### ✅ Registro de Usuario
- Formulario completo con validaciones
- Selección múltiple de verticales de negocio (26 opciones)
- Selección de rol (12 opciones)
- Bio opcional
- Validación de contraseñas
- Términos y condiciones

### ✅ Login
- Autenticación con email/password
- Validación de credenciales
- Mensajes de error apropiados

### ✅ Dashboard Principal
- Navbar con avatar de usuario
- Grilla de usuarios registrados
- Estados de contacto:
  - Sin Contacto
  - Solicitud Enviada
  - Contactado
- Botones de acción según estado

### ✅ Sistema de Solicitudes
- Envío de solicitudes de reunión
- Modal de solicitudes pendientes
- Aceptar/Rechazar solicitudes
- Actualización automática de estados

### ✅ Chat en Tiempo Real
- Mensajería instantánea
- Solo disponible para usuarios contactados
- Interfaz moderna y responsive
- Scroll automático

### ✅ Perfil de Usuario
- Vista de perfil propio
- Vista de perfil de otros usuarios
- Información completa del usuario
- Verticales de negocio
- Bio

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + Vite
- **UI**: Bootstrap 5 + React Bootstrap
- **Routing**: React Router DOM v6
- **Backend**: Firebase
  - Authentication
  - Firestore (datos estructurados)
  - Realtime Database (chat)
- **Hosting**: Vercel
- **Iconos**: React Icons

---

## 📁 Estructura del Proyecto

```
net-we/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Navbar.jsx
│   │   └── PrivateRoute.jsx
│   ├── contexts/            # Context API
│   │   └── AuthContext.jsx
│   ├── firebase/            # Configuración Firebase
│   │   └── config.js
│   ├── pages/               # Páginas principales
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Chat.jsx
│   │   └── Profile.jsx
│   ├── utils/               # Utilidades
│   │   └── constants.js
│   ├── App.jsx
│   └── main.jsx
├── public/
├── .env.example
├── package.json
├── vite.config.js
├── vercel.json
├── README.md
├── FIREBASE_SETUP.md
├── DEPLOYMENT.md
└── QUICK_START.md
```

---

## 🔥 Comandos Principales

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Build
npm run build        # Construye para producción
npm run preview      # Preview del build

# Deploy
vercel               # Deploy a Vercel
vercel --prod        # Deploy a producción
```

---

## 🐛 Troubleshooting Común

### La app no carga
- Verifica que las variables de entorno estén configuradas
- Revisa la consola del navegador para errores

### No puedo registrar usuarios
- Verifica que Authentication esté habilitado en Firebase
- Revisa las reglas de seguridad de Firestore

### El chat no funciona
- Verifica que Realtime Database esté creado
- Revisa las reglas de seguridad de Realtime Database

### Error 404 en rutas
- Verifica que `vercel.json` esté configurado correctamente

---

## 📞 Soporte

Para más información, consulta:
- `README.md` - Documentación general
- `FIREBASE_SETUP.md` - Configuración detallada de Firebase
- `DEPLOYMENT.md` - Guía completa de deployment

---

## 🎉 ¡Listo!

Tu aplicación de networking para emprendedores está lista para usar.

**Próximos pasos sugeridos:**
1. Personalizar colores y branding
2. Agregar más validaciones
3. Implementar notificaciones
4. Agregar búsqueda y filtros
5. Implementar sistema de notificaciones push
6. Agregar analytics
