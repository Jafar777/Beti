'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react'; // Import signIn here
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Language context
  const languageContext = useLanguage();
  const language = languageContext?.language || 'en';
  const translations = languageContext?.translations || {};
  const t = translations[language] || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const trimmedMobile = mobile.trim();

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError(t.passwordsDontMatch || "Passwords don't match");
        setLoading(false);
        return;
      }
      
      if (!/^09\d{8}$/.test(trimmedMobile)) {
        setError(t.invalidMobile || "Invalid Syrian mobile number format");
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            firstName,
            lastName,
            mobile: trimmedMobile,
            password: password
          }),
        });
        
        if (response.ok) {
          // Sign in directly after successful signup
          const result = await signIn('credentials', {
            redirect: false,
            mobile: trimmedMobile,
            password: password
          });
          
          if (result.error) {
            setError(t.signinAfterSignupFailed || 'Signup successful! Please sign in');
          } else {
            router.push('/dashboard');
          }
        } else {
          const data = await response.json();
          setError(data.error || t.signupError || 'Signup failed');
        }
      } catch (err) {
        console.error('Signup error:', err);
        setError(t.networkError || 'Network error');
      }
    } else {
      // Sign in directly
      const result = await signIn('credentials', {
        redirect: false,
        mobile: trimmedMobile,
        password: password
      });
      
      if (result.error) {
        setError(t.invalidCredentials || 'Invalid mobile or password');
      } else {
        router.push('/dashboard');
      }
    }
    
    setLoading(false);
  };


  const toggleFormMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setFirstName('');
    setLastName('');
    setMobile('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-black text-2xl font-bold mb-6 text-center">
            {isSignUp ? (t.signUp || 'Sign Up') : (t.signIn || 'Sign In')}
          </h2>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-black mb-2" htmlFor="firstName">
                    {t.firstName || 'First Name'}
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-black mb-2" htmlFor="lastName">
                    {t.lastName || 'Last Name'}
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-black mb-2" htmlFor="mobile">
                {t.mobile}
              </label>
              <input
                id="mobile"
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="09xxxxxxxx"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-black mb-2" htmlFor="password">
                {t.password}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {isSignUp && (
              <div className="mb-6">
                <label className="block text-black mb-2" htmlFor="confirmPassword">
                  {t.confirmPassword || 'Confirm Password'}
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}
            
            {!isSignUp && (
              <div className="mb-6 text-right">
                <button
                  type="button"
                  onClick={() => router.push('/auth/forgot-password')}
                  className="text-[#375171] hover:underline text-sm cursor-pointer"
                >
                  {t.forgotPassword || 'Forgot Password?'}
                </button>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#375171] text-white py-2 px-4 rounded-lg hover:bg-[#2d4360] transition duration-200 cursor-pointer mb-4 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                t.loading || 'Processing...'
              ) : isSignUp ? (
                t.signUp || 'Sign Up'
              ) : (
                t.signIn || 'Sign In'
              )}
            </button>
            
            <div className="text-center text-gray-600 mt-4">
              <p className="mb-2">
                {isSignUp
                  ? t.alreadyHaveAccount || 'Already have an account?'
                  : t.dontHaveAccount || "Don't have an account?"}
              </p>
              <button
                type="button"
                onClick={toggleFormMode}
                className="text-[#375171] font-medium hover:underline cursor-pointer"
              >
                {isSignUp ? t.signIn : t.signUp || 'Sign Up Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}