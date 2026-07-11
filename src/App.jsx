import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Terms from './pages/Terms';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

// Components
import Footer from './components/Footer';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-wrapper">
          <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/terminos" element={<Terms />} />
          <Route path="/verificar-email" element={<VerifyEmail />} />

          {/* Rutas privadas */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/chat/:userId" 
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/perfil" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/perfil/:userId" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/editar-perfil" 
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            } 
          />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
