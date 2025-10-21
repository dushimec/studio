'use client';

import { OwnerLayout } from '@/components/owner-layout';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function MessagesPage() {
  const { t } = useTranslation();

  return (
    <OwnerLayout>
      <div>
        <h1 className="text-4xl font-headline font-bold mb-8">{t('Messages / Notifications')}</h1>
        <Card>
          <CardHeader>
            <CardTitle>{t('Coming Soon!')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t('This page is under construction. You will soon be able to communicate with renters and receive notifications here.')}</p>
          </CardContent>
        </Card>
      </div>
    </OwnerLayout>
  );
}
