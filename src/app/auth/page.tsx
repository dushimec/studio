
import { Suspense } from 'react';
import AuthContainer from './auth-container';

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContainer />
    </Suspense>
  );
}
