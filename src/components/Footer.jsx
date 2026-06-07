import { Container } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <Container fluid>
        <div className="text-center py-3">
          <p className="mb-0 footer-text">
            Desarrollado por{' '}
            <a 
              href="https://www.instagram.com/kupaltech?igsh=d3YyeXJseGtueWh2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              Kupal
            </a>
            {' '}© {new Date().getFullYear()}
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
