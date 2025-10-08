import React, { useMemo, useState } from 'react';

/**
 * SignIn component (UI only)
 * - Email + Password fields
 * - Basic client-side validation (email format and required password)
 * - Responsive layout with TailwindCSS
 * - Link to switch to Sign Up
 *
 * Integration options:
 * - Pass an `onSwitch` prop to handle navigation inside your app state/router.
 *   If absent, the link will update the URL hash (#signup) as a graceful fallback.
 * - Pass `onSubmit` to receive validated form values on submit (no network calls here).
 */
export interface AuthFormValues {
  email: string;
  password: string;
}

export interface SignInProps {
  onSwitch?: (target: 'signin' | 'signup') => void;
  onSubmit?: (values: AuthFormValues) => void;
  className?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function SignIn({ onSwitch, onSubmit, className }: SignInProps) {
  const [values, setValues] = useState<AuthFormValues>({ email: '', password: '' });
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({ email: false, password: false });
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const emailError = useMemo(() => {
    if (!touched.email && !submitted) return '';
    if (!values.email) return 'Email is required';
    if (!emailRegex.test(values.email)) return 'Enter a valid email address';
    return '';
  }, [values.email, touched.email, submitted]);

  const passwordError = useMemo(() => {
    if (!touched.password && !submitted) return '';
    if (!values.password) return 'Password is required';
    return '';
  }, [values.password, touched.password, submitted]);

  const isValid = !emailError && !passwordError;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(t => ({ ...t, [name]: true } as any));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    // Include remember info if needed by parent in future (UI-only for now)
    onSubmit?.(values);
  };

  const handleSwitch = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSwitch) onSwitch('signup');
    else window.location.hash = '#signup';
  };

  return (
    <div className={['min-h-screen flex items-center justify-center p-4 bg-gray-50', className].filter(Boolean).join(' ')}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to continue to StallOS</p>
        </div>

        {/* Error summary for accessibility */}
        {submitted && !isValid && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert" aria-live="assertive">
            Please fix the errors below and try again.
          </div>
        )}

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
                  autoComplete="current-password"
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
              {passwordError && (
                <p id="password-error" className="mt-1 text-xs text-red-600">
                  {passwordError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <button type="button" className="text-sm font-medium text-orange-600 hover:text-orange-700">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!isValid}
            >
              Sign In
            </button>

            <p className="text-center text-sm text-gray-600">
              New to StallOS?{' '}
              <a href="#signup" onClick={handleSwitch} className="font-medium text-orange-600 hover:text-orange-700">
                Create an account
              </a>
            </p>

            {/* Social (UI only) */}
            <div className="relative mt-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                <span>Google</span>
              </button>
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                <span>GitHub</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
