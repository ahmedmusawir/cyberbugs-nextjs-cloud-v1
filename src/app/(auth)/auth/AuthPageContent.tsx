"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/common/Spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Bug, Eye, EyeOff, Shield, Zap, Users } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email is required",
    })
    .email({
      message: "Please enter a valid email",
    }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

const registerSchema = z
  .object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    email: z
      .string()
      .min(1, {
        message: "Email is required",
      })
      .email({
        message: "Please enter a valid email",
      }),
    password: z.string().min(1, {
      message: "Password is required",
    }),
    passwordConfirm: z.string().min(1, {
      message: "Password confirmation is required",
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

const AuthPageContent = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  useEffect(() => {
    try {
      const target = localStorage.getItem("redirectAfterLogin");
      if (target) {
        localStorage.removeItem("redirectAfterLogin");
        router.replace(target);
      }
    } catch {}
  }, [router]);

  const handleLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
    setError(null);
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } catch (error: any) {
      console.error("Login error:", error.message);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (data: z.infer<typeof registerSchema>) => {
    setError(null);
    setIsLoading(true);
    
    const user_metadata = {
      name: data.name,
      is_qr_superadmin: 0,
      is_qr_admin: 0,
      is_qr_member: 1,
    };

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          user_metadata: user_metadata,
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const result = await response.json();
        console.error("Signup error:", result.error);
        setError(result.error);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Signup error:", error.message);
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Modern Gradient with Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Glowing Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />

        {/* Branding Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Top Section */}
          <div>
            <Link href="/" className="flex items-center gap-4 mb-12 hover:opacity-90 transition-opacity">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/25">
                <Bug className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  CyberBugs Pro
                </h1>
                <p className="text-sm text-blue-400 font-medium">Enterprise Bug Tracking</p>
              </div>
            </Link>
          </div>

          {/* Center - Hero Text */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-4xl font-bold leading-tight mb-6">
              Ship Better Software,
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Faster Than Ever
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed mb-8">
              Streamline your QA workflow with intelligent bug tracking, 
              real-time collaboration, and powerful analytics built for 
              modern development teams.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Bugs Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Teams</div>
              </div>
            </div>
          </div>

          {/* Bottom - Feature Pills */}
          <div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2.5 rounded-full">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium">SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2.5 rounded-full">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium">Real-time Sync</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2.5 rounded-full">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium">Team Collaboration</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <Bug className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">CyberBugs Pro</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setError(null);
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === "login"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setError(null);
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === "register"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {activeTab === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-slate-400">
              {activeTab === "login"
                ? "Sign in to access your dashboard."
                : "Register as a new member."}
            </p>
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
                className="space-y-6"
              >
                {/* Email Field */}
                <FormField
                  control={loginForm.control}
                  name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-300">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 h-12"
                        placeholder="name@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-300">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 h-12 pr-10"
                          placeholder="Enter your password"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-950"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-slate-400 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="#"
                  className="text-sm text-blue-500 hover:text-blue-400"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-400 text-sm bg-red-950/50 border border-red-900 rounded-lg p-3">
                  {error}
                </div>
              )}

              {/* Loading Spinner */}
              {isLoading && (
                <div className="flex justify-center">
                  <Spinner />
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium disabled:opacity-50"
              >
                Sign In
              </Button>
            </form>
          </Form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}
                className="space-y-6"
              >
                {/* Name Field */}
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-300">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 h-12"
                          placeholder="John Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-300">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 h-12"
                          placeholder="name@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-300">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 h-12 pr-10"
                            placeholder="Create a password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={registerForm.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-300">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPasswordConfirm ? "text" : "password"}
                            className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 h-12 pr-10"
                            placeholder="Confirm your password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswordConfirm(!showPasswordConfirm)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                          >
                            {showPasswordConfirm ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Error Message */}
                {error && (
                  <div className="text-red-400 text-sm bg-red-950/50 border border-red-900 rounded-lg p-3">
                    {error}
                  </div>
                )}

                {/* Loading Spinner */}
                {isLoading && (
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium disabled:opacity-50"
                >
                  Create Account
                </Button>
              </form>
            </Form>
          )}

          {/* Footer */}
          {activeTab === "login" && (
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setActiveTab("register")}
                  className="text-blue-500 hover:text-blue-400"
                >
                  Register here
                </button>
              </p>
            </div>
          )}

          {activeTab === "register" && (
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <button
                  onClick={() => setActiveTab("login")}
                  className="text-blue-500 hover:text-blue-400"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}

          {/* Copyright */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-600">
              © 2024 CyberBugs Pro. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPageContent;
