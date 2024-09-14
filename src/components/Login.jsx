import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, setGuestMode } = useAuth();

  const handleLogin = () => {
    if (login(username, password)) {
      toast.success('Logged in as admin');
      navigate('/');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleGuestMode = () => {
    setGuestMode();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6"
        />
        <Button onClick={handleLogin} className="w-full mb-4">
          Login as Admin
        </Button>
        <Button onClick={handleGuestMode} variant="outline" className="w-full">
          Guest Mode
        </Button>
      </div>
    </div>
  );
};

export default Login;
