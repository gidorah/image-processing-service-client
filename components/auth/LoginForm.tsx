"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validators";
import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: (values: LoginInput) => api.post("/auth/login/", values),
    onSuccess: () => {
      setAuth(true); // cookies are set server-side
      //router.replace("/(main)/dashboard"); // or wherever
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const onSubmit = form.handleSubmit((values) => loginMutation.mutate(values));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* Input, Label, ErrorMessage for username */}
      {/* Input, Label, ErrorMessage for password */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...form.register("username")} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" {...form.register("password")} />
      </div>
      <Button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Logging in..." : "Log In"}
      </Button>
    </form>
  );
}
