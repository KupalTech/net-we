import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Spinner, Alert } from 'react-bootstrap';
import { collection, collectionGroup, query, where, getDocs, getCountFromServer } from 'firebase/firestore';
import { db } from '../firebase/config';
import Navbar from '../components/Navbar';
import { REQUEST_STATUS } from '../utils/constants';
import './AdminMetrics.css';

const todayStr = () => new Date().toISOString().slice(0, 10);

const firstDayOfMonthStr = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
};

// createdAt/updatedAt se guardan como ISO en UTC, y timestamp de mensajes como epoch ms.
// El rango elegido es en horario local, así que armamos los límites en ambos formatos.
const getRangeBounds = (startDate, endDate) => {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T23:59:59.999`);
  return {
    startISO: start.toISOString(),
    endISO: end.toISOString(),
    startMs: start.getTime(),
    endMs: end.getTime()
  };
};

const AdminMetrics = () => {
  const [startDate, setStartDate] = useState(firstDayOfMonthStr());
  const [endDate, setEndDate] = useState(todayStr());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState(null);

  const runReport = async () => {
    if (!startDate || !endDate || startDate > endDate) {
      setError('Elegí un rango de fechas válido.');
      return;
    }

    setLoading(true);
    setError('');

    const { startISO, endISO, startMs, endMs } = getRangeBounds(startDate, endDate);

    // Cada consulta se ejecuta por separado y logueada con su propia etiqueta,
    // para poder identificar en la consola cuál falla (permiso o índice faltante).
    const runStep = async (label, fn) => {
      try {
        return await fn();
      } catch (err) {
        console.error(`Error en el paso "${label}":`, err);
        throw new Error(`Falló el paso "${label}": ${err.message}`);
      }
    };

    try {
      const usersSnap = await runStep('usuarios registrados', () =>
        getDocs(
          query(
            collection(db, 'users'),
            where('createdAt', '>=', startISO),
            where('createdAt', '<=', endISO)
          )
        )
      );

      const verticalCounts = {};
      usersSnap.forEach((docSnap) => {
        const verticales = docSnap.data().verticales || [];
        verticales.forEach((vertical) => {
          verticalCounts[vertical] = (verticalCounts[vertical] || 0) + 1;
        });
      });

      const topVerticals = Object.entries(verticalCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      const matchesSentSnap = await runStep('match enviados', () =>
        getCountFromServer(
          query(
            collection(db, 'meetingRequests'),
            where('createdAt', '>=', startISO),
            where('createdAt', '<=', endISO)
          )
        )
      );

      const matchesAcceptedSnap = await runStep('match aceptados', () =>
        getCountFromServer(
          query(
            collection(db, 'meetingRequests'),
            where('status', '==', REQUEST_STATUS.ACCEPTED),
            where('updatedAt', '>=', startISO),
            where('updatedAt', '<=', endISO)
          )
        )
      );

      // Una conversación cuenta como "abierta" si tuvo al menos un mensaje dentro del rango.
      const messagesSnap = await runStep('conversaciones abiertas', () =>
        getDocs(
          query(
            collectionGroup(db, 'messages'),
            where('timestamp', '>=', startMs),
            where('timestamp', '<=', endMs)
          )
        )
      );

      const activeChatIds = new Set();
      messagesSnap.forEach((docSnap) => {
        activeChatIds.add(docSnap.ref.parent.parent.id);
      });

      setMetrics({
        totalUsers: usersSnap.size,
        matchesSent: matchesSentSnap.data().count,
        matchesAccepted: matchesAcceptedSnap.data().count,
        openConversations: activeChatIds.size,
        topVerticals
      });
    } catch (err) {
      console.error('Error generando el reporte:', err);
      setError(`${err.message} — si es la primera vez, puede que falte crear un índice en Firestore: revisá la consola del navegador (F12), el error trae un link para crearlo automáticamente.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container fluid className="admin-metrics-container">
        <Row className="mb-4">
          <Col>
            <h2 className="dashboard-title">Métricas de uso</h2>
            <p className="text-muted">Reporte de actividad de la plataforma por rango de fechas</p>
          </Col>
        </Row>

        <Card className="filter-card mb-4">
          <Card.Body>
            <Row className="align-items-end g-3">
              <Col xs={12} md={4}>
                <Form.Label>Desde</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Col>
              <Col xs={12} md={4}>
                <Form.Label>Hasta</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Col>
              <Col xs={12} md={4}>
                <Button variant="primary" onClick={runReport} disabled={loading} className="w-100">
                  {loading ? <Spinner size="sm" animation="border" /> : 'Generar reporte'}
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {error && <Alert variant="danger">{error}</Alert>}

        {metrics && (
          <>
            <Row className="g-3 mb-4">
              <Col xs={6} md={3}>
                <Card className="metric-card">
                  <Card.Body>
                    <div className="metric-value">{metrics.totalUsers}</div>
                    <div className="metric-label">Contactos logueados</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="metric-card">
                  <Card.Body>
                    <div className="metric-value">{metrics.matchesSent}</div>
                    <div className="metric-label">Match enviados</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="metric-card">
                  <Card.Body>
                    <div className="metric-value">{metrics.matchesAccepted}</div>
                    <div className="metric-label">Match aceptados</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="metric-card">
                  <Card.Body>
                    <div className="metric-value">{metrics.openConversations}</div>
                    <div className="metric-label">Conversaciones abiertas</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card>
              <Card.Body>
                <h5 className="section-heading">Top 5 verticales de negocio</h5>
                {metrics.topVerticals.length === 0 ? (
                  <p className="text-muted mb-0">No hay usuarios registrados en ese rango.</p>
                ) : (
                  <Table hover className="mb-0">
                    <thead>
                      <tr>
                        <th>Vertical</th>
                        <th>Usuarios</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.topVerticals.map(([vertical, count]) => (
                        <tr key={vertical}>
                          <td>{vertical}</td>
                          <td>{count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </>
        )}
      </Container>
    </>
  );
};

export default AdminMetrics;
