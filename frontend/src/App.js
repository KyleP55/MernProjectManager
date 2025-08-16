import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import HubPage from './pages/HubPage';
import AuthRedirect from './util/AuthRedirect';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path='/createAccount' element={<CreateAccountPage />} />
        <Route path='/hub' element={<AuthRedirect><HubPage /></AuthRedirect>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
