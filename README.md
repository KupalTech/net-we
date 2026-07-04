# Net-we - Plataforma de Networking para Emprendedores

## Descripción
Aplicación web responsive para facilitar el contacto y networking entre emprendedores.

## Stack Tecnológico
- **Frontend**: React + Vite
- **Estilos**: Bootstrap 5 + React Bootstrap
- **Backend**: Firebase (Authentication, Firestore)
- **Hosting**: Vercel

## Características Principales
- ✅ Registro y autenticación de usuarios
- ✅ Perfil de usuario con verticales de negocio y roles
- ✅ Sistema de solicitudes de reunión
- ✅ Chat en tiempo real entre usuarios contactados
- ✅ Estados de contacto (Sin Contacto, Solicitud Enviada, Contactado)
- ✅ Diseño responsive

## Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Firebase
1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Authentication (Email/Password)
3. Crear una base de datos Firestore
4. Copiar las credenciales de configuración

### 3. Variables de entorno
Copiar `.env.example` a `.env` y completar con las credenciales de Firebase:
```bash
cp .env.example .env
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

### 5. Build para producción
```bash
npm run build
```

## Deployment en Vercel

1. Instalar Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Configurar las variables de entorno en el dashboard de Vercel

## Estructura del Proyecto
```
net-we/
├── src/
│   ├── components/       # Componentes reutilizables
│   ├── pages/           # Páginas principales
│   ├── contexts/        # Context API para estado global
│   ├── firebase/        # Configuración de Firebase
│   ├── utils/           # Utilidades y constantes
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Punto de entrada
├── public/              # Archivos estáticos
└── index.html          # HTML principal
```

## Casos de Uso

### 1. Registro de Usuario
- Formulario completo con validaciones
- Selección múltiple de verticales de negocio
- Selección de rol en la empresa
- Aceptación de términos y condiciones

### 2. Login
- Autenticación con email y password
- Validación de credenciales

### 3. Dashboard Principal
- Grilla de usuarios registrados
- Filtrado por estado de contacto
- Acciones: Solicitar Reunión, Ver Perfil, Chat

### 4. Solicitudes de Reunión
- Envío de solicitudes
- Aprobación/Rechazo de solicitudes
- Actualización de estados

### 5. Chat
- Mensajería en tiempo real
- Disponible solo para usuarios contactados

## Licencia
Privado - KupalTech © 2026
