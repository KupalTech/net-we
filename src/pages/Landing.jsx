import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import banner from '../assets/xe-anuncio-net-we.png';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Container fluid className="landing-container">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6} className="banner-col">
          <img
            src={banner}
            alt="Experiencia Endeavor Patagonia - 20.08 Neuquén"
            className="landing-banner"
          />
        </Col>
      </Row>
      <Row className="align-items-center justify-content-center py-4">
        <Col xs={12} md={10} lg={8} xl={6}>
          <Row className="align-items-center">
            {/* Logo */}
            <Col xs={12} md={6} className="text-center mb-4 mb-md-0">
              <div className="logo-container">
                <img src={logo} alt="Net-we" className="logo-image" />
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
                Registrarme
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
