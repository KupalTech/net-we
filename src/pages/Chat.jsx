import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, push, onValue, query, orderByChild, update } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import { realtimeDb, db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import './Chat.css';

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);

  const chatId = [currentUser.uid, userId].sort().join('_');

  // Cargar datos del otro usuario
  useEffect(() => {
    const loadOtherUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setOtherUser(userDoc.data());
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
      }
    };

    if (userId) {
      loadOtherUser();
    }
  }, [userId]);

  // Cargar mensajes en tiempo real y marcar como leídos
  useEffect(() => {
    const messagesRef = ref(realtimeDb, `chats/${chatId}/messages`);
    const messagesQuery = query(messagesRef, orderByChild('timestamp'));

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const messagesData = [];
      const updates = {};
      
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        messagesData.push({
          id: childSnapshot.key,
          ...message
        });
        
        // Marcar como leído si el mensaje es del otro usuario y no está leído
        if (message.senderId === userId && !message.read) {
          updates[`chats/${chatId}/messages/${childSnapshot.key}/read`] = true;
        }
      });
      
      setMessages(messagesData);
      
      // Actualizar mensajes como leídos
      if (Object.keys(updates).length > 0) {
        update(ref(realtimeDb), updates).catch(error => {
          console.error('Error marcando mensajes como leídos:', error);
        });
      }
    });

    return () => unsubscribe();
  }, [chatId, userId]);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    try {
      const messagesRef = ref(realtimeDb, `chats/${chatId}/messages`);
      await push(messagesRef, {
        text: newMessage,
        senderId: currentUser.uid,
        senderName: `${userProfile.nombre} ${userProfile.apellido}`,
        timestamp: Date.now()
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert('Error al enviar el mensaje');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      <Navbar />
      <Container fluid className="chat-container">
        <Row className="h-100">
          <Col xs={12} md={8} lg={6} className="mx-auto h-100 d-flex flex-column">
            {/* Header del chat */}
            <Card className="chat-header">
              <Card.Body className="d-flex align-items-center gap-3">
                <Button 
                  variant="link" 
                  onClick={() => navigate('/dashboard')}
                  className="p-0 text-dark"
                >
                  <FaArrowLeft size={20} />
                </Button>
                {otherUser && (
                  <>
                    <img 
                      src={otherUser.avatar} 
                      alt="Avatar" 
                      className="chat-user-avatar"
                    />
                    <div>
                      <h6 className="mb-0">
                        {otherUser.nombre} {otherUser.apellido}
                      </h6>
                      <small className="text-muted">
                        {otherUser.empresa}
                      </small>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>

            {/* Mensajes */}
            <Card className="flex-grow-1 chat-messages-container">
              <Card.Body className="messages-body">
                <ListGroup variant="flush">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted py-5">
                      <p>No hay mensajes aún</p>
                      <p>¡Envía el primer mensaje!</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwn = message.senderId === currentUser.uid;
                      return (
                        <ListGroup.Item 
                          key={message.id} 
                          className="border-0 px-0"
                        >
                          <div className={`message ${isOwn ? 'message-own' : 'message-other'}`}>
                            <div className="message-bubble">
                              <p className="mb-1">{message.text}</p>
                              <small className="message-time">
                                {formatTime(message.timestamp)}
                              </small>
                            </div>
                          </div>
                        </ListGroup.Item>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </ListGroup>
              </Card.Body>
            </Card>

            {/* Input de mensaje */}
            <Card className="chat-input-container">
              <Card.Body>
                <Form onSubmit={handleSendMessage}>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      placeholder="Escribe un mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="chat-input"
                    />
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={!newMessage.trim()}
                    >
                      <FaPaperPlane />
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Chat;
