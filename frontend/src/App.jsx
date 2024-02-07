import React from 'react';
import { Provider } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ChatPage from './Components/ChatPage.jsx';
import LoginPage from './Components/LoginPage.jsx';
import RegistrationPage from './Components/RegistrationPage.jsx';
import HeaderComponent from './Components/HeaderComponent.jsx';
import NotFoundPage from './Components/NotFoundPage.jsx';
import routes from './routes.js';
import useAuth from './Hooks/useAuth.jsx';
import store from './Slices/index.js';
import ModalComponent from './Components/ModalComponent.jsx';

const RoutePrivate = ({ children }) => {
  const auth = useAuth();
  return auth.logIn ? children : auth.logOut;
};

const App = () => (
  <Provider store={store}>
    <div className='d-flex flex-column h-100'>
      <HeaderComponent />
      <Routes>
        <Route
          path={routes.chatPagePath()}
          element={(
            <RoutePrivate>
              <ChatPage />
            </RoutePrivate>
          )}
        />
        <Route path={routes.loginPagePath()} element={<LoginPage />} />
        <Route path={routes.signupPagePath()} element={<RegistrationPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      <ModalComponent />
    </div>
    <ToastContainer />
  </Provider>
);

export default App;
