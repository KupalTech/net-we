# Agregar un usuario admin

El dashboard de métricas (`/admin/metricas`) se habilita con un custom claim `admin` en el
token de Firebase Auth del usuario (no es un campo en Firestore). Para asignarlo:

## 1. Autenticarte con gcloud (solo la primera vez en esta máquina)

```powershell
gcloud auth application-default login
gcloud auth application-default set-quota-project TU_PROJECT_ID
```

`TU_PROJECT_ID` es el ID del proyecto de Firebase (Firebase Console → ⚙️ Configuración del
proyecto → "ID del proyecto"), no el nombre visible.

## 2. Conseguir el UID del usuario a hacer admin

Firebase Console → Authentication → buscá el usuario en la tabla → columna "User UID".

## 3. Asignar el claim

En la raíz del proyecto, en PowerShell:

```powershell
$env:GOOGLE_CLOUD_PROJECT = "TU_PROJECT_ID"
node scripts/setAdminClaim.cjs UID_DEL_USUARIO
```

Tiene que imprimir `Listo: uid ... ahora tiene admin=true`.

Para sacarle el rol de admin a alguien:

```powershell
node scripts/setAdminClaim.cjs UID_DEL_USUARIO --remove
```

## 4. Que el usuario cierre sesión y vuelva a entrar

El token viejo no tiene el claim nuevo — hasta que no se loguea de nuevo (o pasa un buen
rato y Firebase lo refresca solo), no va a ver la opción "Métricas" en el menú.

---

# Reporte histórico de una fecha pasada

Para fechas anteriores al deploy de `lastMessageAt` (o cualquier fecha vieja que quieras
consultar), el dashboard en vivo no tiene el dato — hay que precalcularlo una vez:

```powershell
$env:GOOGLE_CLOUD_PROJECT = "TU_PROJECT_ID"
node scripts/historicalReport.cjs 2026-08-20
```

Esto guarda el resultado en Firestore (`adminReports/2026-08-20_2026-08-20`), y el dashboard
lo va a mostrar automáticamente si elegís ese mismo rango de fechas exacto.
