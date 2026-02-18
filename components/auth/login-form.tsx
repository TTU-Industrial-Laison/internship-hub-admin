"use client";

import { cn } from "@/lib/utils";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { loginSchema, LoginValues } from "@/lib/validations/forms/auth";
import { useLogin } from "@/lib/hooks/mutations/use-auth";

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, reset } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginValues) => {
    login(data);
    reset();
  };

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-base">
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                      className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Link
                        href="/auth/forgot-password"
                        className={cn(
                          "text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors",
                          isPending && "pointer-events-none opacity-50",
                        )}
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        disabled={isPending}
                        className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isPending}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type="submit"
              disabled={isPending}
              size="lg"
              className="w-full mt-2 h-12 text-base font-semibold rounded-full transition-all shadow-lg shadow-indigo-500/25"
            >
              {isPending ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                  Validating
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        {/* <CardFooter className="flex justify-center pt-2">
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className={cn(
                "font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors",
                isPending && "pointer-events-none opacity-50",
              )}
            >
              Sign up
            </Link>
          </div>
        </CardFooter> */}
      </Card>
    </div>
  );
}
