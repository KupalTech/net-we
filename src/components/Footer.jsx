import logoKupal from '../assets/logo-h-azul.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <a
        href="https://www.instagram.com/kupaltech?igsh=d3YyeXJseGtueWh2"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-link"
      >
        <img src={logoKupal} alt="Kupal Tech" className="footer-logo" />
      </a>
    </footer>
  );
};

export default Footer;
