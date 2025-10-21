'use client';

import { useAuthWithProfile } from '@/hooks/use-auth-with-profile';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import type { User } from '@/lib/types';
import { OwnerLayout } from '@/components/owner-layout';

export default function ProfilePage() {
  const { user, userProfile, isLoading } = useAuthWithProfile();
  const { register, handleSubmit, formState: { errors } } = useForm<Pick<User, 'displayName' | 'phoneNumber'>>();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t } = useTranslation();

  const onSubmit = async (data: Pick<User, 'displayName' | 'phoneNumber'>) => {
    if (!user || !firestore) return;

    const userRef = doc(firestore, 'users', user.uid);
    await setDocumentNonBlocking(userRef, data, { merge: true });

    toast({
      title: t('Profile Updated'),
      description: t('Your profile has been successfully updated.'),
    });
  };

  if (isLoading || !userProfile) {
    return <div>{t('Loading profile...')}</div>;
  }

  return (
    <OwnerLayout>
      <div>
        <h1 className="text-4xl font-headline font-bold mb-8">{t('My Profile')}</h1>
        <Card>
          <CardHeader>
            <CardTitle>{t('Update your information')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="displayName">{t('Display Name')}</Label>
                <Input id="displayName" {...register('displayName', { required: true })} defaultValue={userProfile.displayName} />
                {errors.displayName && <p className="text-red-500 text-sm">{t('This field is required')}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t('Email')}</Label>
                <Input id="email" type="email" value={userProfile.email} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">{t('Phone Number')}</Label>
                <Input id="phoneNumber" {...register('phoneNumber')} defaultValue={userProfile.phoneNumber} />
              </div>
              <Button type="submit">{t('Save Changes')}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </OwnerLayout>
  );
}
