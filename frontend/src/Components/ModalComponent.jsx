import React from 'react';
import { useSelector } from 'react-redux';
import getModal from './modalWindows/index.js';

const ModalComponent = () => {
  const modalInfo = useSelector((state) => state.modalsReducer.setModalInfo);
  if (!modalInfo.type) {
    return null;
  }
  const Component = getModal(modalInfo.type);
  return <Component />;
};

export default ModalComponent;
