import React, { useState } from 'react';
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';

export function RegisterForm({ className, ...props }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const navigate = useNavigate();
  const { register } = useAuth();

  const validateForm = () => {
    const errors = {};
    if (!username) {
      errors.username = "Username is required";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
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
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (!validateForm()) return;
    setLoading(true);
    try {
      const success = await register(email, password, username);
      if (success) {
        navigate('/login');
      } else {
        setApiError('Registration failed');
      }
    } catch (err) {
      setApiError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create an Account</h1>
                <p className="text-balance text-muted-foreground">Sign up for your trading journal account</p>
              </div>
              {apiError && (
                <div className="text-red-500 text-sm text-center">{apiError}</div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="username" className={validationErrors.username ? "text-red-500" : ""}>Username</Label>
                <Input id="username" name="username" type="text" placeholder="johndoe" value={username} onChange={e => setUsername(e.target.value)} required aria-invalid={!!validationErrors.username} />
                {validationErrors.username && <p className="text-xs text-red-500" id="username-error">{validationErrors.username}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className={validationErrors.email ? "text-red-500" : ""}>Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" value={email} onChange={e => setEmail(e.target.value)} required aria-invalid={!!validationErrors.email} />
                {validationErrors.email && <p className="text-xs text-red-500" id="email-error">{validationErrors.email}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className={validationErrors.password ? "text-red-500" : ""}>Password</Label>
                <Input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required aria-invalid={!!validationErrors.password} />
                {validationErrors.password && <p className="text-xs text-red-500" id="password-error">{validationErrors.password}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className={validationErrors.confirmPassword ? "text-red-500" : ""}>Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required aria-invalid={!!validationErrors.confirmPassword} />
                {validationErrors.confirmPassword && <p className="text-xs text-red-500" id="confirmPassword-error">{validationErrors.confirmPassword}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading} aria-busy={loading}>
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" className="w-full max-w-[200px]" type="button" disabled={loading}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true" focusable="false">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
                  </svg>
                  <span className="ml-2">Sign up with Google</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{' '}
                <a href="/login" className="underline underline-offset-4">Log in</a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img src="/placeholder.svg" alt="Image" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
} 