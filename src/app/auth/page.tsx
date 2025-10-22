
'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { AuthPopup } from '@/components/ui/auth-popup';
import LoginPage from './login/page';
import SignupPage from './signup/page';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authType = searchParams.get('type');

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };

  return (
    <>
      <AuthPopup
        open={authType === 'login'}
        onOpenChange={handleOpenChange}
        title="Login"
      >
        <LoginPage />
      </AuthPopup>
      <AuthPopup
        open={authType === 'signup'}
        onOpenChange={handleOpenChange}
        title="Sign Up"
      >
        <SignupPage />
      </AuthPopup>
    </>
  );
}
