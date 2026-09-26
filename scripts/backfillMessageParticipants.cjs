// Backfill único: agrega el campo `participants` a los mensajes ya existentes
// (los nuevos ya lo incluyen desde Chat.jsx). Necesario porque la regla de lectura
// de `messages` no puede usar get() al chat padre para poder habilitar collectionGroup
// queries, así que los mensajes viejos sin este campo quedarían inaccesibles.
//
// Uso:
//   GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json" node scripts/backfillMessageParticipants.cjs --dry-run
//   GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json" node scripts/backfillMessageParticipants.cjs
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const dryRun = process.argv.includes('--dry-run');

initializeApp({
  credential: applicationDefault()
});

const db = getFirestore();

async function backfill() {
  const chatsSnap = await db.collection('chats').get();
  console.log(`Chats encontrados: ${chatsSnap.size}`);

  let updatedMessages = 0;
  let skippedMessages = 0;
  let skippedChats = 0;

  for (const chatDoc of chatsSnap.docs) {
    const { participants } = chatDoc.data();
    if (!Array.isArray(participants) || participants.length !== 2) {
      console.warn(`Chat ${chatDoc.id} sin participants válidos, se omite.`);
      skippedChats++;
      continue;
    }

    const messagesSnap = await chatDoc.ref.collection('messages').get();
    let batch = db.batch();
    let opsInBatch = 0;

    for (const messageDoc of messagesSnap.docs) {
      if (messageDoc.data().participants) {
        skippedMessages++;
        continue;
      }

      updatedMessages++;
      if (dryRun) continue;

      batch.update(messageDoc.ref, { participants });
      opsInBatch++;

      if (opsInBatch === 400) {
        await batch.commit();
        batch = db.batch();
        opsInBatch = 0;
      }
    }

    if (opsInBatch > 0) {
      await batch.commit();
    }
  }

  console.log(
    `${dryRun ? '[DRY RUN] ' : ''}Mensajes a actualizar: ${updatedMessages}. ` +
    `Ya tenían el campo: ${skippedMessages}. Chats omitidos: ${skippedChats}.`
  );
}

backfill().catch((err) => {
  console.error('Error en el backfill:', err);
  process.exit(1);
});
