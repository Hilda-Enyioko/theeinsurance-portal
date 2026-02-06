 import { useState } from 'react';
 import { Link, useNavigate } from 'react-router-dom';
 import { useAuth } from '@/contexts/AuthContext';
 import { Logo } from '@/components/Logo';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { useToast } from '@/hooks/use-toast';
 import { Eye, EyeOff, Loader2, Mail, Lock, User } from 'lucide-react';
 import { z } from 'zod';
 
 const registerSchema = z.object({
   firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
   lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
   email: z.string().email('Please enter a valid email address'),
   password: z.string().min(8, 'Password must be at least 8 characters'),
   confirmPassword: z.string(),
 }).refine((data) => data.password === data.confirmPassword, {
   message: "Passwords don't match",
   path: ['confirmPassword'],
 });
 
 export default function Register() {
   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState<Record<string, string>>({});
 
   const { register } = useAuth();
   const navigate = useNavigate();
   const { toast } = useToast();
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setErrors({});
 
     const result = registerSchema.safeParse({ firstName, lastName, email, password, confirmPassword });
     if (!result.success) {
       const fieldErrors: Record<string, string> = {};
       result.error.errors.forEach((err) => {
         const field = err.path[0] as string;
         fieldErrors[field] = err.message;
       });
       setErrors(fieldErrors);
       return;
     }
 
     setIsLoading(true);
     try {
       await register({
         email,
         password,
         first_name: firstName,
         last_name: lastName,
       });
       toast({
         title: 'Account Created!',
         description: 'Welcome to TheeInsurance Portal.',
       });
       navigate('/dashboard', { replace: true });
     } catch (error: unknown) {
       const apiError = error as { response?: { data?: { detail?: string; message?: string; email?: string[] } } };
       let message = 'Registration failed. Please try again.';
       
       if (apiError.response?.data?.email) {
         message = 'An account with this email already exists.';
       } else if (apiError.response?.data?.detail) {
         message = apiError.response.data.detail;
       } else if (apiError.response?.data?.message) {
         message = apiError.response.data.message;
       }
       
       toast({
         title: 'Registration Failed',
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
             <CardTitle className="text-2xl">Create Account</CardTitle>
             <CardDescription>Get started with TheeInsurance Portal</CardDescription>
           </CardHeader>
           <CardContent>
             <form onSubmit={handleSubmit} className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="firstName">First Name</Label>
                   <div className="relative">
                     <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                     <Input
                       id="firstName"
                       placeholder="John"
                       value={firstName}
                       onChange={(e) => setFirstName(e.target.value)}
                       className="pl-10"
                       disabled={isLoading}
                     />
                   </div>
                   {errors.firstName && (
                     <p className="text-sm text-destructive">{errors.firstName}</p>
                   )}
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="lastName">Last Name</Label>
                   <Input
                     id="lastName"
                     placeholder="Doe"
                     value={lastName}
                     onChange={(e) => setLastName(e.target.value)}
                     disabled={isLoading}
                   />
                   {errors.lastName && (
                     <p className="text-sm text-destructive">{errors.lastName}</p>
                   )}
                 </div>
               </div>
 
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
 
               <div className="space-y-2">
                 <Label htmlFor="confirmPassword">Confirm Password</Label>
                 <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input
                     id="confirmPassword"
                     type={showPassword ? 'text' : 'password'}
                     placeholder="••••••••"
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     className="pl-10"
                     disabled={isLoading}
                   />
                 </div>
                 {errors.confirmPassword && (
                   <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                 )}
               </div>
 
               <Button type="submit" className="w-full" disabled={isLoading}>
                 {isLoading ? (
                   <>
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                     Creating account...
                   </>
                 ) : (
                   'Create Account'
                 )}
               </Button>
             </form>
 
             <div className="mt-6 text-center text-sm">
               <span className="text-muted-foreground">Already have an account? </span>
               <Link to="/login" className="text-primary hover:underline font-medium">
                 Sign in
               </Link>
             </div>
           </CardContent>
         </Card>
       </div>
     </div>
   );
 }