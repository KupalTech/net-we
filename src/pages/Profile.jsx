import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaArrowLeft, FaBuilding, FaBriefcase, FaEnvelope, FaEdit } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile: currentUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Si no hay userId en params, mostrar perfil del usuario actual
  const isOwnProfile = !userId || userId === currentUser?.uid;
  const profileId = isOwnProfile ? currentUser?.uid : userId;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (isOwnProfile && currentUserProfile) {
          setProfile(currentUserProfile);
          setLoading(false);
        } else if (profileId) {
          const userDoc = await getDoc(doc(db, 'users', profileId));
          if (userDoc.exists()) {
            setProfile(userDoc.data());
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error cargando perfil:', error);
        setLoading(false);
      }
    };

    loadProfile();
  }, [profileId, isOwnProfile, currentUserProfile]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="text-center mt-5">
          <p>Cargando perfil...</p>
        </Container>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <Container className="text-center mt-5">
          <p>Perfil no encontrado</p>
          <Button onClick={() => navigate('/dashboard')}>
            Volver al Dashboard
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="profile-container">
        <Row className="mb-3">
          <Col>
            <Button 
              variant="link" 
              onClick={() => navigate('/dashboard')}
              className="p-0 text-dark"
            >
              <FaArrowLeft className="me-2" />
              Volver al Dashboard
            </Button>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card className="profile-card">
              <Card.Body>
                {/* Header del perfil */}
                <div className="text-center mb-4">
                  <img 
                    src={profile.avatar} 
                    alt="Avatar" 
                    className="profile-avatar mb-3"
                  />
                  <h2 className="profile-name">
                    {profile.nombre} {profile.apellido}
                  </h2>
                  {isOwnProfile && (
                    <>
                      <Badge bg="primary" className="mb-3">Tu Perfil</Badge>
                      <div>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => navigate('/editar-perfil')}
                        >
                          <FaEdit className="me-2" />
                          Editar Perfil
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                {/* Información de contacto */}
                {isOwnProfile && (
                  <Card className="mb-3 info-card">
                    <Card.Body>
                      <h5 className="section-title">
                        <FaEnvelope className="me-2" />
                        Información de Contacto
                      </h5>
                      <p className="mb-0">
                        <strong>Email:</strong> {profile.email}
                      </p>
                    </Card.Body>
                  </Card>
                )}

                {/* Información profesional */}
                <Card className="mb-3 info-card">
                  <Card.Body>
                    <h5 className="section-title">
                      <FaBuilding className="me-2" />
                      Información Profesional
                    </h5>
                    <Row>
                      <Col md={6} className="mb-3">
                        <p className="mb-1">
                          <strong>Empresa:</strong>
                        </p>
                        <p className="text-muted">{profile.empresa}</p>
                      </Col>
                      <Col md={6} className="mb-3">
                        <p className="mb-1">
                          <strong>Rol:</strong>
                        </p>
                        <p className="text-muted">
                          <FaBriefcase className="me-2" />
                          {profile.rol}
                        </p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Verticales de negocio */}
                <Card className="mb-3 info-card">
                  <Card.Body>
                    <h5 className="section-title mb-3">Verticales de Negocio</h5>
                    <div className="verticals-display">
                      {profile.verticales?.map((vertical, idx) => (
                        <Badge 
                          key={idx} 
                          bg="primary" 
                          className="me-2 mb-2 vertical-badge-large"
                        >
                          {vertical}
                        </Badge>
                      ))}
                    </div>
                  </Card.Body>
                </Card>

                {/* Bio */}
                {profile.bio && (
                  <Card className="info-card">
                    <Card.Body>
                      <h5 className="section-title mb-3">Bio</h5>
                      <p className="bio-text">{profile.bio}</p>
                    </Card.Body>
                  </Card>
                )}

                {/* Fecha de registro */}
                <div className="text-center mt-4">
                  <small className="text-muted">
                    Miembro desde {new Date(profile.createdAt).toLocaleDateString('es-AR')}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
