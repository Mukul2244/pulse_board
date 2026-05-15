import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "../api/client";
import {
  Spotlight,
  GlassCard,
  BorderBeam,
  ShimmerButton,
  TiltCard,
  DotBackground,
} from "@/components/ui/aceternity";
import { Activity, CheckCircle, BarChart3, Zap, Shield } from "lucide-react";

type F = { firstName: string; lastName: string; email: string; password: string };
export const Route = createFileRoute("/register")({ component: RegisterPage });

const perks = [
  { icon: BarChart3, text: "Real-time analytics dashboard" },
  { icon: Zap, text: "Create unlimited polls instantly" },
  { icon: Shield, text: "Anonymous response mode" },
  { icon: CheckCircle, text: "Share with anyone, no sign-up needed" },
];

function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<F>();

  const onSubmit = async (data: F) => {
    try {
      await apiClient.post("/auth/register", data);
      navigate({ to: "/login" });
    } catch {
      alert("Registration failed. Try a different email.");
    }
  };

  return (
    <DotBackground className="flex-1 flex items-center justify-center min-h-[calc(100vh-56px)] relative overflow-hidden">
      <Spotlight />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/8 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-primary/6 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-4 grid lg:grid-cols-2 gap-8 items-center py-10">
        <TiltCard className="hidden lg:block">
          <GlassCard glow="secondary" className="p-8 h-full">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-secondary/30">
                <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg">PulseBoard</span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight leading-snug mb-3">
              The fastest way to
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                collect opinions
              </span>
            </h2>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              Create polls in seconds, share a link, and watch live results roll
              in. Free forever.
            </p>

            <ul className="space-y-3">
              {perks.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-foreground/80">{text}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </TiltCard>

        <GlassCard glow="primary" className="p-8">
          <BorderBeam
            colorFrom="hsl(var(--secondary))"
            colorTo="hsl(var(--primary))"
            duration={12}
          />

          <h1 className="text-2xl font-bold tracking-tight mb-1">
            Create account
          </h1>
          <p className="text-muted-foreground text-sm mb-7">
            Free forever. No credit card needed.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {[
              {
                name: "firstName" as const,
                label: "First Name",
                type: "text",
                placeholder: "Your first name",
                rules: {
                  required: "Required",
                  minLength: { value: 2, message: "Min 2 chars" },
                },
              },
              {
                name: "lastName" as const,
                label: "Last Name",
                type: "text",
                placeholder: "Your last name",
                rules: {
                  required: "Required",
                  minLength: { value: 2, message: "Min 2 chars" },
                },
              },
              {
                name: "email" as const,
                label: "Email",
                type: "email",
                placeholder: "you@example.com",
                rules: {
                  required: "Required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                },
              },
              {
                name: "password" as const,
                label: "Password",
                type: "password",
                placeholder: "",
                rules: {
                  required: "Required",
                  minLength: { value: 6, message: "Min 6 chars" },
                },
              },
            ].map((f) => (
              <div key={f.name} className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground/80">
                  {f.label}
                </Label>
                <Input
                  type={f.type}
                  placeholder={f.placeholder}
                  {...register(f.name, f.rules)}
                  className="h-10 bg-background/50 border-border/60 focus-visible:ring-primary/50 focus-visible:border-primary/60 rounded-xl"
                />
                {errors[f.name] && (
                  <p className="text-xs text-destructive">
                    {errors[f.name]?.message}
                  </p>
                )}
              </div>
            ))}

            <ShimmerButton
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 mt-1"
              colorFrom="hsl(var(--secondary))"
              colorTo="hsl(var(--primary))"
            >
              {isSubmitting ? "Creating account…" : "Get started free →"}
            </ShimmerButton>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </GlassCard>
      </div>
    </DotBackground>
  );
}
