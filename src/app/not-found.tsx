
'use client'
 
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTranslation } from 'react-i18next';
 
export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('404 - Page Not Found')}</h1>
        <p className="text-muted-foreground mb-6">{t('The page you are looking for does not exist.')}</p>
        <Button asChild>
            <Link href="/">{t('Go to Homepage')}</Link>
        </Button>
    </div>
  )
}
