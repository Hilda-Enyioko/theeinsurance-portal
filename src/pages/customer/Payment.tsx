 import { useEffect, useState } from 'react';
 import { useNavigate, Link } from 'react-router-dom';
 import { MainLayout } from '@/components/layouts/MainLayout';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { subscriptionsApi } from '@/api/client';
 import { useToast } from '@/hooks/use-toast';
 import { CreditCard, Lock, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
 
 interface PendingSubscription {
   planId: number;
   planName: string;
   price: number;
   startDate: string;
   endDate: string;
   durationMonths: number;
 }
 
 export default function Payment() {
   const navigate = useNavigate();
   const { toast } = useToast();
   const [subscription, setSubscription] = useState<PendingSubscription | null>(null);
   const [isProcessing, setIsProcessing] = useState(false);
   const [isSuccess, setIsSuccess] = useState(false);
   const [cardNumber, setCardNumber] = useState('');
   const [expiry, setExpiry] = useState('');
   const [cvv, setCvv] = useState('');
   const [name, setName] = useState('');
 
   useEffect(() => {
     const stored = sessionStorage.getItem('pendingSubscription');
     if (stored) {
       setSubscription(JSON.parse(stored));
     } else {
       navigate('/plans');
     }
   }, [navigate]);
 
   const handlePayment = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!subscription) return;
     
     setIsProcessing(true);
     // Simulate payment processing
     await new Promise(resolve => setTimeout(resolve, 2000));
     
     try {
       await subscriptionsApi.create({
         insurance_plan: subscription.planId,
         start_date: subscription.startDate,
       });
       sessionStorage.removeItem('pendingSubscription');
       setIsSuccess(true);
       toast({ title: 'Payment Successful!', description: 'Your policy is now active.' });
     } catch (error) {
       toast({ title: 'Payment Failed', description: 'Please try again.', variant: 'destructive' });
     } finally {
       setIsProcessing(false);
     }
   };
 
   if (isSuccess) {
     return (
       <MainLayout>
         <div className="container mx-auto px-4 py-20 max-w-lg text-center animate-scale-in">
           <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
             <CheckCircle2 className="w-10 h-10 text-success" />
           </div>
           <h1 className="text-3xl font-bold text-foreground mb-4">Payment Successful!</h1>
           <p className="text-muted-foreground mb-8">
             Your insurance policy has been activated. You can view it in your subscriptions.
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link to="/subscriptions"><Button>View Subscriptions</Button></Link>
             <Link to="/dashboard"><Button variant="outline">Go to Dashboard</Button></Link>
           </div>
         </div>
       </MainLayout>
     );
   }
 
   if (!subscription) return null;
 
   return (
     <MainLayout>
       <div className="container mx-auto px-4 py-8 max-w-lg">
         <Link to={`/subscribe/${subscription.planId}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
           <ArrowLeft className="w-4 h-4 mr-2" />Back
         </Link>
         <Card className="shadow-brand-lg animate-scale-in">
           <CardHeader className="text-center border-b">
             <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
               <CreditCard className="w-6 h-6 text-primary-foreground" />
             </div>
             <CardTitle>Complete Payment</CardTitle>
             <CardDescription>Enter your card details (mock payment)</CardDescription>
           </CardHeader>
           <CardContent className="pt-6">
             <div className="p-4 rounded-lg bg-secondary/50 mb-6">
               <div className="flex justify-between items-center">
                 <span className="text-foreground font-medium">{subscription.planName}</span>
                 <span className="text-2xl font-bold text-primary">${subscription.price}</span>
               </div>
             </div>
             <form onSubmit={handlePayment} className="space-y-4">
               <div className="space-y-2">
                 <Label>Cardholder Name</Label>
                 <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
               </div>
               <div className="space-y-2">
                 <Label>Card Number</Label>
                 <Input value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))} placeholder="4242 4242 4242 4242" required />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Expiry</Label>
                   <Input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" required />
                 </div>
                 <div className="space-y-2">
                   <Label>CVV</Label>
                   <Input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" required />
                 </div>
               </div>
               <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                 {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : <>Pay ${subscription.price}</>}
               </Button>
               <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                 <Lock className="w-3 h-3" /> This is a mock payment - no real charges
               </p>
             </form>
           </CardContent>
         </Card>
       </div>
     </MainLayout>
   );
 }