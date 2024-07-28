import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LoginPage = ({ setUser }) => {

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    margin: 'auto'
  };
  
  const inputStyle = {
    marginBottom: '10px',
    padding: '8px',
    fontSize: '16px'
  };

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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={formStyle}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        </div>
        <p>{error ? error : ""}</p>
        <button type="submit">
            <Link to="/invoices">Login</Link>
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
