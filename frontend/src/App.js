import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import Login from './Component/Auth/LoginForm';
import SignupForm from './Component/Auth/SignupForm';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <GoogleOAuthProvider clientId="96058883383-37l1psr3jj24606a7doisqhd6ac0th2h.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/auth/signup' element={<SignupForm/>}/>
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
