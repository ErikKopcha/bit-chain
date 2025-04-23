'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ROUTES } from '../constants';
import { loginSchema } from '../schemas';

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter();
  const callbackUrl = ROUTES.DASHBOARD.path;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await signIn('credentials', {
        redirect: true,
        email: data.email,
        password: data.password,
        callbackUrl: ROUTES.DASHBOARD.path,
      });

      if (res?.error) {
        setError('root', {
          type: 'manual',
          message: 'Invalid email or password',
        });
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('root', {
        type: 'manual',
        message: 'An error occurred. Please try again.',
      });
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>Login with your email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register('email')}
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href={ROUTES.FORGOT_PASSWORD.path}
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    {...register('password')}
                    disabled={isSubmitting}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>

              <div className="text-center text-sm">
                Don't have an account?{' '}
                <Link href={ROUTES.REGISTER.path} className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
