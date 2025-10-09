import React, { useMemo, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
/**
 * SignUp component (UI only)
 * - Email + Password fields
 * - Basic client-side validation (email format, password strength)
 * - Responsive layout with TailwindCSS
 * - Link to switch to Sign In
 *
 * Integration options:
 * - Pass an `onSwitch` prop to handle navigation inside your app state/router.
 *   If absent, the link will update the URL hash (#signin) as a graceful fallback.
 * - Pass `onSubmit` to receive validated form values on submit (no network calls here).
 */
export interface AuthFormValues {
  email: string;
  password: string;
}

export interface SignUpProps {
  onSwitch?: (target: 'signin' | 'signup') => void;
  onSubmit?: (values: AuthFormValues) => void;
  className?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function getPasswordIssues(pw: string): string[] {
  const issues: string[] = [];
  if (pw.length < 8) issues.push('At least 8 characters');
  if (!/[A-Za-z]/.test(pw)) issues.push('At least one letter');
  if (!/\d/.test(pw)) issues.push('At least one number');
  return issues;
}

export default function SignUp({ onSwitch, onSubmit, className }: SignUpProps) {
  const [values, setValues] = useState<AuthFormValues>({ email: '', password: '' });
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({ email: false, password: false });
  const [submitted, setSubmitted] = useState(false);
  const [confirm, setConfirm] = useState<string>('');
  const [confirmTouched, setConfirmTouched] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
const [authError, setAuthError] = useState<string>('');
  const emailError = useMemo(() => {
    if (!touched.email && !submitted) return '';
    if (!values.email) return 'Email is required';
    if (!emailRegex.test(values.email)) return 'Enter a valid email address';
    return '';
  }, [values.email, touched.email, submitted]);

  const passwordIssues = useMemo(() => getPasswordIssues(values.password), [values.password]);
  const passwordError = useMemo(() => {
    if (!touched.password && !submitted) return '';
    if (!values.password) return 'Password is required';
    return passwordIssues.length ? `Password must include: ${passwordIssues.join(', ')}` : '';
  }, [values.password, touched.password, submitted, passwordIssues]);
  const confirmError = useMemo(() => {
    if (!confirmTouched && !submitted) return '';
    if (!confirm) return 'Please confirm your password';
    if (confirm !== values.password) return 'Passwords do not match';
    return '';
  }, [confirm, values.password, confirmTouched, submitted]);

  const isValid = !emailError && !passwordError && !confirmError;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(t => ({ ...t, [name]: true } as any));
  };

  const handleConfirmBlur = () => setConfirmTouched(true);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitted(true);
  setAuthError('');

  if (!isValid) return;

  try {
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (error) {
      if (error.message.includes('rate limit')) {
        setAuthError('Too many signup attempts. Please try again in a few minutes.');
      } else if (error.message.includes('invalid email')) {
        setAuthError('Please enter a valid email address.');
      } else if (error.message.includes('password')) {
        setAuthError('Password does not meet requirements. Please try a stronger password.');
      } else if (error.message.includes('network')) {
        setAuthError('Network error. Please check your internet connection and try again.');
      } else {
        setAuthError(error.message);
      }
      return;
    }

    if (data?.user && data.user.identities?.length === 0) {
      setAuthError('This email is already registered. Please sign in instead.');
      return;
    }

    if (data?.user) {
      alert("Signup successful! Please check your email to verify your account.");
      console.log("User created:", data.user);
      onSubmit?.(values);
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes('fetch') || err.message.includes('network')) {
        setAuthError('Unable to connect to the server. Please check your internet connection.');
      } else {
        setAuthError('An unexpected error occurred. Please try again.');
      }
    } else {
      setAuthError('An unexpected error occurred. Please try again.');
    }
    console.error("Unexpected error:", err);
  }
};


  const handleSwitch = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSwitch) onSwitch('signin');
    else window.location.hash = '#signin';
  };

  const strengthLabel = useMemo(() => {
    if (!values.password) return '';
    const issuesCount = passwordIssues.length;
    if (issuesCount === 0) return 'Strong';
    if (issuesCount === 1) return 'Medium';
    return 'Weak';
  }, [passwordIssues, values.password]);

  return (
    <div className={['min-h-screen flex items-center justify-center p-4 bg-gray-50', className].filter(Boolean).join(' ')}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Join StallOS to optimize your food business</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${emailError ? 'border-red-300' : 'border-gray-300'}`}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'email-error' : undefined}
                required
              />
              {emailError && (
                <p id="email-error" className="mt-1 text-xs text-red-600">
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${passwordError ? 'border-red-300' : 'border-gray-300'}`}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? 'password-error' : undefined}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute inset-y-0 right-2 my-auto h-8 px-2 text-xs text-gray-600 hover:text-gray-900"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-xs text-gray-500">Strength: {strengthLabel || '—'}</p>
                {values.password && (
                  <p className={
                    'text-xs ' + (passwordIssues.length === 0 ? 'text-green-600' : passwordIssues.length === 1 ? 'text-yellow-600' : 'text-red-600')
                  }>
                    {passwordIssues.length === 0 ? 'Good password' : passwordIssues[0]}
                  </p>
                )}
              </div>
              {/* Strength meter */}
              <div className="mt-2 h-1 w-full rounded bg-gray-200 overflow-hidden">
                <div
                  className={
                    'h-full transition-all ' +
                    (passwordIssues.length === 0
                      ? 'w-11/12 bg-green-500'
                      : passwordIssues.length === 1
                        ? 'w-2/3 bg-yellow-500'
                        : 'w-1/3 bg-red-500')
                  }
                />
              </div>
              {passwordError && (
                <p id="password-error" className="mt-1 text-xs text-red-600">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm"
                  name="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onBlur={handleConfirmBlur}
                  className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${confirmError ? 'border-red-300' : 'border-gray-300'}`}
                  aria-invalid={!!confirmError}
                  aria-describedby={confirmError ? 'confirm-error' : undefined}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(s => !s)}
                  className="absolute inset-y-0 right-2 my-auto h-8 px-2 text-xs text-gray-600 hover:text-gray-900"
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>
              {confirmError && (
                <p id="confirm-error" className="mt-1 text-xs text-red-600">
                  {confirmError}
                </p>
              )}
            </div>
{authError && (
  <div className="rounded-lg bg-red-50 border border-red-200 p-3">
    <p className="text-sm text-red-800">{authError}</p>
  </div>
)}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!isValid}
            >
              Sign Up
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="#signin" onClick={handleSwitch} className="font-medium text-orange-600 hover:text-orange-700">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
