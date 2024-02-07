import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import FormGroup from 'react-bootstrap/FormGroup';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSocket from '../../Hooks/useSocket.jsx';
import { actions as modalsActions } from '../../Slices/modalsSlice.js';

const RemoveChannel = () => {
  const socketChat = useSocket();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const onHide = () => dispatch(modalsActions.closeModal());
  const modalInfo = useSelector((state) => state.modalsReducer.setModalInfo);
  const channelId = modalInfo.targetId;
  const popUpNotification = () => toast.success(t('channels.channelDeleted'));

  const { handleSubmit, setSubmitting, isSubmitting } = useFormik({
    initialValues: {
      removingChannelId: null,
    },
    onSubmit: () => {
      setSubmitting(true);
      socketChat
        .removeChannel(channelId)
        .then(() => {
          onHide();
          popUpNotification();
        })
        .catch((error) => {
          console.log('ERROR', error);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  const inputRef = useRef(null);

  return (
    <Modal show centered>
      <Modal.Header closeButton onClick={onHide}>
        <Modal.Title className="modal-title h4">
          {t('modals.deleteChannel')}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p className="lead">{t('modals.sure')}</p>
        </Modal.Body>
        <FormGroup className="d-flex justify-content-end m-3">
          <Button
            className="me-2 btn-secondary"
            variant="secondary"
            onClick={() => onHide()}
          >
            {t('modals.cancel')}
          </Button>
          <Button
            className="btn-primary"
            type="submit"
            variant="danger"
            ref={inputRef}
            disabled={isSubmitting}
          >
            {t('modals.delete')}
          </Button>
        </FormGroup>
      </Form>
    </Modal>
  );
};

export default RemoveChannel;
