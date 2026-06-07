import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Badge, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { BUSINESS_VERTICALS, COMPANY_ROLES } from '../utils/constants';
import { FaArrowLeft } from 'react-icons/fa';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    empresa: '',
    verticales: [],
    rol: '',
    bio: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        nombre: userProfile.nombre || '',
        apellido: userProfile.apellido || '',
        empresa: userProfile.empresa || '',
        verticales: userProfile.verticales || [],
        rol: userProfile.rol || '',
        bio: userProfile.bio || ''
      });
    }
  }, [userProfile]);

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

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        empresa: formData.empresa,
        verticales: formData.verticales,
        rol: formData.rol,
        bio: formData.bio,
        updatedAt: new Date().toISOString()
      });

      setMessage({ 
        type: 'success', 
        text: 'Perfil actualizado correctamente' 
      });

      setTimeout(() => {
        navigate('/perfil');
      }, 2000);
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      setMessage({ 
        type: 'danger', 
        text: 'Error al actualizar el perfil' 
      });
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <Container className="edit-profile-container py-4">
        <Row className="mb-3">
          <Col>
            <Button 
              variant="link" 
              onClick={() => navigate('/perfil')}
              className="p-0 text-dark"
            >
              <FaArrowLeft className="me-2" />
              Volver al Perfil
            </Button>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card className="edit-profile-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="edit-profile-title">Editar Perfil</h2>
                  <p className="text-muted">Actualiza tu información personal</p>
                </div>

                {message.text && (
                  <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                    {message.text}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
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
                      <option value="">Seleccione un rol...</option>
                      {COMPANY_ROLES.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.rol}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Bio */}
                  <Form.Group className="mb-4">
                    <Form.Label>Bio Breve (Opcional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Cuéntanos un poco sobre ti..."
                      maxLength={500}
                    />
                    <Form.Text className="text-muted">
                      {formData.bio.length}/500 caracteres
                    </Form.Text>
                  </Form.Group>

                  {/* Botones */}
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => navigate('/perfil')}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EditProfile;
