# Guía de Configuración de Firebase

## Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Ingresa el nombre del proyecto: **net-we**
4. Acepta los términos y crea el proyecto

## Paso 2: Configurar Authentication

1. En el menú lateral, ve a **Build > Authentication**
2. Haz clic en "Comenzar"
3. Habilita el proveedor **Email/Password**
4. Guarda los cambios

## Paso 3: Crear Firestore Database

1. En el menú lateral, ve a **Build > Firestore Database**
2. Haz clic en "Crear base de datos"
3. Selecciona el modo de inicio:
   - **Modo de prueba** (para desarrollo)
   - **Modo de producción** (para producción con reglas de seguridad)
4. Selecciona la ubicación (preferiblemente cercana a tus usuarios)
5. Haz clic en "Habilitar"

### Reglas de Seguridad de Firestore (Modo Producción)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios: solo lectura pública, escritura propia
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Contactos: solo el propietario puede leer/escribir
    match /contacts/{contactId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Solicitudes de reunión: lectura para involucrados, escritura controlada
    match /meetingRequests/{requestId} {
      allow read: if request.auth != null && 
        (resource.data.senderId == request.auth.uid || 
         resource.data.receiverId == request.auth.uid);
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        resource.data.receiverId == request.auth.uid;
    }
    
    // Chats: solo participantes pueden leer/escribir
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
  }
}
```

## Paso 4: Crear Realtime Database

1. En el menú lateral, ve a **Build > Realtime Database**
2. Haz clic en "Crear base de datos"
3. Selecciona la ubicación
4. Selecciona el modo de inicio:
   - **Modo de prueba** (para desarrollo)
   - **Modo bloqueado** (para producción con reglas de seguridad)
5. Haz clic en "Habilitar"

### Reglas de Seguridad de Realtime Database (Modo Producción)

```json
{
  "rules": {
    "chats": {
      "$chatId": {
        ".read": "auth != null",
        ".write": "auth != null",
        "messages": {
          "$messageId": {
            ".validate": "newData.hasChildren(['text', 'senderId', 'senderName', 'timestamp'])"
          }
        }
      }
    }
  }
}
```

## Paso 5: Obtener Credenciales de Configuración

1. En el menú lateral, ve a **Configuración del proyecto** (ícono de engranaje)
2. En la sección "Tus apps", haz clic en el ícono **</>** (Web)
3. Registra la app con un nombre (ej: "net-we-web")
4. **NO** marques "También configurar Firebase Hosting"
5. Haz clic en "Registrar app"
6. Copia las credenciales que aparecen en `firebaseConfig`

## Paso 6: Configurar Variables de Entorno

1. En la raíz del proyecto, crea un archivo `.env`
2. Copia el contenido de `.env.example`
3. Reemplaza los valores con las credenciales de Firebase:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_DATABASE_URL=https://tu_proyecto.firebaseio.com
```

## Paso 7: Estructura de Datos en Firestore

### Colección: `users`
```javascript
{
  uid: "user_id",
  email: "usuario@email.com",
  nombre: "Juan",
  apellido: "Pérez",
  empresa: "Mi Empresa",
  verticales: ["Fintech", "SaaS"],
  rol: "CEO",
  bio: "Descripción breve...",
  avatar: "url_del_avatar",
  createdAt: "2026-06-06T18:00:00.000Z"
}
```

### Colección: `contacts`
```javascript
{
  userId: "user_id_1",
  contactId: "user_id_2",
  status: "Contactado", // "Sin Contacto" | "Solicitud Enviada" | "Contactado"
  updatedAt: "2026-06-06T18:00:00.000Z"
}
```

### Colección: `meetingRequests`
```javascript
{
  senderId: "user_id_1",
  receiverId: "user_id_2",
  status: "pending", // "pending" | "accepted" | "rejected"
  createdAt: "2026-06-06T18:00:00.000Z",
  updatedAt: "2026-06-06T18:00:00.000Z"
}
```

### Colección: `chats`
```javascript
{
  participants: ["user_id_1", "user_id_2"],
  createdAt: "2026-06-06T18:00:00.000Z",
  lastMessage: null
}
```

## Paso 8: Estructura de Datos en Realtime Database

```
chats/
  {chatId}/
    messages/
      {messageId}/
        text: "Mensaje..."
        senderId: "user_id"
        senderName: "Juan Pérez"
        timestamp: 1717707600000
```

## Notas Importantes

- **Seguridad**: En producción, asegúrate de configurar las reglas de seguridad apropiadas
- **Índices**: Firebase puede sugerir crear índices compuestos para consultas complejas
- **Límites**: Ten en cuenta los límites del plan gratuito de Firebase
- **Backup**: Considera configurar backups automáticos para Firestore

## Verificación

Para verificar que todo está configurado correctamente:

1. Ejecuta `npm install`
2. Ejecuta `npm run dev`
3. Intenta registrar un usuario
4. Verifica en Firebase Console que:
   - El usuario aparece en Authentication
   - El documento del usuario aparece en Firestore > users
   - Las colecciones se crean automáticamente al usarlas

## Troubleshooting

### Error: "Firebase: Error (auth/configuration-not-found)"
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que el archivo `.env` esté en la raíz del proyecto

### Error: "Missing or insufficient permissions"
- Revisa las reglas de seguridad de Firestore
- En desarrollo, puedes usar modo de prueba temporalmente

### Error: "PERMISSION_DENIED: Permission denied"
- Revisa las reglas de seguridad de Realtime Database
- Asegúrate de que el usuario esté autenticado
