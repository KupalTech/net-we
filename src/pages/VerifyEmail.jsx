import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEnvelopeOpenText } from 'react-icons/fa';
import './Login.css';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { currentUser, emailVerified, logout, resendVerificationEmail, refreshEmailVerification } = useAuth();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [tokenReady, setTokenReady] = useState(false);
  const [verifiedInBackground, setVerifiedInBackground] = useState(false);

  // Al llegar acá (por ejemplo desde el link del mail, con la sesión recién restaurada)
  // el estado "emailVerified" puede venir desactualizado: forzamos releerlo de verdad
  // antes de decidir si corresponde pasar al Dashboard.
  useEffect(() => {
    const sync = async () => {
      if (currentUser) {
        await refreshEmailVerification();
      }
      setTokenReady(true);
    };
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // El link del mail suele abrir en otra pestaña: esta pestaña original se queda esperando.
  // Reintentamos solos cada pocos segundos para detectar la verificación sin que el usuario
  // tenga que volver acá y apretar un botón. Si la detección viene de este chequeo automático
  // (no de un click manual), no mandamos derecho al Dashboard: mostramos un aviso para cerrar
  // esta pestaña, ya que la verificación real ya se está continuando en la otra.
  useEffect(() => {
    if (!tokenReady || emailVerified) return;

    const interval = setInterval(async () => {
      const nowVerified = await refreshEmailVerification();
      if (nowVerified) {
        setVerifiedInBackground(true);
      }
    }, 4000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenReady, emailVerified]);

  // Intento silencioso de cerrar la pestaña sola. Los navegadores solo lo permiten si la
  // pestaña fue abierta por script, así que en la mayoría de los casos no va a hacer nada
  // visible; el mensaje en pantalla queda como respaldo para que el usuario la cierre a mano.
  useEffect(() => {
    if (emailVerified && verifiedInBackground) {
      try {
        window.close();
      } catch {
        // ignorar: el navegador no lo permite, no hay nada más para hacer
      }
    }
  }, [emailVerified, verifiedInBackground]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!tokenReady) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (emailVerified && verifiedInBackground) {
    return (
      <Container className="login-container">
        <Row className="min-vh-footer-safe align-items-center justify-content-center">
          <Col xs={12} md={6} lg={5} xl={4}>
            <div className="login-card text-center">
              <FaEnvelopeOpenText size={48} className="mb-3 text-success" />
              <h2 className="login-title" style={{ fontSize: '1.75rem' }}>¡Listo!</h2>
              <p className="text-muted">
                Ya verificaste tu email y continuaste desde la otra pestaña.
                Podés cerrar esta pestaña, ya no hace falta.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  if (emailVerified) {
    return <Navigate to="/dashboard" />;
  }

  const handleCheck = async () => {
    setMessage({ type: '', text: '' });
    setChecking(true);
    await refreshEmailVerification();
    setChecking(false);
    setMessage({
      type: 'warning',
      text: 'Todavía no verificamos tu email. Revisá tu bandeja de entrada (y la carpeta de spam) y volvé a intentar.'
    });
  };

  const handleResend = async () => {
    setMessage({ type: '', text: '' });
    setResending(true);
    const result = await resendVerificationEmail();
    setResending(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Te reenviamos el email de verificación.' });
    } else {
      setMessage({
        type: 'danger',
        text: 'No pudimos reenviar el email. Esperá unos minutos e intentá de nuevo.'
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Container className="login-container">
      <Row className="min-vh-footer-safe align-items-center justify-content-center">
        <Col xs={12} md={6} lg={5} xl={4}>
          <div className="login-card text-center">
            <FaEnvelopeOpenText size={48} className="mb-3 text-primary" />
            <h2 className="login-title" style={{ fontSize: '1.75rem' }}>Verificá tu email</h2>
            <p className="text-muted">
              Te enviamos un link de confirmación a <strong>{currentUser.email}</strong>.
              Hacé clic en el link y después volvé acá.
            </p>

            {message.text && (
              <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                {message.text}
              </Alert>
            )}

            <div className="d-grid gap-2 mt-3">
              <Button variant="primary" onClick={handleCheck} disabled={checking}>
                {checking ? 'Comprobando...' : 'Ya verifiqué, continuar'}
              </Button>
              <Button variant="outline-secondary" onClick={handleResend} disabled={resending}>
                {resending ? 'Enviando...' : 'Reenviar email'}
              </Button>
              <Button variant="link" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyEmail;
