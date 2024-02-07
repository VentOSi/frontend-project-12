/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  setModalInfo: { type: null, targetId: null },
  isOpened: false,
};

const modalsSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal(state, { payload }) {
      const { type, targetId } = payload;
      state.setModalInfo.type = type;
      state.setModalInfo.targetId = targetId;
      state.isOpened = true;
    },
    closeModal(state) {
      state.setModalInfo.type = null;
      state.setModalInfo.targetId = null;
      state.isOpened = false;
    },
  },
});

export const { actions } = modalsSlice;
export default modalsSlice.reducer;
