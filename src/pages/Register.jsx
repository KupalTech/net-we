import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Badge, Modal } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BUSINESS_VERTICALS, COMPANY_ROLES } from '../utils/constants';
import TermsContent from '../components/TermsContent';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    empresa: '',
    verticales: [],
    rol: '',
    bio: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [showTerms, setShowTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleVertical = (vertical) => {
    setFormData(prev => ({
      ...prev,
      verticales: prev.verticales.includes(vertical)
        ? prev.verticales.filter(v => v !== vertical)
        : [...prev.verticales, vertical]
    }));
    if (errors.verticales) {
      setErrors(prev => ({ ...prev, verticales: '' }));
    }
  };

  const removeVertical = (vertical) => {
    setFormData(prev => ({
      ...prev,
      verticales: prev.verticales.filter(v => v !== vertical)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }

    if (!formData.empresa.trim()) {
      newErrors.empresa = 'La empresa es requerida';
    }

    if (formData.verticales.length === 0) {
      newErrors.verticales = 'Debe seleccionar al menos una vertical de negocio';
    }

    if (!formData.rol) {
      newErrors.rol = 'Debe seleccionar un rol';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debe confirmar la contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debe aceptar los términos y condiciones';
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

    const userData = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      empresa: formData.empresa,
      verticales: formData.verticales,
      rol: formData.rol,
      bio: formData.bio
    };

    const result = await signup(formData.email, formData.password, userData);

    if (result.success) {
      setMessage({
        type: 'success',
        text: 'Usuario dado de alta correctamente. Te enviamos un email para verificar tu cuenta.'
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setMessage({ 
        type: 'danger', 
        text: 'El usuario no se pudo dar de alta' 
      });
    }

    setLoading(false);
  };

  return (
    <Container className="register-container">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <div className="register-card">
            <div className="text-center mb-4">
              <h2 className="register-title">Registro</h2>
              <p className="text-muted">Networking para emprendedores</p>
            </div>

            {message.text && (
              <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                {message.text}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              {/* Email */}
              <Form.Group className="mb-3">
                <Form.Label>Correo electrónico *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  placeholder="correo@tu-empresa.com"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Nombre y Apellido */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre *</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      isInvalid={!!errors.nombre}
                      placeholder="Nombre"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.nombre}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Apellido *</Form.Label>
                    <Form.Control
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      isInvalid={!!errors.apellido}
                      placeholder="Apellido"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.apellido}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* Empresa */}
              <Form.Group className="mb-3">
                <Form.Label>Empresa *</Form.Label>
                <Form.Control
                  type="text"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  isInvalid={!!errors.empresa}
                  placeholder="Mi Empresa S.A."
                />
                <Form.Control.Feedback type="invalid">
                  {errors.empresa}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Verticales de Negocio */}
              <Form.Group className="mb-3">
                <Form.Label>Vertical de Negocio * (seleccione una o más)</Form.Label>
                
                {/* Verticales seleccionadas */}
                {formData.verticales.length > 0 && (
                  <div className="mb-2">
                    {formData.verticales.map(vertical => (
                      <Badge 
                        key={vertical} 
                        bg="primary" 
                        className="me-2 mb-2 vertical-badge"
                        onClick={() => removeVertical(vertical)}
                        style={{ cursor: 'pointer' }}
                      >
                        {vertical} ×
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Lista de verticales */}
                <div className="verticals-container">
                  {BUSINESS_VERTICALS.map(vertical => (
                    <Badge
                      key={vertical}
                      bg={formData.verticales.includes(vertical) ? 'primary' : 'light'}
                      text={formData.verticales.includes(vertical) ? 'white' : 'dark'}
                      className="me-2 mb-2 vertical-option"
                      onClick={() => toggleVertical(vertical)}
                      style={{ cursor: 'pointer' }}
                    >
                      {vertical}
                    </Badge>
                  ))}
                </div>
                {errors.verticales && (
                  <div className="text-danger small mt-1">{errors.verticales}</div>
                )}
              </Form.Group>

              {/* Rol */}
              <Form.Group className="mb-3">
                <Form.Label>Rol dentro de la empresa *</Form.Label>
                <Form.Select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  isInvalid={!!errors.rol}
                >
                  <option value="">Seleccionar</option>
                  {COMPANY_ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.rol}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Bio */}
              <Form.Group className="mb-3">
                <Form.Label>Bio (opcional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Ej: Co-fundadora de una fintech, buscando partners tecnológicos y capital semilla."
                  maxLength={500}
                />
                <Form.Text className="text-muted">
                  {formData.bio.length}/500 caracteres
                </Form.Text>
              </Form.Group>

              {/* Password */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña *</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      placeholder="Mínimo 8 caracteres"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirmar Contraseña *</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      isInvalid={!!errors.confirmPassword}
                      placeholder="Repite tu contraseña"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* Términos y Condiciones */}
              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  isInvalid={!!errors.acceptTerms}
                  label={
                    <span>
                      Acepto los{' '}
                      <a href="#" onClick={(e) => { e.preventDefault(); setShowTerms(true); }}>
                        Términos y Condiciones
                      </a>
                    </span>
                  }
                  feedback={errors.acceptTerms}
                  feedbackType="invalid"
                />
              </Form.Group>

              {/* Botones */}
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  type="submit" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Registrando...' : 'Registrarse'}
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
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login">Inicia sesión aquí</Link>
                </p>
              </div>
            </Form>
          </div>
        </Col>
      </Row>

      <Modal show={showTerms} onHide={() => setShowTerms(false)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Términos y Condiciones de Uso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TermsContent />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowTerms(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Register;
