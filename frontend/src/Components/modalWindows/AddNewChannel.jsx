import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import Modal from 'react-bootstrap/Modal';
import cn from 'classnames';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSocket from '../../Hooks/useSocket.jsx';
import { actions as channelsActions } from '../../Slices/channelsSlice.js';
import { actions as modalsActions } from '../../Slices/modalsSlice.js';

const AddNewChannel = () => {
  const socketChat = useSocket();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const onHide = () => dispatch(modalsActions.closeModal());
  const channels = useSelector((state) => state.channelsReducer.channels);
  const channelName = channels ? channels.map((channel) => channel.name) : [];
  const popUpNotification = () => toast.success(t('channels.channelCreated'));

  const setNameSchema = yup.object().shape({
    channelName: yup
      .string()
      .trim()
      .min(3, t('modals.numberCharacters'))
      .max(20, t('modals.numberCharacters'))
      .required(t('modals.obligatoryField'))
      .notOneOf(channelName, t('modals.mustUnique')),
  });

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setSubmitting,
    isSubmitting,
  } = useFormik({
    initialValues: {
      channelName: '',
    },
    validationSchema: setNameSchema,
    validateOnChange: false,
    errorToken: false,
    onSubmit: () => {
      setSubmitting(true);
      socketChat
        .addChannel(values)
        .then((response) => {
          dispatch(channelsActions.moveToChannel(response.id));
          values.channelName = '';
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

  const showModal = () => {
    inputRef.current.focus();
  };

  return (
    <Modal show centered onShow={showModal} className='modal-form'>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('modals.addChannel')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Form.Group className='mb-3'>
          <Modal.Footer>
            <Form.Control
              ref={inputRef}
              name='channelName'
              id='channelName'
              placeholder={t('modals.text')}
              className={classError}
              value={values.channelName}
              onChange={handleChange}
            />
            <Form.Label className='visually-hidden' htmlFor='channelName'>
              {t('modals.channelName')}
            </Form.Label>
            <div className='invalid-feedback'>{errors.channelName}</div>
          </Modal.Footer>
        </Form.Group>
        <FormGroup className='d-flex justify-content-end m-3'>
          <Button
            variant='secondary'
            type='button'
            className='me-2'
            onClick={() => onHide()}
          >
            {t('modals.cancel')}
          </Button>
          <Button
            className='btn-primary'
            type='submit'
            variant='primary'
            disabled={isSubmitting}
          >
            {t('modals.send')}
          </Button>
        </FormGroup>
      </Form>
    </Modal>
  );
};

export default AddNewChannel;
