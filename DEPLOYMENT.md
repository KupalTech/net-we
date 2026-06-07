# Guía de Deployment en Vercel

## Opción 1: Deploy desde GitHub (Recomendado)

### Paso 1: Subir el proyecto a GitHub

```bash
# Inicializar repositorio Git
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "Initial commit - Net-we MVP"

# Crear repositorio en GitHub y conectarlo
git remote add origin https://github.com/tu-usuario/net-we.git
git branch -M main
git push -u origin main
```

### Paso 2: Importar en Vercel

1. Ve a [Vercel](https://vercel.com)
2. Haz clic en "Add New Project"
3. Importa tu repositorio de GitHub
4. Configura el proyecto:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Paso 3: Configurar Variables de Entorno

En la configuración del proyecto en Vercel, agrega las siguientes variables de entorno:

```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_DATABASE_URL=https://tu_proyecto.firebaseio.com
```

### Paso 4: Deploy

1. Haz clic en "Deploy"
2. Espera a que se complete el build
3. Tu aplicación estará disponible en `https://tu-proyecto.vercel.app`

### Paso 5: Configurar Dominio Personalizado (Opcional)

1. En el dashboard de Vercel, ve a "Settings > Domains"
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar los DNS

## Opción 2: Deploy con Vercel CLI

### Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Paso 2: Login en Vercel

```bash
vercel login
```

### Paso 3: Deploy

```bash
# Desde la raíz del proyecto
vercel

# Para producción
vercel --prod
```

### Paso 4: Configurar Variables de Entorno

```bash
# Agregar variables de entorno una por una
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
vercel env add VITE_FIREBASE_DATABASE_URL
```

## Configuración de Firebase para Producción

### Actualizar dominios autorizados

1. Ve a Firebase Console > Authentication > Settings
2. En "Authorized domains", agrega:
   - `tu-proyecto.vercel.app`
   - Tu dominio personalizado (si lo tienes)

### Actualizar reglas de seguridad

Asegúrate de cambiar las reglas de Firestore y Realtime Database del modo de prueba al modo de producción (ver `FIREBASE_SETUP.md`).

## Verificación Post-Deployment

1. **Prueba de Registro**: Intenta crear un nuevo usuario
2. **Prueba de Login**: Inicia sesión con el usuario creado
3. **Prueba de Dashboard**: Verifica que se carguen los usuarios
4. **Prueba de Solicitud**: Envía una solicitud de reunión
5. **Prueba de Chat**: Envía mensajes entre usuarios contactados
6. **Prueba de Perfil**: Visualiza perfiles de usuario

## Comandos Útiles de Vercel

```bash
# Ver logs de deployment
vercel logs

# Ver lista de deployments
vercel ls

# Remover deployment
vercel rm [deployment-url]

# Ver información del proyecto
vercel inspect

# Abrir dashboard del proyecto
vercel dashboard
```

## Actualización Continua

### Deploy Automático

Si conectaste con GitHub, cada push a la rama `main` desplegará automáticamente:

```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

### Preview Deployments

Cada pull request creará un deployment de preview automáticamente.

## Monitoreo y Analytics

### Habilitar Analytics en Vercel

1. Ve a Settings > Analytics
2. Habilita Vercel Analytics
3. Agrega el script en tu aplicación (opcional)

### Habilitar Analytics en Firebase

1. Ve a Firebase Console > Analytics
2. Habilita Google Analytics
3. Configura las propiedades

## Troubleshooting

### Error: "Build failed"
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que el build funcione localmente: `npm run build`

### Error: "Environment variables not found"
- Verifica que las variables de entorno estén configuradas en Vercel
- Asegúrate de que tengan el prefijo `VITE_`

### Error: "404 on page reload"
- Verifica que `vercel.json` esté configurado correctamente
- Las rutas deben redirigir a `index.html`

### Error: "Firebase configuration not found"
- Verifica que las variables de entorno estén disponibles en el build
- Usa `console.log(import.meta.env)` para debuggear

## Rollback

Si necesitas volver a una versión anterior:

```bash
# Listar deployments
vercel ls

# Promover un deployment anterior a producción
vercel promote [deployment-url]
```

## Límites del Plan Gratuito de Vercel

- **Bandwidth**: 100 GB/mes
- **Builds**: 6000 minutos/mes
- **Serverless Functions**: 100 GB-Hrs
- **Edge Middleware**: 100,000 invocaciones/día

Para proyectos más grandes, considera el plan Pro.

## Optimizaciones

### Build Optimization

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/database']
        }
      }
    }
  }
})
```

### Caching

Vercel automáticamente cachea los assets estáticos. Para optimizar:

1. Usa nombres de archivo con hash (Vite lo hace por defecto)
2. Configura headers de cache en `vercel.json` si es necesario

## Soporte

- [Documentación de Vercel](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Soporte de Vercel](https://vercel.com/support)
