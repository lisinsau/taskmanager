"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db } from "../lib/firebase";

export const AuthContext = createContext(null);

function translateFirebaseError(error) {
  if (!error?.code) {
    return "Une erreur inattendue est survenue. Réessayez.";
  }

  const errorMessages = {
    "auth/email-already-in-use": "Cette adresse e-mail est déjà utilisée.",
    "auth/invalid-email": "L'adresse e-mail est invalide.",
    "auth/weak-password": "Le mot de passe est trop faible.",
    "auth/missing-password": "Le mot de passe est requis.",
    "auth/invalid-credential": "Identifiants invalides. Vérifiez vos informations.",
    "auth/user-not-found": "Aucun compte trouvé avec cette adresse e-mail.",
    "auth/wrong-password": "Mot de passe incorrect.",
    "auth/user-disabled": "Ce compte est désactivé.",
    "auth/popup-closed-by-user": "La fenêtre de connexion a été fermée.",
    "auth/cancelled-popup-request": "La connexion Google a été annulée.",
    "auth/network-request-failed":
      "Erreur réseau. Vérifiez votre connexion internet.",
    "auth/too-many-requests":
      "Trop de tentatives. Veuillez réessayer plus tard.",
    "auth/operation-not-allowed":
      "Cette méthode de connexion n'est pas activée.",
  };

  return (
    errorMessages[error.code] ||
    "Impossible de vous authentifier pour le moment. Réessayez."
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ensureUserDocument = async (firebaseUser) => {
    if (!firebaseUser?.uid) {
      return;
    }

    const email = firebaseUser.email || "";
    await setDoc(
      doc(db, "users", firebaseUser.uid),
      {
        email,
        emailLowercase: email.toLowerCase(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  useEffect(() => {
    // Écoute en temps réel des changements d'authentification Firebase.
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        try {
          if (currentUser) {
            await ensureUserDocument(currentUser);
          }
        } catch {
          // On ignore ici pour ne pas bloquer la session utilisateur.
        }
        setUser(currentUser);
        setLoading(false);
      },
      (firebaseError) => {
        setError(translateFirebaseError(firebaseError));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    setError(null);
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return credential.user;
    } catch (firebaseError) {
      const translatedMessage = translateFirebaseError(firebaseError);
      setError(translatedMessage);
      throw new Error(translatedMessage);
    }
  };

  const signIn = async (email, password) => {
    setError(null);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      return credential.user;
    } catch (firebaseError) {
      const translatedMessage = translateFirebaseError(firebaseError);
      setError(translatedMessage);
      throw new Error(translatedMessage);
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      return credential.user;
    } catch (firebaseError) {
      const translatedMessage = translateFirebaseError(firebaseError);
      setError(translatedMessage);
      throw new Error(translatedMessage);
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
    } catch (firebaseError) {
      const translatedMessage = translateFirebaseError(firebaseError);
      setError(translatedMessage);
      throw new Error(translatedMessage);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider.");
  }

  return context;
}
