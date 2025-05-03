
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!email || !password) {
    toast({
      title: "Error",
      description: "Please enter your email and password",
      variant: "destructive",
    });
    return;
  }
  
  setIsLoading(true);
  try {
    await login(email, password);
    navigate("/");  // Redirection après connexion
  } catch (error) {
    console.error("Login error:", error);
  } finally {
    setIsLoading(false);
  }
};

  // Demo accounts for easy testing
  const demoAccounts = [
    { email: "john@example.com", description: "Client account" },
    { email: "contact@globaltravel.com", description: "Agency account" },
  ];

  // Handle demo login
  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demopassword"); // In a real app, you would use a secure method
    
    setIsLoading(true);
    try {
      await login(demoEmail, "demopassword");
      navigate("/");
    } catch (error) {
      console.error("Demo login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-800">TripOfferNexus</h1>
          <p className="text-gray-600 mt-2">Connecting clients with personalized travel offers</p>
        </div>
        
        <Card className="shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl">Log in</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Demo Accounts</span>
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                {demoAccounts.map((account) => (
                  <Button
                    key={account.email}
                    variant="outline"
                    className="justify-start text-left"
                    onClick={() => handleDemoLogin(account.email)}
                    disabled={isLoading}
                  >
                    <div>
                      <div>{account.email}</div>
                      <div className="text-xs text-muted-foreground">{account.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-gray-100 flex flex-col items-start">
            <p className="text-sm text-gray-600 mt-2">
              Don't have an account?{" "}
              <Link to="/register" className="text-brand-600 hover:underline">
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
