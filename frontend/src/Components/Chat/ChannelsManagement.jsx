import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import filterWords from 'leo-profanity';
import { actions as channelsActions } from '../../Slices/channelsSlice.js';

const ChannelsManagement = ({ showModal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channelsReducer.channels) || [];
  const channelIdActive = useSelector(
    (state) => state.channelsReducer.channelId
  );

  const setChannelIdAction = (id) => {
    dispatch(channelsActions.setChannelId(id));
  };
  const render = channels.map((channel) => {
    const { name, id, removable } = channel;
    return !removable ? (
      <li className='nav-item w-100' key={id}>
        <button
          type='button'
          className={
            id === channelIdActive
              ? 'w-100 rounded-0 text-start btn btn-secondary'
              : 'w-100 rounded-0 text-start btn'
          }
          onClick={() => setChannelIdAction(id)}
        >
          <span className='me-1'>#</span>
          {name}
        </button>
      </li>
    ) : (
      <li className='nav-item w-100' key={id}>
        <Dropdown as={ButtonGroup} className='d-flex'>
          <Button
            key={id}
            variant={id === channelIdActive ? 'secondary' : 'light'}
            className='w-100 rounded-0 text-start text-truncate'
            onClick={() => setChannelIdAction(id)}
          >
            <span className='me-1'>#</span>
            {filterWords.clean(name)}
          </Button>
          <Dropdown.Toggle
            variant={
              id === channelIdActive
                ? 'flex-grow-0 dropdown-toggle dropdown-toggle-split btn btn-secondary'
                : 'flex-grow-0 dropdown-toggle dropdown-toggle-split btn'
            }
          >
            <span className='visually-hidden'>
              {t('channels.channelManagement')}
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => showModal('delete', id)}>
              {t('channels.delete')}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => showModal('rename', id)}>
              {t('channels.rename')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </li>
    );
  });
  return render;
};

export default ChannelsManagement;
