import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import HubPage from './pages/HubPage';
import FeaturesPage from './pages/FeaturesPage';

import Header from './components/Header';
import AuthRedirect from './util/AuthRedirect';
import LoggedinRedirect from './util/LoggedinRedirect';

import './css/Master.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Header />}>
          <Route index element={<LoggedinRedirect><LoginPage /></LoggedinRedirect>} />
          <Route path='/createAccount' element={<CreateAccountPage />} />
          <Route path='/hub' element={<AuthRedirect><HubPage /></AuthRedirect>} />
          <Route path='/features' element={<FeaturesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;