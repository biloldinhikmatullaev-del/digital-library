import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  auth as firebaseAuth, 
  isFirebaseConfigured 
} from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from "firebase/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor Auth state change
  useEffect(() => {
    if (isFirebaseConfigured && firebaseAuth) {
      const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
        if (currentUser) {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || currentUser.email.split("@")[0],
            isMock: false
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Mock Auth Initialization
      const storedUser = localStorage.getItem("lumina_mock_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }
  }, []);

  const signup = async (email, password, name) => {
    if (isFirebaseConfigured && firebaseAuth) {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: name || email.split("@")[0],
        isMock: false
      });
      return userCredential.user;
    } else {
      // Mock Sign up
      const mockUser = {
        uid: "mock-" + Math.random().toString(36).substring(2, 11),
        email,
        displayName: name || email.split("@")[0],
        isMock: true
      };
      localStorage.setItem("lumina_mock_user", JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }
  };

  const login = async (email, password) => {
    if (isFirebaseConfigured && firebaseAuth) {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      return userCredential.user;
    } else {
      // Mock Login
      const mockUser = {
        uid: "mock-user-123",
        email,
        displayName: email.split("@")[0],
        isMock: true
      };
      localStorage.setItem("lumina_mock_user", JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && firebaseAuth) {
      await firebaseSignOut(firebaseAuth);
    } else {
      // Mock Logout
      localStorage.removeItem("lumina_mock_user");
      setUser(null);
    }
  };

  const updateUser = (updatedFields) => {
    const updatedUser = user ? { ...user, ...updatedFields } : null;
    if (updatedUser) {
      if (user.isMock || !isFirebaseConfigured) {
        localStorage.setItem("lumina_mock_user", JSON.stringify(updatedUser));
      }
      setUser(updatedUser);
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    updateUser,
    isMock: !isFirebaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
