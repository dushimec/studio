
'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuthWithProfile } from "@/hooks/use-auth-with-profile";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { t } = useTranslation();

  const { user, userProfile, isLoading } = useAuthWithProfile();

  useEffect(() => {
    if (!isLoading && user && userProfile) {
        toast({
            title: t("Login Successful"),
            description: `${t('Welcome back')}, ${userProfile.displayName}!`,
        });

        // Role-based redirection
        switch (userProfile.role) {
            case 'admin':
                router.push('/admin');
                break;
            case 'owner':
                router.push('/dashboard');
                break;
            case 'customer':
            default:
                router.push('/browse');
                break;
        }
    }
  }, [user, userProfile, isLoading, router, toast, t]);

  const handleLogin = async () => {
    if (!auth) return;
    setIsLoggingIn(true);
    signInWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        toast({
          variant: "destructive",
          title: t("Login Failed"),
          description: error.message,
        });
        setIsLoggingIn(false);
      });
  };

  const isButtonDisabled = isLoggingIn || isLoading || !email || !password;

  return (
    <div>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{t('Email')}</Label>
            <Input id="email" type="email" placeholder="dushime@gmail.com" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{t('Password')}</Label>
            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full" onClick={handleLogin} disabled={isButtonDisabled}>
            {(isLoggingIn || isLoading) && <span className="material-symbols-outlined mr-2 h-4 w-4 animate-spin">progress_activity</span>}
            {t('Sign in')}
          </Button>
           <div className="mt-4 text-center text-sm">
            {t("Don't have an account?")}{" "}
            <Link href="/auth?type=signup" className="underline">
              {t('Sign up')}
            </Link>
          </div>
        </CardFooter>
    </div>
  )
}
