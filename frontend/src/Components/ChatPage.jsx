/* eslint-disable max-len */
import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useAuth from '../Hooks/useAuth.jsx';
import routes from '../routes.js';
import Channels from './Chat/Channels.jsx';
import Messages from './Chat/Messages.jsx';
import { actions as channelsActions } from '../Slices/channelsSlice';
import { actions as messagesActions } from '../Slices/messagesSlice';

const ChatPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!localStorage.getItem('userInfo')) {
      navigate(routes.loginPagePath());
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(routes.usersPath(), {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem('userInfo')).token
            }`,
          },
        });
        dispatch(channelsActions.setChannels(response.data.channels));
        dispatch(messagesActions.setMessages(response.data.messages));
      } catch (error) {
        if (error.status === 401) {
          navigate(routes.loginPagePath());
        }
        console.log(error);
      }
    };
    fetchData();
  }, [dispatch, auth, navigate]);

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <Channels />
        <Messages />
      </div>
    </div>
  );
};

export default ChatPage;
