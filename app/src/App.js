import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

// Screens
import Login from './screens/Login';
import Home from './screens/Home';
import { getUserInfo } from './utils/getUser';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />

        {/* Everything besides the path /login will direct to Home component */}
        <Route
          path='/*'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

const ProtectedRoute = ({ children }) => {
  const userInfo = getUserInfo();

  if (!userInfo) return <Navigate to='/login' replace />;

  return children;
};

export default App;
