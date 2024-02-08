import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { defaultChannelId } from '../../Slices/channelsSlice.js';
import ChannelsManagement from './ChannelsManagement.jsx';
import { actions as modalsActions } from '../../Slices/modalsSlice.js';

const Channels = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  // eslint-disable-next-line max-len
  const showModal = (type, targetId = null) => dispatch(modalsActions.openModal({ type, targetId }));

  const channels = useSelector((state) => state.channelsReducer.channels || []);
  const currentChannelId = useSelector((state) => state.channelsReducer.channelId);
  const channelRef = useRef(null);

  useEffect(() => {
    if (currentChannelId !== defaultChannelId) {
      channelRef.current.scrollTo(
        currentChannelId,
        channelRef.current.scrollHeight,
      );
    } else {
      channelRef.current.scrollTo(0, 0);
    }
  }, [channels, currentChannelId]);

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <span className="bold-text">{t('channels.channels')}</span>
        <button
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
          onClick={() => showModal('add')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">{t('channels.plus')}</span>
        </button>
      </div>
      <ul
        ref={channelRef}
        id="channels-box"
        className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      >
        <ChannelsManagement showModal={showModal} />
      </ul>
    </div>
  );
};

export default Channels;
