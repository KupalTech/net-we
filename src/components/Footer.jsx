import logoKupal from '../assets/logo-h-negro.png';
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
        <span className="footer-text">© {new Date().getFullYear()} | desarrollado por</span>
        <img src={logoKupal} alt="Kupal Tech" className="footer-logo" />
      </a>
    </footer>
  );
};

export default Footer;
