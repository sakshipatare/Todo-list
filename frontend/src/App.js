import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import Login from './Component/Auth/LoginForm';
import SignupForm from './Component/Auth/SignupForm';

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Router>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/auth/signup' element={<SignupForm/>}/>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
