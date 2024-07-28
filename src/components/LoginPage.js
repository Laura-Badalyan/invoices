import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LoginPage = ({ setUser }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('https://bever-aca-assignment.azurewebsites.net/users');
      
      const user = response.data.value.find( user => user.Name === username && user.Password === password
      );

      if (user) {
        setUser(user);
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleLogin} className='flex flex-col w-100 mx-auto justify-between items-center'>
        <div className="mb-4 flex flex-col items-center">
          <label className='text-2xl mb-3'>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="mb-2 p-2 text-lg border border-gray-300 rounded" />
        </div>
        <div className='mb-4 flex flex-col items-center'>
          <label className='text-2xl mb-3'>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-2 p-2 text-lg border border-gray-300 rounded" />
        </div>
        <p>{error ? error : ""}</p>
        <button type="submit" className="bg-blue-500 text-white px-20 py-1 rounded mt-10">
            <Link to="/invoices">Log In</Link>
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
