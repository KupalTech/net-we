import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import TermsContent from '../components/TermsContent';
import './Terms.css';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <Container className="terms-container">
      <Row className="mb-3">
        <Col>
          <Button
            variant="link"
            onClick={() => navigate(-1)}
            className="p-0 text-dark"
          >
            <FaArrowLeft className="me-2" />
            Volver
          </Button>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="terms-card">
            <Card.Body>
              <h2 className="terms-title mb-1">Términos y Condiciones de Uso</h2>
              <TermsContent />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Terms;
