// Calcula las métricas de uso para un rango de fechas pasado (anterior a que existiera
// `lastMessageAt` en los chats) y las guarda en adminReports/{desde}_{hasta}, para que el
// dashboard de /admin/metricas las muestre directamente al elegir ese mismo rango exacto.
// Usa el Admin SDK porque necesita leer los mensajes de todos los chats sin la restricción
// que tiene Firestore para collectionGroup queries en el cliente.
//
// Uso (con `gcloud auth application-default login` ya hecho):
//   $env:GOOGLE_CLOUD_PROJECT = "tu-project-id"
//   node scripts/historicalReport.cjs 2026-08-20
//   node scripts/historicalReport.cjs 2026-08-01 2026-08-31
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const [, , startArg, endArg] = process.argv;
if (!startArg) {
  console.error('Uso: node scripts/historicalReport.cjs <desde YYYY-MM-DD> [hasta YYYY-MM-DD]');
  process.exit(1);
}
if (!process.env.GOOGLE_CLOUD_PROJECT) {
  console.error('Falta la variable GOOGLE_CLOUD_PROJECT con el ID del proyecto de Firebase.');
  process.exit(1);
}

const startDate = startArg;
const endDate = endArg || startArg;

initializeApp({
  credential: applicationDefault(),
  projectId: process.env.GOOGLE_CLOUD_PROJECT
});

const db = getFirestore();

const start = new Date(`${startDate}T00:00:00`);
const end = new Date(`${endDate}T23:59:59.999`);
const startISO = start.toISOString();
const endISO = end.toISOString();
const startMs = start.getTime();
const endMs = end.getTime();

async function run() {
  const usersSnap = await db.collection('users')
    .where('createdAt', '>=', startISO)
    .where('createdAt', '<=', endISO)
    .get();

  const verticalCounts = {};
  usersSnap.forEach((docSnap) => {
    (docSnap.data().verticales || []).forEach((vertical) => {
      verticalCounts[vertical] = (verticalCounts[vertical] || 0) + 1;
    });
  });
  const topVerticals = Object.entries(verticalCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([vertical, count]) => ({ vertical, count }));

  const matchesSentSnap = await db.collection('meetingRequests')
    .where('createdAt', '>=', startISO)
    .where('createdAt', '<=', endISO)
    .count()
    .get();

  const matchesAcceptedSnap = await db.collection('meetingRequests')
    .where('status', '==', 'accepted')
    .where('updatedAt', '>=', startISO)
    .where('updatedAt', '<=', endISO)
    .count()
    .get();

  // Recorre cada chat y se fija si tuvo al menos un mensaje dentro del rango (limit(1), no
  // hace falta traer todos los mensajes para saber si el chat estuvo activo ese día).
  const chatsSnap = await db.collection('chats').get();
  let openConversations = 0;
  for (const chatDoc of chatsSnap.docs) {
    const messagesSnap = await chatDoc.ref.collection('messages')
      .where('timestamp', '>=', startMs)
      .where('timestamp', '<=', endMs)
      .limit(1)
      .get();
    if (!messagesSnap.empty) openConversations++;
  }

  const report = {
    totalUsers: usersSnap.size,
    matchesSent: matchesSentSnap.data().count,
    matchesAccepted: matchesAcceptedSnap.data().count,
    openConversations,
    topVerticals
  };

  await db.collection('adminReports').doc(`${startDate}_${endDate}`).set(report);

  console.log(`Reporte del ${startDate} al ${endDate} (guardado en adminReports/${startDate}_${endDate})`);
  console.log('--------------------------------------');
  console.log(`Contactos logueados (usuarios registrados): ${report.totalUsers}`);
  console.log(`Match enviados: ${report.matchesSent}`);
  console.log(`Match aceptados: ${report.matchesAccepted}`);
  console.log(`Conversaciones abiertas: ${report.openConversations}`);
  console.log('Top 5 verticales:');
  if (topVerticals.length === 0) {
    console.log('  (sin usuarios registrados en el rango)');
  } else {
    topVerticals.forEach(({ vertical, count }) => console.log(`  ${vertical}: ${count}`));
  }
}

run().catch((err) => {
  console.error('Error generando el reporte histórico:', err);
  process.exit(1);
});
