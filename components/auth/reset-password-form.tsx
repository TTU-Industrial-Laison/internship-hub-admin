"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetPasswordValues,
  resetPasswordSchema,
} from "@/lib/validations/forms/auth";
import { useResetPassword } from "@/lib/hooks/mutations/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Loader2,
  ChevronLeft,
  ArrowLeft,
  XCircle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const code = searchParams.get("code");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPassword();

  const { control, handleSubmit, reset } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email || "",
      code: code || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordValues) => {
    resetPassword(data);
    reset();
  };

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Reset Password
          </CardTitle>
          <CardDescription className="text-base">
            Enter your email, the code you received, and your new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              {/* Email Field */}
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email address</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending || !!email}
                      className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all font-medium"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Code Field */}
              <Controller
                control={control}
                name="code"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="code">Verification Code</FieldLabel>
                    <Input
                      {...field}
                      id="code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending || !!code}
                      className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all font-mono text-center text-lg tracking-widest"
                      maxLength={6}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* New Password Field */}
              <Controller
                control={control}
                name="newPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
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
                        tabIndex={-1}
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

              {/* Confirm Password Field */}
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        aria-invalid={fieldState.invalid}
                        disabled={isPending}
                        className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isPending}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showConfirmPassword
                            ? "Hide password"
                            : "Show password"}
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pt-2">
          <Link
            href="/auth/login"
            className={cn(
              "flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors",
              isPending && "pointer-events-none opacity-50",
            )}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
