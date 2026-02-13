"use client";

import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/lib/providers/toaster-provider";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  verifyEmailSchema,
  VerifyEmailValues,
} from "@/lib/validations/forms/auth";
import {
  useResendVerification,
  useVerifyEmail,
} from "@/lib/hooks/mutations/use-auth";
import Link from "next/link";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const { mutate: verify, isPending: isVerifying } = useVerifyEmail();
  const { mutate: resend, isPending: isResending } = useResendVerification();

  const { control, handleSubmit, setValue } = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: email || "",
      code: "",
    },
  });

  useEffect(() => {
    if (email) {
      setValue("email", email);
    }
  }, [email, setValue]);

  // Centralized email check
  const ensureEmailExists = (): string | null => {
    if (!email) {
      toast.error("Email not found. Redirecting...");
      router.push("/auth/forgot-password");
      return null;
    }
    return email;
  };

  const onVerify = (data: VerifyEmailValues) => {
    const validEmail = ensureEmailExists();
    if (!validEmail) return;

    verify({ ...data, email: validEmail });
  };

  const onResend = () => {
    const validEmail = ensureEmailExists();
    if (!validEmail) return;

    resend({ email: validEmail });
  };

  return (
    <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
      <Card>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Verify your email
          </CardTitle>
          <CardDescription className="text-base">
            Enter the 6-digit code sent to{" "}
            <span
              className={`font-medium ${
                email ? "text-primary" : "text-foreground"
              }`}
            >
              {email || "your email"}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onVerify)} className="space-y-6">
            <FieldGroup>
              <Controller
                control={control}
                name="code"
                render={({ field, fieldState }) => {
                  // slot styles
                  const slotStyles = cn(
                    "size-14 text-lg border border-gray-400 rounded-md transition-colors",
                    fieldState.invalid &&
                      "border-destructive ring-destructive text-destructive",
                  );

                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center justify-between mb-2">
                        <FieldLabel htmlFor="code">
                          Verification code
                        </FieldLabel>
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          onClick={onResend}
                          disabled={isResending || !email || isVerifying}
                          className={cn(
                            "h-auto p-0 text-xs font-normal text-muted-foreground hover:text-indigo-600 transition-colors",
                            isResending && "opacity-50",
                          )}
                        >
                          {isResending ? (
                            <Loader className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3! w-3!" />
                          )}
                          {isResending ? "Resending" : "Resend Code"}
                        </Button>
                      </div>

                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          id="code"
                          value={field.value}
                          onChange={(value) => {
                            const numericValue = value.replace(/\D/g, "");
                            field.onChange(numericValue);
                          }}
                          disabled={isVerifying}
                          aria-invalid={fieldState.invalid}
                        >
                          <InputOTPGroup className="gap-2">
                            <InputOTPSlot index={0} className={slotStyles} />
                            <InputOTPSlot index={1} className={slotStyles} />
                            <InputOTPSlot index={2} className={slotStyles} />
                          </InputOTPGroup>
                          <InputOTPSeparator className="mx-2 text-slate-300" />
                          <InputOTPGroup className="gap-2">
                            <InputOTPSlot index={3} className={slotStyles} />
                            <InputOTPSlot index={4} className={slotStyles} />
                            <InputOTPSlot index={5} className={slotStyles} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>

                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
            <Button
              type="submit"
              disabled={isVerifying}
              size="lg"
              className="w-full mt-2 h-12 text-base font-semibold rounded-full transition-all shadow-lg shadow-indigo-500/25"
            >
              {isVerifying ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                  Verifying
                </>
              ) : (
                "Verify Email"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 justify-center pt-2 pb-2">
          <div className="text-sm text-muted-foreground text-center">
            Didn&apos;t receive the code? Check your spam folder.
          </div>
          <div className="flex justify-center pt-2">
            <Link
              href="/auth/login"
              className={cn(
                "flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors",
                isVerifying && "pointer-events-none opacity-50",
              )}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
