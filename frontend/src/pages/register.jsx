import React from 'react';
import { RegisterForm } from '../components/register-form';

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage; 