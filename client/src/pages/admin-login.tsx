import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { loginMutation, user } = useAuth();
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/admin");
    }
  }, [user, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(credentials, {
      onSuccess: () => {
        setLocation("/admin");
      }
    });
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-dark-800 border-dark-700">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <svg width="60" height="60" viewBox="0 0 40 40" className="mx-auto">
                <defs>
                  <linearGradient id="adminGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(36, 42%, 65%)" />
                    <stop offset="100%" stopColor="hsl(36, 42%, 75%)" />
                  </linearGradient>
                </defs>
                <g transform="translate(20,5)">
                  <polygon points="-15,10 0,0 15,10 0,20" fill="url(#adminGradient)" opacity="0.9"/>
                  <polygon points="-15,10 0,20 0,35 -15,25" fill="hsl(36, 42%, 55%)" opacity="0.7"/>
                  <polygon points="15,10 0,20 0,35 15,25" fill="hsl(36, 42%, 50%)" opacity="0.8"/>
                </g>
              </svg>
            </motion.div>
            <CardTitle className="text-2xl font-title font-bold text-slate-100">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-slate-400">
              Sign in to manage your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Username"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-dark-700 border-dark-600 text-slate-100 placeholder:text-slate-500"
                  data-testid="input-username"
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-dark-700 border-dark-600 text-slate-100 placeholder:text-slate-500"
                  data-testid="input-password"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}