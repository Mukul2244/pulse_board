import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API } from "../api";
import { toast } from "sonner";
import {
  BackgroundBeams,
  GlassCard,
  BorderBeam,
  ShimmerButton,
} from "@/components/ui/aceternity";
import { Activity } from "lucide-react";

type F = { email: string; password: string };
export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<F>();

  const onSubmit = async (data: F) => {
    try {
      const resp = await API.auth.login(data);
      localStorage.setItem("accessToken", resp.data.data.accessToken);
      toast.success("Login successful");
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error("Login failed. Check your credentials.");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="relative flex-1 flex items-center justify-center min-h-[calc(100vh-56px)] overflow-hidden bg-background">
      <BackgroundBeams />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-primary/8 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <GlassCard glow="primary" className="p-8">
          <BorderBeam duration={10} />

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
              <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-foreground">PulseBoard</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-sm mb-7">
            Sign in to your account to continue.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field label="Email" error={errors.email?.message}>
              <Input
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                })}
                className="h-10 bg-background/50 border-border/60 focus-visible:ring-primary/50 focus-visible:border-primary/60 rounded-xl"
              />
            </Field>

            <Field
              label="Password"
              error={errors.password?.message}
              action={
                <a
                  href="#"
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot?
                </a>
              }
            >
              <Input
                type="password"
                {...register("password", {
                  required: "Required",
                  minLength: { value: 6, message: "Min 6 chars" },
                })}
                className="h-10 bg-background/50 border-border/60 focus-visible:ring-primary/50 focus-visible:border-primary/60 rounded-xl"
              />
            </Field>

            <ShimmerButton
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 mt-1"
            >
              {isSubmitting ? "Signing in…" : "Sign in →"}
            </ShimmerButton>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            No account?{" "}
            <Link
              to="/register"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Create one free
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  action,
  children,
}: {
  label: string;
  error?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground/80">
          {label}
        </Label>
        {action}
      </div>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
