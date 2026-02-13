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
  CardFooter,
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
import {
  registerStudentSchema,
  RegisterStudentValues,
} from "@/lib/validations/forms/auth";
import { useRegisterStudent } from "@/lib/hooks/mutations/use-auth";

export function RegisterForm() {
  const { mutate: register, isPending } = useRegisterStudent();
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit } = useForm<RegisterStudentValues>({
    resolver: zodResolver(registerStudentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "Kok1@551",
    },
  });

  const onSubmit = (data: RegisterStudentValues) => {
    register(data);
  };

  return (
    <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
      <Card>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription className="text-base">
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="firstName">First name</FieldLabel>
                      <Input
                        {...field}
                        disabled={isPending}
                        id="firstName"
                        placeholder="John"
                        aria-invalid={fieldState.invalid}
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
                  name="lastName"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                      <Input
                        {...field}
                        disabled={isPending}
                        id="lastName"
                        placeholder="Doe"
                        aria-invalid={fieldState.invalid}
                        className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      disabled={isPending}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      aria-invalid={fieldState.invalid}
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
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        disabled={isPending}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
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
                  Creating Account
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pt-2">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className={cn(
                "font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors",
                isPending && "pointer-events-none opacity-50",
              )}
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
