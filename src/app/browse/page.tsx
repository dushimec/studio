
'use client';

import { Suspense } from 'react';
import { BrowseGrid } from '@/app/browse/browse-grid';
import { useTranslation } from 'react-i18next';

export default function BrowsePage() {
  const { t } = useTranslation();

  return (
    <Suspense fallback={<div>{t('Loading...')}</div>}>
      <BrowseGrid />
    </Suspense>
  );
}
