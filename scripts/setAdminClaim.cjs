// Asigna (o quita) el custom claim `admin` a un usuario, usado por las reglas de Firestore
// para el dashboard de métricas (reemplaza al campo `is_admin` del doc de `users`, que no
// sirve para las collectionGroup queries — ver AdminMetrics.jsx).
//
// Uso:
//   GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json" node scripts/setAdminClaim.cjs <uid>
//   GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json" node scripts/setAdminClaim.cjs <uid> --remove
//
// Después de correrlo, el usuario tiene que cerrar sesión y volver a entrar para que el
// claim se refleje en el cliente y en las reglas (el token viejo no lo tiene).
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const uid = process.argv[2];
const remove = process.argv.includes('--remove');

if (!uid) {
  console.error('Uso: node scripts/setAdminClaim.cjs <uid> [--remove]');
  process.exit(1);
}

initializeApp({
  credential: applicationDefault()
});

getAuth()
  .setCustomUserClaims(uid, remove ? { admin: null } : { admin: true })
  .then(() => {
    console.log(`Listo: uid ${uid} ahora tiene admin=${remove ? 'removido' : 'true'}.`);
  })
  .catch((err) => {
    console.error('Error asignando el claim:', err);
    process.exit(1);
  });
