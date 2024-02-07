/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const defaultChannelId = 1;

const initialState = {
  channels: [],
  channelId: defaultChannelId,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel(state, { payload }) {
      state.channels.push(payload);
    },

    removeChannel(state, { payload }) {
      const newChannel = state.channels.filter((channel) => channel.id !== payload.id);
      state.channelId = state.channelId === payload.id ? 1 : state.channelId;
      state.channels = newChannel;
    },

    renameChannel(state, { payload }) {
      const newNames = state.channels.map((channel) => {
        if (channel.id === payload.id) {
          return payload;
        }
        return channel;
      });
      state.channels = newNames;
    },

    setChannels: (state, { payload }) => {
      state.channels = payload;
    },

    setChannelId(state, { payload }) {
      state.channelId = payload;
    },

    moveToChannel(state, { payload }) {
      state.channelId = payload;
    },
  },
});

export const { actions } = channelsSlice;
export default channelsSlice.reducer;
