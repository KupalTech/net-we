import { useState } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
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

  if (!currentUser) {
    return <Navigate to="/login" />;
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
