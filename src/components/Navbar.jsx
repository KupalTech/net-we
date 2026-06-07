import { Navbar as BootstrapNavbar, Container, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { userProfile, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/perfil');
  };

  return (
    <BootstrapNavbar bg="white" className="shadow-sm navbar-custom">
      <Container fluid>
        <BootstrapNavbar.Brand className="navbar-brand-custom">
          Net-we
        </BootstrapNavbar.Brand>
        
        <div className="ms-auto">
          <Dropdown align="end">
            <Dropdown.Toggle 
              variant="link" 
              id="dropdown-user" 
              className="user-dropdown-toggle"
            >
              {userProfile?.avatar ? (
                <img 
                  src={userProfile.avatar} 
                  alt="Avatar" 
                  className="user-avatar"
                />
              ) : (
                <FaUserCircle size={40} className="text-primary" />
              )}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Header>
                <div className="fw-bold">
                  {userProfile?.nombre} {userProfile?.apellido}
                </div>
                <div className="text-muted small">{userProfile?.email}</div>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleProfile}>
                Ver Perfil
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                Cerrar Sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
