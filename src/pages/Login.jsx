import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setMessage({ 
        type: 'danger', 
        text: 'Mail y/o password incorrecto. Por favor intente nuevamente' 
      });
    }

    setLoading(false);
  };

  return (
    <Container className="login-container">
      <Row className="min-vh-100 align-items-center justify-content-center">
        <Col xs={12} md={6} lg={5} xl={4}>
          <div className="login-card">
            <div className="text-center mb-4">
              <h2 className="login-title">Net-we</h2>
              <p className="text-muted">Inicia sesión en tu cuenta</p>
            </div>

            {message.text && (
              <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                {message.text}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  placeholder="tu@email.com"
                  autoFocus
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  placeholder="Tu contraseña"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  type="submit" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Ingresando...' : 'Ingresar'}
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate('/')}
                  disabled={loading}
                >
                  Volver
                </Button>
              </div>

              <div className="text-center mt-3">
                <p className="text-muted">
                  ¿No tienes cuenta?{' '}
                  <Link to="/registro">Regístrate aquí</Link>
                </p>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
