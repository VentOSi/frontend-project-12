/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice.js';

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage(state, { payload }) {
      state.messages.push(payload);
    },

    setMessages(state, { payload }) {
      state.messages = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(channelsActions.removeChannel, (state, actions) => {
      const channelId = actions.payload.id;
      const remainingMessages = state.messages.filter((i) => i.channelId !== channelId);
      state.messages = remainingMessages;
    });
  },
});

export const { actions } = messagesSlice;
export default messagesSlice.reducer;
