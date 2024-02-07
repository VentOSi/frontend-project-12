import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import routes from '../routes.js';
import avatar3 from '../images/avatar3.jpg';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <img
        src={avatar3}
        className="img-fluid h-25"
        alt={t('notFound.notFound')}
      />
      <h1 className="h4 text-muted">{t('notFound.notFound')}</h1>
      <p className="text-muted">
        {t('notFound.redirectTextBegin')}
        <Link to={routes.chatPagePath()}>{t('notFound.redirectTextEnd')}</Link>
      </p>
    </div>
  );
};

export default NotFound;
