
'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useUserProfile } from "@/hooks/use-user-profile";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { user, isUserLoading } = useUser();
  const { userProfile, isLoading: isProfileLoading } = useUserProfile(user?.uid);

  useEffect(() => {
    if (!isUserLoading && user && !isProfileLoading && userProfile) {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userProfile.fullName}!`,
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
  }, [user, isUserLoading, userProfile, isProfileLoading, router, toast]);

  const handleLogin = async () => {
    if (!auth) return;
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message,
        });
        setIsLoading(false); // Only stop loading on error, success is handled by useEffect
      });
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="dushime@gmail.com" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full" onClick={handleLogin} disabled={isLoading || !email || !password}>
            {(isLoading || isUserLoading || isProfileLoading) && <span className="material-symbols-outlined mr-2 h-4 w-4 animate-spin">progress_activity</span>}
            Sign in
          </Button>
           <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
