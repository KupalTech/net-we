import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';
import './Login.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('El email es requerido');
      return;
    }

    setLoading(true);
    await resetPassword(email.trim());
    setLoading(false);
    setSent(true);
  };

  return (
    <Container className="login-container">
      <Row className="min-vh-footer-safe align-items-center justify-content-center">
        <Col xs={12} md={6} lg={5} xl={4}>
          <div className="login-card">
            <div className="text-center mb-4">
              <img src={logo} alt="Net-we" className="login-logo" />
              <p className="text-muted">Recuperar contraseña</p>
            </div>

            {sent ? (
              <>
                <Alert variant="success">
                  Si <strong>{email}</strong> está registrado en Net-we, te enviamos un email con instrucciones para restablecer tu contraseña.
                </Alert>
                <div className="d-grid">
                  <Button variant="primary" onClick={() => navigate('/login')}>
                    Volver a Ingresar
                  </Button>
                </div>
              </>
            ) : (
              <Form onSubmit={handleSubmit}>
                <p className="text-muted small">
                  Ingresá el email con el que te registraste y te mandamos un link para crear una nueva contraseña.
                </p>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form.Group className="mb-4">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    autoFocus
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" size="lg" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar link de recuperación'}
                  </Button>
                  <Button variant="outline-secondary" onClick={() => navigate('/login')} disabled={loading}>
                    Volver
                  </Button>
                </div>
              </Form>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
