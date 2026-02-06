 import { useEffect, useState } from 'react';
 import { Link } from 'react-router-dom';
 import { MainLayout } from '@/components/layouts/MainLayout';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { subscriptionsApi } from '@/lib/api';
 import { PolicySubscription } from '@/types';
 import { Loader2, Calendar, Shield, FileText } from 'lucide-react';
 import { format } from 'date-fns';
 
 export default function Subscriptions() {
   const [subscriptions, setSubscriptions] = useState<PolicySubscription[]>([]);
   const [isLoading, setIsLoading] = useState(true);
 
   useEffect(() => {
     const fetchSubscriptions = async () => {
       try {
         const res = await subscriptionsApi.getAll();
         setSubscriptions(res.data.results || []);
       } catch (error) {
         console.error('Failed to fetch subscriptions:', error);
       } finally {
         setIsLoading(false);
       }
     };
     fetchSubscriptions();
   }, []);
 
   const activeSubscriptions = subscriptions.filter(
     (sub) => new Date(sub.end_date) >= new Date()
   );
   const expiredSubscriptions = subscriptions.filter(
     (sub) => new Date(sub.end_date) < new Date()
   );
 
   const SubscriptionCard = ({ subscription }: { subscription: PolicySubscription }) => {
     const isActive = new Date(subscription.end_date) >= new Date();
     
     return (
       <Card className="hover:shadow-brand-md transition-shadow">
         <CardContent className="pt-6">
           <div className="flex items-start gap-4">
             <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
               isActive ? 'gradient-primary' : 'bg-muted'
             }`}>
               <Shield className={`w-6 h-6 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
             </div>
             <div className="flex-1 min-w-0">
               <div className="flex items-start justify-between gap-4">
                 <div>
                   <h3 className="font-semibold text-foreground">
                     {subscription.insurance_plan_name || `Plan #${subscription.insurance_plan}`}
                   </h3>
                   <p className="text-sm text-muted-foreground">
                     Policy ID: #{subscription.id}
                   </p>
                 </div>
                 <span
                   className={`px-3 py-1 rounded-full text-xs font-medium ${
                     isActive
                       ? 'bg-success/20 text-success'
                       : 'bg-muted text-muted-foreground'
                   }`}
                 >
                   {isActive ? 'Active' : 'Expired'}
                 </span>
               </div>
               
               <div className="mt-4 flex items-center gap-6 text-sm">
                 <div className="flex items-center gap-2 text-muted-foreground">
                   <Calendar className="w-4 h-4" />
                   <span>
                     {format(new Date(subscription.start_date), 'MMM d, yyyy')} - {format(new Date(subscription.end_date), 'MMM d, yyyy')}
                   </span>
                 </div>
               </div>
             </div>
           </div>
         </CardContent>
       </Card>
     );
   };
 
   return (
     <MainLayout>
       <div className="container mx-auto px-4 py-8">
         <div className="mb-8 animate-fade-in">
           <h1 className="text-3xl font-bold text-foreground mb-2">My Subscriptions</h1>
           <p className="text-muted-foreground">
             View and manage all your insurance policy subscriptions.
           </p>
         </div>
 
         {isLoading ? (
           <div className="flex items-center justify-center py-20">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
           </div>
         ) : subscriptions.length > 0 ? (
           <Tabs defaultValue="active" className="animate-fade-in">
             <TabsList className="mb-6">
               <TabsTrigger value="active">
                 Active ({activeSubscriptions.length})
               </TabsTrigger>
               <TabsTrigger value="expired">
                 Expired ({expiredSubscriptions.length})
               </TabsTrigger>
               <TabsTrigger value="all">
                 All ({subscriptions.length})
               </TabsTrigger>
             </TabsList>
 
             <TabsContent value="active" className="space-y-4">
               {activeSubscriptions.length > 0 ? (
                 activeSubscriptions.map((sub) => (
                   <SubscriptionCard key={sub.id} subscription={sub} />
                 ))
               ) : (
                 <Card>
                   <CardContent className="py-12 text-center">
                     <Shield className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                     <p className="text-muted-foreground mb-4">No active subscriptions</p>
                     <Link to="/plans">
                       <Button>Browse Plans</Button>
                     </Link>
                   </CardContent>
                 </Card>
               )}
             </TabsContent>
 
             <TabsContent value="expired" className="space-y-4">
               {expiredSubscriptions.length > 0 ? (
                 expiredSubscriptions.map((sub) => (
                   <SubscriptionCard key={sub.id} subscription={sub} />
                 ))
               ) : (
                 <Card>
                   <CardContent className="py-12 text-center">
                     <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                     <p className="text-muted-foreground">No expired subscriptions</p>
                   </CardContent>
                 </Card>
               )}
             </TabsContent>
 
             <TabsContent value="all" className="space-y-4">
               {subscriptions.map((sub) => (
                 <SubscriptionCard key={sub.id} subscription={sub} />
               ))}
             </TabsContent>
           </Tabs>
         ) : (
           <Card>
             <CardHeader className="text-center">
               <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                 <Shield className="w-8 h-8 text-muted-foreground" />
               </div>
               <CardTitle>No Subscriptions Yet</CardTitle>
               <CardDescription>
                 You haven't subscribed to any insurance plans yet. 
                 Browse our plans to get started with coverage.
               </CardDescription>
             </CardHeader>
             <CardContent className="text-center">
               <Link to="/plans">
                 <Button size="lg">Browse Insurance Plans</Button>
               </Link>
             </CardContent>
           </Card>
         )}
       </div>
     </MainLayout>
   );
 }