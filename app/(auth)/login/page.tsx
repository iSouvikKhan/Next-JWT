'use client';

import { useState } from 'react';
import { setToken, setUser } from '@/redux/auth/auth.slice';
import useAuthSession from '../../../hooks/useAuthSession';
import { useAppDispatch } from '@/redux/store';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const user = useAuthSession();

  // validation variables
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  const validateForm = () => {
    let isValid = true;
    setUsernameError('');
    setPasswordError('');

    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters long');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    // Implement the logic to authenticate the user

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('/api/login', { username, password });
      const { token } = response.data;

      localStorage.setItem('token', token);
      dispatch(setToken(token));

      // Fetch and set user data
      const userResponse = await axios.get('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setUser(userResponse.data.user));
      toast.success('Login successful!');
    } catch (error) {
      setLoginError('Login failed. Please check your credentials and try again.');
      toast.error('Login failed. Please check your credentials and try again.');
      console.error('Login failed', error);
    }

  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {user ? (
          <div>
            <h2 
            className="w-full text-center px-4 py-2 mt-4 border rounded-md text-black dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            >Welcome, {user.username}</h2>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 mt-4 border rounded-md text-black dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 mt-4 border rounded-md text-black dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-500 rounded-md"
            >
              Login
            </button>
            {loginError && <p className="text-red-500 text-sm mt-4">{loginError}</p>}
          </div>
        )}
        <div className="mt-6 p-4 border rounded-md text-black bg-gray-50">
          <h3 className="text-lg font-semibold">The hook should be usable like this: </h3>
          <pre className="mt-2 p-2 text-gray-500 bg-gray-100 rounded-md">
            <code>
              {
              `const { user } = useAuthSession();
if (user) {
  console.log('User:', user.username);
}`
                }
            </code>
          </pre>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
