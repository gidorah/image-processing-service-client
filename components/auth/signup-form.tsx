"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupInput } from "@/lib/validators";
import useAuthStore from "@/store/authStore";
import { toast } from "sonner";
import { AxiosError } from "axios";

type AuthErrorResponse = {
  non_field_errors?: string[];
  email?: string[];
  password1?: string[];
  password2?: string[];
};

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const signupMutation = useMutation({
    mutationFn: (values: SignupInput) =>
      api.post("/auth/registration/", values),
    onSuccess: () => {
      setAuth(true);
      router.replace("/");
    },
    onError: (err: AxiosError<AuthErrorResponse>) => {
      if (err.response?.data?.email?.[0]) {
        toast.error(err.response.data.email[0]);
      } else if (err.response?.data?.password1?.[0]) {
        toast.error(err.response.data.password1[0]);
      } else if (err.message) {
        toast.error(err.message);
      } else {
        toast.error("An error occurred during signup");
      }
    },
  });

  const onSubmit = form.handleSubmit((values) => signupMutation.mutate(values));

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password1">Password</Label>
                </div>
                <Input
                  id="password1"
                  type="password"
                  required
                  {...form.register("password1")}
                />
                <div className="flex items-center">
                  <Label htmlFor="password2">Confirm Password</Label>
                </div>
                <Input
                  id="password2"
                  type="password"
                  required
                  {...form.register("password2")}
                />
                {form.formState.errors.password2 && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.password2.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  {signupMutation.isPending ? "Signing up..." : "Sign Up"}
                </Button>
                {/* <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
