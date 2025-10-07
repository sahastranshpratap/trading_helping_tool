import React, { useState } from 'react';
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ApiErrorBoundary, FormErrorMessage } from "./ui/error";
import { LoadingSpinner } from "./ui/loading";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiError, setApiError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const errors = {};
    
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    }
    
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setApiError(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Use Supabase auth service from auth.js
      const success = await login(email, password);
      
      if (success) {
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setApiError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setApiError(null);
    handleSubmit(new Event('submit'));
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit} aria-labelledby="login-heading" noValidate>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 id="login-heading" className="text-2xl font-bold text-gray-900 dark:text-white" tabIndex="-1">Welcome back</h1>
                <p className="text-balance text-gray-500 dark:text-gray-400">Login to your trading journal account</p>
              </div>
              
              <ApiErrorBoundary error={apiError} onRetry={handleRetry} />
              <FormErrorMessage errors={validationErrors} />
              
              <div className="grid gap-2">
                <Label htmlFor="email" className={validationErrors.email ? "text-red-500 dark:text-red-400" : ""}>Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="your@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-required="true"
                  aria-invalid={validationErrors.email ? "true" : "false"}
                  className={validationErrors.email ? "border-red-300 dark:border-red-500" : ""}
                />
                {validationErrors.email && (
                  <p className="text-xs text-red-500 dark:text-red-400" id="email-error">
                    {validationErrors.email}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className={validationErrors.password ? "text-red-500 dark:text-red-400" : ""}>Password</Label>
                  <button 
                    type="button"
                    onClick={() => alert("Password reset functionality will be implemented soon!")}
                    className="ml-auto text-sm text-blue-600 hover:underline underline-offset-2 dark:text-blue-400"
                    aria-label="Forgot password"
                  >
                    Forgot your password?
                  </button>
                </div>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-required="true"
                  aria-invalid={validationErrors.password ? "true" : "false"}
                  aria-describedby={validationErrors.password ? "password-error" : undefined}
                  className={validationErrors.password ? "border-red-300 dark:border-red-500" : ""}
                />
                {validationErrors.password && (
                  <p className="text-xs text-red-500 dark:text-red-400" id="password-error">
                    {validationErrors.password}
                  </p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" className="mr-2" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-200 dark:after:border-gray-700" aria-hidden="true">
                <span className="relative z-10 bg-white px-2 text-gray-500 dark:bg-[#0F0F12] dark:text-gray-400">Or continue with</span>
              </div>
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  className="w-full max-w-[200px]" 
                  type="button"
                  aria-label="Login with Google"
                  disabled={loading}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    className="w-5 h-5"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="ml-2">Login with Google</span>
                </Button>
              </div>
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <a 
                  href="/register" 
                  className="text-blue-600 hover:underline underline-offset-4 dark:text-blue-400"
                  aria-label="Go to sign up page"
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-gray-100 dark:bg-[#151518] md:block" aria-hidden="true">
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="max-w-sm">
                <div className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Track your trading journey
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Journal your trades, analyze your performance, and improve your trading strategy with our powerful analytics tools.
                </p>
                <ul className="mt-6 space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <svg 
                      className="mr-2 h-5 w-5 text-green-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Detailed trade analytics
                  </li>
                  <li className="flex items-center">
                    <svg 
                      className="mr-2 h-5 w-5 text-green-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Performance metrics
                  </li>
                  <li className="flex items-center">
                    <svg 
                      className="mr-2 h-5 w-5 text-green-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    AI-powered insights
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-gray-500 dark:text-gray-400 [&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-blue-700 dark:[&_a]:text-blue-400">
        By clicking continue, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
      </div>
    </div>
  );
}