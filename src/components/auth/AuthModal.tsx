import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { X, Mail, Lock, User, AtSign, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const getFriendlyErrorMessage = (error: any) => {
    const code = error?.code || error?.message;
    switch (code) {
      case 'auth/unauthorized-domain':
        return "This domain is not authorized for login. Please contact the administrator.";
      case 'auth/user-not-found':
        return "No account found with this email.";
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return "Incorrect password. Please try again.";
      case 'auth/email-already-in-use':
        return "An account with this email already exists.";
      case 'auth/weak-password':
        return "Password should be at least 6 characters.";
      case 'auth/invalid-email':
        return "Please enter a valid email address.";
      case 'auth/network-request-failed':
        return "Network error. Please check your internet connection.";
      case 'auth/popup-blocked':
        return "Popup blocked. Please open this app in a new tab to sign in.";
      case 'auth/popup-closed-by-user':
        return "Sign-in popup was closed before completion.";
      default:
        // Attempt to clean up generic Firebase errors if they leak through
        const msg = error?.message || 'An unexpected error occurred. Please try again.';
        return msg.replace(/Firebase:\s(.*)\s\([^)]+\)./, '$1');
    }
  };

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
      }
      onClose();
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error("Auth Error (Google):", err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#F5F5F7] backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md overflow-hidden bg-bg-card rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-700"
        >
          <button onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-500 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors z-10 text-base font-semibold active:scale-95 hover:-translate-y-0.5 hover:shadow-lg shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="px-8 pt-10 pb-8">
            <h2 className="text-slate-900 dark:text-white mb-2 text-xl font-semibold text-slate-900 tracking-tight mb-4">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="mb-8 text-base font-normal text-slate-600 leading-relaxed">
              {isLogin ? 'Sign in to access your estimates' : 'Sign up to save your estimation data safely'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 w-5 h-5 text-slate-700" />
                    <><label htmlFor="a11y-input-11" className="sr-only">Full Name</label>
<input id="a11y-input-11"
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError('');
                      }}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-indigo-500/50 transition-all"
                    /></>
                  </div>
                </div>
              )}
              
              <div>
                <div className="relative flex items-center">
                  <AtSign className="absolute left-3.5 w-5 h-5 text-slate-700" />
                  <><label htmlFor="a11y-input-12" className="sr-only">Email Address</label>
<input id="a11y-input-12"
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-indigo-500/50 transition-all"
                  /></>
                </div>
              </div>

              <div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-5 h-5 text-slate-700" />
                  <><label htmlFor="a11y-input-13" className="sr-only">Password</label>
<input id="a11y-input-13"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    required
                    className="w-full pl-11 pr-12 py-3 bg-white border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-indigo-500/50 transition-all"
                  /></>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-700 hover:text-slate-600 focus:outline-none rounded-full"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-[24px] overflow-hidden">
                  {error}
                </div>
              )}

              <button type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-sm transition-all flex justify-center items-center h-12 text-base font-semibold active:scale-95 hover:-translate-y-0.5"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Sign Up')}
              </button>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-slate-200 dark:border-slate-700"></div>
              <span className="px-4 text-sm font-medium text-slate-700 uppercase tracking-wider">or</span>
              <div className="flex-1 border-t border-slate-200 dark:border-slate-700"></div>
            </div>

            <button type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-bg-card border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-900 dark:text-white rounded-full shadow-sm transition-all focus:ring-4 focus:ring-slate-500/10 flex items-center justify-center gap-3 h-12 text-base font-semibold active:scale-95 hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>

            <p className="mt-8 text-center text-base font-normal text-slate-600 leading-relaxed">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors rounded-full"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
