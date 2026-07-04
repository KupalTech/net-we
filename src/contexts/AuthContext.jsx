import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Registro de usuario
  const signup = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar perfil en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        nombre: userData.nombre,
        apellido: userData.apellido,
        empresa: userData.empresa,
        verticales: userData.verticales,
        rol: userData.rol,
        bio: userData.bio || '',
        createdAt: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${userData.nombre}+${userData.apellido}&background=random`
      });

      return { success: true };
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: error.message };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  // Cargar perfil del usuario
  const loadUserProfile = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Refrescar perfil tras editarlo, para que el resto de la app vea los datos nuevos sin recargar
  const refreshUserProfile = async () => {
    if (currentUser) {
      await loadUserProfile(currentUser.uid);
    }
  };

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    loading,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
