import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import InvoicesPage from './components/InvoicesPage';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setUser={setUser} />} />
        <Route path="/invoices" element={user ? <InvoicesPage user={user} /> : <LoginPage setUser={setUser} />} />
      </Routes>
    </Router>
  );
};

export default App;
