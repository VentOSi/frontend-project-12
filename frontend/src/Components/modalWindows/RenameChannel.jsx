import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import cn from 'classnames';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSocket from '../../Hooks/useSocket.jsx';
import { actions as modalsActions } from '../../Slices/modalsSlice.js';

const RenameChannel = () => {
  const socketChat = useSocket();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const onHide = () => dispatch(modalsActions.closeModal());
  const modalInfo = useSelector((state) => state.modalsReducer.setModalInfo);
  const channelId = modalInfo.targetId;
  const channels = useSelector((state) => state.channelsReducer.channels);
  const channelName = channels.map((i) => i.name);
  const popUpNotification = () => toast.success(t('channels.channelRenamed'));

  const setNameSchema = yup.object().shape({
    channelName: yup
      .string()
      .trim()
      .min(3, t('modals.numberCharacters'))
      .max(20, t('modals.numberCharacters'))
      .required(t('modals.obligatoryField'))
      .notOneOf(channelName, t('modals.mustUnique')),
  });

  const channelToRename = channels.find((i) => i.id === channelId);
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setSubmitting,
    isSubmitting,
  } = useFormik({
    initialValues: {
      channelName: channelToRename ? channelToRename.name : '',
    },
    validationSchema: setNameSchema,
    validateOnChange: false,
    errorToken: false,
    onSubmit: () => {
      setSubmitting(true);
      socketChat
        .renameChannel(channelId, values)
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

  const classError = cn('mb-2 form-control', {
    'is-invalid': errors.channelName,
  });

  const inputRef = useRef(null);
  useEffect(() => {
    setTimeout(() => inputRef.current.select());
  }, []);

  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <FormGroup className="mb-3">
            <Modal.Footer>
              <Form.Control
                ref={inputRef}
                name="channelName"
                id="channelName"
                className={classError}
                value={values.channelName}
                onChange={handleChange}
              />
              <Form.Label className="visually-hidden" htmlFor="channelName">
                {t('modals.channelName')}
              </Form.Label>
              <div className="invalid-feedback">{errors.channelName}</div>
            </Modal.Footer>
          </FormGroup>
          <FormGroup className="d-flex justify-content-end m-3">
            <Button
              variant="secondary"
              type="button"
              className="me-2 btn-secondary"
              onClick={() => onHide()}
            >
              {t('modals.cancel')}
            </Button>
            <Button
              className="btn-primary"
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {t('modals.send')}
            </Button>
          </FormGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannel;
