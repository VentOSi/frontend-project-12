import React from 'react';
import { Container, Navbar, Button } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../Hooks/useAuth.jsx';
import routes from '../routes.js';

const HeaderComponent = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  return (
    <>
      <Navbar className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <Container>
          <Navbar.Brand as={Link} to={routes.chatPagePath()}>
            {t('header.mainHeader')}
          </Navbar.Brand>
          {auth.token ? (
            <Button
              type="button"
              className="btn btn-primary"
              onClick={auth.logOut}
            >
              {t('header.goOut')}
            </Button>
          ) : null}
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};

export default HeaderComponent;
