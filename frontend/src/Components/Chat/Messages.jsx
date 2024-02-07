import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import filterWords from 'leo-profanity';
import useSocket from '../../Hooks/useSocket.jsx';
import useAuth from '../../Hooks/useAuth.jsx';

const Messages = () => {
  const { t } = useTranslation();
  const channels = useSelector((state) => state.channelsReducer.channels) || [];
  const channelsId = useSelector((state) => state.channelsReducer.channelId);
  // eslint-disable-next-line
  const messages = useSelector((state) => state.messagesReducer.messages) || [];
  const [message, setMessage] = useState('');
  const socketChat = useSocket();
  const auth = useAuth();
  const currentUser = JSON.parse(auth.token);

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const messagesInEnd = useRef(null);
  const scroll = () =>
    messagesInEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  useEffect(() => scroll(), [messages]);

  const activeChannelId = (channelItem) => {
    const filter = channelItem.find((channel) => channel.id === channelsId);
    return filter ? filter.name : t('channels.notFoundChannel');
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const currentName = currentUser.username;
    socketChat
      .newMessage(message, channelsId, currentName)
      .then(() => {
        setMessage('');
      })
      .catch((error) => {
        console.log('ERROR', error);
      });
  };

  const channelMessage = messages.filter((mes) => mes.channelId === channelsId);
  const messagesBox = channelMessage.map(({ username, id, body }) => {
    const isCurrentUser = username === currentUser.username;
    const messageClasses = isCurrentUser ? 'bg-light' : 'bg-transparent';
    return (
      <div className={`text-break mb-2 ${messageClasses}`} key={id}>
        <b>{username}</b>
        {`: ${filterWords.clean(body)}`}
      </div>
    );
  });

  return (
    <div className='col p-0 h-100'>
      <div className='d-flex flex-column h-100'>
        <div className='bg-light mb-4 p-3 shadow-sm small'>
          <p className='m-0'>
            <b># {activeChannelId(channels)} </b>
          </p>
          <span className='text-muted'>
            {`${channelMessage.length} ${t('chat.messagesCounter.messages', {
              count: channelMessage.length,
            })}`}
          </span>
        </div>
        <div id='messages-box' className='chat-messages overflow-auto px-5 '>
          {messagesBox}
          <div ref={messagesInEnd} />
        </div>
        <div className='mt-auto px-5 py-3'>
          <Form
            noValidate=''
            className='py-1 border rounded-2'
            onSubmit={sendMessage}
          >
            <div className='input-group has-validation'>
              <Form.Control
                name='body'
                aria-label={t('chat.messageNew')}
                placeholder={t('chat.enterMessage')}
                className='border-0 p-0 ps-2 form-control'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                ref={inputRef}
              />
              <Button
                type='submit'
                className='btn btn-group-vertical'
                disabled={!message}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 16 16'
                  width='20'
                  height='20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z'
                  />
                </svg>
                <span className='visually-hidden'>{t('chat.send')}</span>
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Messages;
