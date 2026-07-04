import { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Table, Button, Badge, Spinner, Modal, Card } from 'react-bootstrap';
import { collection, query, where, getDocs, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { ref, onValue, query as rtQuery, orderByChild, equalTo } from 'firebase/database';
import { db, realtimeDb } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CONTACT_STATUS, REQUEST_STATUS } from '../utils/constants';
import { FaComments } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactStatuses, setContactStatuses] = useState({});
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});

  // Cargar usuarios
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', '!=', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push(doc.data());
        });
        
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando usuarios:', error);
        setLoading(false);
      }
    };

    if (currentUser) {
      loadUsers();
    }
  }, [currentUser]);

  // Cargar estados de contacto
  useEffect(() => {
    if (!currentUser) return;

    const contactsRef = collection(db, 'contacts');
    const q = query(contactsRef, where('userId', '==', currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const statuses = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        statuses[data.contactId] = data.status;
      });
      setContactStatuses(statuses);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Cargar solicitudes pendientes
  useEffect(() => {
    if (!currentUser) return;

    const requestsRef = collection(db, 'meetingRequests');
    const q = query(
      requestsRef, 
      where('receiverId', '==', currentUser.uid),
      where('status', '==', REQUEST_STATUS.PENDING)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const requests = [];
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        // Obtener datos del remitente
        const senderDoc = await getDoc(doc(db, 'users', data.senderId));
        if (senderDoc.exists()) {
          requests.push({
            id: docSnap.id,
            ...data,
            senderData: senderDoc.data()
          });
        }
      }
      setPendingRequests(requests);
      if (requests.length > 0) {
        setShowRequestModal(true);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Cargar mensajes no leídos para cada chat
  useEffect(() => {
    if (!currentUser || users.length === 0) return;

    const unsubscribes = [];

    users.forEach((user) => {
      const status = contactStatuses[user.uid];
      if (status === CONTACT_STATUS.CONTACTED) {
        const chatId = [currentUser.uid, user.uid].sort().join('_');
        const messagesRef = ref(realtimeDb, `chats/${chatId}/messages`);

        const unsubscribe = onValue(messagesRef, (snapshot) => {
          let unreadCount = 0;
          snapshot.forEach((childSnapshot) => {
            const message = childSnapshot.val();
            // Contar mensajes del otro usuario que no han sido leídos
            if (message.senderId === user.uid && !message.read) {
              unreadCount++;
            }
          });
          
          setUnreadCounts(prev => ({
            ...prev,
            [user.uid]: unreadCount
          }));
        });

        unsubscribes.push(unsubscribe);
      }
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [currentUser, users, contactStatuses]);

  const getContactStatus = (userId) => {
    return contactStatuses[userId] || CONTACT_STATUS.NO_CONTACT;
  };

  // Usuarios Contactados primero, el resto mantiene el orden recibido
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aContacted = getContactStatus(a.uid) === CONTACT_STATUS.CONTACTED;
      const bContacted = getContactStatus(b.uid) === CONTACT_STATUS.CONTACTED;
      return aContacted === bContacted ? 0 : aContacted ? -1 : 1;
    });
  }, [users, contactStatuses]);

  const handleSendRequest = async (targetUser) => {
    try {
      const requestId = `${currentUser.uid}_${targetUser.uid}`;
      
      // Crear solicitud de reunión
      await setDoc(doc(db, 'meetingRequests', requestId), {
        senderId: currentUser.uid,
        receiverId: targetUser.uid,
        status: REQUEST_STATUS.PENDING,
        createdAt: new Date().toISOString()
      });

      // Actualizar estado de contacto del remitente
      await setDoc(doc(db, 'contacts', `${currentUser.uid}_${targetUser.uid}`), {
        userId: currentUser.uid,
        contactId: targetUser.uid,
        status: CONTACT_STATUS.REQUEST_SENT,
        updatedAt: new Date().toISOString()
      });

      alert('Solicitud de reunión enviada correctamente');
    } catch (error) {
      console.error('Error enviando solicitud:', error);
      alert('Error al enviar la solicitud');
    }
  };

  const handleAcceptRequest = async (request) => {
    try {
      // Actualizar estado de la solicitud
      await setDoc(doc(db, 'meetingRequests', request.id), {
        ...request,
        status: REQUEST_STATUS.ACCEPTED,
        updatedAt: new Date().toISOString()
      });

      // Actualizar estado de contacto para ambos usuarios
      await setDoc(doc(db, 'contacts', `${currentUser.uid}_${request.senderId}`), {
        userId: currentUser.uid,
        contactId: request.senderId,
        status: CONTACT_STATUS.CONTACTED,
        updatedAt: new Date().toISOString()
      });

      await setDoc(doc(db, 'contacts', `${request.senderId}_${currentUser.uid}`), {
        userId: request.senderId,
        contactId: currentUser.uid,
        status: CONTACT_STATUS.CONTACTED,
        updatedAt: new Date().toISOString()
      });

      // Crear sala de chat
      const chatId = [currentUser.uid, request.senderId].sort().join('_');
      await setDoc(doc(db, 'chats', chatId), {
        participants: [currentUser.uid, request.senderId],
        createdAt: new Date().toISOString(),
        lastMessage: null
      });

    } catch (error) {
      console.error('Error aceptando solicitud:', error);
      alert('Error al aceptar la solicitud');
    }
  };

  const handleRejectRequest = async (request) => {
    try {
      await setDoc(doc(db, 'meetingRequests', request.id), {
        ...request,
        status: REQUEST_STATUS.REJECTED,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error rechazando solicitud:', error);
      alert('Error al rechazar la solicitud');
    }
  };

  const renderActionButtons = (user, status, isContacted, unreadCount) => (
    <div className="d-flex gap-2 flex-wrap">
      {status === CONTACT_STATUS.NO_CONTACT && (
        <Button
          size="sm"
          variant="primary"
          onClick={() => handleSendRequest(user)}
        >
          Solicitar Reunión
        </Button>
      )}

      {status === CONTACT_STATUS.REQUEST_SENT && (
        <Button size="sm" variant="warning" disabled>
          Solicitud Enviada
        </Button>
      )}

      {isContacted && (
        <Button
          size="sm"
          variant="success"
          onClick={() => window.location.href = `/chat/${user.uid}`}
          className="position-relative chat-button"
        >
          <FaComments size={18} />
          {unreadCount > 0 && (
            <Badge
              bg="danger"
              pill
              className="position-absolute top-0 start-100 translate-middle"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      )}
    </div>
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Cargando usuarios...</p>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container fluid className="dashboard-container py-4">
        <Row className="mb-4">
          <Col>
            <h2 className="dashboard-title">Comunidad Net-we</h2>
            <p className="text-muted">
              Conecta con otros emprendedores de la comunidad
            </p>
          </Col>
        </Row>

        <Row>
          <Col>
            {/* Tabla: solo desktop/tablet */}
            <div className="table-responsive d-none d-md-block">
              <Table hover className="users-table">
                <thead>
                  <tr>
                    <th>Nombre Completo</th>
                    <th>Empresa</th>
                    <th>Vertical</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user) => {
                    const status = getContactStatus(user.uid);
                    const isContacted = status === CONTACT_STATUS.CONTACTED;
                    const unreadCount = unreadCounts[user.uid] || 0;

                    return (
                      <tr key={user.uid}>
                        <td>
                          {isContacted ? (
                            <Link
                              to={`/perfil/${user.uid}`}
                              className="user-name-link"
                            >
                              {user.nombre} {user.apellido}
                            </Link>
                          ) : (
                            <span>{user.nombre} {user.apellido}</span>
                          )}
                        </td>
                        <td>{user.empresa}</td>
                        <td>
                          <div className="verticals-cell">
                            {user.verticales?.slice(0, 2).map((v, idx) => (
                              <Badge key={idx} bg="info" className="me-1 mb-1">
                                {v}
                              </Badge>
                            ))}
                            {user.verticales?.length > 2 && (
                              <Badge bg="secondary">+{user.verticales.length - 2}</Badge>
                            )}
                          </div>
                        </td>
                        <td>{user.rol}</td>
                        <td>
                          {renderActionButtons(user, status, isContacted, unreadCount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>

            {/* Tarjetas: solo mobile */}
            <div className="users-cards d-md-none">
              {sortedUsers.map((user) => {
                const status = getContactStatus(user.uid);
                const isContacted = status === CONTACT_STATUS.CONTACTED;
                const unreadCount = unreadCounts[user.uid] || 0;

                return (
                  <Card key={user.uid} className="user-card mb-3">
                    <Card.Body>
                      <div className="d-flex align-items-center gap-3 mb-2">
                        <img
                          src={user.avatar}
                          alt="Avatar"
                          className="user-card-avatar"
                        />
                        <div>
                          {isContacted ? (
                            <Link
                              to={`/perfil/${user.uid}`}
                              className="user-name-link"
                            >
                              {user.nombre} {user.apellido}
                            </Link>
                          ) : (
                            <span className="fw-semibold">
                              {user.nombre} {user.apellido}
                            </span>
                          )}
                          <div className="text-muted small">{user.empresa}</div>
                        </div>
                      </div>

                      <div className="mb-2">
                        <span className="text-muted small me-1">Rol:</span>
                        <span className="small">{user.rol}</span>
                      </div>

                      <div className="verticals-cell mb-3">
                        {user.verticales?.slice(0, 2).map((v, idx) => (
                          <Badge key={idx} bg="info" className="me-1 mb-1">
                            {v}
                          </Badge>
                        ))}
                        {user.verticales?.length > 2 && (
                          <Badge bg="secondary">+{user.verticales.length - 2}</Badge>
                        )}
                      </div>

                      {renderActionButtons(user, status, isContacted, unreadCount)}
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modal de solicitudes pendientes */}
      <Modal 
        show={showRequestModal} 
        onHide={() => setShowRequestModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Solicitudes de Reunión Pendientes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pendingRequests.length === 0 ? (
            <p className="text-muted">No tienes solicitudes pendientes</p>
          ) : (
            <div className="requests-list">
              {pendingRequests.map((request) => (
                <div key={request.id} className="request-item p-3 mb-3 border rounded">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <img 
                        src={request.senderData.avatar} 
                        alt="Avatar" 
                        className="request-avatar"
                      />
                      <div>
                        <h6 className="mb-0">
                          {request.senderData.nombre} {request.senderData.apellido}
                        </h6>
                        <small className="text-muted">
                          {request.senderData.empresa} - {request.senderData.rol}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <Button 
                        size="sm" 
                        variant="success"
                        onClick={() => handleAcceptRequest(request)}
                      >
                        Aceptar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="danger"
                        onClick={() => handleRejectRequest(request)}
                      >
                        Rechazar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Dashboard;
