import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Zap, Phone, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        await signUp(formData);
        alert('Account created! You can now sign in.');
      } else {
        await signIn(formData.phone, formData.password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-[#0a0a0a] transition-colors duration-500">
      {/* Decorative Side (Desktop) */}
      <div className="hidden md:flex md:w-1/2 bg-black relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,#ffffff_0%,transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,#ffffff_0%,transparent_50%)]"></div>
        </div>
        
        <div className="relative z-10 text-white max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              <Zap className="w-8 h-8 text-black fill-current" />
            </div>
            <h2 className="text-5xl font-black tracking-tighter mb-6 leading-tight uppercase">
              Progress Hub <span className="text-gray-400 font-light italic">Yetu.</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">Empowering our community through digital synchronization and collective advancement.</p>
          </motion.div>
        </div>
      </div>

      {/* Login Side */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-12 lg:p-24 relative overflow-hidden">
        <div className="md:hidden absolute top-8 left-8 flex items-center gap-2">
            <Zap className="w-6 h-6 text-black dark:text-white" />
            <span className="font-bold tracking-tighter dark:text-white">HUB YETU</span>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="mb-12">
              <h3 className="text-3xl font-black tracking-tighter mb-2 dark:text-white uppercase">
                {isSignUp ? 'Join the' : 'Welcome'} <span className="text-gray-300 dark:text-gray-600">{isSignUp ? 'Collective' : 'Back'}</span>
              </h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium italic">
                {isSignUp ? 'Initiate your entity access' : 'Access your secure terminal'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div 
                    key="signup-fields"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="relative group">
                      <Zap className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl pl-16 pr-8 py-5 text-sm font-bold placeholder:text-gray-300 dark:text-white outline-none focus:ring-4 ring-black/5 dark:ring-white/5 transition-all"
                        required
                      />
                    </div>
                    <div className="relative group">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                      <input 
                        type="email" 
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl pl-16 pr-8 py-5 text-sm font-bold placeholder:text-gray-300 dark:text-white outline-none focus:ring-4 ring-black/5 dark:ring-white/5 transition-all"
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative group">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                <input 
                  type="tel" 
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl pl-16 pr-8 py-5 text-sm font-bold placeholder:text-gray-300 dark:text-white outline-none focus:ring-4 ring-black/5 dark:ring-white/5 transition-all"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                <input 
                  type="password" 
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl pl-16 pr-8 py-5 text-sm font-bold placeholder:text-gray-300 dark:text-white outline-none focus:ring-4 ring-black/5 dark:ring-white/5 transition-all"
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest text-center">
                  Error: {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full group flex items-center justify-between bg-black dark:bg-white px-8 py-5 rounded-2xl text-white dark:text-black font-bold text-lg transition-all active:scale-95 shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(255,255,255,0.05)]"
              >
                <span>{loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}</span>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white uppercase tracking-widest transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign In' : 'New to Hub Yetu? Sign Up'}
              </button>
            </div>

            <p className="mt-12 text-center text-[10px] text-gray-300 dark:text-gray-600 font-bold px-8 leading-loose uppercase tracking-widest">
              Authorized access only. All interactions are logged via Hub Yetu security protocols.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
