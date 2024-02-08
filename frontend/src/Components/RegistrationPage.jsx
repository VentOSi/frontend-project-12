import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import avatar2 from '../images/avatar2.jpg';
import routes from '../routes.js';
import useAuth from '../Hooks/useAuth.jsx';

const RegistrationPage = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const usernameRef = useRef(null);
  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const registrationSchema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .min(3, t('signup.numberCharacters'))
      .max(20, t('signup.numberCharacters'))
      .required(t('signup.obligatoryField')),
    password: yup
      .string()
      .trim()
      .min(6, t('signup.moreCharacters'))
      .required(t('signup.obligatoryField')),
    confirmPassword: yup
      .string()
      .trim()
      .required(t('signup.obligatoryField'))
      .oneOf([yup.ref('password'), null], t('signup.passwordsMustMatch')),
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
    setSubmitting,
    isSubmitting,
  } = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registrationSchema,
    // eslint-disable-next-line no-shadow
    onSubmit: (values) => {
      setSubmitting(true);
      axios
        .post(routes.signupPath(), {
          username: values.username,
          password: values.password,
        })
        .then((response) => {
          auth.logIn(response);
          navigate(routes.chatPagePath());
        })
        .catch((err) => {
          if (err.response.status === 409) {
            errors.username = t('signup.alreadyExists');
            return setSubmitting(false);
          }
          return setSubmitting(false);
        });
    },
  });

  return (
    <>
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                <div>
                  <img
                    src={avatar2}
                    className="rounded-circle"
                    alt={t('signup.registration')}
                  />
                </div>
                <Form className="w-50" onSubmit={handleSubmit}>
                  <h1 className="text-center mb-4">
                    {t('signup.registration')}
                  </h1>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      placeholder={t('signup.userName')}
                      name="username"
                      autoComplete="username"
                      required=""
                      id="username"
                      className={
                        errors.username && touched.username
                          ? 'form-control is-invalid'
                          : 'form-control'
                      }
                      onChange={handleChange}
                      value={values.username}
                      onBlur={handleBlur}
                      ref={usernameRef}
                    />
                    <div className="invalid-tooltip">{errors.username}</div>
                    <Form.Label className="form-label" htmlFor="username">
                      {t('signup.userName')}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      placeholder={t('signup.password')}
                      name="password"
                      aria-describedby="passwordHelpBlock"
                      required=""
                      autoComplete="new-password"
                      type="password"
                      id="password"
                      className={
                        errors.password && touched.password
                          ? 'form-control is-invalid'
                          : 'form-control'
                      }
                      onChange={handleChange}
                      value={values.password}
                      onBlur={handleBlur}
                    />
                    <div className="invalid-tooltip">{errors.password}</div>
                    <Form.Label className="form-label" htmlFor="password">
                      {t('signup.password')}
                    </Form.Label>
                  </Form.Group>
                  <Form.Group className="form-floating mb-4">
                    <Form.Control
                      placeholder={t('signup.confirmPassword')}
                      name="confirmPassword"
                      autoComplete="new-password"
                      required=""
                      type="password"
                      id="confirmPassword"
                      className={
                        errors.confirmPassword && touched.confirmPassword
                          ? 'form-control is-invalid'
                          : 'form-control'
                      }
                      onChange={handleChange}
                      value={values.confirmPassword}
                      onBlur={handleBlur}
                      disabled={isSubmitting}
                    />
                    <div className="invalid-tooltip">
                      {errors.confirmPassword}
                    </div>
                    <Form.Label
                      className="form-label"
                      htmlFor="confirmPassword"
                    >
                      {t('signup.confirmPassword')}
                    </Form.Label>
                  </Form.Group>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-100 mb-3 btn btn-outline-primary btn-light"
                  >
                    {t('signup.register')}
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="Toastify" />
    </>
  );
};

export default RegistrationPage;
