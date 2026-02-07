 import { useEffect, useState } from 'react';
 import { useParams, Link, useNavigate } from 'react-router-dom';
 import { MainLayout } from '@/components/layouts/MainLayout';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { plansApi } from '@/api/client';
 import { InsurancePlan } from '@/types';
 import { useAuth } from '@/contexts/AuthContext';
 import { ArrowLeft, Clock, Shield, Check, Loader2 } from 'lucide-react';
 
 const planFeatures = [
   'Comprehensive coverage',
   'No hidden fees',
   '24/7 customer support',
   'Easy claims process',
   'Flexible payment options',
   'Digital policy documents',
 ];
 
 export default function PlanDetails() {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const { isAuthenticated } = useAuth();
   const [plan, setPlan] = useState<InsurancePlan | null>(null);
   const [isLoading, setIsLoading] = useState(true);
 
   useEffect(() => {
     const fetchPlan = async () => {
       if (!id) return;
       try {
         const res = await plansApi.getById(Number(id));
         setPlan(res.data);
       } catch (error) {
         console.error('Failed to fetch plan:', error);
       } finally {
         setIsLoading(false);
       }
     };
     fetchPlan();
   }, [id]);
 
   const handleSubscribe = () => {
     if (!isAuthenticated) {
       navigate('/login', { state: { from: { pathname: `/subscribe/${id}` } } });
     } else {
       navigate(`/subscribe/${id}`);
     }
   };
 
   if (isLoading) {
     return (
       <MainLayout>
         <div className="flex items-center justify-center min-h-[60vh]">
           <Loader2 className="w-8 h-8 animate-spin text-primary" />
         </div>
       </MainLayout>
     );
   }
 
   if (!plan) {
     return (
       <MainLayout>
         <div className="container mx-auto px-4 py-20 text-center">
           <h1 className="text-2xl font-bold text-foreground mb-4">Plan Not Found</h1>
           <p className="text-muted-foreground mb-8">
             The insurance plan you're looking for doesn't exist or has been removed.
           </p>
           <Link to="/plans">
             <Button>
               <ArrowLeft className="w-4 h-4 mr-2" />
               Back to Plans
             </Button>
           </Link>
         </div>
       </MainLayout>
     );
   }
 
   return (
     <MainLayout>
       <div className="container mx-auto px-4 py-8">
         <Link 
           to="/plans" 
           className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
         >
           <ArrowLeft className="w-4 h-4 mr-2" />
           Back to Plans
         </Link>
 
         <div className="grid lg:grid-cols-3 gap-8">
           {/* Plan Info */}
           <div className="lg:col-span-2 space-y-6 animate-fade-in">
             <div>
               <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
                 {plan.property_category_name || 'Insurance Plan'}
               </span>
               <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                 {plan.name}
               </h1>
               <p className="text-lg text-muted-foreground">
                 {plan.description || 'Comprehensive insurance coverage designed to protect what matters most to you. Get peace of mind with our trusted protection plans.'}
               </p>
             </div>
 
             <Card>
               <CardHeader>
                 <CardTitle className="text-lg">Plan Features</CardTitle>
                 <CardDescription>Everything included with this plan</CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="grid sm:grid-cols-2 gap-4">
                   {planFeatures.map((feature) => (
                     <div key={feature} className="flex items-center gap-3">
                       <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                         <Check className="w-3 h-3 text-success" />
                       </div>
                       <span className="text-foreground">{feature}</span>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
 
             <Card>
               <CardHeader>
                 <CardTitle className="text-lg">Coverage Details</CardTitle>
                 <CardDescription>What's protected under this plan</CardDescription>
               </CardHeader>
               <CardContent className="prose prose-sm text-muted-foreground">
                 <p>
                   This comprehensive insurance plan provides robust protection for your 
                   valued assets. Our coverage includes protection against various risks 
                   and unforeseen circumstances, ensuring you're never left vulnerable.
                 </p>
                 <p>
                   With a coverage period of {plan.duration_months} months, you'll have 
                   ample time to enjoy peace of mind knowing that you're protected by 
                   one of the most trusted names in insurance.
                 </p>
               </CardContent>
             </Card>
           </div>
 
           {/* Pricing Card */}
           <div className="lg:col-span-1">
             <Card className="sticky top-24 shadow-brand-lg animate-scale-in">
               <CardHeader className="text-center border-b">
                 <CardDescription>Total Price</CardDescription>
                 <CardTitle className="text-4xl font-bold text-primary">
                   ${plan.price}
                 </CardTitle>
               </CardHeader>
               <CardContent className="pt-6 space-y-6">
                 <div className="space-y-4">
                   <div className="flex items-center gap-3 text-muted-foreground">
                     <Clock className="w-5 h-5 text-primary" />
                     <span>{plan.duration_months} months coverage</span>
                   </div>
                   <div className="flex items-center gap-3 text-muted-foreground">
                     <Shield className="w-5 h-5 text-primary" />
                     <span>Full protection included</span>
                   </div>
                 </div>
 
                 <Button 
                   className="w-full" 
                   size="lg"
                   onClick={handleSubscribe}
                 >
                   Subscribe Now
                 </Button>
 
                 <p className="text-xs text-muted-foreground text-center">
                   By subscribing, you agree to our terms of service and privacy policy.
                 </p>
               </CardContent>
             </Card>
           </div>
         </div>
       </div>
     </MainLayout>
   );
 }