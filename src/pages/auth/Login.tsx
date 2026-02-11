import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { z } from 'zod';
 
const loginSchema = z.object({
   email: z.string().email('Please enter a valid email address'),
   password: z.string().min(1, 'Password is required'),
});
 
export default function Login() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
 
   const { login } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();
   const { toast } = useToast();
 
   const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setErrors({});
 
     const result = loginSchema.safeParse({ email, password });
     if (!result.success) {
       const fieldErrors: { email?: string; password?: string } = {};
       result.error.issues.forEach((err) => {
         if (err.path[0] === 'email') fieldErrors.email = err.message;
         if (err.path[0] === 'password') fieldErrors.password = err.message;
       });
       setErrors(fieldErrors);
       return;
     }
 
     setIsLoading(true);
     try {
       await login(email, password);
       toast({
         title: 'Welcome back!',
         description: 'You have successfully signed in.',
       });
       navigate(from, { replace: true });
     } catch (error: unknown) {
       const apiError = error as { response?: { data?: { detail?: string; message?: string } } };
       const message = apiError.response?.data?.detail || apiError.response?.data?.message || 'Invalid credentials. Please try again.';
       toast({
         title: 'Login Failed',
         description: message,
         variant: 'destructive',
       });
     } finally {
       setIsLoading(false);
     }
   };
 
   return (
     <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
       <div className="w-full max-w-md animate-scale-in">
         <div className="text-center mb-8">
           <Link to="/" className="inline-block">
             <Logo size="lg" />
           </Link>
         </div>
 
         <Card className="shadow-brand-xl">
           <CardHeader className="text-center">
             <CardTitle className="text-2xl">Welcome Back</CardTitle>
             <CardDescription>Sign in to your account to continue</CardDescription>
           </CardHeader>
           <CardContent>
             <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="email">Email</Label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input
                     id="email"
                     type="email"
                     placeholder="you@example.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="pl-10"
                     disabled={isLoading}
                   />
                 </div>
                 {errors.email && (
                   <p className="text-sm text-destructive">{errors.email}</p>
                 )}
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="password">Password</Label>
                 <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input
                     id="password"
                     type={showPassword ? 'text' : 'password'}
                     placeholder="••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="pl-10 pr-10"
                     disabled={isLoading}
                   />
                   <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                   >
                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                   </button>
                 </div>
                 {errors.password && (
                   <p className="text-sm text-destructive">{errors.password}</p>
                 )}
               </div>
 
               <Button type="submit" className="w-full" disabled={isLoading}>
                 {isLoading ? (
                   <>
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                     Signing in...
                   </>
                 ) : (
                   'Sign In'
                 )}
               </Button>
             </form>
 
             <div className="mt-6 text-center text-sm">
               <span className="text-muted-foreground">Don't have an account? </span>
               <Link to="/register" className="text-primary hover:underline font-medium">
                 Create one
               </Link>
             </div>
 
             <div className="mt-4 text-center">
               <Link to="/admin/login" className="text-sm text-muted-foreground hover:text-foreground">
                 Admin Login →
               </Link>
             </div>
           </CardContent>
         </Card>
       </div>
     </div>
   );
}