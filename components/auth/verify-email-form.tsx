"use client";

import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, RefreshCw } from "lucide-react";

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
import { useResendVerification, useVerifyEmail } from "@/lib/hooks/use-auth";
import { useSearchParams } from "next/navigation";

export function VerifyEmailForm() {
  const { mutate: verify, isPending: isVerifying } = useVerifyEmail();
  const { mutate: resend, isPending: isResending } = useResendVerification();

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

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

  const onVerify = (data: VerifyEmailValues) => {
    verify(data);
  };

  const onResend = () => {
    if (email) {
      resend({ email });
    }
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
              className={`font-medium ${email ? "text-primary" : "text-foreground"}`}
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
                          onChange={field.onChange}
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
        <CardFooter className="flex flex-col gap-4 justify-center pt-2 pb-6">
          <div className="text-sm text-muted-foreground text-center">
            Didn&apos;t receive the code? Check your spam folder.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
