import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2, Mail, Lock, ShieldCheck } from 'lucide-react';
import { z } from 'zod';
 
 const loginSchema = z.object({
   email: z.string().email('Please enter a valid email address'),
   password: z.string().min(1, 'Password is required'),
 });
 
 export default function AdminLogin() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
 
   const { adminLogin } = useAuth();
   const navigate = useNavigate();
   const { toast } = useToast();
 
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
       await adminLogin(email, password);
       toast({
         title: 'Welcome, Admin!',
         description: 'You have successfully signed in to the admin panel.',
       });
       navigate('/admin', { replace: true });
     } catch (error: unknown) {
       const apiError = error as { response?: { data?: { detail?: string; message?: string } } };
       const message = apiError.response?.data?.detail || apiError.response?.data?.message || 'Invalid admin credentials. Please try again.';
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
 
         <Card className="shadow-brand-xl border-primary/20">
           <CardHeader className="text-center">
             <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
               <ShieldCheck className="w-8 h-8 text-primary-foreground" />
             </div>
             <CardTitle className="text-2xl">Admin Portal</CardTitle>
             <CardDescription>Sign in to access the admin dashboard</CardDescription>
           </CardHeader>
           <CardContent>
             <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="email">Admin Email</Label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input
                     id="email"
                     type="email"
                     placeholder="admin@theeinsurance.com"
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
                   'Sign In as Admin'
                 )}
               </Button>
             </form>
 
             <div className="mt-6 text-center">
               <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
                 ← Customer Login
               </Link>
             </div>
           </CardContent>
         </Card>
       </div>
     </div>
   );
}