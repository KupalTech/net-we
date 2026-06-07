import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Container fluid className="landing-container">
      <Row className="min-vh-100 align-items-center justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6}>
          <Row className="align-items-center">
            {/* Logo */}
            <Col xs={12} md={6} className="text-center mb-4 mb-md-0">
              <div className="logo-container">
                <h1 className="logo-text">Net-we</h1>
                <p className="logo-subtitle">Networking para Emprendedores</p>
              </div>
            </Col>

            {/* Botones */}
            <Col xs={12} md={6} className="d-flex flex-column align-items-center gap-3">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-75 action-button"
                onClick={() => navigate('/registro')}
              >
                Registrarse
              </Button>
              <Button 
                variant="outline-primary" 
                size="lg" 
                className="w-75 action-button"
                onClick={() => navigate('/login')}
              >
                Ingresar
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Landing;
