import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Screens
import Login from './screens/Login';
import Home from './screens/Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />

        {/* Everything besides the path /login will direct to Home component */}
        <Route path='/*' element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
