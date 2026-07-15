import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
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
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  // Registro de usuario
  const signup = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar perfil en Firestore (publico: lo puede leer cualquier usuario verificado)
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        nombre: userData.nombre,
        apellido: userData.apellido,
        empresa: userData.empresa,
        verticales: userData.verticales,
        rol: userData.rol,
        bio: userData.bio || '',
        createdAt: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${userData.nombre}+${userData.apellido}&background=random`
      });

      // El email vive aparte, en un doc que solo el propio usuario puede leer
      await setDoc(doc(db, 'users', user.uid, 'private', 'contact'), {
        email: email
      });

      await sendEmailVerification(user);

      return { success: true };
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: error.message };
    }
  };

  // Reenviar email de verificación
  const resendVerificationEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      }
      return { success: true };
    } catch (error) {
      console.error('Error reenviando verificación:', error);
      return { success: false, error: error.message };
    }
  };

  // Releer el estado de verificación desde Firebase (tras hacer click en el link del mail).
  // reload() actualiza user.emailVerified, pero el ID token que usan las reglas de Firestore
  // (request.auth.token.email_verified) queda desactualizado hasta que se fuerza su renovación.
  const refreshEmailVerification = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      await auth.currentUser.getIdToken(true);
      setEmailVerified(auth.currentUser.emailVerified);
    }
  };

  // Enviar email para restablecer contraseña. Siempre devuelve éxito
  // (no revelamos si ese email está o no registrado, para evitar enumeración de cuentas)
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/restablecer-password`,
        handleCodeInApp: true
      });
    } catch (error) {
      console.error('Error enviando email de recuperación:', error);
    }
    return { success: true };
  };

  // Validar el código del link de recuperación y obtener el email asociado
  const verifyResetCode = async (oobCode) => {
    try {
      const email = await verifyPasswordResetCode(auth, oobCode);
      return { success: true, email };
    } catch (error) {
      console.error('Código de recuperación inválido o expirado:', error);
      return { success: false };
    }
  };

  // Confirmar la nueva contraseña usando el código del link
  const confirmReset = async (oobCode, newPassword) => {
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      return { success: true };
    } catch (error) {
      console.error('Error confirmando nueva contraseña:', error);
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

  // Cargar perfil del usuario (datos publicos + email privado, separados en Firestore)
  const loadUserProfile = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return;

      const publicData = docSnap.data();
      const privateRef = doc(db, 'users', uid, 'private', 'contact');
      let privateSnap = await getDoc(privateRef);

      // Migracion en caliente: cuentas creadas antes de separar el email
      if (publicData.email) {
        if (!privateSnap.exists()) {
          await setDoc(privateRef, { email: publicData.email });
          privateSnap = await getDoc(privateRef);
        }
        await updateDoc(docRef, { email: deleteField() });
        delete publicData.email;
      }

      setUserProfile({
        ...publicData,
        email: privateSnap.exists() ? privateSnap.data().email : null
      });
    } catch (error) {
      console.error('Error cargando perfil:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setEmailVerified(user?.emailVerified || false);
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
    emailVerified,
    signup,
    login,
    logout,
    loading,
    refreshUserProfile,
    resendVerificationEmail,
    refreshEmailVerification,
    resetPassword,
    verifyResetCode,
    confirmReset
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
