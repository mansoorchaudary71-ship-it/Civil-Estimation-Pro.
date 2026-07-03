import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  workspaceToken: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (e: string, p: string, name: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateUserDisplayName: (name: string) => Promise<void>;
  updateUserProfilePhoto: (url: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Helper for users doc
const createOrUpdateUserDoc = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  try {
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: Date.now()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'users');
  }
}

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [workspaceToken, setWorkspaceToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          await createOrUpdateUserDoc(currentUser);
        } catch (error) {
          console.warn("Failed to create or update user doc during auth state change:", error);
        }
      } else {
        setWorkspaceToken(null);
      }
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/gmail.send');
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setWorkspaceToken(credential.accessToken);
      }
      try {
        await createOrUpdateUserDoc(result.user);
      } catch (error) {
        console.warn("User signed in with Google, but failed to sync user doc:", error);
      }
    } catch (error) {
       console.error("Google sign-in error:", error);
       throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(res.user, { displayName: name });
    try {
      await createOrUpdateUserDoc({ ...res.user, displayName: name } as User);
    } catch (error) {
      console.warn("User signed up, but failed to sync user doc:", error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const updateUserDisplayName = async (name: string) => {
     if (!auth.currentUser) return;
     try {
       await updateProfile(auth.currentUser, { displayName: name });
       const userRef = doc(db, 'users', auth.currentUser.uid);
       await setDoc(userRef, { displayName: name }, { merge: true });
       setUser({ ...auth.currentUser });
     } catch (error) {
       handleFirestoreError(error, OperationType.UPDATE, 'users');
     }
  }

  const updateUserProfilePhoto = async (url: string) => {
     if (!auth.currentUser) return;
     try {
       await updateProfile(auth.currentUser, { photoURL: url });
       const userRef = doc(db, 'users', auth.currentUser.uid);
       await setDoc(userRef, { photoURL: url }, { merge: true });
       setUser({ ...auth.currentUser });
     } catch (error) {
       handleFirestoreError(error, OperationType.UPDATE, 'users');
     }
  }

  return (
    <AuthContext.Provider value={{
      user, 
      loading, 
      workspaceToken,
      signInWithGoogle, 
      signInWithEmail,
      signUpWithEmail,
      logOut,
      updateUserDisplayName,
      updateUserProfilePhoto
    }}>
      {!loading ? children : <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-slate-800"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}
    </AuthContext.Provider>
  );
};
