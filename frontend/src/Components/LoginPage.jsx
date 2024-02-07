import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import cn from 'classnames';
import useAuth from '../Hooks/useAuth.jsx';
import routes from '../routes.js';
import avatar1 from '../images/avatar1.jpg';

const LoginPage = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const noNetworkError = () => toast.error(t('error.networkError'));
  const dataLoadingError = () => toast.error(t('error.dataLoadingError'));

  const [error, setError] = useState('');

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const loginSchema = yup.object().shape({
    username: yup.string().trim().required(),
    password: yup.string().trim().required(),
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
      username: '',
      password: '',
    },
    validationSchema: loginSchema,
    validateOnChange: false,
    errorToken: false,
    onSubmit: () => {
      setSubmitting(true);
      axios
        .post(routes.loginPath(), {
          username: values.username,
          password: values.password,
        })
        .then((response) => {
          auth.logIn(response);
          navigate(routes.chatPagePath());
        })
        .catch((err) => {
          if (err.status === 401) {
            setError(t('login.submissionFailed'));
            setSubmitting(false);
          }
          if (err.message === 'Network Error') {
            noNetworkError();
          }
          if (err.status === 500) {
            dataLoadingError();
          }
          setSubmitting(false);
        })
        .finally(() => {
          setSubmitting(true);
        });
    },
  });

  const errorClass = cn('form-control', {
    'is-invalid': errors.password || errors.username || error,
  });

  return (
    <>
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body row p-5">
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                  <img
                    src={avatar1}
                    className="rounded-circle"
                    alt={t('login.loginHeader')}
                  />
                </div>
                <Form
                  className="col-12 col-md-6 mt-3 mt-mb-0"
                  onSubmit={handleSubmit}
                >
                  <h1 className="text-center mb-4">{t('login.loginHeader')}</h1>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      ref={inputRef}
                      name="username"
                      autoComplete="username"
                      required=''
                      placeholder={t('login.yourNickname')}
                      id="username"
                      className={errorClass}
                      value={values.username}
                      onChange={handleChange}
                    />
                    <Form.Label htmlFor="username">
                      {t('login.yourNickname')}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group className="form-floating mb-4">
                    <Form.Control
                      name="password"
                      autoComplete="current-password"
                      required=''
                      placeholder={t('login.password')}
                      type="password"
                      id="password"
                      className={errorClass}
                      value={values.password}
                      onChange={handleChange}
                    />
                    <Form.Label className="form-label" htmlFor="password">
                      {t('login.password')}
                    </Form.Label>
                    <Form.Control.Feedback type="invalid">
                      {t('login.submissionFailed')}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-100 mb-3 btn btn-primary"
                  >
                    {t('login.loginHeader')}
                  </Button>
                </Form>
              </div>
              <div className="card-footer p-4">
                <div className="text-center">
                  <span>{t('login.noAccount')}</span>
                  <Link to={routes.signupPagePath()}>
                    {t('login.registration')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="Toastify" />
    </>
  );
};

export default LoginPage;
