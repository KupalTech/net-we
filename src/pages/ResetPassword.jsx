import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, InputGroup, Spinner } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../assets/logo.png';
import './Login.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode');
  const { verifyResetCode, confirmReset } = useAuth();

  const [checking, setChecking] = useState(true);
  const [validCode, setValidCode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const check = async () => {
      if (!oobCode) {
        setChecking(false);
        return;
      }

      // Si ya usamos este link con éxito en esta misma sesión del navegador, no hace
      // falta re-validarlo contra Firebase (un link de reset es de un solo uso, y ya se usó)
      if (sessionStorage.getItem(`resetCode_used_${oobCode}`) === 'true') {
        setValidCode(true);
        setDone(true);
        setChecking(false);
        return;
      }

      const result = await verifyResetCode(oobCode);
      if (result.success) {
        setEmail(result.email);
        setValidCode(true);
      }
      setChecking(false);
    };
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oobCode]);

  const validate = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validate()) return;

    setLoading(true);
    const result = await confirmReset(oobCode, password);
    setLoading(false);

    if (result.success) {
      sessionStorage.setItem(`resetCode_used_${oobCode}`, 'true');
      setDone(true);
    } else {
      setMessage({
        type: 'danger',
        text: 'No pudimos actualizar tu contraseña. El link puede haber expirado, pedí uno nuevo.'
      });
    }
  };

  if (checking) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="login-container">
      <Row className="min-vh-footer-safe align-items-center justify-content-center">
        <Col xs={12} md={6} lg={5} xl={4}>
          <div className="login-card">
            <div className="text-center mb-4">
              <img src={logo} alt="Net-we" className="login-logo" />
              <p className="text-muted">Restablecer contraseña</p>
            </div>

            {!oobCode ? (
              <>
                <Alert variant="success">
                  Ya podés ingresar a Net-we con tu nueva contraseña.
                </Alert>
                <div className="d-grid gap-2">
                  <Button variant="primary" onClick={() => navigate('/login')}>
                    Ir a Ingresar
                  </Button>
                  <Button variant="outline-secondary" onClick={() => navigate('/')}>
                    Volver al inicio
                  </Button>
                </div>
              </>
            ) : !validCode ? (
              <>
                <Alert variant="danger">
                  Este link no es válido o ya expiró. Pedí uno nuevo desde "¿Olvidaste tu contraseña?" en la pantalla de ingreso.
                </Alert>
                <div className="d-grid">
                  <Button variant="primary" onClick={() => navigate('/olvide-password')}>
                    Pedir un nuevo link
                  </Button>
                </div>
              </>
            ) : done ? (
              <>
                <Alert variant="success">
                  Tu contraseña se actualizó correctamente.
                </Alert>
                <div className="d-grid">
                  <Button variant="primary" onClick={() => navigate('/login')}>
                    Ir a Ingresar
                  </Button>
                </div>
              </>
            ) : (
              <Form onSubmit={handleSubmit}>
                <p className="text-muted small">
                  Creá una nueva contraseña para <strong>{email}</strong>.
                </p>

                {message.text && <Alert variant={message.type}>{message.text}</Alert>}

                <Form.Group className="mb-3">
                  <Form.Label>Nueva contraseña</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      isInvalid={!!errors.password}
                      placeholder="Mínimo 8 caracteres"
                    />
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={() => setShowPassword((p) => !p)}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      isInvalid={!!errors.confirmPassword}
                      placeholder="Repetí tu contraseña"
                    />
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit" size="lg" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
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

export default ResetPassword;
