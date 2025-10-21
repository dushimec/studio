
'use client'
 
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">{t('Something went wrong!')}</h1>
      <p className="text-muted-foreground mb-6">{error.message}</p>
      <Button onClick={() => reset()}>{t('Try again')}</Button>
    </div>
  )
}
