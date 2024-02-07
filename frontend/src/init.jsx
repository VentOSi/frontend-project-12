import React from 'react';
import i18next from 'i18next';
import { BrowserRouter } from 'react-router-dom';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import { io } from 'socket.io-client';
import {
  Provider as RollbarProvider,
  ErrorBoundary as RollbarErrorBoundary,
} from '@rollbar/react';
import filterWords from 'leo-profanity';
import App from './App.jsx';
import AuthProvider from './Components/AuthProvider.jsx';
import SocketProvider from './Components/SocketProvider.jsx';
import { actions as channelsActions } from './Slices/channelsSlice.js';
import { actions as messagesActions } from './Slices/messagesSlice.js';
import slice from './Slices/index.js';
import resources from './Locales/index.js';

const init = async () => {
  const defaultLanguage = 'ru';
  const i18n = i18next.createInstance();

  await i18n.use(initReactI18next).init({
    resources,
    lng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });

  filterWords.add(filterWords.getDictionary('ru'));
  filterWords.add(filterWords.getDictionary('en'));

  const socket = io();

  socket.on('newChannel', (payload) => {
    slice.dispatch(channelsActions.addChannel(payload));
  });

  socket.on('removeChannel', (payload) => {
    slice.dispatch(channelsActions.removeChannel(payload));
  });

  socket.on('renameChannel', (payload) => {
    slice.dispatch(channelsActions.renameChannel(payload));
  });

  socket.on('newMessage', (payload) => {
    slice.dispatch(messagesActions.addMessage(payload));
  });

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN,
    environment: 'production',
  };

  return (
    <RollbarProvider config={rollbarConfig}>
      <RollbarErrorBoundary>
        <React.StrictMode>
          <I18nextProvider i18n={i18n}>
            <BrowserRouter>
              <AuthProvider>
                <SocketProvider socket={socket}>
                  <App />
                </SocketProvider>
              </AuthProvider>
            </BrowserRouter>
          </I18nextProvider>
        </React.StrictMode>
      </RollbarErrorBoundary>
    </RollbarProvider>
  );
};

export default init;
