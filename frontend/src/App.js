import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import HubPage from './pages/HubPage';

import Header from './components/Header';
import AuthRedirect from './util/AuthRedirect';
import LoggedinRedirect from './util/LoggedinRedirect';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Header />}>
          <Route index element={<LoggedinRedirect><LoginPage /></LoggedinRedirect>} />
          <Route path='/createAccount' element={<CreateAccountPage />} />
          <Route path='/hub' element={<AuthRedirect><HubPage /></AuthRedirect>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

//<LoggedinRedirect><LoginPage /></LoggedinRedirect>