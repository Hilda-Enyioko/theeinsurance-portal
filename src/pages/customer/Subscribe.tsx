 import { useEffect, useState } from 'react';
 import { useParams, useNavigate, Link } from 'react-router-dom';
 import { MainLayout } from '@/components/layouts/MainLayout';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { plansApi } from '@/lib/api';
 import { InsurancePlan } from '@/types';
 import { useToast } from '@/hooks/use-toast';
 import { ArrowLeft, ArrowRight, Loader2, Calendar, Shield, Check } from 'lucide-react';
 import { format, addMonths } from 'date-fns';
 
 export default function Subscribe() {
   const { planId } = useParams<{ planId: string }>();
   const navigate = useNavigate();
   const { toast } = useToast();
   
   const [plan, setPlan] = useState<InsurancePlan | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
   const [step, setStep] = useState<'select' | 'review'>('select');
 
   useEffect(() => {
     const fetchPlan = async () => {
       if (!planId) return;
       try {
         const res = await plansApi.getById(Number(planId));
         setPlan(res.data);
       } catch (error) {
         console.error('Failed to fetch plan:', error);
         toast({
           title: 'Error',
           description: 'Failed to load plan details.',
           variant: 'destructive',
         });
         navigate('/plans');
       } finally {
         setIsLoading(false);
       }
     };
     fetchPlan();
   }, [planId, navigate, toast]);
 
   const endDate = plan 
     ? format(addMonths(new Date(startDate), plan.duration_months), 'yyyy-MM-dd')
     : '';
 
   const handleProceedToPayment = () => {
     // Store subscription details for payment page
     sessionStorage.setItem('pendingSubscription', JSON.stringify({
       planId: plan?.id,
       planName: plan?.name,
       price: plan?.price,
       startDate,
       endDate,
       durationMonths: plan?.duration_months,
     }));
     navigate('/payment');
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
       <div className="container mx-auto px-4 py-8 max-w-3xl">
         <Link 
           to={`/plans/${planId}`}
           className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
         >
           <ArrowLeft className="w-4 h-4 mr-2" />
           Back to Plan
         </Link>
 
         {/* Progress Steps */}
         <div className="flex items-center justify-center gap-4 mb-8">
           <div className={`flex items-center gap-2 ${step === 'select' ? 'text-primary' : 'text-muted-foreground'}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
               step === 'select' ? 'bg-primary text-primary-foreground' : 'bg-muted'
             }`}>
               1
             </div>
             <span className="hidden sm:inline">Select Date</span>
           </div>
           <div className="w-12 h-0.5 bg-border" />
           <div className={`flex items-center gap-2 ${step === 'review' ? 'text-primary' : 'text-muted-foreground'}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
               step === 'review' ? 'bg-primary text-primary-foreground' : 'bg-muted'
             }`}>
               2
             </div>
             <span className="hidden sm:inline">Review</span>
           </div>
           <div className="w-12 h-0.5 bg-border" />
           <div className="flex items-center gap-2 text-muted-foreground">
             <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-muted">
               3
             </div>
             <span className="hidden sm:inline">Payment</span>
           </div>
         </div>
 
         <Card className="animate-scale-in">
           <CardHeader>
             <CardTitle>
               {step === 'select' ? 'Choose Start Date' : 'Review Subscription'}
             </CardTitle>
             <CardDescription>
               {step === 'select' 
                 ? 'Select when you want your coverage to begin'
                 : 'Please review your subscription details before proceeding'}
             </CardDescription>
           </CardHeader>
           <CardContent>
             {step === 'select' ? (
               <div className="space-y-6">
                 {/* Plan Summary */}
                 <div className="p-4 rounded-lg bg-secondary/50 flex items-center justify-between">
                   <div>
                     <p className="font-semibold text-foreground">{plan.name}</p>
                     <p className="text-sm text-muted-foreground">
                       {plan.duration_months} months coverage
                     </p>
                   </div>
                   <p className="text-2xl font-bold text-primary">${plan.price}</p>
                 </div>
 
                 {/* Date Selection */}
                 <div className="space-y-2">
                   <Label htmlFor="startDate">Start Date</Label>
                   <div className="relative">
                     <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                     <Input
                       id="startDate"
                       type="date"
                       value={startDate}
                       min={format(new Date(), 'yyyy-MM-dd')}
                       onChange={(e) => setStartDate(e.target.value)}
                       className="pl-10"
                     />
                   </div>
                 </div>
 
                 {/* Coverage Preview */}
                 <div className="p-4 rounded-lg border space-y-3">
                   <h4 className="font-medium text-foreground">Coverage Period</h4>
                   <div className="grid grid-cols-2 gap-4 text-sm">
                     <div>
                       <p className="text-muted-foreground">Start</p>
                       <p className="font-medium text-foreground">
                         {format(new Date(startDate), 'MMMM d, yyyy')}
                       </p>
                     </div>
                     <div>
                       <p className="text-muted-foreground">End</p>
                       <p className="font-medium text-foreground">
                         {format(new Date(endDate), 'MMMM d, yyyy')}
                       </p>
                     </div>
                   </div>
                 </div>
 
                 <Button className="w-full" onClick={() => setStep('review')}>
                   Continue to Review
                   <ArrowRight className="w-4 h-4 ml-2" />
                 </Button>
               </div>
             ) : (
               <div className="space-y-6">
                 {/* Review Details */}
                 <div className="space-y-4">
                   <div className="p-4 rounded-lg border space-y-4">
                     <div className="flex items-start gap-4">
                       <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                         <Shield className="w-6 h-6 text-primary-foreground" />
                       </div>
                       <div>
                         <h3 className="font-semibold text-foreground text-lg">{plan.name}</h3>
                         <p className="text-muted-foreground text-sm">
                           {plan.property_category_name || 'Insurance Plan'}
                         </p>
                       </div>
                     </div>
 
                     <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                       <div>
                         <p className="text-sm text-muted-foreground">Coverage Period</p>
                         <p className="font-medium text-foreground">
                           {plan.duration_months} months
                         </p>
                       </div>
                       <div>
                         <p className="text-sm text-muted-foreground">Price</p>
                         <p className="font-bold text-primary text-lg">${plan.price}</p>
                       </div>
                       <div>
                         <p className="text-sm text-muted-foreground">Start Date</p>
                         <p className="font-medium text-foreground">
                           {format(new Date(startDate), 'MMM d, yyyy')}
                         </p>
                       </div>
                       <div>
                         <p className="text-sm text-muted-foreground">End Date</p>
                         <p className="font-medium text-foreground">
                           {format(new Date(endDate), 'MMM d, yyyy')}
                         </p>
                       </div>
                     </div>
                   </div>
 
                   {/* Confirmation Checklist */}
                   <div className="space-y-3">
                     {[
                       'I understand the coverage terms',
                       'I agree to the payment amount',
                       'I accept the policy start and end dates',
                     ].map((item) => (
                       <div key={item} className="flex items-center gap-3">
                         <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                           <Check className="w-3 h-3 text-success" />
                         </div>
                         <span className="text-sm text-foreground">{item}</span>
                       </div>
                     ))}
                   </div>
                 </div>
 
                 <div className="flex gap-4">
                   <Button variant="outline" className="flex-1" onClick={() => setStep('select')}>
                     <ArrowLeft className="w-4 h-4 mr-2" />
                     Back
                   </Button>
                   <Button className="flex-1" onClick={handleProceedToPayment}>
                     Proceed to Payment
                     <ArrowRight className="w-4 h-4 ml-2" />
                   </Button>
                 </div>
               </div>
             )}
           </CardContent>
         </Card>
       </div>
     </MainLayout>
   );
 }