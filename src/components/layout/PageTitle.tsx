
'use client';

import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const PageTitle = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('We Go - Your Journey, Your Car.');
  }, [t]);

  return null;
};

export default PageTitle;
