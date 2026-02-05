"use client";
import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { loginSchema, type LoginValues } from "@/lib/schemas/auth";
import { toast } from "@/lib/providers/toaster";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("staff-id");

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  function onSubmit(data: LoginValues) {
    console.log("Submitted:", { ...data, type: activeTab });
  }

  return (
    <Card className="w-full max-w-lg border border-gray-300 bg-white/70 backdrop-blur-xl shadow-sm">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-semibold tracking-tight">
          Admin Login
        </CardTitle>
        <CardDescription className="text-gray-500">
          Secure access for authorized staff
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs
          defaultValue="staff-id"
          onValueChange={(val) => {
            setActiveTab(val);
            form.reset();
          }}
          className="w-full"
        >
          <TabsList className="mb-8 grid grid-cols-2 rounded-xl bg-gray-100 p-1 w-full">
            <TabsTrigger
              value="staff-id"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-card data-[state=active]:text-primary"
            >
              Staff ID
            </TabsTrigger>
            <TabsTrigger
              value="university-email"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-card data-[state=active]:text-primary"
            >
              University Email
            </TabsTrigger>
          </TabsList>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <Controller
                name="identifier"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="identifier"
                      className="text-sm font-medium text-gray-700"
                    >
                      {activeTab === "staff-id"
                        ? "Staff ID"
                        : "University Email"}
                    </FieldLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        {...field}
                        id="identifier"
                        placeholder={
                          activeTab === "staff-id"
                            ? "Enter your staff ID"
                            : "name@university.edu.gh"
                        }
                        className="border-gray-300 bg-gray-50 pl-10 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                        aria-invalid={fieldState.invalid}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </FieldLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="border-gray-300 bg-gray-50 pl-10 pr-10 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                        aria-invalid={fieldState.invalid}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                        <span className="sr-only">
                          Toggle password visibility
                        </span>
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button type="submit" className="w-full mt-4">
              Login
            </Button>
          </form>

          <div className="text-center">
            <Button size="sm" variant="link">
              Forgot password?
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
